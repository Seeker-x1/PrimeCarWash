const DEFAULT_THREADS_PROFILE_URL =
  "https://www.threads.com/@primecarwashjapan";

/** Official Threads profile (override via NEXT_PUBLIC_THREADS_PROFILE_URL). */
export function getThreadsProfileUrl(): string {
  const raw = process.env.NEXT_PUBLIC_THREADS_PROFILE_URL?.trim();
  if (!raw) return DEFAULT_THREADS_PROFILE_URL;
  try {
    return new URL(raw).href;
  } catch {
    return DEFAULT_THREADS_PROFILE_URL;
  }
}

/** Google Business Profile public URL. Set after GBP is verified. */
export function getGoogleBusinessProfileUrl(): string | null {
  const raw = process.env.NEXT_PUBLIC_GOOGLE_BUSINESS_PROFILE_URL?.trim();
  if (!raw) return null;
  try {
    return new URL(raw).href;
  } catch {
    return null;
  }
}

export function getOrganizationSameAs(lineProfileUrl: string): string[] {
  const urls = [lineProfileUrl, getThreadsProfileUrl()];
  const gbp = getGoogleBusinessProfileUrl();
  if (gbp) urls.push(gbp);
  return Array.from(new Set(urls));
}
