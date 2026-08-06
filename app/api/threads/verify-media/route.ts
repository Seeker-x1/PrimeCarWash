import { NextResponse } from "next/server";
import { authorizeThreadsRequest, threadsAuthConfigured } from "@/lib/threads/auth";
import { fetchPublishedMedia, getThreadsCredentials } from "@/lib/threads/client";
import { getPostedForDate, loadPostedStore } from "@/lib/threads/posted-store";
import { jstDateKey } from "@/lib/threads/schedule";

export const runtime = "nodejs";

/**
 * GET /api/threads/verify-media?mediaId=... — Graph API で投稿の実在を確認
 * mediaId 省略時は本日の記録を検証
 */
export async function GET(request: Request) {
  if (!threadsAuthConfigured()) {
    return NextResponse.json({ ok: false, message: "Auth not configured." }, { status: 503 });
  }
  if (!authorizeThreadsRequest(request)) {
    return NextResponse.json({ ok: false, message: "Unauthorized." }, { status: 401 });
  }

  const creds = getThreadsCredentials();
  if (!creds) {
    return NextResponse.json(
      { ok: false, message: "THREADS_USER_ID / THREADS_ACCESS_TOKEN missing." },
      { status: 503 },
    );
  }

  const url = new URL(request.url);
  const mediaIdParam = url.searchParams.get("mediaId")?.trim();
  const dateKey = jstDateKey();
  const postedToday = await getPostedForDate(dateKey);
  const mediaId = mediaIdParam || postedToday?.mediaId;

  if (!mediaId) {
    return NextResponse.json({ ok: false, message: "No mediaId to verify." }, { status: 400 });
  }

  const media = await fetchPublishedMedia(creds, mediaId);
  const store = await loadPostedStore();
  const matchingRecords = store.records.filter((r) => r.mediaId === mediaId);

  return NextResponse.json({
    ok: true,
    date: dateKey,
    mediaId,
    verified: Boolean(media?.permalink || media?.text),
    media,
    blobRecords: matchingRecords,
    postedToday,
  });
}
