import { listEnabledPosts } from "@/lib/threads/content";
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

/**
 * その日の投稿を決定的に選ぶ（DB 不要）。
 * enabled な投稿を id 順で並べ、通算日で剰余。
 */
export function pickPostForDate(date = new Date()): ThreadsPost | null {
  const enabled = listEnabledPosts().slice().sort((a, b) => a.id.localeCompare(b.id));
  if (enabled.length === 0) return null;
  const index = jstDayIndex(date) % enabled.length;
  return enabled[index] ?? null;
}

export function peekUpcoming(days = 7, from = new Date()): Array<{ date: string; post: ThreadsPost }> {
  const out: Array<{ date: string; post: ThreadsPost }> = [];
  for (let i = 0; i < days; i += 1) {
    const d = new Date(from.getTime() + i * 86_400_000);
    const post = pickPostForDate(d);
    if (!post) continue;
    out.push({ date: jstDateKey(d), post });
  }
  return out;
}
