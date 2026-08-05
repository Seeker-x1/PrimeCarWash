import type { Locale } from "@/lib/site-content";

export const guideSlugs = [
  "mobile-car-wash-vs-coin-wash",
  "waterless-car-wash-guide",
  "apartment-parking-car-wash",
  "luxury-car-mobile-wash",
  "tokyo-mobile-car-wash-price",
] as const;

export type GuideSlug = (typeof guideSlugs)[number];

type GuideSection = { heading: string; paragraphs: string[] };

export type GuidePost = {
  slug: GuideSlug;
  publishedAt: string;
  ja: {
    searchTitle: string;
    searchDescription: string;
    h1: string;
    lead: string;
    sections: GuideSection[];
  };
  en: {
    searchTitle: string;
    searchDescription: string;
    h1: string;
    lead: string;
    sections: GuideSection[];
  };
};

export const guidePosts: GuidePost[] = [
  {
    slug: "mobile-car-wash-vs-coin-wash",
    publishedAt: "2026-08-04",
    ja: {
      searchTitle: "出張洗車とコイン洗車の違い｜東京で選ぶならどっち？",
      searchDescription:
        "出張洗車とコイン洗車の違いを料金・時間・仕上がり・塗装への負担で比較。東京で忙しい方・高級車オーナー向けに、出張洗車のメリットを解説。",
      h1: "出張洗車とコイン洗車の違い",
      lead: "「洗車に行く時間がない」「仕上がりにこだわりたい」—そんな方が増える中、出張洗車とコイン洗車のどちらを選ぶべきか整理します。",
      sections: [
        {
          heading: "時間と手間",
          paragraphs: [
            "コイン洗車は設備利用料に加え、洗車・拭き上げまで自分で行う必要があります。往復の移動と待ち時間も含めると、1回あたり1時間以上かかることも珍しくありません。",
            "出張洗車はご自宅や勤務先の駐車場でプロが施工するため、移動ゼロ。予約時間に合わせて仕上がるので、家事や仕事の合間に依頼できます。",
          ],
        },
        {
          heading: "仕上がりと塗装への配慮",
          paragraphs: [
            "コイン洗車は高圧洗浄やブラシの使用で、塗装に細かな傷がつきやすい場合があります。",
            "出張洗車（当社は無水洗浄を基本）では、専用洗浄剤と手作業で汚れを浮かせて拭き取るため、塗装面への負担を抑えやすいのが特徴です。高級車・輸入車オーナーにも選ばれています。",
          ],
        },
        {
          heading: "料金の考え方",
          paragraphs: [
            "コイン洗車は1回数百円〜と安く見えますが、ワックスや拭き上げクロス、時間コストを含めると意外と割高になることも。",
            "当社の出張洗車はMサイズ7,700円（税込）から。月2回プランなら11,000円で1回5,500円相当—こまめにプロ品質を維持したい方に向いています。",
          ],
        },
      ],
    },
    en: {
      searchTitle: "Mobile valeting vs coin wash | PRIME CAR WASH",
      searchDescription:
        "Compare mobile car wash and coin wash on time, finish quality, and paint care. For busy Tokyo drivers and luxury car owners.",
      h1: "Mobile valeting vs coin wash",
      lead: "No time to visit a wash bay? Here is how appointment-only mobile valeting compares to coin washes.",
      sections: [
        {
          heading: "Time and convenience",
          paragraphs: [
            "Coin washes require travel, queuing, and doing the work yourself—often an hour or more per visit.",
            "We come to your parking spot at the booked time so you can skip the trip entirely.",
          ],
        },
        {
          heading: "Finish and paint care",
          paragraphs: [
            "High-pressure wands and brushes at coin washes can add fine scratches over time.",
            "Our waterless hand finish is gentler on paint and popular with luxury and imported vehicles.",
          ],
        },
        {
          heading: "Cost in context",
          paragraphs: [
            "Coin washes look cheap per visit but add up with supplies and your time.",
            "Our twice-monthly plan is about ¥5,500 per wash for size M versus ¥7,700 pay-as-you-go.",
          ],
        },
      ],
    },
  },
  {
    slug: "waterless-car-wash-guide",
    publishedAt: "2026-08-04",
    ja: {
      searchTitle: "無水洗車（ウォーターレス洗車）とは？メリット・デメリット",
      searchDescription:
        "無水洗車の仕組み・メリット（節水・マンション対応）・向いているケースを解説。東京の出張洗車サービス PRIME CAR WASH の施工方針も紹介。",
      h1: "無水洗車（ウォーターレス洗車）ガイド",
      lead: "水をほとんど使わずにボディを洗浄する無水洗車。環境面だけでなく、マンションや狭小地でも依頼しやすい方法として注目されています。",
      sections: [
        {
          heading: "無水洗車の仕組み",
          paragraphs: [
            "専用の洗浄剤をボディに吹き付け、汚れを包み込んでからマイクロファイバーで拭き取ります。水で流す工程がないため、排水設備がなくても施工できます。",
          ],
        },
        {
          heading: "メリット",
          paragraphs: [
            "節水・近隣への配慮：大量の水を使わないため、マンションや住宅街でもトラブルになりにくい。",
            "塗装保護：適切な洗浄剤と手作業により、艶と保護被膜を維持しやすい。",
            "場所を選ばない：駐車場・ガレージ前など、洗車可能な場所であれば出張対応可能。",
          ],
        },
        {
          heading: "当社での対応",
          paragraphs: [
            "PRIME CAR WASHは無水洗浄を基本とし、車種・汚れ具合に応じて最適な方法をご案内します。渋谷・世田谷・目黒を中心に、港区・品川区・中野区などへ伺います。",
          ],
        },
      ],
    },
    en: {
      searchTitle: "Waterless car wash guide | PRIME CAR WASH",
      searchDescription:
        "How waterless valeting works, benefits for apartments and paint care, and how PRIME CAR WASH applies it in Tokyo.",
      h1: "Waterless car wash guide",
      lead: "Waterless cleaning uses specialty products and hand wiping instead of a hose—ideal where drainage is limited.",
      sections: [
        {
          heading: "How it works",
          paragraphs: [
            "Cleaner encapsulates dirt; microfiber towels lift it away without a rinse step.",
          ],
        },
        {
          heading: "Benefits",
          paragraphs: [
            "Less water and neighbor impact—suited to apartment parking.",
            "Gentler hand finish helps maintain gloss and protection.",
            "We work wherever washing is permitted on your property.",
          ],
        },
        {
          heading: "Our approach",
          paragraphs: [
            "Waterless exterior care is our default; we advise the best method per vehicle across central Tokyo wards.",
          ],
        },
      ],
    },
  },
  {
    slug: "apartment-parking-car-wash",
    publishedAt: "2026-08-04",
    ja: {
      searchTitle: "マンション駐車場での出張洗車｜機械式・タワマンも相談可",
      searchDescription:
        "マンション・タワーマンの駐車場で出張洗車は可能？機械式・自走式の注意点、管理規約の確認ポイント、東京エリアの対応事例を解説。",
      h1: "マンション駐車場での出張洗車",
      lead: "「マンションの駐車場で洗車してもらえる？」—最も多いご質問のひとつです。結論、洗車が可能な場所であれば多くの場合対応できます。",
      sections: [
        {
          heading: "機械式・自走式どちらも相談可",
          paragraphs: [
            "自走式の平置き・機械式いずれも、洗車が許可されている駐車スペースであれば施工可能です。六本木・麻布などタワーマン駐車場での実績もあります。",
          ],
        },
        {
          heading: "事前に確認したいこと",
          paragraphs: [
            "管理規約で洗車が禁止されていないか、排水・洗浄剤の使用に制限がないかをご確認ください。当社は無水洗浄を基本とするため、多くの物件で問題になりにくい施工です。",
            "予約時に駐車場の種類（機械式の段数など）と車種をお知らせいただけるとスムーズです。",
          ],
        },
        {
          heading: "対応エリア",
          paragraphs: [
            "渋谷区・世田谷区・目黒区を中心に、港区・品川区・中野区・杉並区などへ伺います。エリア外もまずはご相談ください。",
          ],
        },
      ],
    },
    en: {
      searchTitle: "Mobile wash at apartment parking | PRIME CAR WASH",
      searchDescription:
        "Can you book mobile valeting in tower or mechanical parking? Rules to check and how we serve Tokyo apartments.",
      h1: "Mobile valeting at apartment parking",
      lead: "Yes—where washing is allowed, we can usually work in flat or mechanical bays.",
      sections: [
        {
          heading: "Tower and mechanical parking",
          paragraphs: [
            "We have experience at high-rise parking in Minato and similar wards when rules permit washing on site.",
          ],
        },
        {
          heading: "What to check first",
          paragraphs: [
            "Confirm building rules allow washing and any limits on products or drainage.",
            "Share parking type and vehicle model when booking for a smooth visit.",
          ],
        },
        {
          heading: "Service area",
          paragraphs: [
            "Core wards: Shibuya, Setagaya, Meguro—also Minato, Shinagawa, Nakano, Suginami, Ota, and nearby.",
          ],
        },
      ],
    },
  },
  {
    slug: "luxury-car-mobile-wash",
    publishedAt: "2026-08-04",
    ja: {
      searchTitle: "高級車・輸入車の出張洗車｜レクサス・ポルシェ・ベンツ対応",
      searchDescription:
        "高級車・輸入車向け出張洗車のポイント。塗装への配慮、サイズ別料金、対応車種例。東京・渋谷エリアの PRIME CAR WASH。",
      h1: "高級車・輸入車の出張洗車",
      lead: "レクサス、ポルシェ、メルセデス・ベンツ、BMWなど—高級車オーナーが出張洗車を選ぶ理由と、当社の施工方針をまとめます。",
      sections: [
        {
          heading: "なぜ出張洗車が選ばれるか",
          paragraphs: [
            "ディーラーまで預ける手間なく、ご自宅で丁寧な手洗い仕上げが受けられます。コイン洗車のブラシや不適切な洗剤によるリスクを避けたい方に適しています。",
          ],
        },
        {
          heading: "対応車種と料金",
          paragraphs: [
            "サイズ別料金表に掲載のない車種やカスタムパーツ装着車は現車確認のうえご案内します。LL・XLサイズ（アルファード、カイエン、Gクラスなど）も対応可能です。",
          ],
        },
        {
          heading: "継続プランのすすめ",
          paragraphs: [
            "高級車ほど定期的なケアで資産価値を維持しやすくなります。月2回11,000円プランは、都度7,700円より1回あたりお得にプロ品質をキープできます。",
          ],
        },
      ],
    },
    en: {
      searchTitle: "Luxury & imported car mobile wash | PRIME CAR WASH",
      searchDescription:
        "Mobile valeting for Lexus, Porsche, Mercedes, BMW and more—paint-safe care and size-based pricing in Tokyo.",
      h1: "Luxury and imported car valeting",
      lead: "Hand-finished waterless care at home—without coin-wash brush risk.",
      sections: [
        {
          heading: "Why owners choose mobile",
          paragraphs: [
            "Skip dealer drop-off while keeping a careful hand finish and appropriate products.",
          ],
        },
        {
          heading: "Vehicles and pricing",
          paragraphs: [
            "Unlisted or modified cars are quoted after inspection; LL/XL sizes including Alphard and Cayenne are supported.",
          ],
        },
        {
          heading: "Subscription value",
          paragraphs: [
            "Regular pro care helps preserve finish and value—twice-monthly plans lower the per-visit cost.",
          ],
        },
      ],
    },
  },
  {
    slug: "tokyo-mobile-car-wash-price",
    publishedAt: "2026-08-04",
    ja: {
      searchTitle: "東京の出張洗車 料金相場｜サイズ別・月額プラン一覧",
      searchDescription:
        "東京・渋谷・世田谷・目黒の出張洗車料金。Mサイズ7,700円〜、月2回11,000円プランの内訳、サイズ区分（SS〜XL）をわかりやすく解説。",
      h1: "東京の出張洗車 料金ガイド",
      lead: "出張洗車の料金は車種サイズとプランで決まります。東京エリアでも追加の出張料はいただかず、サイズ別料金表がそのまま適用されます。",
      sections: [
        {
          heading: "ビジター（都度）料金の目安",
          paragraphs: [
            "Mサイズ（プリウス・ヤリス・BMW 3シリーズなど）：ボディ洗車7,700円、ボディ＋内装9,900円（いずれも税込）。",
            "Lサイズは1.2倍、LLは1.4倍、XLは1.6倍。サイトの料金表で車種例をご確認ください。",
          ],
        },
        {
          heading: "継続プランがお得な理由",
          paragraphs: [
            "月1回ボディ洗車：6,600円（Mサイズ）。月2回ボディ洗車：11,000円—1回5,500円相当で、都度より約30%お得です。",
            "解約はいつでも可能。まずビジターで試してから継続プランへ切り替える方も多いです。",
          ],
        },
        {
          heading: "出張料・エリア",
          paragraphs: [
            "渋谷・世田谷・目黒を中心に、港区・品川・中野・杉並・大田区などへ追加料金なしで伺います（車種・プランによる）。",
          ],
        },
      ],
    },
    en: {
      searchTitle: "Tokyo mobile car wash pricing | PRIME CAR WASH",
      searchDescription:
        "Exterior wash from ¥7,700 (size M), twice-monthly plan ¥11,000, and size multipliers—transparent Tokyo mobile valeting prices.",
      h1: "Tokyo mobile valeting pricing",
      lead: "Pricing depends on vehicle size and plan; no extra travel fee across our Tokyo service wards.",
      sections: [
        {
          heading: "Pay-as-you-go",
          paragraphs: [
            "Size M exterior from ¥7,700; exterior + interior ¥9,900 (tax included).",
            "L ×1.2, LL ×1.4, XL ×1.6—see the full matrix on our homepage.",
          ],
        },
        {
          heading: "Subscriptions",
          paragraphs: [
            "Monthly ×1 exterior ¥6,600; monthly ×2 ¥11,000—about ¥5,500 per wash for size M.",
            "Cancel anytime; many customers try a visitor wash first.",
          ],
        },
        {
          heading: "Travel fees",
          paragraphs: [
            "No extra travel charge across listed Tokyo wards including Shibuya, Setagaya, Meguro, Minato, and more.",
          ],
        },
      ],
    },
  },
];

export function isGuideSlug(value: string): value is GuideSlug {
  return (guideSlugs as readonly string[]).includes(value);
}

export function getGuidePost(slug: string): GuidePost | undefined {
  return guidePosts.find((post) => post.slug === slug);
}

export function getGuideContent(locale: Locale, post: GuidePost) {
  return locale === "ja" ? post.ja : post.en;
}

export function getGuideCanonicalPath(locale: Locale, slug: GuideSlug): string {
  return locale === "ja" ? `/guides/${slug}` : `/en/guides/${slug}`;
}

export function getGuidesHubPath(locale: Locale): string {
  return locale === "ja" ? "/guides" : "/en/guides";
}

export function getAreasHubPath(locale: Locale): string {
  return locale === "ja" ? "/areas" : "/en/areas";
}
