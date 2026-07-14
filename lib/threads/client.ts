import type { ThreadsPublishResult } from "@/lib/threads/types";

const GRAPH_BASE = "https://graph.threads.net/v1.0";

export type ThreadsCredentials = {
  userId: string;
  accessToken: string;
};

export function getThreadsCredentials(): ThreadsCredentials | null {
  const userId = process.env.THREADS_USER_ID?.trim();
  const accessToken = process.env.THREADS_ACCESS_TOKEN?.trim();
  if (!userId || !accessToken) return null;
  return { userId, accessToken };
}

export function isThreadsDryRun(): boolean {
  const flag = process.env.THREADS_DRY_RUN?.trim().toLowerCase();
  if (flag === "1" || flag === "true" || flag === "yes") return true;
  return getThreadsCredentials() === null;
}

type GraphErrorBody = {
  error?: { message?: string; type?: string; code?: number };
};

async function readGraphJson(res: Response): Promise<Record<string, unknown>> {
  const text = await res.text();
  let body: Record<string, unknown> = {};
  try {
    body = text ? (JSON.parse(text) as Record<string, unknown>) : {};
  } catch {
    throw new Error(`Threads API returned non-JSON (${res.status}): ${text.slice(0, 200)}`);
  }
  if (!res.ok) {
    const err = body as GraphErrorBody;
    const msg = err.error?.message ?? (text.slice(0, 300) || res.statusText);
    throw new Error(`Threads API ${res.status}: ${msg}`);
  }
  return body;
}

/** Step 1: create media container */
export async function createTextContainer(
  creds: ThreadsCredentials,
  text: string,
): Promise<string> {
  const url = new URL(`${GRAPH_BASE}/${creds.userId}/threads`);
  url.searchParams.set("media_type", "TEXT");
  url.searchParams.set("text", text);
  url.searchParams.set("access_token", creds.accessToken);

  const res = await fetch(url, { method: "POST" });
  const body = await readGraphJson(res);
  const id = typeof body.id === "string" ? body.id : null;
  if (!id) throw new Error("Threads API: container id missing in response");
  return id;
}

/** Step 2: publish container */
export async function publishContainer(
  creds: ThreadsCredentials,
  creationId: string,
): Promise<string> {
  const url = new URL(`${GRAPH_BASE}/${creds.userId}/threads_publish`);
  url.searchParams.set("creation_id", creationId);
  url.searchParams.set("access_token", creds.accessToken);

  const res = await fetch(url, { method: "POST" });
  const body = await readGraphJson(res);
  const id = typeof body.id === "string" ? body.id : null;
  if (!id) throw new Error("Threads API: published media id missing in response");
  return id;
}

export async function publishTextPost(input: {
  postId: string;
  themeId: string;
  text: string;
  dryRun?: boolean;
}): Promise<ThreadsPublishResult> {
  const dryRun = input.dryRun ?? isThreadsDryRun();
  if (dryRun) {
    return {
      dryRun: true,
      postId: input.postId,
      themeId: input.themeId,
      text: input.text,
    };
  }

  const creds = getThreadsCredentials();
  if (!creds) {
    throw new Error("THREADS_USER_ID / THREADS_ACCESS_TOKEN are required to publish");
  }

  const containerId = await createTextContainer(creds, input.text);
  // Meta recommends a short wait before publish for media; text is usually ready immediately,
  // but a brief pause reduces rare "not ready" errors.
  await new Promise((r) => setTimeout(r, 800));
  const mediaId = await publishContainer(creds, containerId);

  return {
    dryRun: false,
    postId: input.postId,
    themeId: input.themeId,
    text: input.text,
    containerId,
    mediaId,
  };
}
