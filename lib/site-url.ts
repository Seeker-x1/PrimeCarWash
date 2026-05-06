/** Local / CI fallback when no Vercel env (本番ドメイン: 出張洗車.jp). */
const FALLBACK_ORIGIN = "https://xn--79q753awyk7z6a.jp";

function originFrom(input: string): string | null {
  try {
    return new URL(input).origin;
  } catch {
    return null;
  }
}

/**
 * Canonical origin for metadata, sitemap, JSON-LD.
 * Priority: explicit env → Vercel production hostname → current deployment → fallback.
 * Match Search Console property host (custom domain vs *.vercel.app).
 */
export function getSiteOrigin(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) {
    const o = originFrom(explicit);
    if (o) return o;
  }

  const prodHost = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  if (prodHost) {
    const o = originFrom(`https://${prodHost}`);
    if (o) return o;
  }

  const vercelHost = process.env.VERCEL_URL?.trim();
  if (vercelHost) {
    const o = originFrom(`https://${vercelHost}`);
    if (o) return o;
  }

  return FALLBACK_ORIGIN;
}
