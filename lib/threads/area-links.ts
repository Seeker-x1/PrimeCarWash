import {
  areaSlugs,
  getAreaCanonicalPath,
  getAreaPage,
  type AreaSlug,
} from "@/lib/area-pages";
import type { Locale } from "@/lib/site-content";
import { getSiteOrigin } from "@/lib/site-url";

/** Absolute URL for Threads / Ops copy (JA default paths: /areas/{slug}). */
export function getAreaPageUrl(slug: AreaSlug, locale: Locale = "ja"): string {
  return `${getSiteOrigin()}${getAreaCanonicalPath(locale, slug)}`;
}

/** One line per ward for prompts and briefs. */
export function formatAreaUrlsForPrompt(locale: Locale = "ja"): string {
  return areaSlugs
    .map((slug) => {
      const page = getAreaPage(slug)!;
      const label = locale === "ja" ? page.wardJa : page.wardEn;
      return `- ${label}: ${getAreaPageUrl(slug, locale)}`;
    })
    .join("\n");
}

/** Compact block for a Threads post (ward label + URL per line). */
export function formatAreaUrlsForPost(slugs: AreaSlug[]): string {
  return slugs
    .map((slug) => {
      const page = getAreaPage(slug)!;
      return `${page.wardJa}\n${getAreaPageUrl(slug)}`;
    })
    .join("\n\n");
}

export const ALL_AREA_SLUGS = areaSlugs;
