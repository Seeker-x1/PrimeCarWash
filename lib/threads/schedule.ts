import { listRotatingPosts } from "@/lib/threads/content";
import { getOverrideForDate, loadOverridesStore } from "@/lib/threads/overrides-store";
import {
  loadPostedStore,
  postedRecordJstDate,
  postedStoreConfigured,
  wasPostIdUsedBeforeJstDate,
  type PostedRecord,
} from "@/lib/threads/posted-store";
import type { ThreadsPost } from "@/lib/threads/types";

/**
 * JST hours that vercel.json Cron hits on Vercel Hobby (UTC 21 / 22 → JST 6 / 7).
 * Blob 未設定の本番では catch-up が無効なので、target もこの時刻に限定する。
 */
export const HOBBY_CRON_HOURS_JST = [6, 7];

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

export function jstMinute(date = new Date()): number {
  const minute = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Tokyo",
    minute: "numeric",
  })
    .formatToParts(date)
    .find((p) => p.type === "minute")?.value;
  return Number(minute ?? "0");
}

/**
 * Auto-post window in JST hours [start, end).
 * Defaults: 6–8 → candidates 6,7（朝6〜7時台固定）。
 */
export function getPostWindowHours(): { start: number; end: number } {
  const rawStart = Number.parseInt(process.env.THREADS_POST_WINDOW_START ?? "6", 10);
  const rawEnd = Number.parseInt(process.env.THREADS_POST_WINDOW_END ?? "8", 10);
  const start = Number.isFinite(rawStart) ? Math.min(23, Math.max(0, rawStart)) : 6;
  let end = Number.isFinite(rawEnd) ? Math.min(24, Math.max(0, rawEnd)) : 8;
  if (end <= start) end = Math.min(24, start + 1);
  return { start, end };
}

/** Stable scramble from day index (not crypto; just day-to-day variety). */
export function dayMix(dayIndex: number, salt: number): number {
  let x = (dayIndex + 1) * 1103515245 + salt;
  x = Math.imul(x ^ (x >>> 16), 2246822507);
  x = Math.imul(x ^ (x >>> 13), 3266489909);
  return (x >>> 0) % 1_000_000;
}

/**
 * That day's post hour (JST), picked deterministically from the date.
 * Blob 未設定の Vercel 本番は Cron 時刻（6/7）に合わせる。
 */
export function pickPostHourJstForDate(date = new Date()): number {
  if (!postedStoreConfigured() || process.env.VERCEL) {
    const idx = dayMix(jstDayIndex(date), 17) % HOBBY_CRON_HOURS_JST.length;
    return HOBBY_CRON_HOURS_JST[idx];
  }
  const { start, end } = getPostWindowHours();
  const span = end - start;
  return start + (dayMix(jstDayIndex(date), 17) % span);
}

/**
 * That day's post minute (JST 0–59), deterministic from the date.
 * Exact-minute firing needs frequent cron (Pro). Hobby only guarantees
 * "sometime during the target hour", so this is the intended/display minute.
 */
export function pickPostMinuteJstForDate(date = new Date()): number {
  return dayMix(jstDayIndex(date), 91) % 60;
}

export function formatJstHm(hour: number, minute: number): string {
  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}

export type PublishSkipReason =
  | "already_posted_today"
  | "before_target_slot"
  | "after_post_window"
  | "outside_daily_random_slot";

export type PublishMode = "on_time" | "catch_up";

const PRECISION_NOTE =
  "朝6〜7時台固定。時は日付で6か7に決まり、分も日付で決めますが、Hobby の Cron は同時台内で前後するため厳密なちょうどMM分起動は保証されません。取りこぼし時は7時 Cron で1回だけ追いかけます。";

/**
 * Decide whether Cron should publish now.
 * - on_time: JST hour matches the date-seeded slot
 * - catch_up: past the slot but still inside the window, and not posted today yet
 */
export function evaluatePublishSlot(
  date = new Date(),
  options: {
    alreadyPostedToday: boolean;
    catchUpEnabled: boolean;
  },
): {
  yes: boolean;
  mode: PublishMode | null;
  skipReason: PublishSkipReason | null;
  hourJst: number;
  minuteJst: number;
  targetHourJst: number;
  targetMinuteJst: number;
  targetLabel: string;
  window: { start: number; end: number };
  precisionNote: string;
} {
  const window = getPostWindowHours();
  const hourJst = jstHour(date);
  const minuteJst = jstMinute(date);
  const targetHourJst = pickPostHourJstForDate(date);
  const targetMinuteJst = pickPostMinuteJstForDate(date);
  const base = {
    hourJst,
    minuteJst,
    targetHourJst,
    targetMinuteJst,
    targetLabel: formatJstHm(targetHourJst, targetMinuteJst),
    window,
    precisionNote: PRECISION_NOTE,
  };

  if (options.alreadyPostedToday) {
    return { ...base, yes: false, mode: null, skipReason: "already_posted_today" };
  }

  if (hourJst >= window.end) {
    return { ...base, yes: false, mode: null, skipReason: "after_post_window" };
  }

  if (hourJst === targetHourJst) {
    return { ...base, yes: true, mode: "on_time", skipReason: null };
  }

  if (options.catchUpEnabled && hourJst > targetHourJst) {
    return { ...base, yes: true, mode: "catch_up", skipReason: null };
  }

  const skipReason: PublishSkipReason =
    hourJst < targetHourJst ? "before_target_slot" : "outside_daily_random_slot";

  return { ...base, yes: false, mode: null, skipReason };
}

/**
 * Hobby は同日に Cron が1回しか動かないことがある。
 * 窓内の Cron 起動時は、予定投稿が未完了ならその tick で出す。
 */
export function resolveCronPublish(
  slot: ReturnType<typeof evaluatePublishSlot>,
  cronBlocked: boolean,
): { yes: boolean; mode: PublishMode | null; skipReason: PublishSkipReason | null } {
  if (cronBlocked) {
    return { yes: false, mode: null, skipReason: "already_posted_today" };
  }
  if (slot.yes) {
    return { yes: true, mode: slot.mode, skipReason: null };
  }
  if (
    process.env.VERCEL &&
    slot.hourJst >= slot.window.start &&
    slot.hourJst < slot.window.end
  ) {
    const mode: PublishMode =
      slot.hourJst > slot.targetHourJst ? "catch_up" : "on_time";
    return { yes: true, mode, skipReason: null };
  }
  // Hobby Cron は遅延・1日1回・窓外起動があり得る。未投稿ならいつ起動しても出す。
  if (process.env.VERCEL) {
    return { yes: true, mode: "catch_up", skipReason: null };
  }
  return { yes: false, mode: null, skipReason: slot.skipReason };
}

/** @deprecated Prefer evaluatePublishSlot */
export function shouldAutoPublishNow(date = new Date()): {
  yes: boolean;
  hourJst: number;
  minuteJst: number;
  targetHourJst: number;
  targetMinuteJst: number;
  targetLabel: string;
  window: { start: number; end: number };
  precisionNote: string;
} {
  const slot = evaluatePublishSlot(date, {
    alreadyPostedToday: false,
    catchUpEnabled: false,
  });
  return {
    yes: slot.yes,
    hourJst: slot.hourJst,
    minuteJst: slot.minuteJst,
    targetHourJst: slot.targetHourJst,
    targetMinuteJst: slot.targetMinuteJst,
    targetLabel: slot.targetLabel,
    window: slot.window,
    precisionNote: slot.precisionNote,
  };
}

/**
 * その日の投稿を決定的に選ぶ。
 * 削除済みを除いたキューを id 順にし、通算日で剰余 → 削除すると以降が繰り上がる。
 */
export async function pickPostForDate(date = new Date()): Promise<ThreadsPost | null> {
  const dateKey = jstDateKey(date);
  const override = await getOverrideForDate(dateKey);
  if (override) {
    return {
      id: override.postId,
      themeId: override.themeId,
      text: override.text,
      enabled: true,
    };
  }

  const enabled = await listRotatingPosts();
  if (enabled.length === 0) return null;
  const index = jstDayIndex(date) % enabled.length;
  return enabled[index] ?? null;
}

/** ローテーションで次の候補（同日内の先出しスキップ用） */
export function pickNextRotatingPost(
  currentId: string,
  enabled: ThreadsPost[],
): ThreadsPost | null {
  if (enabled.length === 0) return null;
  const idx = enabled.findIndex((p) => p.id === currentId);
  const start = idx >= 0 ? idx + 1 : 0;
  for (let i = 0; i < enabled.length; i += 1) {
    const post = enabled[(start + i) % enabled.length];
    if (post) return post;
  }
  return null;
}

/**
 * その日の予定投稿。直近に同じ postId を出済み／予定済みならローテーションを進める。
 */
export async function pickPostForDateSkippingAired(
  date = new Date(),
  priorRecords: PostedRecord[],
): Promise<{ post: ThreadsPost | null; skippedPostId: string | null }> {
  const dateKey = jstDateKey(date);
  const priorOverrides =
    (await loadOverridesStore()).overrides
      .filter((o) => o.date < dateKey)
      .map((o) => ({ date: o.date, postId: o.postId }));

  const isUsedBefore = (postId: string) =>
    wasPostIdUsedBeforeJstDate(postId, dateKey, priorRecords, priorOverrides);

  const override = await getOverrideForDate(dateKey);
  if (override && !isUsedBefore(override.postId)) {
    return {
      post: {
        id: override.postId,
        themeId: override.themeId,
        text: override.text,
        enabled: true,
      },
      skippedPostId: null,
    };
  }

  const enabled = await listRotatingPosts();
  if (enabled.length === 0) return { post: null, skippedPostId: null };

  let post = await pickPostForDate(date);
  if (!post) return { post: null, skippedPostId: null };

  let skippedPostId: string | null =
    override && isUsedBefore(override.postId) ? override.postId : null;
  const seen = new Set<string>();

  while (post && isUsedBefore(post.id) && !seen.has(post.id)) {
    seen.add(post.id);
    if (!skippedPostId) skippedPostId = post.id;
    post = pickNextRotatingPost(post.id, enabled);
  }

  return { post, skippedPostId };
}

/** 指定日より前に投稿済み・差し替え済みの postId 一覧 */
export async function getPostIdsUsedBeforeJstDate(dateKey: string): Promise<Set<string>> {
  const ids = new Set<string>();
  if (postedStoreConfigured()) {
    const store = await loadPostedStore();
    for (const record of store.records) {
      if (postedRecordJstDate(record) < dateKey) ids.add(record.postId);
    }
  }
  const overrides = await loadOverridesStore();
  for (const override of overrides.overrides) {
    if (override.date < dateKey) ids.add(override.postId);
  }
  return ids;
}

export async function peekUpcoming(
  days = 7,
  from = new Date(),
): Promise<
  Array<{ date: string; post: ThreadsPost; hourJst: number; minuteJst: number; timeLabel: string }>
> {
  const records = postedStoreConfigured() ? (await loadPostedStore()).records : [];

  const out: Array<{
    date: string;
    post: ThreadsPost;
    hourJst: number;
    minuteJst: number;
    timeLabel: string;
  }> = [];

  for (let i = 0; i < days; i += 1) {
    const d = new Date(from.getTime() + i * 86_400_000);
    const dateKey = jstDateKey(d);
    const { post } = await pickPostForDateSkippingAired(d, records);
    if (!post) continue;
    const hourJst = pickPostHourJstForDate(d);
    const minuteJst = pickPostMinuteJstForDate(d);
    out.push({
      date: dateKey,
      post,
      hourJst,
      minuteJst,
      timeLabel: formatJstHm(hourJst, minuteJst),
    });
  }
  return out;
}
