import { NextResponse } from "next/server";
import { authorizeThreadsRequest, threadsAuthConfigured } from "@/lib/threads/auth";
import { clearOverrideForDate, overridesStoreConfigured } from "@/lib/threads/overrides-store";
import { refreshPickForDate } from "@/lib/threads/refresh-pick";
import { jstDateKey } from "@/lib/threads/schedule";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

export const runtime = "nodejs";

type Body = { date?: string; forceGenerate?: boolean };

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

  if (!overridesStoreConfigured()) {
    return NextResponse.json(
      {
        ok: false,
        message:
          "投稿の差し替えには Vercel Blob が必要です。Storage で Blob を接続して Redeploy してください。",
      },
      { status: 503 },
    );
  }

  const ip = getClientIp(request);
  const limited = checkRateLimit(`threads-refresh:${ip}`, 30, 60_000);
  if (!limited.ok) {
    return NextResponse.json(
      { ok: false, message: "Rate limited." },
      { status: 429, headers: { "Retry-After": String(limited.retryAfterSec) } },
    );
  }

  let body: Body = {};
  try {
    const raw = await request.text();
    if (raw.trim()) body = JSON.parse(raw) as Body;
  } catch {
    return NextResponse.json({ ok: false, message: "Invalid JSON body." }, { status: 400 });
  }

  const dateKey = body.date?.trim() || jstDateKey();

  try {
    const result = await refreshPickForDate(dateKey, {
      forceGenerate: body.forceGenerate === true,
    });
    return NextResponse.json({
      ok: true,
      date: dateKey,
      postId: result.post.id,
      themeId: result.post.themeId,
      text: result.post.text,
      source: result.source,
      refreshCount: result.refreshCount,
      forceGenerate: body.forceGenerate === true,
      note: body.forceGenerate
        ? "AI で新規文面を生成しました（何度でも再生成できます）。"
        : result.source === "generated"
          ? "バンク候補を使い切ったため AI で新規生成しました。"
          : "投稿バンクから別案に差し替えました。",
    });
  } catch (e) {
    console.error("[threads/refresh]", e);
    const raw = e instanceof Error ? e.message : "Refresh failed.";
    let message = raw;
    if (/GEMINI_API_KEY/i.test(raw)) {
      message =
        "GEMINI_API_KEY が Vercel に未設定です。AI 生成に必要な場合はサーバー専用キーを入れて Redeploy してください。";
    }
    return NextResponse.json({ ok: false, message }, { status: 502 });
  }
}

/** 指定日の差し替えを削除（ローテーション予定に戻す） */
export async function DELETE(request: Request) {
  if (!threadsAuthConfigured()) {
    return NextResponse.json(
      { ok: false, message: "THREADS_PUBLISH_SECRET (or CRON_SECRET) is not configured." },
      { status: 503 },
    );
  }
  if (!authorizeThreadsRequest(request)) {
    return NextResponse.json({ ok: false, message: "Unauthorized." }, { status: 401 });
  }

  if (!overridesStoreConfigured()) {
    return NextResponse.json(
      {
        ok: false,
        message: "差し替えの解除には Vercel Blob が必要です。",
      },
      { status: 503 },
    );
  }

  const url = new URL(request.url);
  const dateKey = url.searchParams.get("date")?.trim() || jstDateKey();

  try {
    const cleared = await clearOverrideForDate(dateKey);
    return NextResponse.json({
      ok: true,
      date: dateKey,
      cleared,
      note: cleared
        ? "差し替えを解除し、ローテーション予定に戻しました。"
        : "この日付に差し替えはありません。",
    });
  } catch (e) {
    console.error("[threads/refresh] clear", e);
    return NextResponse.json(
      { ok: false, message: e instanceof Error ? e.message : "Clear failed." },
      { status: 502 },
    );
  }
}
