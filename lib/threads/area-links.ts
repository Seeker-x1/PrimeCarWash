import {
  areaSlugs,
  getAreaPage,
  type AreaSlug,
} from "@/lib/area-pages";
import type { Locale } from "@/lib/site-content";

/** 投稿本文用（punycode xn-- は出さない） */
export const OUTBOUND_CAR_WASH_DISPLAY_HOST = "出張洗車.jp";

/**
 * Threads 投稿に載せる公式 LP。
 * 表示は IDN の 出張洗車.jp（https://www.xn--79q753awyk7z6a.jp は使わない）。
 */
export function getOutboundCarWashUrl(locale: Locale = "ja"): string {
  return `https://${OUTBOUND_CAR_WASH_DISPLAY_HOST}/${locale}`;
}

/** 保存済み本文の punycode URL を投稿用 IDN 表記へ置換 */
export function normalizeOutboundUrlInPostText(text: string): string {
  const displayOrigin = `https://${OUTBOUND_CAR_WASH_DISPLAY_HOST}`;
  return text
    .replace(
      /https?:\/\/www\.xn--79q753awyk7z6a\.jp(\/[^\s]*)?/gi,
      (_match, path = "/ja") => `${displayOrigin}${path || "/ja"}`,
    )
    .replace(
      /https?:\/\/xn--79q753awyk7z6a\.jp(\/[^\s]*)?/gi,
      (_match, path = "/ja") => `${displayOrigin}${path || "/ja"}`,
    )
    .replace(
      /(?:^|[\s(（【])((?:www\.)?xn--79q753awyk7z6a\.jp(\/[^\s]*)?)/gi,
      (match, url: string, path = "/ja") =>
        match.replace(url, `${displayOrigin}${path || "/ja"}`),
    );
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
