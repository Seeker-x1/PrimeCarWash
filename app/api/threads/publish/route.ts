import { NextResponse } from "next/server";
import { assertPostBank, getPostById } from "@/lib/threads/content";
import { authorizeThreadsRequest, threadsAuthConfigured } from "@/lib/threads/auth";
import { isThreadsDryRun, publishTextPost } from "@/lib/threads/client";
import { getDisabledPostIds } from "@/lib/threads/disabled-store";
import { jstDateKey, pickPostForDate } from "@/lib/threads/schedule";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

export const runtime = "nodejs";

type PublishBody = {
  postId?: string;
  /** force dry-run even when credentials exist */
  dryRun?: boolean;
};

export async function POST(request: Request) {
  if (!threadsAuthConfigured()) {
    return NextResponse.json(
      { ok: false, message: "THREADS_PUBLISH_SECRET (or CRON_SECRET) is not configured." },
      { status: 503 },
    );
  }
  if (!authorizeThreadsRequest(request)) {
    return NextResponse.json({ ok: false, message: "Unauthorized." }, { status: 401 });
  }

  const ip = getClientIp(request);
  const limited = checkRateLimit(`threads-publish:${ip}`, 10, 60_000);
  if (!limited.ok) {
    return NextResponse.json(
      { ok: false, message: "Rate limited." },
      { status: 429, headers: { "Retry-After": String(limited.retryAfterSec) } },
    );
  }

  let body: PublishBody = {};
  try {
    const raw = await request.text();
    if (raw.trim()) body = JSON.parse(raw) as PublishBody;
  } catch {
    return NextResponse.json({ ok: false, message: "Invalid JSON body." }, { status: 400 });
  }

  try {
    assertPostBank();
  } catch (e) {
    return NextResponse.json(
      { ok: false, message: e instanceof Error ? e.message : "Invalid post bank." },
      { status: 500 },
    );
  }

  const post = body.postId?.trim()
    ? getPostById(body.postId.trim())
    : await pickPostForDate();

  if (!post) {
    return NextResponse.json(
      { ok: false, message: body.postId ? "Post not found." : "No enabled posts in bank." },
      { status: 404 },
    );
  }
  if ((!post.enabled || (await getDisabledPostIds()).has(post.id)) && body.postId) {
    return NextResponse.json(
      { ok: false, message: `Post "${post.id}" is disabled or deleted from rotation.` },
      { status: 400 },
    );
  }

  const dryRun = body.dryRun === true || (body.dryRun !== false && isThreadsDryRun());

  try {
    const result = await publishTextPost({
      postId: post.id,
      themeId: post.themeId,
      text: post.text,
      dryRun,
    });

    return NextResponse.json({
      ok: true,
      date: jstDateKey(),
      ...result,
    });
  } catch (e) {
    console.error("[threads/publish]", e);
    const raw = e instanceof Error ? e.message : "Publish failed.";
    let message = raw;
    if (/failed to decrypt/i.test(raw)) {
      message =
        "Threads のアクセストークンが無効です（Failed to decrypt）。Vercel の THREADS_ACCESS_TOKEN を、Graph API Explorer の Threads 用トークンで入れ直して Redeploy してください（引用符や改行を付けない）。";
    } else if (/THREADS_USER_ID|THREADS_ACCESS_TOKEN are required/i.test(raw)) {
      message =
        "THREADS_USER_ID / THREADS_ACCESS_TOKEN が Vercel に未設定です。両方入れて Redeploy してください。";
    } else if (/does not exist|missing permissions|Unsupported post request/i.test(raw)) {
      message =
        "THREADS_USER_ID が違う可能性が高いです。ユーザー名（例: primecarwashjapan）ではなく、Graph API Explorer で me?fields=id,username を実行して返ってきた数字の id を入れて Redeploy してください。";
    }
    return NextResponse.json({ ok: false, message }, { status: 502 });
  }
}
