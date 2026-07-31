import { NextResponse } from "next/server";
import { assertPostBank, getPostById, getThemeById, THREADS_POSTS, THREADS_THEMES } from "@/lib/threads/content";
import { authorizeThreadsRequest, threadsAuthConfigured } from "@/lib/threads/auth";
import { isThreadsDryRun } from "@/lib/threads/client";
import {
  disabledStoreConfigured,
  getDisabledPostIds,
  loadDisabledStore,
} from "@/lib/threads/disabled-store";
import { getPostedForDate, postedStoreConfigured } from "@/lib/threads/posted-store";
import { getOverrideForDate, overridesStoreConfigured } from "@/lib/threads/overrides-store";
import {
  evaluatePublishSlot,
  jstDateKey,
  peekUpcoming,
  pickPostForDate,
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

  const today = await pickPostForDate();
  const theme = today ? getThemeById(today.themeId) : undefined;
  const dateKey = jstDateKey();
  const postedToday = await getPostedForDate(dateKey);
  const slot = evaluatePublishSlot(new Date(), {
    alreadyPostedToday: Boolean(postedToday),
    catchUpEnabled: postedStoreConfigured(),
  });
  const disabled = await getDisabledPostIds();
  const disabledStore = await loadDisabledStore();
  const upcoming = await peekUpcoming(14);
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
    schedule: {
      window: slot.window,
      todayHourJst: slot.targetHourJst,
      todayMinuteJst: slot.targetMinuteJst,
      todayTimeLabel: slot.targetLabel,
      currentHourJst: slot.hourJst,
      currentMinuteJst: slot.minuteJst,
      note: slot.precisionNote,
    },
    publish: {
      postedToday,
      eligibleNow: slot.yes,
      mode: slot.mode,
      skipReason: slot.skipReason,
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
