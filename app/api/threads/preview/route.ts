import { NextResponse } from "next/server";
import { assertPostBank, getPostById, getThemeById, THREADS_POSTS, THREADS_THEMES } from "@/lib/threads/content";
import { authorizeThreadsRequest, threadsAuthConfigured } from "@/lib/threads/auth";
import { fetchPublishedMedia, getThreadsCredentials, isThreadsDryRun } from "@/lib/threads/client";
import {
  disabledStoreConfigured,
  getDisabledPostIds,
  loadDisabledStore,
} from "@/lib/threads/disabled-store";
import {
  cronBlockedByPostedToday,
  getPostedForDate,
  isStaleManualPostedRecord,
  loadPostedStore,
  postedStoreConfigured,
} from "@/lib/threads/posted-store";
import { getOverrideForDate, overridesStoreConfigured } from "@/lib/threads/overrides-store";
import {
  evaluatePublishSlot,
  HOBBY_CRON_HOURS_JST,
  jstDateKey,
  peekUpcoming,
  pickPostForDate,
  pickPostForDateSkippingAired,
  resolveCronPublish,
} from "@/lib/threads/schedule";

export const runtime = "nodejs";

export async function GET(request: Request) {
  if (!threadsAuthConfigured()) {
    return NextResponse.json(
      { ok: false, message: "THREADS_PUBLISH_SECRET (or CRON_SECRET) is not configured." },
      { status: 503 },
    );
  }
  if (!authorizeThreadsRequest(request)) {
    return NextResponse.json({ ok: false, message: "Unauthorized." }, { status: 401 });
  }

  try {
    assertPostBank();
  } catch (e) {
    return NextResponse.json(
      { ok: false, message: e instanceof Error ? e.message : "Invalid post bank." },
      { status: 500 },
    );
  }

  const dateKey = jstDateKey();
  const postedStore = postedStoreConfigured() ? await loadPostedStore() : null;
  const postedStoreRecords = postedStore?.records ?? [];
  const { post: scheduledToday, skippedPostId } = await pickPostForDateSkippingAired(
    new Date(),
    postedStoreRecords,
  );
  const today = scheduledToday;
  const theme = today ? getThemeById(today.themeId) : undefined;
  const postedTodayRaw = await getPostedForDate(dateKey);
  let postedTodayEnriched: (typeof postedTodayRaw & { permalink?: string }) | null =
    postedTodayRaw;
  if (postedTodayRaw?.mediaId) {
    const creds = getThreadsCredentials();
    if (creds) {
      try {
        const media = await fetchPublishedMedia(creds, postedTodayRaw.mediaId);
        if (media?.permalink) {
          postedTodayEnriched = { ...postedTodayRaw, permalink: media.permalink };
        }
      } catch {
        /* Graph lookup optional for preview */
      }
    }
  }
  const staleManual = postedTodayRaw ? isStaleManualPostedRecord(postedTodayRaw) : false;
  const postedToday = staleManual ? null : postedTodayRaw;
  const cronBlocked = cronBlockedByPostedToday(postedToday, today?.id ?? null);
  const recentPosted = postedStore
    ? [...postedStore.records]
        .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
        .slice(0, 14)
    : [];
  const slot = evaluatePublishSlot(new Date(), {
    alreadyPostedToday: cronBlocked,
    catchUpEnabled: postedStoreConfigured(),
  });
  const publishDecision = resolveCronPublish(slot, cronBlocked);
  const publishEligible =
    publishDecision.yes || staleManual;
  const disabled = await getDisabledPostIds();
  const disabledStore = await loadDisabledStore();
  const upcomingAll = await peekUpcoming(15);
  const upcoming = upcomingAll.filter((u) => u.date !== dateKey).slice(0, 14);
  const todayOverride = await getOverrideForDate(dateKey);

  const upcomingEnriched = await Promise.all(
    upcoming.map(async ({ date, post, hourJst, minuteJst, timeLabel }) => {
      const override = await getOverrideForDate(date);
      return {
        date,
        hourJst,
        minuteJst,
        timeLabel,
        postId: post.id,
        themeId: post.themeId,
        themeName: getThemeById(post.themeId)?.nameJa ?? post.themeId,
        text: post.text,
        preview: post.text.slice(0, 80).replace(/\n/g, " "),
        refreshCount: override?.refreshCount ?? 0,
        pickSource: override?.source ?? "schedule",
      };
    }),
  );

  return NextResponse.json({
    ok: true,
    dryRunDefault: isThreadsDryRun(),
    date: jstDateKey(),
    canPersistDeletes: disabledStoreConfigured(),
    canTrackPosted: postedStoreConfigured(),
    canRefreshPosts: overridesStoreConfigured(),
    canGenerateWithAi: Boolean(process.env.GEMINI_API_KEY?.trim()),
    schedule: {
      window: slot.window,
      todayHourJst: slot.targetHourJst,
      todayMinuteJst: slot.targetMinuteJst,
      todayTimeLabel: slot.targetLabel,
      currentHourJst: slot.hourJst,
      currentMinuteJst: slot.minuteJst,
      cronHoursJst: HOBBY_CRON_HOURS_JST,
      note: slot.precisionNote,
    },
    publish: {
      postedToday: postedTodayEnriched,
      staleManual,
      recentPosted,
      cronBlocked,
      scheduledPostId: today?.id ?? null,
      skippedSchedulePostId: skippedPostId,
      eligibleNow: publishEligible,
      mode: publishDecision.mode ?? (staleManual ? "catch_up" : null),
      skipReason: staleManual ? null : publishDecision.skipReason,
      catchUpEnabled: postedStoreConfigured(),
    },
    today: today
      ? {
          post: today,
          theme: theme ?? null,
          hourJst: slot.targetHourJst,
          minuteJst: slot.targetMinuteJst,
          timeLabel: slot.targetLabel,
          refreshCount: todayOverride?.refreshCount ?? 0,
          pickSource: todayOverride?.source ?? "schedule",
        }
      : null,
    upcoming: upcomingEnriched,
    themes: THREADS_THEMES,
    posts: THREADS_POSTS.map((p) => ({
      id: p.id,
      themeId: p.themeId,
      enabled: p.enabled,
      deleted: disabled.has(p.id),
      length: p.text.length,
      preview: p.text.slice(0, 80).replace(/\n/g, " "),
    })),
    deletedIds: disabledStore.ids,
  });
}
