/** Canonical production origin: HTTPS apex (no www). */
export const CANONICAL_ORIGIN = "https://xn--79q753awyk7z6a.jp";
const FALLBACK_ORIGIN = CANONICAL_ORIGIN;

/** Apex punycode for 出張洗車.jp */
export const IDN_APEX_HOST = "xn--79q753awyk7z6a.jp";
export const IDN_WWW_HOST = `www.${IDN_APEX_HOST}`;

/** HSTS preload-ready. Must match vercel.json headers (Googlebot stops crawling http://). */
export const HSTS_HEADER_VALUE =
  "max-age=63072000; includeSubDomains; preload";

function originFrom(input: string): string | null {
  try {
    return new URL(input).origin;
  } catch {
    return null;
  }
}

export function isWwwHost(host: string): boolean {
  const hostname = host.split(":")[0]?.toLowerCase() ?? "";
  return hostname === IDN_WWW_HOST || hostname === "www.出張洗車.jp";
}

/** Sitemap / canonical must use the host that returns 200 (apex, not www). */
function alignToApex(origin: string): string {
  try {
    const u = new URL(origin);
    if (isWwwHost(u.hostname) || u.hostname === IDN_APEX_HOST) {
      u.protocol = "https:";
      u.hostname = IDN_APEX_HOST;
      return u.origin;
    }
    return origin;
  } catch {
    return origin;
  }
}

/**
 * Canonical origin for metadata, sitemap, JSON-LD.
 * Priority: explicit env → Vercel production hostname → current deployment → fallback.
 */
export function getSiteOrigin(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) {
    const o = originFrom(explicit);
    if (o) return alignToApex(o);
  }

  let resolved = FALLBACK_ORIGIN;

  const prodHost = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  if (prodHost) {
    const o = originFrom(`https://${prodHost}`);
    if (o) resolved = o;
  } else {
    const vercelHost = process.env.VERCEL_URL?.trim();
    if (vercelHost) {
      const o = originFrom(`https://${vercelHost}`);
      if (o) resolved = o;
    }
  }

  return alignToApex(resolved);
}
