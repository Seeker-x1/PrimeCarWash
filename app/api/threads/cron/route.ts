import { NextResponse } from "next/server";
import { assertPostBank } from "@/lib/threads/content";
import { authorizeThreadsCron, threadsAuthConfigured } from "@/lib/threads/auth";
import { isThreadsDryRun, publishTextPost } from "@/lib/threads/client";
import { jstDateKey, pickPostForDate } from "@/lib/threads/schedule";

export const runtime = "nodejs";

/**
 * Vercel Cron: daily auto-post (see vercel.json) — 10:00 JST.
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

  try {
    assertPostBank();
  } catch (e) {
    return NextResponse.json(
      { ok: false, message: e instanceof Error ? e.message : "Invalid post bank." },
      { status: 500 },
    );
  }

  const post = pickPostForDate();
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
