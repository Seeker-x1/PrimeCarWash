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

export function getOrganizationSameAs(lineProfileUrl: string): string[] {
  return [lineProfileUrl, getThreadsProfileUrl()];
}
