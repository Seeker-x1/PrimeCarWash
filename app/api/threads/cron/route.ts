import { NextResponse } from "next/server";
import { assertPostBank } from "@/lib/threads/content";
import { authorizeThreadsCron, threadsAuthConfigured } from "@/lib/threads/auth";
import { isThreadsDryRun, publishTextPost } from "@/lib/threads/client";
import {
  jstDateKey,
  pickPostForDate,
  shouldAutoPublishNow,
} from "@/lib/threads/schedule";

export const runtime = "nodejs";

/**
 * Vercel Cron: daily ticks at JST 8–11 (Hobby allows once/day per expression).
 * Posts once when JST hour matches the date-seeded slot in the window.
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

  const slot = shouldAutoPublishNow();
  if (!slot.yes) {
    return NextResponse.json({
      ok: true,
      skipped: true,
      reason: "outside_daily_random_slot",
      date: jstDateKey(),
      hourJst: slot.hourJst,
      targetHourJst: slot.targetHourJst,
      window: slot.window,
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

  const post = await pickPostForDate();
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

    return NextResponse.json({
      ok: true,
      source: "cron",
      date: jstDateKey(),
      targetHourJst: slot.targetHourJst,
      targetMinuteJst: slot.targetMinuteJst,
      targetLabel: slot.targetLabel,
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
