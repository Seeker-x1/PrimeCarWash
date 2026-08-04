import { NextResponse } from "next/server";
import { assertPostBank } from "@/lib/threads/content";
import { authorizeThreadsCron, threadsAuthConfigured } from "@/lib/threads/auth";
import { isThreadsDryRun, publishTextPost } from "@/lib/threads/client";
import {
  cronBlockedByPostedToday,
  getPostedForDate,
  markPostedForDate,
  postedStoreConfigured,
} from "@/lib/threads/posted-store";
import {
  evaluatePublishSlot,
  jstDateKey,
  pickPostForDate,
  resolveCronPublish,
} from "@/lib/threads/schedule";

export const runtime = "nodejs";

/**
 * Vercel Cron: daily ticks at JST 8–12 (Hobby allows once/day per expression).
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
  const scheduledPost = await pickPostForDate();
  const postedToday = await getPostedForDate(dateKey);
  const cronBlocked = cronBlockedByPostedToday(postedToday, scheduledPost?.id ?? null);
  const catchUpEnabled = postedStoreConfigured();
  const slot = evaluatePublishSlot(new Date(), {
    alreadyPostedToday: cronBlocked,
    catchUpEnabled,
  });
  const publish = resolveCronPublish(slot, cronBlocked);

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
      postedToday: postedToday ?? null,
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
