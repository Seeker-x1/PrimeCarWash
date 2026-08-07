import { get, put } from "@vercel/blob";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const LOCAL_PATH = path.join(process.cwd(), "data", "threads-overrides.json");
const BLOB_PATHNAME = "threads/date-overrides.json";
const MAX_OVERRIDES = 60;

export type DateOverride = {
  date: string;
  postId: string;
  themeId: string;
  text: string;
  rejectedIds: string[];
  /** AI 生成の重複回避用（直近の本文） */
  recentTexts?: string[];
  source: "bank" | "generated";
  refreshCount: number;
  updatedAt: string;
};

export type OverridesStore = {
  overrides: DateOverride[];
  updatedAt: string;
};

function emptyStore(): OverridesStore {
  return { overrides: [], updatedAt: new Date().toISOString() };
}

function hasBlobAuth(): boolean {
  if (process.env.BLOB_READ_WRITE_TOKEN?.trim()) return true;
  if (process.env.VERCEL && process.env.BLOB_STORE_ID?.trim()) return true;
  return false;
}

function parseStore(raw: unknown): OverridesStore {
  const parsed = raw as OverridesStore;
  if (!parsed || !Array.isArray(parsed.overrides)) return emptyStore();
  const overrides = parsed.overrides
    .filter(
      (o) =>
        o &&
        typeof o.date === "string" &&
        typeof o.postId === "string" &&
        typeof o.themeId === "string" &&
        typeof o.text === "string",
    )
    .map((o) => ({
      date: o.date,
      postId: o.postId,
      themeId: o.themeId,
      text: o.text,
      rejectedIds: Array.isArray(o.rejectedIds)
        ? o.rejectedIds.filter((id): id is string => typeof id === "string")
        : [],
      recentTexts: Array.isArray(o.recentTexts)
        ? o.recentTexts.filter(
            (t): t is string => typeof t === "string" && t.trim().length > 0,
          )
        : [],
      source: (o.source === "generated" ? "generated" : "bank") as "bank" | "generated",
      refreshCount: typeof o.refreshCount === "number" ? o.refreshCount : 0,
      updatedAt: typeof o.updatedAt === "string" ? o.updatedAt : new Date().toISOString(),
    }));
  return {
    overrides,
    updatedAt:
      typeof parsed.updatedAt === "string" ? parsed.updatedAt : new Date().toISOString(),
  };
}

function pruneStore(store: OverridesStore): OverridesStore {
  const byDate = new Map<string, DateOverride>();
  for (const item of store.overrides) {
    byDate.set(item.date, item);
  }
  const dates = [...byDate.keys()].sort();
  const keep = new Set(dates.slice(-MAX_OVERRIDES));
  return {
    overrides: [...byDate.values()].filter((o) => keep.has(o.date)),
    updatedAt: new Date().toISOString(),
  };
}

async function readLocal(): Promise<OverridesStore> {
  try {
    const raw = await readFile(LOCAL_PATH, "utf8");
    return parseStore(JSON.parse(raw));
  } catch {
    return emptyStore();
  }
}

async function writeLocal(store: OverridesStore): Promise<void> {
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

async function readBlob(): Promise<OverridesStore> {
  const result = await get(BLOB_PATHNAME, { access: "private" });
  if (!result || result.statusCode !== 200 || !result.stream) {
    return emptyStore();
  }
  const text = await streamToText(result.stream);
  if (!text.trim()) return emptyStore();
  return parseStore(JSON.parse(text));
}

async function writeBlob(store: OverridesStore): Promise<void> {
  await put(BLOB_PATHNAME, JSON.stringify(store, null, 2), {
    access: "private",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json",
  });
}

export function overridesStoreConfigured(): boolean {
  return hasBlobAuth() || !process.env.VERCEL;
}

export async function loadOverridesStore(): Promise<OverridesStore> {
  if (hasBlobAuth()) {
    try {
      return await readBlob();
    } catch (e) {
      console.error("[threads/overrides-store] blob read failed", e);
      return emptyStore();
    }
  }
  return readLocal();
}

export async function saveOverridesStore(store: OverridesStore): Promise<OverridesStore> {
  const next = pruneStore(store);

  if (hasBlobAuth()) {
    await writeBlob(next);
    return next;
  }

  if (process.env.VERCEL) {
    throw new Error(
      "本番で投稿差し替えを残すには Vercel Blob を有効化してください（BLOB_STORE_ID または BLOB_READ_WRITE_TOKEN）。",
    );
  }
  await writeLocal(next);
  return next;
}

export async function getOverrideForDate(dateKey: string): Promise<DateOverride | null> {
  const store = await loadOverridesStore();
  return store.overrides.find((o) => o.date === dateKey) ?? null;
}

export async function saveDateOverride(override: DateOverride): Promise<DateOverride> {
  const date = override.date.trim();
  if (!date) throw new Error("date required");

  const store = await loadOverridesStore();
  const rest = store.overrides.filter((o) => o.date !== date);
  rest.push({
    ...override,
    date,
    updatedAt: new Date().toISOString(),
  });
  await saveOverridesStore({ overrides: rest, updatedAt: new Date().toISOString() });
  return override;
}

/** 指定日の差し替えを削除し、ローテーション予定に戻す */
export async function clearOverrideForDate(dateKey: string): Promise<boolean> {
  const date = dateKey.trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    throw new Error("date must be YYYY-MM-DD (JST)");
  }
  const store = await loadOverridesStore();
  const next = store.overrides.filter((o) => o.date !== date);
  if (next.length === store.overrides.length) return false;
  await saveOverridesStore({ overrides: next, updatedAt: new Date().toISOString() });
  return true;
}
