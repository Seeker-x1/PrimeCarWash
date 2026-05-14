import type { Locale } from "@/lib/site-content";

export type PopPageContent = {
  title: string;
  description: string;
  lead: string;
  bullets: string[];
  ctaLine: string;
  ctaDetails: string;
  footnote: string;
};

export const popPageContent: Record<Locale, PopPageContent> = {
  ja: {
    title: "店頭POP限定 · 初回6,000円",
    description:
      "店頭のPOPからアクセスいただいた方限定の初回特典案内です。",
    lead:
      "下のボタンからLINEを開き、表示された内容をそのまま送信してください。送信文に店頭用の識別情報が含まれるため、POP経由のお申し込みとして案内できます。",
    bullets: [
      "店頭POPのQRからお進みいただいた方を対象にした導線です。",
      "識別用の文言はLINE画面に表示されます（このページには表示しません）。",
    ],
    ctaLine: "LINEで送信する",
    ctaDetails: "タップするとLINEが開きます。",
    footnote:
      "送信後は、LINEの自動応答またはスタッフからのメッセージで特典内容・予約手順をご案内します。",
  },
  en: {
    title: "In-store POP · first visit ¥6,000",
    description:
      "First-visit offer for customers arriving from our printed POP materials.",
    lead:
      "Open LINE with the button below and send the pre-filled message as shown. It includes an in-store proof token so we can treat your request as coming from POP.",
    bullets: [
      "This flow is intended for customers who scan the in-store POP QR.",
      "The proof text appears in LINE (it is not shown on this page).",
    ],
    ctaLine: "Continue in LINE",
    ctaDetails: "Opens the LINE app with a pre-filled message.",
    footnote:
      "After sending, we will reply in LINE with offer details and next steps (auto-reply and/or staff).",
  },
};
