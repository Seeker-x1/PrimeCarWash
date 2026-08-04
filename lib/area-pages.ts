import type { Locale } from "@/lib/site-content";

export const areaSlugs = [
  "shibuya",
  "setagaya",
  "meguro",
  "minato",
  "shinagawa",
  "nakano",
] as const;

export type AreaSlug = (typeof areaSlugs)[number];

type AreaFaq = { question: string; answer: string };

export type AreaPageContent = {
  slug: AreaSlug;
  wardJa: string;
  wardEn: string;
  isPrimary: boolean;
  ja: {
    searchTitle: string;
    searchDescription: string;
    h1: string;
    lead: string;
    body: string[];
    spots: string;
    faq: AreaFaq[];
  };
  en: {
    searchTitle: string;
    searchDescription: string;
    h1: string;
    lead: string;
    body: string[];
    spots: string;
    faq: AreaFaq[];
  };
};

export const areaPages: AreaPageContent[] = [
  {
    slug: "shibuya",
    wardJa: "渋谷区",
    wardEn: "Shibuya",
    isPrimary: true,
    ja: {
      searchTitle: "渋谷区の出張洗車｜完全予約制・PRIME CAR WASH",
      searchDescription:
        "渋谷区の出張洗車ならPRIME CAR WASH。代々木・恵比寿・広尾などへ伺い、無水洗浄で車外・車内を丁寧にケア。月2回プランは1回5,500円相当。LINE・フォームで予約。",
      h1: "渋谷区の出張洗車",
      lead: "渋谷区エリアへ出張し、ご指定の洗車場所でプレミアムな車両ケアを提供します。",
      body: [
        "マンション駐車場・戸建てガレージ・オフィスビル前など、洗車可能な場所であればお伺いします。完全予約制のため、お客様のスケジュールに合わせた施工が可能です。",
        "高級車・輸入車にも対応。ボディ無水洗浄を中心に、塗装面への負担を抑えた施工を行います。継続プランなら月2回11,000円（税込）で、都度利用よりお得にキレイを維持できます。",
      ],
      spots: "代々木・恵比寿・広尾・神南・松濤・笹塚など",
      faq: [
        {
          question: "渋谷区のマンション駐車場でも依頼できますか？",
          answer:
            "はい。機械式・平置きを問わず、洗車が可能な駐車場であれば対応します。事前に場所と車種をお知らせください。",
        },
        {
          question: "渋谷区の出張洗車の料金は？",
          answer:
            "Mサイズのボディ洗車は7,700円（税込）から。月2回プランなら11,000円（税込）で1回あたり5,500円相当です。",
        },
      ],
    },
    en: {
      searchTitle: "Mobile car wash in Shibuya | PRIME CAR WASH",
      searchDescription:
        "Appointment-only mobile valeting in Shibuya Ward—Yoyogi, Ebisu, Hiroo, and more. Waterless exterior and interior care from ¥7,700.",
      h1: "Mobile valeting in Shibuya",
      lead: "We come to your location in Shibuya Ward for premium exterior and interior care.",
      body: [
        "Home garages, apartment parking, and office buildings—wherever washing is permitted.",
        "Twice-monthly plans from ¥11,000 (tax included), about ¥5,500 per wash for size M.",
      ],
      spots: "Yoyogi, Ebisu, Hiroo, Jinnan, Shoto, Sasazuka, and nearby",
      faq: [
        {
          question: "Can you wash at my apartment parking in Shibuya?",
          answer: "Yes, wherever washing is permitted. Share your location and vehicle in advance.",
        },
        {
          question: "How much does valeting cost in Shibuya?",
          answer: "Exterior wash for size M from ¥7,700 (tax included); twice-monthly plan ¥11,000.",
        },
      ],
    },
  },
  {
    slug: "setagaya",
    wardJa: "世田谷区",
    wardEn: "Setagaya",
    isPrimary: true,
    ja: {
      searchTitle: "世田谷区の出張洗車｜完全予約制・PRIME CAR WASH",
      searchDescription:
        "世田谷区の出張洗車。三軒茶屋・下北沢・成城・二子玉川などへ伺います。無水洗浄・車内清掃・月額プランあり。ご自宅でプレミアム洗車。",
      h1: "世田谷区の出張洗車",
      lead: "世田谷区全域を中心に、ご指定の場所へ出張洗車サービスを提供します。",
      body: [
        "住宅街の路傍駐車やマンション、店舗前など、お客様のライフスタイルに合わせた洗車場所に対応。移動時間ゼロで、上質な仕上がりをご自宅で。",
        "ビジタープランは都度払い、継続プランは解約いつでも可能。お子様やペットのいるご家庭でも、水を使わない施工を基本としています。",
      ],
      spots: "三軒茶屋・下北沢・成城・二子玉川・用賀・砧など",
      faq: [
        {
          question: "世田谷区の戸建てでも出張洗車は可能ですか？",
          answer: "はい。ガレージ前・カーポート・路傍など、施工可能な場所であればお伺いします。",
        },
        {
          question: "世田谷区は追加料金はかかりますか？",
          answer: "区内在住・駐車であれば追加の出張料はいただきません。料金は車種サイズとプランによります。",
        },
      ],
    },
    en: {
      searchTitle: "Mobile car wash in Setagaya | PRIME CAR WASH",
      searchDescription:
        "Mobile valeting in Setagaya—Sangenjaya, Shimokitazawa, Seijo, Futako-Tamagawa, and more.",
      h1: "Mobile valeting in Setagaya",
      lead: "Premium mobile car wash across Setagaya Ward at your chosen location.",
      body: [
        "Residential streets, apartments, and home garages—we come to you.",
        "Pay-as-you-go or subscription plans; cancel anytime.",
      ],
      spots: "Sangenjaya, Shimokitazawa, Seijo, Futako-Tamagawa, Yōga, Kinuta, and nearby",
      faq: [
        {
          question: "Do you serve detached homes in Setagaya?",
          answer: "Yes—driveway, carport, or street parking where washing is allowed.",
        },
        {
          question: "Is there an extra travel fee for Setagaya?",
          answer: "No extra travel fee within the ward; pricing depends on vehicle size and plan.",
        },
      ],
    },
  },
  {
    slug: "meguro",
    wardJa: "目黒区",
    wardEn: "Meguro",
    isPrimary: true,
    ja: {
      searchTitle: "目黒区の出張洗車｜完全予約制・PRIME CAR WASH",
      searchDescription:
        "目黒区の出張洗車。中目黒・自由が丘・学芸大学・祐天寺などへ伺います。完全予約制・無水洗浄。高級車・輸入車も対応。",
      h1: "目黒区の出張洗車",
      lead: "目黒区のご自宅・勤務先まで、出張洗車のプロがお伺いします。",
      body: [
        "目黒区は住宅と商業が混在するエリア。マンション・オフィス・店舗前など、場所を選ばずプレミアムな施工を。",
        "輸入車・高級車のお客様にもご利用いただいています。サイズ別料金表で事前に目安をご確認いただけます。",
      ],
      spots: "中目黒・自由が丘・学芸大学・祐天寺・大岡山・洗足など",
      faq: [
        {
          question: "目黒区で高級車の出張洗車は依頼できますか？",
          answer: "はい。レクサス・ポルシェ・ベンツなど、高級車・輸入車に対応しています。",
        },
        {
          question: "目黒区の出張洗車は水を使いますか？",
          answer: "基本は無水洗浄です。状況に応じて最適な方法をご案内します。",
        },
      ],
    },
    en: {
      searchTitle: "Mobile car wash in Meguro | PRIME CAR WASH",
      searchDescription:
        "Mobile valeting in Meguro—Naka-Meguro, Jiyugaoka, Gakugei-daigaku, and more.",
      h1: "Mobile valeting in Meguro",
      lead: "Premium mobile valeting at your home or workplace in Meguro Ward.",
      body: [
        "Apartments, offices, and retail parking—we adapt to your location.",
        "Luxury and imported vehicles welcome; see our size-based pricing.",
      ],
      spots: "Naka-Meguro, Jiyugaoka, Gakugei-daigaku, Yūtenji, Ōokayama, Senzoku, and nearby",
      faq: [
        {
          question: "Do you handle luxury cars in Meguro?",
          answer: "Yes—Lexus, Porsche, Mercedes-Benz, and other premium vehicles.",
        },
        {
          question: "Is your Meguro service waterless?",
          answer: "We mainly use waterless cleaning and advise the best method per vehicle.",
        },
      ],
    },
  },
  {
    slug: "minato",
    wardJa: "港区",
    wardEn: "Minato",
    isPrimary: false,
    ja: {
      searchTitle: "港区の出張洗車｜六本木・麻布・赤坂対応",
      searchDescription:
        "港区の出張洗車。六本木・麻布・赤坂・白金・芝などへ伺います。タワーマンション駐車場も対応。完全予約制のプレミアム洗車。",
      h1: "港区の出張洗車",
      lead: "港区のタワーマンション・住宅街へ、出張洗車サービスをお届けします。",
      body: [
        "六本木・麻布・赤坂など、港区の高層マンション駐車場での施工実績があります。事前に場所と車種を共有いただければスムーズです。",
        "ビジター・月額プランをご用意。都度7,700円（税込）から、継続利用で1回あたりのコストを抑えられます。",
      ],
      spots: "六本木・麻布・赤坂・白金・芝・港南など",
      faq: [
        {
          question: "港区のタワーマンション駐車場でも可能ですか？",
          answer: "はい。機械式・自走式を問わず、洗車可能な場所であれば対応します。",
        },
      ],
    },
    en: {
      searchTitle: "Mobile car wash in Minato | PRIME CAR WASH",
      searchDescription:
        "Mobile valeting in Minato Ward—Roppongi, Azabu, Akasaka, Shirokane, and more.",
      h1: "Mobile valeting in Minato",
      lead: "Premium mobile valeting for tower apartments and homes in Minato Ward.",
      body: [
        "Experience at high-rise parking in Roppongi, Azabu, and Akasaka.",
        "From ¥7,700 per visit; subscription plans lower the per-wash cost.",
      ],
      spots: "Roppongi, Azabu, Akasaka, Shirokane, Shiba, Konan, and nearby",
      faq: [
        {
          question: "Can you wash at my tower apartment parking in Minato?",
          answer: "Yes, wherever washing is permitted—mechanical or flat parking.",
        },
      ],
    },
  },
  {
    slug: "shinagawa",
    wardJa: "品川区",
    wardEn: "Shinagawa",
    isPrimary: false,
    ja: {
      searchTitle: "品川区の出張洗車｜大崎・五反田・目黒駅周辺",
      searchDescription:
        "品川区の出張洗車。大崎・五反田・武蔵小山・西五反田などへ伺います。出張無水洗車・車内清掃・月2回プランあり。",
      h1: "品川区の出張洗車",
      lead: "品川区のご指定場所へ、完全予約制の出張洗車をお届けします。",
      body: [
        "大崎・五反田エリアのオフィス街や住宅地まで対応。お仕事帰りの時間帯など、ご希望の枠をご相談ください。",
        "車外洗浄に加え、内装清掃オプションも。一台まるごとプレミアムケアが可能です。",
      ],
      spots: "大崎・五反田・武蔵小山・西五反田・荏原など",
      faq: [
        {
          question: "品川区は渋谷区と同じ料金ですか？",
          answer: "はい。区をまたいでも追加の出張料はかかりません。車種サイズとプランで料金が決まります。",
        },
      ],
    },
    en: {
      searchTitle: "Mobile car wash in Shinagawa | PRIME CAR WASH",
      searchDescription:
        "Mobile valeting in Shinagawa—Ōsaki, Gotanda, Musashi-Koyama, and more.",
      h1: "Mobile valeting in Shinagawa",
      lead: "Appointment-only mobile valeting across Shinagawa Ward.",
      body: [
        "Office districts and residential areas—we work around your schedule.",
        "Exterior wash plus optional interior cleaning.",
      ],
      spots: "Ōsaki, Gotanda, Musashi-Koyama, Nishi-Gotanda, Ebara, and nearby",
      faq: [
        {
          question: "Is pricing the same as Shibuya?",
          answer: "Yes—no extra travel fee across wards; price depends on size and plan.",
        },
      ],
    },
  },
  {
    slug: "nakano",
    wardJa: "中野区",
    wardEn: "Nakano",
    isPrimary: false,
    ja: {
      searchTitle: "中野区の出張洗車｜中野・東中野・野方対応",
      searchDescription:
        "中野区の出張洗車。中野・東中野・野方・沼袋などへ伺います。無水洗浄・完全予約制。月2回11,000円プランでお得に。",
      h1: "中野区の出張洗車",
      lead: "中野区のご自宅・マンション駐車場へ、出張洗車のプロが伺います。",
      body: [
        "中野・東中野・野方エリアを中心に対応。路傍駐車やマンションの自走式駐車場など、柔軟にお伺いします。",
        "継続プランはいつでも解約可能。まずはビジターでお試しいただくこともできます。",
      ],
      spots: "中野・東中野・野方・沼袋・新井など",
      faq: [
        {
          question: "中野区への出張は予約から何日で可能ですか？",
          answer: "ご希望日をフォームまたはLINEでお送りください。空き状況を確認のうえ折り返しご連絡します。",
        },
      ],
    },
    en: {
      searchTitle: "Mobile car wash in Nakano | PRIME CAR WASH",
      searchDescription:
        "Mobile valeting in Nakano—Nakano, Higashi-Nakano, Nogata, Numabukuro, and more.",
      h1: "Mobile valeting in Nakano",
      lead: "We come to your home or apartment parking in Nakano Ward.",
      body: [
        "Serving Nakano, Higashi-Nakano, and Nogata—street or garage parking.",
        "Try a one-off visit or subscribe; cancel anytime.",
      ],
      spots: "Nakano, Higashi-Nakano, Nogata, Numabukuro, Arai, and nearby",
      faq: [
        {
          question: "How soon can you visit Nakano?",
          answer: "Send your preferred dates via the form or LINE—we will confirm availability.",
        },
      ],
    },
  },
];

export function isAreaSlug(value: string): value is AreaSlug {
  return (areaSlugs as readonly string[]).includes(value);
}

export function getAreaPage(slug: string): AreaPageContent | undefined {
  return areaPages.find((page) => page.slug === slug);
}

/** Public canonical path (no /ja prefix for Japanese). */
export function getAreaCanonicalPath(locale: Locale, slug: AreaSlug): string {
  return locale === "ja" ? `/areas/${slug}` : `/en/areas/${slug}`;
}

export function getAreaContent(locale: Locale, page: AreaPageContent) {
  return locale === "ja" ? page.ja : page.en;
}
