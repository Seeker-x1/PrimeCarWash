import {
  areaSlugs,
  getAreaPage,
  type AreaSlug,
} from "@/lib/area-pages";
import type { Locale } from "@/lib/site-content";
import { getSiteOrigin } from "@/lib/site-url";

/** 投稿本文用（punycode xn-- は出さない） */
export const OUTBOUND_CAR_WASH_DISPLAY_HOST = "出張洗車.jp";

/**
 * Threads 本文に載せる表記（タップ用リンクは link_attachment で別途付与）。
 */
export function getOutboundCarWashUrl(_locale: Locale = "ja"): string {
  return OUTBOUND_CAR_WASH_DISPLAY_HOST;
}

/** Threads API link_attachment 用（ASCII 正規 URL。プレビューカード・タップ先） */
export function getOutboundCarWashLinkAttachmentUrl(locale: Locale = "ja"): string {
  return `${getSiteOrigin()}/${locale}`;
}

const OUTBOUND_REFERENCE_PATTERN =
  /出張洗車\.jp|xn--79q753awyk7z6a\.jp|https?:\/\/出張洗車\.jp/i;

/** 本文に公式サイト言及があれば link_attachment URL を返す */
export function resolveOutboundLinkAttachment(text: string, locale: Locale = "ja"): string | null {
  return OUTBOUND_REFERENCE_PATTERN.test(text)
    ? getOutboundCarWashLinkAttachmentUrl(locale)
    : null;
}

/** 保存済み本文の punycode / IDN URL を投稿用の短い表記へ置換 */
export function normalizeOutboundUrlInPostText(text: string): string {
  return text
    .replace(
      /https?:\/\/www\.xn--79q753awyk7z6a\.jp(\/[^\s]*)?/gi,
      OUTBOUND_CAR_WASH_DISPLAY_HOST,
    )
    .replace(
      /https?:\/\/xn--79q753awyk7z6a\.jp(\/[^\s]*)?/gi,
      OUTBOUND_CAR_WASH_DISPLAY_HOST,
    )
    .replace(/https?:\/\/出張洗車\.jp(\/[^\s]*)?/gi, OUTBOUND_CAR_WASH_DISPLAY_HOST)
    .replace(
      /(?:^|[\s(（【])((?:www\.)?xn--79q753awyk7z6a\.jp(\/[^\s]*)?)/gi,
      (match, url: string) => match.replace(url, OUTBOUND_CAR_WASH_DISPLAY_HOST),
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
  return `公式（出張洗車）: ${getOutboundCarWashUrl(locale)}（本文表記。タップ用リンクカードは API で自動付与）\n対応エリア例: ${wards}`;
}

/** 複数区に触れる投稿用（URL は出張洗車 LP 1 本） */
export function formatAreaUrlsForPost(slugs: AreaSlug[]): string {
  const wards = slugs.map((slug) => getAreaPage(slug)!.wardJa).join("・");
  return `出張洗車（${wards}ほか）\n${getOutboundCarWashUrl()}`;
}

export const ALL_AREA_SLUGS = areaSlugs;
