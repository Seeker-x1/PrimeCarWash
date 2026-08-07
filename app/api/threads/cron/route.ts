import { NextResponse } from "next/server";
import { assertPostBank } from "@/lib/threads/content";
import { authorizeThreadsCron, threadsAuthConfigured } from "@/lib/threads/auth";
import { isThreadsDryRun, publishTextPost } from "@/lib/threads/client";
import {
  cronBlockedByPostedToday,
  getPostedForDate,
  isStaleManualPostedRecord,
  loadPostedStore,
  markPostedForDate,
  postedStoreConfigured,
} from "@/lib/threads/posted-store";
import {
  evaluatePublishSlot,
  jstDateKey,
  pickPostForDateSkippingAired,
  resolveCronPublish,
} from "@/lib/threads/schedule";

export const runtime = "nodejs";

/**
 * Vercel Cron: daily ticks at JST 6–7 (UTC 21/22; Hobby allows once/day per expression).
 * Posts on the date-seeded hour, or catch-up later in the window if missed.
 * Auth: Bearer CRON_SECRET|THREADS_PUBLISH_SECRET, or x-vercel-cron: 1
 */
export async function GET(request: Request) {
  if (!threadsAuthConfigured()) {
    return NextResponse.json(
      { ok: false, message: "CRON_SECRET / THREADS_PUBLISH_SECRET missing." },
      { status: 503 },
    );
  }
  if (!authorizeThreadsCron(request)) {
    return NextResponse.json({ ok: false, message: "Unauthorized." }, { status: 401 });
  }

  if (process.env.THREADS_CRON_ENABLED?.trim().toLowerCase() === "false") {
    return NextResponse.json({
      ok: true,
      skipped: true,
      reason: "THREADS_CRON_ENABLED=false",
      date: jstDateKey(),
    });
  }

  const dateKey = jstDateKey();
  const postedStore = postedStoreConfigured() ? await loadPostedStore() : { records: [] };
  const { post: scheduledPost, skippedPostId } = await pickPostForDateSkippingAired(
    new Date(),
    postedStore.records,
  );
  const postedTodayRaw = await getPostedForDate(dateKey);
  const staleManual = postedTodayRaw ? isStaleManualPostedRecord(postedTodayRaw) : false;
  const postedToday = staleManual ? null : postedTodayRaw;
  const cronBlocked = cronBlockedByPostedToday(postedToday, scheduledPost?.id ?? null);
  const catchUpEnabled = postedStoreConfigured();
  const slot = evaluatePublishSlot(new Date(), {
    alreadyPostedToday: cronBlocked,
    catchUpEnabled,
  });
  let publish = resolveCronPublish(slot, cronBlocked);
  if (!publish.yes && staleManual && scheduledPost) {
    publish = { yes: true, mode: "catch_up", skipReason: null };
  }

  // #region agent log
  fetch("http://127.0.0.1:7806/ingest/8b50c3e5-afe6-4dff-86e9-b33c4cf14860", {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "9b35a5" },
    body: JSON.stringify({
      sessionId: "9b35a5",
      runId: "cron-decision",
      hypothesisId: "H1-after-window",
      location: "app/api/threads/cron/route.ts:decision",
      message: "cron publish decision",
      data: {
        dateKey,
        hourJst: slot.hourJst,
        publishYes: publish.yes,
        skipReason: publish.skipReason,
        cronBlocked,
        staleManual,
        scheduledPostId: scheduledPost?.id ?? null,
        vercel: Boolean(process.env.VERCEL),
      },
      timestamp: Date.now(),
    }),
  }).catch(() => {});
  // #endregion

  console.error(
    "[threads/cron] decision",
    JSON.stringify({
      dateKey,
      hourJst: slot.hourJst,
      targetHourJst: slot.targetHourJst,
      publishYes: publish.yes,
      publishSkip: publish.skipReason,
      cronBlocked,
      staleManual,
      scheduledPostId: scheduledPost?.id ?? null,
      skippedPostId,
    }),
  );

  if (!publish.yes) {
    return NextResponse.json({
      ok: true,
      skipped: true,
      reason: publish.skipReason ?? slot.skipReason ?? "outside_daily_random_slot",
      cronSchedule: request.headers.get("x-vercel-cron-schedule"),
      date: dateKey,
      hourJst: slot.hourJst,
      targetHourJst: slot.targetHourJst,
      window: slot.window,
      postedToday: postedTodayRaw ?? null,
      staleManual,
      scheduledPostId: scheduledPost?.id ?? null,
      cronBlocked,
      catchUpEnabled: postedStoreConfigured(),
    });
  }

  try {
    assertPostBank();
  } catch (e) {
    return NextResponse.json(
      { ok: false, message: e instanceof Error ? e.message : "Invalid post bank." },
      { status: 500 },
    );
  }

  const post = scheduledPost;
  if (!post) {
    return NextResponse.json({ ok: false, message: "No enabled posts." }, { status: 404 });
  }

  try {
    const result = await publishTextPost({
      postId: post.id,
      themeId: post.themeId,
      text: post.text,
      dryRun: isThreadsDryRun(),
    });

    let postedRecord = null;
    if (!result.dryRun) {
      try {
        postedRecord = await markPostedForDate({
          date: dateKey,
          postId: post.id,
          mediaId: result.mediaId,
          source: publish.mode === "catch_up" ? "catch_up" : "cron",
        });
      } catch (e) {
        console.error("[threads/cron] mark posted failed", e);
      }
    }

    return NextResponse.json({
      ok: true,
      source: "cron",
      publishMode: publish.mode,
      cronSchedule: request.headers.get("x-vercel-cron-schedule"),
      date: dateKey,
      targetHourJst: slot.targetHourJst,
      targetMinuteJst: slot.targetMinuteJst,
      targetLabel: slot.targetLabel,
      postedRecord,
      ...result,
    });
  } catch (e) {
    console.error("[threads/cron]", e);
    return NextResponse.json(
      { ok: false, message: e instanceof Error ? e.message : "Cron publish failed." },
      { status: 502 },
    );
  }
}
