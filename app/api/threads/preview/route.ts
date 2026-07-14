import { NextResponse } from "next/server";
import { assertPostBank, getThemeById, THREADS_POSTS, THREADS_THEMES } from "@/lib/threads/content";
import { authorizeThreadsRequest, threadsAuthConfigured } from "@/lib/threads/auth";
import { isThreadsDryRun } from "@/lib/threads/client";
import { jstDateKey, peekUpcoming, pickPostForDate } from "@/lib/threads/schedule";

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

  const today = pickPostForDate();
  const theme = today ? getThemeById(today.themeId) : undefined;

  return NextResponse.json({
    ok: true,
    dryRunDefault: isThreadsDryRun(),
    date: jstDateKey(),
    today: today
      ? {
          post: today,
          theme: theme ?? null,
        }
      : null,
    upcoming: peekUpcoming(14).map(({ date, post }) => ({
      date,
      postId: post.id,
      themeId: post.themeId,
      themeName: getThemeById(post.themeId)?.nameJa ?? post.themeId,
      preview: post.text.slice(0, 80).replace(/\n/g, " "),
    })),
    themes: THREADS_THEMES,
    posts: THREADS_POSTS.map((p) => ({
      id: p.id,
      themeId: p.themeId,
      enabled: p.enabled,
      length: p.text.length,
      preview: p.text.slice(0, 80).replace(/\n/g, " "),
    })),
  });
}
