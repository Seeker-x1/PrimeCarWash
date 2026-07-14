import { put, list } from "@vercel/blob";
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

function hasBlobToken(): boolean {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN?.trim());
}

async function readLocal(): Promise<DisabledStore> {
  try {
    const raw = await readFile(LOCAL_PATH, "utf8");
    const parsed = JSON.parse(raw) as DisabledStore;
    if (!Array.isArray(parsed.ids)) return emptyStore();
    return {
      ids: parsed.ids.filter((id) => typeof id === "string" && id.trim()),
      updatedAt: typeof parsed.updatedAt === "string" ? parsed.updatedAt : new Date().toISOString(),
    };
  } catch {
    return emptyStore();
  }
}

async function writeLocal(store: DisabledStore): Promise<void> {
  await mkdir(path.dirname(LOCAL_PATH), { recursive: true });
  await writeFile(LOCAL_PATH, `${JSON.stringify(store, null, 2)}\n`, "utf8");
}

async function readBlob(): Promise<DisabledStore> {
  const result = await list({ prefix: BLOB_PATHNAME, limit: 10 });
  const hit = result.blobs.find((b) => b.pathname === BLOB_PATHNAME);
  if (!hit?.url) return emptyStore();
  const res = await fetch(hit.url, { cache: "no-store" });
  if (!res.ok) return emptyStore();
  const parsed = (await res.json()) as DisabledStore;
  if (!Array.isArray(parsed.ids)) return emptyStore();
  return {
    ids: parsed.ids.filter((id) => typeof id === "string" && id.trim()),
    updatedAt: typeof parsed.updatedAt === "string" ? parsed.updatedAt : new Date().toISOString(),
  };
}

async function writeBlob(store: DisabledStore): Promise<void> {
  await put(BLOB_PATHNAME, JSON.stringify(store, null, 2), {
    access: "public",
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

  // Local/dev fallback. On Vercel without Blob this will not persist across instances.
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
  return hasBlobToken() || !process.env.VERCEL;
}
