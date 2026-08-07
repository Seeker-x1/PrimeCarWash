import { get, put } from "@vercel/blob";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { jstDateKey } from "@/lib/threads/schedule";

const LOCAL_PATH = path.join(process.cwd(), "data", "threads-posted.json");
const BLOB_PATHNAME = "threads/posted-dates.json";
const MAX_RECORDS = 90;

export type PostedRecord = {
  date: string;
  postId: string;
  mediaId?: string;
  publishedAt: string;
  source: "cron" | "catch_up" | "manual";
};

export type PostedStore = {
  records: PostedRecord[];
  updatedAt: string;
};

function emptyStore(): PostedStore {
  return { records: [], updatedAt: new Date().toISOString() };
}

function hasBlobAuth(): boolean {
  if (process.env.BLOB_READ_WRITE_TOKEN?.trim()) return true;
  if (process.env.VERCEL && process.env.BLOB_STORE_ID?.trim()) return true;
  return false;
}

function parseStore(raw: unknown): PostedStore {
  const parsed = raw as PostedStore;
  if (!parsed || !Array.isArray(parsed.records)) return emptyStore();
  const records = parsed.records
    .filter(
      (r) =>
        r &&
        typeof r.date === "string" &&
        typeof r.postId === "string" &&
        typeof r.publishedAt === "string",
    )
    .map((r) => ({
      date: r.date,
      postId: r.postId,
      mediaId: typeof r.mediaId === "string" ? r.mediaId : undefined,
      publishedAt: r.publishedAt,
      source:
        r.source === "cron" || r.source === "catch_up" || r.source === "manual"
          ? r.source
          : "manual",
    }));
  return {
    records,
    updatedAt:
      typeof parsed.updatedAt === "string" ? parsed.updatedAt : new Date().toISOString(),
  };
}

function pruneStore(store: PostedStore): PostedStore {
  const sorted = [...store.records].sort((a, b) => a.publishedAt.localeCompare(b.publishedAt));
  return {
    records: sorted.slice(-MAX_RECORDS),
    updatedAt: new Date().toISOString(),
  };
}

async function readLocal(): Promise<PostedStore> {
  try {
    const raw = await readFile(LOCAL_PATH, "utf8");
    return parseStore(JSON.parse(raw));
  } catch {
    return emptyStore();
  }
}

async function writeLocal(store: PostedStore): Promise<void> {
  await mkdir(path.dirname(LOCAL_PATH), { recursive: true });
  await writeFile(LOCAL_PATH, `${JSON.stringify(store, null, 2)}\n`, "utf8");
}

async function streamToText(stream: ReadableStream<Uint8Array>): Promise<string> {
  const reader = stream.getReader();
  const chunks: Uint8Array[] = [];
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    if (value) chunks.push(value);
  }
  const merged = new Uint8Array(chunks.reduce((n, c) => n + c.length, 0));
  let offset = 0;
  for (const c of chunks) {
    merged.set(c, offset);
    offset += c.length;
  }
  return new TextDecoder().decode(merged);
}

async function readBlob(): Promise<PostedStore> {
  const result = await get(BLOB_PATHNAME, { access: "private" });
  if (!result || result.statusCode !== 200 || !result.stream) {
    return emptyStore();
  }
  const text = await streamToText(result.stream);
  if (!text.trim()) return emptyStore();
  return parseStore(JSON.parse(text));
}

async function writeBlob(store: PostedStore): Promise<void> {
  await put(BLOB_PATHNAME, JSON.stringify(store, null, 2), {
    access: "private",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json",
  });
}

export function postedStoreConfigured(): boolean {
  return hasBlobAuth() || !process.env.VERCEL;
}

export async function loadPostedStore(): Promise<PostedStore> {
  if (hasBlobAuth()) {
    try {
      return await readBlob();
    } catch (e) {
      console.error("[threads/posted-store] blob read failed", e);
      return emptyStore();
    }
  }
  return readLocal();
}

export async function savePostedStore(store: PostedStore): Promise<PostedStore> {
  const next = pruneStore({
    records: store.records,
    updatedAt: new Date().toISOString(),
  });

  if (hasBlobAuth()) {
    await writeBlob(next);
    return next;
  }

  if (process.env.VERCEL) {
    throw new Error(
      "本番で投稿済み記録を残すには Vercel Blob を有効化し、BLOB_READ_WRITE_TOKEN を設定してください。",
    );
  }
  await writeLocal(next);
  return next;
}

export async function getPostedForDate(dateKey: string): Promise<PostedRecord | null> {
  const store = await loadPostedStore();
  const matches = store.records.filter((r) => postedRecordJstDate(r) === dateKey);
  if (matches.length === 0) return null;
  return matches.sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))[0] ?? null;
}

/** 指定日より前の JST 日付に同じ postId が出ていれば true */
export function wasPostIdPublishedOnPriorJstDay(
  postId: string,
  dateKey: string,
  records: PostedRecord[],
): boolean {
  return records.some(
    (r) => r.postId === postId && postedRecordJstDate(r) < dateKey,
  );
}

/** 投稿記録または日付差し替えで、指定日より前に同じ postId が使われていれば true */
export function wasPostIdUsedBeforeJstDate(
  postId: string,
  dateKey: string,
  records: PostedRecord[],
  priorOverrides: Array<{ date: string; postId: string }>,
): boolean {
  if (wasPostIdPublishedOnPriorJstDay(postId, dateKey, records)) return true;
  return priorOverrides.some((o) => o.postId === postId && o.date < dateKey);
}

/** publishedAt の JST 日付（記録の date キーと照合用） */
export function postedRecordJstDate(record: PostedRecord): string {
  return jstDateKey(new Date(record.publishedAt));
}

/**
 * 手動記録の date と publishedAt の JST 日が食い違う（先取りマーク等）。
 * この場合 Cron をブロックしない。
 */
export function isStaleManualPostedRecord(record: PostedRecord): boolean {
  if (record.source !== "manual") return false;
  return postedRecordJstDate(record) !== record.date;
}

/**
 * Cron は「その日の予定投稿がまだ出ていない」なら動く。
 * 手動で別 ID を出しただけではブロックしない（予定 take-04 / 手動 save-03 など）。
 */
export function cronBlockedByPostedToday(
  postedToday: PostedRecord | null,
  _scheduledPostId: string | null,
): boolean {
  if (!postedToday) return false;
  if (isStaleManualPostedRecord(postedToday)) return false;
  return true;
}

export async function markPostedForDate(input: {
  date: string;
  postId: string;
  mediaId?: string;
  source: PostedRecord["source"];
}): Promise<PostedRecord> {
  const postId = input.postId.trim();
  if (!postId) throw new Error("postId required");
  // 記録日は常に投稿実行時の JST 日（クライアント指定の先取り date を防ぐ）
  const date = jstDateKey();

  const store = await loadPostedStore();
  const record: PostedRecord = {
    date,
    postId,
    mediaId: input.mediaId?.trim() || undefined,
    publishedAt: new Date().toISOString(),
    source: input.source,
  };

  const rest = [...store.records, record];
  await savePostedStore({ records: rest, updatedAt: new Date().toISOString() });
  return record;
}
