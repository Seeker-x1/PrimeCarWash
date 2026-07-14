import { get, put } from "@vercel/blob";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const LOCAL_PATH = path.join(process.cwd(), "data", "threads-disabled.json");
const BLOB_PATHNAME = "threads/disabled-posts.json";

export type DisabledStore = {
  ids: string[];
  updatedAt: string;
};

function emptyStore(): DisabledStore {
  return { ids: [], updatedAt: new Date().toISOString() };
}

function hasBlobAuth(): boolean {
  if (process.env.BLOB_READ_WRITE_TOKEN?.trim()) return true;
  // Connected via Vercel store + OIDC (no static RW token required)
  if (process.env.VERCEL && process.env.BLOB_STORE_ID?.trim()) return true;
  return false;
}

function hasBlobToken(): boolean {
  return hasBlobAuth();
}

function parseStore(raw: unknown): DisabledStore {
  const parsed = raw as DisabledStore;
  if (!parsed || !Array.isArray(parsed.ids)) return emptyStore();
  return {
    ids: parsed.ids.filter((id) => typeof id === "string" && id.trim()),
    updatedAt:
      typeof parsed.updatedAt === "string" ? parsed.updatedAt : new Date().toISOString(),
  };
}

async function readLocal(): Promise<DisabledStore> {
  try {
    const raw = await readFile(LOCAL_PATH, "utf8");
    return parseStore(JSON.parse(raw));
  } catch {
    return emptyStore();
  }
}

async function writeLocal(store: DisabledStore): Promise<void> {
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

async function readBlob(): Promise<DisabledStore> {
  const result = await get(BLOB_PATHNAME, { access: "private" });
  if (!result || result.statusCode !== 200 || !result.stream) {
    return emptyStore();
  }
  const text = await streamToText(result.stream);
  if (!text.trim()) return emptyStore();
  return parseStore(JSON.parse(text));
}

async function writeBlob(store: DisabledStore): Promise<void> {
  await put(BLOB_PATHNAME, JSON.stringify(store, null, 2), {
    access: "private",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json",
  });
}

export async function loadDisabledStore(): Promise<DisabledStore> {
  if (hasBlobToken()) {
    try {
      return await readBlob();
    } catch (e) {
      console.error("[threads/disabled-store] blob read failed", e);
      return emptyStore();
    }
  }
  return readLocal();
}

export async function saveDisabledStore(store: DisabledStore): Promise<DisabledStore> {
  const next: DisabledStore = {
    ids: [...new Set(store.ids.map((id) => id.trim()).filter(Boolean))].sort(),
    updatedAt: new Date().toISOString(),
  };

  if (hasBlobToken()) {
    await writeBlob(next);
    return next;
  }

  if (process.env.VERCEL) {
    throw new Error(
      "本番で削除を残すには Vercel Blob を有効化し、BLOB_READ_WRITE_TOKEN を設定してください。",
    );
  }
  await writeLocal(next);
  return next;
}

export async function getDisabledPostIds(): Promise<Set<string>> {
  const store = await loadDisabledStore();
  return new Set(store.ids);
}

export async function disablePostId(postId: string): Promise<DisabledStore> {
  const id = postId.trim();
  if (!id) throw new Error("postId required");
  const store = await loadDisabledStore();
  if (!store.ids.includes(id)) store.ids.push(id);
  return saveDisabledStore(store);
}

export async function restorePostId(postId: string): Promise<DisabledStore> {
  const id = postId.trim();
  if (!id) throw new Error("postId required");
  const store = await loadDisabledStore();
  store.ids = store.ids.filter((x) => x !== id);
  return saveDisabledStore(store);
}

export function disabledStoreConfigured(): boolean {
  return hasBlobAuth() || !process.env.VERCEL;
}
