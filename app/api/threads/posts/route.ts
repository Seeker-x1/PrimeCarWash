import { NextResponse } from "next/server";
import { getPostById } from "@/lib/threads/content";
import { authorizeThreadsRequest, threadsAuthConfigured } from "@/lib/threads/auth";
import {
  disablePostId,
  disabledStoreConfigured,
  restorePostId,
} from "@/lib/threads/disabled-store";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

export const runtime = "nodejs";

type Body = { postId?: string };

async function parseBody(request: Request): Promise<Body> {
  const raw = await request.text();
  if (!raw.trim()) return {};
  return JSON.parse(raw) as Body;
}

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
  const limited = checkRateLimit(`threads-disable:${ip}`, 30, 60_000);
  if (!limited.ok) {
    return NextResponse.json(
      { ok: false, message: "Rate limited." },
      { status: 429, headers: { "Retry-After": String(limited.retryAfterSec) } },
    );
  }

  if (!disabledStoreConfigured()) {
    return NextResponse.json(
      {
        ok: false,
        message:
          "削除の永続化には Vercel Blob が必要です。Storage で Blob を作り BLOB_READ_WRITE_TOKEN を入れて Redeploy してください。",
      },
      { status: 503 },
    );
  }

  let body: Body;
  try {
    body = await parseBody(request);
  } catch {
    return NextResponse.json({ ok: false, message: "Invalid JSON body." }, { status: 400 });
  }

  const postId = body.postId?.trim();
  if (!postId) {
    return NextResponse.json({ ok: false, message: "postId required." }, { status: 400 });
  }
  if (!getPostById(postId)) {
    return NextResponse.json({ ok: false, message: "Post not found." }, { status: 404 });
  }

  try {
    const store = await disablePostId(postId);
    return NextResponse.json({
      ok: true,
      action: "deleted",
      postId,
      deletedIds: store.ids,
      note: "ローテーションから外しました。以降の予定は繰り上がります。",
    });
  } catch (e) {
    return NextResponse.json(
      { ok: false, message: e instanceof Error ? e.message : "Delete failed." },
      { status: 502 },
    );
  }
}

/** Restore a soft-deleted post into the rotation. */
export async function PUT(request: Request) {
  if (!threadsAuthConfigured()) {
    return NextResponse.json(
      { ok: false, message: "THREADS_PUBLISH_SECRET (or CRON_SECRET) is not configured." },
      { status: 503 },
    );
  }
  if (!authorizeThreadsRequest(request)) {
    return NextResponse.json({ ok: false, message: "Unauthorized." }, { status: 401 });
  }

  if (!disabledStoreConfigured()) {
    return NextResponse.json(
      {
        ok: false,
        message:
          "復元の永続化には Vercel Blob が必要です。Storage で Blob を作り BLOB_READ_WRITE_TOKEN を入れて Redeploy してください。",
      },
      { status: 503 },
    );
  }

  let body: Body;
  try {
    body = await parseBody(request);
  } catch {
    return NextResponse.json({ ok: false, message: "Invalid JSON body." }, { status: 400 });
  }

  const postId = body.postId?.trim();
  if (!postId) {
    return NextResponse.json({ ok: false, message: "postId required." }, { status: 400 });
  }

  try {
    const store = await restorePostId(postId);
    return NextResponse.json({
      ok: true,
      action: "restored",
      postId,
      deletedIds: store.ids,
    });
  } catch (e) {
    return NextResponse.json(
      { ok: false, message: e instanceof Error ? e.message : "Restore failed." },
      { status: 502 },
    );
  }
}
