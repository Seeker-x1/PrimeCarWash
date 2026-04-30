import type { Locale } from "@/lib/site-content";

const LINE_OFFICIAL_ID =
  process.env.NEXT_PUBLIC_LINE_OFFICIAL_ID ?? "@834ecayh";

const consultationMessages: Record<Locale, string> = {
  ja: `[WEB\u76f8\u8ac7]

\u203b\u3053\u306e\u307e\u307e\u9001\u4fe1\u3059\u308b\u304b\u3001\u4ee5\u4e0b\u306b\u81ea\u7531\u306b\u3054\u8cea\u554f\u30fb\u3054\u8981\u671b\u3092\u3054\u5165\u529b\u304f\u3060\u3055\u3044\u3002
\uff08\u4f8b\uff1a\u3007\u3007\u3068\u3044\u3046\u8eca\u3067\u3059\u304c\u5bfe\u5fdc\u53ef\u80fd\u3067\u3059\u304b\uff1f / \u4e00\u756a\u304a\u3059\u3059\u3081\u306e\u30e1\u30cb\u30e5\u30fc\u3092\u6559\u3048\u3066\u304f\u3060\u3055\u3044 \u306a\u3069\uff09`,
  en: `[WEB CONSULTATION]

Please send this message as is, or add any questions or requests below.
(Example: Can you service my vehicle? / Which menu do you recommend?)`,
};

export function getLineConsultationUrl(locale: Locale) {
  return `https://line.me/R/oaMessage/${LINE_OFFICIAL_ID}/?${encodeURIComponent(
    consultationMessages[locale],
  )}`;
}
