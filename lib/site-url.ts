/** Local / CI fallback: www host matches Vercel (apex redirects with 308). */
const FALLBACK_ORIGIN = "https://www.xn--79q753awyk7z6a.jp";

/** Apex punycode for 出張洗車.jp — production redirects this host to www. */
const IDN_APEX_HOST = "xn--79q753awyk7z6a.jp";

function originFrom(input: string): string | null {
  try {
    return new URL(input).origin;
  } catch {
    return null;
  }
}

/** Use the hostname that returns 200 so sitemap/canonical match crawlers (unless NEXT_PUBLIC_SITE_URL overrides). */
function alignWithWwwRedirect(origin: string): string {
  try {
    const u = new URL(origin);
    if (u.hostname === IDN_APEX_HOST) {
      u.hostname = `www.${IDN_APEX_HOST}`;
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
    if (o) return o;
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

  return alignWithWwwRedirect(resolved);
}
