export type Locale = "ja" | "en";

export const locales: Locale[] = ["ja", "en"];

type ServiceItem = { label: string; description: string };
type FaqItem = { question: string; answer: string };
type Plan = { name: string; price: string; detail: string; highlight?: boolean };
type MatrixRow = { size: string; visitorExterior: string; visitorFull: string; subMonthly1: string; subMonthly2Exterior: string; subMonthly2Full: string };
type SizeGroup = { name: string; multiplier: string; cars: string[] };

type SiteContent = {
  brandTagline: string;
  heroTitle: string;
  /** ヒーロー H1 直下の英語タグライン等 */
  heroSubtitle?: string;
  /** ヒーローに表示する対応エリア（ページ上で見える文言） */
  heroArea?: string;
  heroDescription: string;
  /** Google 検索結果などの `<title>`。未指定時は heroTitle */
  searchTitle?: string;
  /** Google 検索結果のスニペット用（目安 70〜155 文字）。未指定時は heroDescription */
  searchDescription?: string;
  ctaReserve: string;
  ctaContact: string;
  serviceScopeTitle: string;
  exteriorTitle: string;
  interiorTitle: string;
  exteriorItems: ServiceItem[];
  interiorItems: ServiceItem[];
  benefitTitle: string;
  benefitDescription: string;
  plansTitle: string;
  plans: Plan[];
  matrixTitle: string;
  matrixHeaders: {
    size: string;
    visitorExterior: string;
    visitorFull: string;
    subMonthly1: string;
    subMonthly2Exterior: string;
    subMonthly2Full: string;
  };
  matrixNote: string;
  matrixRows: MatrixRow[];
  vehicleSizeTitle: string;
  vehicleSizeSubTitle: string;
  sizeGroups: SizeGroup[];
  vehicleSizeNote: string;
  serviceAreaTitle: string;
  serviceAreaPrimaryLabel: string;
  serviceAreaPrimary: string;
  serviceAreaSecondaryLabel: string;
  serviceAreaSecondary: string;
  serviceAreaNote: string;
  faqTitle: string;
  faqItems: FaqItem[];
  heroImageAlt: string;
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

const commonSizeGroups: SizeGroup[] = [
  {
    name: "SS / S / M",
    multiplier: "1.0x",
    cars: [
      "N-BOX", "ハスラー", "タント", "スペーシア", "デイズ", "レクサス CT", "ヤリス / アクア",
      "ポルシェ 911", "ノート", "718ケイマン", "レクサス LBX / UX", "BMW 3シリーズ", "メルセデス Aクラス", "プリウス", "テスラ モデル3"
    ],
  },
  {
    name: "L",
    multiplier: "1.2x",
    cars: [
      "レクサス IS / NX", "レクサス ES / LC", "クラウン", "ハリアー / RAV4", "CX-60", "ベンツ C / Eクラス", "BMW 5シリーズ", "ポルシェ マカン", "ポルシェ タイカン", "アウディ A6 / Q5"
    ],
  },
  {
    name: "LL",
    multiplier: "1.4x",
    cars: [
      "レクサス LS / RX", "レクサス GX / RZ", "アルファード / ヴェルファイア", "LandCruiser 250",
      "ベンツ Sクラス / GLE", "BMW 7 / X5", "ポルシェ カイエン", "ディフェンダー 90 / 110",
      "ジープ ラングラー（4ドア）", "テスラ モデルX"
    ],
  },
  {
    name: "XL",
    multiplier: "1.6x",
    cars: [
      "レクサス LX / LM", "Gクラス", "LandCruiser 300", "センチュリー",
      "ロールスロイス", "ウルス / ベントレー", "エスカレード", "ディフェンダー 130",
      "レンジローバー", "ジープ グラディエーター"
    ],
  },
];

export const siteContent: Record<Locale, SiteContent> = {
  ja: {
    brandTagline: "あなたのガレージを、洗車スタジオに。",
    heroTitle: "出張洗車・完全予約制",
    heroSubtitle: "PREMIUM MOBILE VALETING",
    heroArea: "渋谷・世田谷・目黒を中心に",
    heroDescription: "ご自宅や指定の洗車場所へ伺い、車外・車内を丁寧にケアする出張洗車サービスです。",
    searchTitle: "出張洗車・完全予約｜PRIME CAR WASH（渋谷・世田谷・目黒周辺）",
    searchDescription:
      "出張洗車・完全予約制。ご自宅や指定場所で車外・車内を丁寧にケア。ビジター／月額プランの料金表あり。LINEまたはフォームから予約。",
    ctaReserve: "日程を選んで予約",
    ctaContact: "LINEで相談",
    serviceScopeTitle: "施工内容詳細",
    exteriorTitle: "車外清掃（全プラン共通・基本範囲）",
    interiorTitle: "車内清掃（オプション内容）",
    exteriorItems: [
      { label: "ボディ無水洗浄", description: "独自配合の最高級洗浄剤を採用。塗装面への負担を抑え、汚れ除去と艶・保護層形成を同時に実施。" },
      { label: "窓ガラス拭き", description: "外窓全てを丁寧に拭き上げ、砂埃や指紋を除去しクリアな視界を整えます。" },
      { label: "ホイール拭き", description: "専用クロスでブレーキダストや泥汚れを細部まで拭き上げます。" },
    ],
    interiorItems: [
      { label: "ドア開口部", description: "ステップやドア内側の枠を清掃し、乗降時に目に入る部分を美しく保ちます。" },
      { label: "車内掃除機", description: "フロアマット・シートを中心に効率的な除塵清掃を行います。" },
      { label: "内窓ガラス", description: "内窓の曇りや指紋を除去し、クリアな視界を確保します。" },
      { label: "内装拭き上げ", description: "ダッシュボードやコンソールの手垢や埃を除去します。" },
    ],
    benefitTitle: "プレミアム・撥水プロテクト施工（6ヶ月に1回 無料提供）",
    benefitDescription: "塗装面に防汚・撥水被膜を形成し、砂埃や雨汚れの付着を抑え、日常の美しさを長く維持します。",
    plansTitle: "サービスメニュー・Mサイズ料金目安",
    plans: [
      { name: "ビジター：ボディ洗車", price: "¥7,700", detail: "都度払い" },
      { name: "ビジター：ボディ洗車＋内装清掃", price: "¥9,900", detail: "都度払い" },
      { name: "継続プラン：月1回ボディ洗車", price: "¥6,600", detail: "ボディ洗車のみ" },
      { name: "継続プラン：月2回ボディ洗車", price: "¥11,000", detail: "ボディ洗車を月2回", highlight: true },
      { name: "継続プラン：月2回ボディ洗車＋内装清掃", price: "¥15,400", detail: "内装清掃＋ボディ洗車＋継続特典付" },
    ],
    matrixTitle: "サイズ別料金一覧（税込）",
    matrixHeaders: {
      size: "サイズ区分",
      visitorExterior: "ビジター：ボディ洗車",
      visitorFull: "ビジター：ボディ洗車＋内装清掃",
      subMonthly1: "継続プラン：月1回ボディ洗車",
      subMonthly2Exterior: "継続プラン：月2回ボディ洗車",
      subMonthly2Full: "継続プラン：月2回ボディ洗車＋内装清掃",
    },
    matrixNote: "※継続プラン：月内回数分をオンライン自動決済。解約はいつでも可能です。",
    matrixRows: [
      { size: "SS / S / M (1.0x)", visitorExterior: "¥7,700", visitorFull: "¥9,900", subMonthly1: "¥6,600", subMonthly2Exterior: "¥11,000", subMonthly2Full: "¥15,400" },
      { size: "L Size (1.2x)", visitorExterior: "¥9,240", visitorFull: "¥11,880", subMonthly1: "¥7,920", subMonthly2Exterior: "¥13,200", subMonthly2Full: "¥18,480" },
      { size: "LL Size (1.4x)", visitorExterior: "¥10,780", visitorFull: "¥13,860", subMonthly1: "¥9,240", subMonthly2Exterior: "¥15,400", subMonthly2Full: "¥21,560" },
      { size: "XL Size (1.6x)", visitorExterior: "¥12,320", visitorFull: "¥15,840", subMonthly1: "¥10,560", subMonthly2Exterior: "¥17,600", subMonthly2Full: "¥24,640" },
    ],
    vehicleSizeTitle: "車種サイズ一覧表",
    vehicleSizeSubTitle: "Vehicle Classification Standard (10 Examples Per Group)",
    sizeGroups: commonSizeGroups,
    vehicleSizeNote: "※掲載のない車種、およびカスタムパーツ装着車は現車確認の上で判断します。",
    serviceAreaTitle: "対応エリア",
    serviceAreaPrimaryLabel: "中心エリア",
    serviceAreaPrimary: "渋谷区・世田谷区・目黒区を中心に",
    serviceAreaSecondaryLabel: "対応例",
    serviceAreaSecondary: "港区・品川区・中野区など",
    serviceAreaNote:
      "エリア外もご相談ください。車種とご希望日が分かるとスムーズです。",
    faqTitle: "よくある質問",
    faqItems: [
      {
        question: "対応エリアはどこですか？",
        answer:
          "渋谷区・世田谷区・目黒区を中心に、港区・品川区・中野区などへ伺います。エリア外もまずはご相談ください。",
      },
      {
        question: "水は使いますか？",
        answer:
          "基本は無水洗浄を中心に対応します。状況に応じて最適な方法をご案内します。",
      },
      {
        question: "マンションの駐車場でも可能ですか？",
        answer:
          "はい。ご自宅・マンション駐車場・勤務先など、洗車可能な場所であれば対応できます。事前に場所をお知らせください。",
      },
      {
        question: "料金の目安は？",
        answer:
          "Mサイズのボディ洗車は7,700円（税込）から。月2回の継続プランなら11,000円（税込）で、1回あたり5,500円相当—都度利用よりお得に、こまめにキレイを保てます。車種サイズやプランにより変わります。サイズ別料金表もご確認ください。",
      },
      {
        question: "継続プランの解約はいつでもできますか？",
        answer: "はい。継続プランはいつでも解約可能です。",
      },
      {
        question: "高級車・カスタムパーツ装着車は対応できますか？",
        answer:
          "対応可能です。掲載のない車種やカスタムパーツ装着車は現車確認のうえご案内します。",
      },
      {
        question: "予約の流れは？",
        answer:
          "サイトの予約フォーム、またはLINEからご希望日・車種・洗車場所をお送りください。担当より折り返しご連絡します。",
      },
    ],
    heroImageAlt: "高級セダンを手作業で拭き上げる出張洗車イメージ",
    formTitle: "予約フォーム",
    formDescription: "以下をご入力ください。担当より折り返しご連絡します。",
    labels: { name: "氏名", phone: "電話番号", vehicle: "車種", preferredDate1: "希望日（第1候補）", preferredDate2: "希望日（第2候補）", address: "住所", submit: "送信する" },
    formMessages: { success: "送信が完了しました。折り返しご連絡します。", error: "送信に失敗しました。時間をおいて再度お試しください。", sending: "送信中..." },
    footer: "PRIME CAR WASH | 完全予約制・サブスクリプション型出張無水洗車",
  },
  en: {
    brandTagline: "Turn your garage into a private valeting studio.",
    heroTitle: "Appointment-only mobile valeting",
    heroSubtitle: "PREMIUM MOBILE VALETING",
    heroArea: "Shibuya, Setagaya & Meguro and surrounding areas",
    heroDescription: "We come to your home or chosen location for premium exterior and interior care.",
    searchTitle: "PRIME CAR WASH | Mobile valeting in Japan",
    searchDescription:
      "Appointment-only mobile car wash with premium exterior and interior care. Pricing for visitor and subscription plans. Book via LINE or the on-site form.",
    ctaReserve: "Choose a time",
    ctaContact: "Ask via LINE",
    serviceScopeTitle: "Service Scope",
    exteriorTitle: "Exterior cleaning (included in all plans)",
    interiorTitle: "Interior cleaning (optional)",
    exteriorItems: [
      { label: "Waterless body wash", description: "Premium cleaner with lower paint stress, deep gloss, and protection film." },
      { label: "Exterior glass wipe", description: "Removes dust and fingerprints for clear visibility." },
      { label: "Wheel wipe", description: "Detailed wipe-down for brake dust and mud." },
    ],
    interiorItems: [
      { label: "Door openings", description: "Clean sills and inner door frames." },
      { label: "Vacuum", description: "Efficient dust removal on mats and seats." },
      { label: "Interior windows", description: "Removes haze and fingerprints." },
      { label: "Interior wipe", description: "Dashboard and console cleaning." },
    ],
    benefitTitle: "Premium Hydrophobic Protect (Free every 6 months)",
    benefitDescription: "Creates anti-fouling and water-repellent coating for longer-lasting cleanliness.",
    plansTitle: "Service Menu / M Size",
    plans: [
      { name: "Visitor: Exterior", price: "¥7,700", detail: "One-time" },
      { name: "Visitor: Interior + Exterior", price: "¥9,900", detail: "One-time" },
      { name: "Subscription: Monthly x1", price: "¥6,600", detail: "Exterior only" },
      { name: "Subscription: Monthly x2", price: "¥11,000", detail: "Best Value", highlight: true },
      { name: "Subscription: Monthly x2 + Interior", price: "¥15,400", detail: "With benefits" },
    ],
    matrixTitle: "Pricing Matrix (Tax Included)",
    matrixHeaders: {
      size: "Size",
      visitorExterior: "Visitor: Exterior",
      visitorFull: "Visitor: In+Out",
      subMonthly1: "Sub: Monthly x1",
      subMonthly2Exterior: "Sub: Monthly x2 (Out)",
      subMonthly2Full: "Sub: Monthly x2 (In+Out)",
    },
    matrixNote: "Subscription plans are auto-paid online monthly and can be canceled anytime.",
    matrixRows: [
      { size: "SS / S / M (1.0x)", visitorExterior: "¥7,700", visitorFull: "¥9,900", subMonthly1: "¥6,600", subMonthly2Exterior: "¥11,000", subMonthly2Full: "¥15,400" },
      { size: "L Size (1.2x)", visitorExterior: "¥9,240", visitorFull: "¥11,880", subMonthly1: "¥7,920", subMonthly2Exterior: "¥13,200", subMonthly2Full: "¥18,480" },
      { size: "LL Size (1.4x)", visitorExterior: "¥10,780", visitorFull: "¥13,860", subMonthly1: "¥9,240", subMonthly2Exterior: "¥15,400", subMonthly2Full: "¥21,560" },
      { size: "XL Size (1.6x)", visitorExterior: "¥12,320", visitorFull: "¥15,840", subMonthly1: "¥10,560", subMonthly2Exterior: "¥17,600", subMonthly2Full: "¥24,640" },
    ],
    vehicleSizeTitle: "Vehicle Size Guide",
    vehicleSizeSubTitle: "Vehicle Classification Standard",
    sizeGroups: commonSizeGroups,
    vehicleSizeNote: "Vehicles not listed or with custom parts are assessed after physical inspection.",
    serviceAreaTitle: "Service area",
    serviceAreaPrimaryLabel: "Core areas",
    serviceAreaPrimary: "Shibuya, Setagaya, and Meguro (Tokyo)",
    serviceAreaSecondaryLabel: "Also serving",
    serviceAreaSecondary: "Minato, Shinagawa, Nakano, and nearby wards",
    serviceAreaNote:
      "Outside these areas? Contact us with your vehicle and preferred dates.",
    faqTitle: "FAQ",
    faqItems: [
      {
        question: "Which areas do you serve?",
        answer:
          "We are based around Shibuya, Setagaya, and Meguro, and also serve Minato, Shinagawa, Nakano, and nearby areas. Ask us if you are outside the listed wards.",
      },
      {
        question: "Do you use water?",
        answer:
          "We mainly use waterless cleaning. We will advise the best method for your situation.",
      },
      {
        question: "Can you wash at my apartment parking?",
        answer:
          "Yes, at home, apartment parking, or your workplace—wherever washing is permitted. Please share the location in advance.",
      },
      {
        question: "How much does it cost?",
        answer:
          "Exterior wash for size M starts at ¥7,700 (tax included). Our twice-monthly plan is ¥11,000 (tax included)—about ¥5,500 per wash, so you save versus pay-as-you-go while keeping your car consistently clean. Pricing varies by size and plan; see the pricing matrix on this page.",
      },
      {
        question: "Can I cancel a subscription anytime?",
        answer: "Yes. Subscription plans can be canceled at any time.",
      },
      {
        question: "Do you handle luxury or modified vehicles?",
        answer:
          "Yes. Unlisted models and cars with custom parts are quoted after inspection.",
      },
      {
        question: "How do I book?",
        answer:
          "Use the reservation form or LINE with your preferred dates, vehicle, and location. We will get back to you shortly.",
      },
    ],
    heroImageAlt: "Mobile valeting specialist wiping a luxury sedan",
    formTitle: "Reservation Form",
    formDescription: "Please fill in the fields below. Our team will contact you shortly.",
    labels: { name: "Full Name", phone: "Phone Number", vehicle: "Vehicle Model", preferredDate1: "Preferred Date (1st)", preferredDate2: "Preferred Date (2nd)", address: "Address", submit: "Submit" },
    formMessages: { success: "Your request was submitted successfully.", error: "Submission failed. Please try again shortly.", sending: "Submitting..." },
    footer: "PRIME CAR WASH | Appointment-only subscription mobile waterless wash",
  },
};
