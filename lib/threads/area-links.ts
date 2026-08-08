import {
  areaSlugs,
  getAreaPage,
  type AreaSlug,
} from "@/lib/area-pages";
import type { Locale } from "@/lib/site-content";
import { getSiteOrigin } from "@/lib/site-url";

/** Threads 投稿に載せる公式 LP（出張洗車トップ。エリア個別 /areas/* は使わない） */
export function getOutboundCarWashUrl(locale: Locale = "ja"): string {
  return `${getSiteOrigin()}/${locale}`;
}

/** @deprecated Threads では getOutboundCarWashUrl を使う */
export function getAreaPageUrl(_slug: AreaSlug, locale: Locale = "ja"): string {
  return getOutboundCarWashUrl(locale);
}

/** AI プロンプト用：公式 URL と対応区名のみ */
export function formatAreaUrlsForPrompt(locale: Locale = "ja"): string {
  const wards = areaSlugs
    .map((slug) => {
      const page = getAreaPage(slug)!;
      return locale === "ja" ? page.wardJa : page.wardEn;
    })
    .join("、");
  return `公式（出張洗車）: ${getOutboundCarWashUrl(locale)}\n対応エリア例: ${wards}`;
}

/** 複数区に触れる投稿用（URL は出張洗車 LP 1 本） */
export function formatAreaUrlsForPost(slugs: AreaSlug[]): string {
  const wards = slugs.map((slug) => getAreaPage(slug)!.wardJa).join("・");
  return `出張洗車（${wards}ほか）\n${getOutboundCarWashUrl()}`;
}

export const ALL_AREA_SLUGS = areaSlugs;
