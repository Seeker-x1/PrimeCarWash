import type { ThreadsPublishResult } from "@/lib/threads/types";

const GRAPH_BASE = "https://graph.threads.net/v1.0";
const CONTAINER_POLL_MS = 1_000;
const CONTAINER_MAX_WAIT_MS = 30_000;

export type ThreadsCredentials = {
  userId: string;
  accessToken: string;
};

export type ThreadsMediaInfo = {
  id: string;
  permalink?: string;
  text?: string;
  timestamp?: string;
  username?: string;
  mediaProductType?: string;
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

/** Poll until container is FINISHED (Meta recommends before threads_publish). */
export async function waitForContainerReady(
  creds: ThreadsCredentials,
  containerId: string,
): Promise<void> {
  const url = new URL(`${GRAPH_BASE}/${containerId}`);
  url.searchParams.set("fields", "status,error_message");
  url.searchParams.set("access_token", creds.accessToken);

  const started = Date.now();
  while (Date.now() - started < CONTAINER_MAX_WAIT_MS) {
    const res = await fetch(url, { method: "GET" });
    const body = await readGraphJson(res);
    const status = typeof body.status === "string" ? body.status : "";
    if (status === "FINISHED") return;
    if (status === "ERROR") {
      const errMsg =
        typeof body.error_message === "string" ? body.error_message : "unknown container error";
      throw new Error(`Threads container ERROR: ${errMsg}`);
    }
    await new Promise((r) => setTimeout(r, CONTAINER_POLL_MS));
  }
  throw new Error("Threads container not FINISHED before timeout");
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

/** Confirm published media is readable from Graph API (visible on profile). */
export async function fetchPublishedMedia(
  creds: ThreadsCredentials,
  mediaId: string,
): Promise<ThreadsMediaInfo | null> {
  const url = new URL(`${GRAPH_BASE}/${mediaId}`);
  url.searchParams.set(
    "fields",
    "id,media_product_type,permalink,text,timestamp,username",
  );
  url.searchParams.set("access_token", creds.accessToken);

  const res = await fetch(url, { method: "GET" });
  if (res.status === 404) return null;
  const body = await readGraphJson(res);
  const id = typeof body.id === "string" ? body.id : mediaId;
  return {
    id,
    permalink: typeof body.permalink === "string" ? body.permalink : undefined,
    text: typeof body.text === "string" ? body.text : undefined,
    timestamp: typeof body.timestamp === "string" ? body.timestamp : undefined,
    username: typeof body.username === "string" ? body.username : undefined,
    mediaProductType:
      typeof body.media_product_type === "string" ? body.media_product_type : undefined,
  };
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
  await waitForContainerReady(creds, containerId);
  const mediaId = await publishContainer(creds, containerId);

  let mediaInfo: ThreadsMediaInfo | null = null;
  for (let attempt = 0; attempt < 5; attempt += 1) {
    mediaInfo = await fetchPublishedMedia(creds, mediaId);
    if (mediaInfo?.permalink || mediaInfo?.text) break;
    await new Promise((r) => setTimeout(r, 1_500));
  }

  const mediaVerified = Boolean(mediaInfo?.permalink || mediaInfo?.text);

  // #region agent log
  fetch("http://127.0.0.1:7806/ingest/8b50c3e5-afe6-4dff-86e9-b33c4cf14860", {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "9b35a5" },
    body: JSON.stringify({
      sessionId: "9b35a5",
      runId: "publish-verify",
      hypothesisId: "H1-H4",
      location: "lib/threads/client.ts:publishTextPost",
      message: "threads publish verify",
      data: {
        postId: input.postId,
        containerId,
        mediaId,
        mediaVerified,
        permalink: mediaInfo?.permalink ?? null,
        username: mediaInfo?.username ?? null,
      },
      timestamp: Date.now(),
    }),
  }).catch(() => {});
  // #endregion

  if (!mediaVerified) {
    throw new Error(
      `Threads publish returned mediaId ${mediaId} but Graph API could not verify the post (no permalink/text). Token or account permissions may be wrong.`,
    );
  }

  return {
    dryRun: false,
    postId: input.postId,
    themeId: input.themeId,
    text: input.text,
    containerId,
    mediaId,
    permalink: mediaInfo?.permalink,
    mediaVerified: true,
  };
}
