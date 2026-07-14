import { timingSafeEqual } from "node:crypto";

function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

/**
 * Accepts Authorization: Bearer <secret> or x-threads-secret header.
 * Valid secrets: THREADS_PUBLISH_SECRET and/or CRON_SECRET (Vercel Cron).
 */
export function authorizeThreadsRequest(request: Request): boolean {
  const secrets = [
    process.env.THREADS_PUBLISH_SECRET?.trim(),
    process.env.CRON_SECRET?.trim(),
  ].filter((s): s is string => Boolean(s));

  if (secrets.length === 0) return false;

  const auth = request.headers.get("authorization");
  let token: string | null = null;
  if (auth?.toLowerCase().startsWith("bearer ")) {
    token = auth.slice(7).trim();
  }
  if (!token) {
    token = request.headers.get("x-threads-secret")?.trim() ?? null;
  }
  if (!token) return false;

  return secrets.some((secret) => safeEqual(token!, secret));
}

export function threadsAuthConfigured(): boolean {
  return Boolean(
    process.env.THREADS_PUBLISH_SECRET?.trim() || process.env.CRON_SECRET?.trim(),
  );
}
