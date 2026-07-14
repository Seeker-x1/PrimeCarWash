import { listRotatingPosts } from "@/lib/threads/content";
import type { ThreadsPost } from "@/lib/threads/types";

/** JST の年月日キー（例: 2026-07-14） */
export function jstDateKey(date = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

/** エポックからの通算日（JST 日付基準）— 決定的ローテーション用 */
export function jstDayIndex(date = new Date()): number {
  const key = jstDateKey(date);
  const [y, m, d] = key.split("-").map(Number);
  return Math.floor(Date.UTC(y, m - 1, d) / 86_400_000);
}

export function jstHour(date = new Date()): number {
  const hour = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Tokyo",
    hour: "numeric",
    hourCycle: "h23",
  })
    .formatToParts(date)
    .find((p) => p.type === "hour")?.value;
  return Number(hour ?? "0");
}

/**
 * Auto-post window in JST hours [start, end).
 * Defaults: 8–12 → candidates 8,9,10,11.
 */
export function getPostWindowHours(): { start: number; end: number } {
  const rawStart = Number.parseInt(process.env.THREADS_POST_WINDOW_START ?? "8", 10);
  const rawEnd = Number.parseInt(process.env.THREADS_POST_WINDOW_END ?? "12", 10);
  const start = Number.isFinite(rawStart) ? Math.min(23, Math.max(0, rawStart)) : 8;
  let end = Number.isFinite(rawEnd) ? Math.min(24, Math.max(0, rawEnd)) : 12;
  if (end <= start) end = Math.min(24, start + 1);
  return { start, end };
}

/**
 * That day's post hour (JST), picked deterministically from the date
 * so it looks random across days but needs no DB.
 */
export function pickPostHourJstForDate(date = new Date()): number {
  const { start, end } = getPostWindowHours();
  const span = end - start;
  return start + (jstDayIndex(date) % span);
}

export function shouldAutoPublishNow(date = new Date()): {
  yes: boolean;
  hourJst: number;
  targetHourJst: number;
  window: { start: number; end: number };
} {
  const window = getPostWindowHours();
  const hourJst = jstHour(date);
  const targetHourJst = pickPostHourJstForDate(date);
  return {
    yes: hourJst === targetHourJst,
    hourJst,
    targetHourJst,
    window,
  };
}

/**
 * その日の投稿を決定的に選ぶ。
 * 削除済みを除いたキューを id 順にし、通算日で剰余 → 削除すると以降が繰り上がる。
 */
export async function pickPostForDate(date = new Date()): Promise<ThreadsPost | null> {
  const enabled = await listRotatingPosts();
  if (enabled.length === 0) return null;
  const index = jstDayIndex(date) % enabled.length;
  return enabled[index] ?? null;
}

export async function peekUpcoming(
  days = 7,
  from = new Date(),
): Promise<Array<{ date: string; post: ThreadsPost; hourJst: number }>> {
  const out: Array<{ date: string; post: ThreadsPost; hourJst: number }> = [];
  for (let i = 0; i < days; i += 1) {
    const d = new Date(from.getTime() + i * 86_400_000);
    const post = await pickPostForDate(d);
    if (!post) continue;
    out.push({
      date: jstDateKey(d),
      post,
      hourJst: pickPostHourJstForDate(d),
    });
  }
  return out;
}
