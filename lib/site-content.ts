export type Locale = "ja" | "en";

export const locales: Locale[] = ["ja", "en"];

type SiteContent = {
  brandTagline: string;
  heroTitle: string;
  heroDescription: string;
  ctaReserve: string;
  ctaContact: string;
  lineUrlPlaceholder: string;
  sectionTitle: string;
  plansTitle: string;
  plans: Array<{ name: string; price: string; detail: string }>;
  formTitle: string;
  formDescription: string;
  labels: {
    name: string;
    phone: string;
    vehicle: string;
    preferredDate1: string;
    preferredDate2: string;
    address: string;
    submit: string;
  };
  formMessages: {
    success: string;
    error: string;
    sending: string;
  };
  footer: string;
};

export const siteContent: Record<Locale, SiteContent> = {
  ja: {
    brandTagline: "あなたのガレージを、洗車スタジオに。",
    heroTitle: "PREMIUM MOBILE VALETING",
    heroDescription:
      "完全予約制の出張洗車サービス。車外・車内ケアを、黒を基調とした上質な体験で提供します。",
    ctaReserve: "LINEで予約（準備中）",
    ctaContact: "予約フォームへ",
    lineUrlPlaceholder: "#",
    sectionTitle: "施工内容",
    plansTitle: "料金プラン（Mサイズ）",
    plans: [
      { name: "ビジター：車外", price: "¥7,700", detail: "都度払い" },
      { name: "ビジター：内＋外", price: "¥9,900", detail: "都度払い" },
      { name: "継続：月1回（外）", price: "¥6,600", detail: "サブスク" },
      { name: "継続：月2回（外）", price: "¥11,000", detail: "人気プラン" },
      { name: "継続：月2回（内＋外）", price: "¥15,400", detail: "特典付き" },
    ],
    formTitle: "予約フォーム",
    formDescription: "以下をご入力ください。担当より折り返しご連絡します。",
    labels: {
      name: "氏名",
      phone: "電話番号",
      vehicle: "車種",
      preferredDate1: "希望日（第1候補）",
      preferredDate2: "希望日（第2候補）",
      address: "住所",
      submit: "送信する",
    },
    formMessages: {
      success: "送信が完了しました。折り返しご連絡します。",
      error: "送信に失敗しました。時間をおいて再度お試しください。",
      sending: "送信中...",
    },
    footer: "PRIME CAR WASH | 完全予約制・サブスクリプション型出張無水洗車",
  },
  en: {
    brandTagline: "Turn your garage into a private valeting studio.",
    heroTitle: "PREMIUM MOBILE VALETING",
    heroDescription:
      "Appointment-only mobile car wash service with premium exterior and interior care.",
    ctaReserve: "Reserve via LINE (Coming Soon)",
    ctaContact: "Open Reservation Form",
    lineUrlPlaceholder: "#",
    sectionTitle: "Service Scope",
    plansTitle: "Pricing Plans (M size)",
    plans: [
      { name: "Visitor: Exterior", price: "¥7,700", detail: "One-time" },
      { name: "Visitor: Interior + Exterior", price: "¥9,900", detail: "One-time" },
      { name: "Subscription: Monthly x1", price: "¥6,600", detail: "Recurring" },
      { name: "Subscription: Monthly x2", price: "¥11,000", detail: "Best value" },
      { name: "Subscription: Monthly x2 + Interior", price: "¥15,400", detail: "With perks" },
    ],
    formTitle: "Reservation Form",
    formDescription: "Please fill in the fields below. Our team will contact you shortly.",
    labels: {
      name: "Full Name",
      phone: "Phone Number",
      vehicle: "Vehicle Model",
      preferredDate1: "Preferred Date (1st choice)",
      preferredDate2: "Preferred Date (2nd choice)",
      address: "Address",
      submit: "Submit",
    },
    formMessages: {
      success: "Your request was submitted successfully.",
      error: "Submission failed. Please try again shortly.",
      sending: "Submitting...",
    },
    footer: "PRIME CAR WASH | Appointment-only subscription mobile waterless wash",
  },
};
