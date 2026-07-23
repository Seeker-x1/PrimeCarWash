import type { ThreadsPost, ThreadsTheme } from "@/lib/threads/types";

/**
 * PRIME CAR WASH — Threads 投稿テーマ
 * トーン: 静か・上質・売り込み控えめ。末尾 CTA は控えめに。
 * 軸: 利便性だけでなく、車へのいたわり・仕上げのこだわりを適宜織り込む。
 */
export const THREADS_THEMES: ThreadsTheme[] = [
  {
    id: "brand-world",
    nameJa: "ブランド世界観",
    description: "プレミアム出張洗車としての空気感・美学を伝える",
    postingTips: "価格やプラン名は出さない。短い一行＋短い余韻。優しさと静けさを両立。",
  },
  {
    id: "time-place",
    nameJa: "時間と場所の自由",
    description: "ガレージ／駐車場へ伺う価値、移動ゼロの体験",
    postingTips: "忙しい人の一日に寄り添う。罪悪感ではなく解放感。",
  },
  {
    id: "exterior-craft",
    nameJa: "車外ケアのこだわり",
    description: "無水洗浄・艶・ホイールなど、目に見える仕上がりと塗面への配慮",
    postingTips: "専門用語は1つまで。プロセス自慢より『触れる前の判断』と結果の質感。",
  },
  {
    id: "interior-care",
    nameJa: "車内ケア",
    description: "乗り降りで目に入る清潔感・内装をいたわる整え方",
    postingTips: "臭いや汚れの強い表現は避け、静かな清潔感と内装への優しさで。",
  },
  {
    id: "subscription",
    nameJa: "継続プラン",
    description: "月1〜2回で美しさをキープする習慣",
    postingTips: "割引煽り禁止。『戻らない状態』と『負荷を溜めない』価値を語る。",
  },
  {
    id: "protect-benefit",
    nameJa: "撥水プロテクト",
    description: "継続特典の防汚・撥水被膜（6ヶ月に1回）",
    postingTips: "技術自慢より『雨の日のあと』と塗装面の負担軽減で語る。",
  },
  {
    id: "faq-trust",
    nameJa: "不安解消・FAQ",
    description: "完全予約・水の手配・対応車種などよくある疑問",
    postingTips: "1投稿1疑問。結論を先に。",
  },
  {
    id: "seasonal",
    nameJa: "季節ネタ",
    description: "花粉・黄砂・梅雨・猛暑・落ち葉など季節汚れ",
    postingTips: "暦に合わせて enabled を見ると効果的。放置しない＝いたわり、で締める。",
  },
  {
    id: "owner-mindset",
    nameJa: "オーナーのこだわり",
    description: "愛車を大切にする人の共感・静かな矜持",
    postingTips: "高級車名・価格帯の露出は最小限に。『大切に扱いたい』感覚に寄り添う。",
  },
  {
    id: "soft-cta",
    nameJa: "やわらかい予約導線",
    description: "LINE相談・日程相談へ自然に誘導",
    postingTips: "リンクや硬めの『今すぐ』は避ける。相談できる余白を残す。",
  },
];

/**
 * 投稿バンク（日次 Cron がローテーション）
 * 追加時: id をユニークに、text は500字以内、themeId は THREADS_THEMES に存在すること
 */
export const THREADS_POSTS: ThreadsPost[] = [
  // —— brand-world ——
  {
    id: "bw-01",
    themeId: "brand-world",
    text: "洗車は、急ぐものではない。\n塗面に触れる前の判断まで含めて、体験だと思っています。\n\nPRIME CAR WASH\n完全予約制の出張洗車",
    enabled: true,
  },
  {
    id: "bw-02",
    themeId: "brand-world",
    text: "あなたのガレージを、洗車スタジオに。\n\n場所を変えず、仕上がりだけを変える。\nそれがプレミアムな出張洗車のかたちです。",
    enabled: true,
  },
  {
    id: "bw-03",
    themeId: "brand-world",
    text: "艶は、偶然には生まれない。\n汚れを落としたあとに残る、均一な光。\n\nそこに時間をかける理由があります。",
    enabled: true,
  },
  {
    id: "bw-04",
    themeId: "brand-world",
    text: "きれいにするだけでなく、車をいたわる洗車でありたい。\n力の入れ方ひとつで、仕上がりの印象は変わります。\n\n静かで、丁寧な一手を大切にしています。",
    enabled: true,
  },

  // —— time-place ——
  {
    id: "tp-01",
    themeId: "time-place",
    text: "洗車のために、半日を空けなくていい。\nご指定の場所へ伺います。\n\n帰宅後、愛車が整っている——その静かな余裕が価値です。",
    enabled: true,
  },
  {
    id: "tp-02",
    themeId: "time-place",
    text: "移動時間ゼロ。待ち時間ゼロ。\n予約した枠だけが、あなたの時間。\n\n完全予約制の出張洗車です。",
    enabled: true,
  },
  {
    id: "tp-03",
    themeId: "time-place",
    text: "週末の洗車混雑から、降りてみませんか。\n自宅やオフィスの駐車場が、そのまま施工スペースになります。",
    enabled: true,
  },

  // —— exterior-craft ——
  {
    id: "ex-01",
    themeId: "exterior-craft",
    text: "ボディは、落とすだけでなく整える。\n汚れ除去と同時に、艶と保護の層を意識した車外ケア。\n\n見た目の美しさは、触れたあとの静けさにも出ます。",
    enabled: true,
  },
  {
    id: "ex-02",
    themeId: "exterior-craft",
    text: "ホイールのブレーキダストは、遠くからより近くで気になるもの。\n細部まで拭き上げると、車全体の印象が一段変わります。",
    enabled: true,
  },
  {
    id: "ex-03",
    themeId: "exterior-craft",
    text: "窓ガラスがクリアだと、運転の気分まで整う。\n外窓の砂埃と指紋を丁寧に落とす——地味ですが、効果は確実です。",
    enabled: true,
  },
  {
    id: "ex-04",
    themeId: "exterior-craft",
    text: "乾いた砂埃を、そのままこすらない。\n塗面へのいちばんのいたわりは、順番を守ることだと思っています。\n\n落とす前に、まず優しくほどく。",
    enabled: true,
  },
  {
    id: "ex-05",
    themeId: "exterior-craft",
    text: "ミラー裏やドアの窪みは、見逃しやすい場所。\n見えないところまで整えると、車全体に統一感が生まれます。\n\nこだわりは、細部に静かに出ます。",
    enabled: true,
  },

  // —— interior-care ——
  {
    id: "in-01",
    themeId: "interior-care",
    text: "ドアを開けた瞬間に見える場所。\nステップや枠の清潔感は、オーナーの感覚にじかに届きます。\n\n車内ケアは、そこから始まります。",
    enabled: true,
  },
  {
    id: "in-02",
    themeId: "interior-care",
    text: "フロアとシートの埃は、乗っている本人がいちばん気づきにくい。\n定期的な掃除機かけで、車内の空気感が戻ります。",
    enabled: true,
  },
  {
    id: "in-03",
    themeId: "interior-care",
    text: "内窓の曇りや指紋は、視界だけでなく気分にも影響する。\nクリアなガラスは、小さな贅沢です。",
    enabled: true,
  },
  {
    id: "in-04",
    themeId: "interior-care",
    text: "ハンドルやスイッチ周りは、触れる回数が多い分、傷みやすい。\n強くこすらず、汚れだけをそっと持ち上げる。\n\n内装へのいたわりも、仕上げのこだわりです。",
    enabled: true,
  },

  // —— subscription ——
  {
    id: "sub-01",
    themeId: "subscription",
    text: "一度きれいになると、戻したくなくなる。\nだからこそ、月1〜2回の継続が合理的です。\n\n美しさを『イベント』ではなく『習慣』に。",
    enabled: true,
  },
  {
    id: "sub-02",
    themeId: "subscription",
    text: "都度より、続くほうが楽。\n洗車の判断疲労を減らし、常に整った状態をキープする——継続プランの本質です。",
    enabled: true,
  },
  {
    id: "sub-03",
    themeId: "subscription",
    text: "汚れは一気に溜まるより、少しずつ積み重なる。\n定期メンテは、汚れとの追いかけっこから降りる選択です。",
    enabled: true,
  },
  {
    id: "sub-04",
    themeId: "subscription",
    text: "溜めてから一気に落とすより、負担が軽い段階で整える。\nそれが、愛車へのいちばん地味で確実ないたわりかもしれません。\n\n継続は、無理のないケアのリズムです。",
    enabled: true,
  },

  // —— protect-benefit ——
  {
    id: "pr-01",
    themeId: "protect-benefit",
    text: "雨のあと、水滴が玉になって流れる。\nその感触が続くと、日常の手入れが一段楽になります。\n\n継続プランの撥水プロテクト特典です。",
    enabled: true,
  },
  {
    id: "pr-02",
    themeId: "protect-benefit",
    text: "防汚・撥水の被膜は、目立たない保険のようなもの。\n砂埃や雨汚れの付着を抑え、美しさの持ちを伸ばします。",
    enabled: true,
  },
  {
    id: "pr-03",
    themeId: "protect-benefit",
    text: "撥水は見た目の変化だけでなく、塗装面への負担を減らす手伝いでもある。\n雨染みが残りにくいと、次のケアもやさしくなります。",
    enabled: true,
  },

  // —— faq-trust ——
  {
    id: "fq-01",
    themeId: "faq-trust",
    text: "Q. 水や電気の手配は？\nA. 基本はこちらで対応できる無水洗浄中心。詳細はご状況を伺いながらご案内します。\n\nまずはLINEで気軽にご相談ください。",
    enabled: true,
  },
  {
    id: "fq-02",
    themeId: "faq-trust",
    text: "Q. どんな車でも対応できますか？\nA. サイズ区分に応じて料金が変わります。軽から大型SUV・輸入車までご相談可能です。\n\n車種名を添えていただければ目安をお伝えします。",
    enabled: true,
  },
  {
    id: "fq-03",
    themeId: "faq-trust",
    text: "Q. 当日いきなりお願いできますか？\nA. 完全予約制です。仕上がりの質を守るため、枠を確保してから伺います。\n\n日程の候補がわかる段階でご連絡を。",
    enabled: true,
  },

  // —— seasonal ——
  {
    id: "se-pollen",
    themeId: "seasonal",
    text: "花粉の季節、ボディの黄ばんだ膜は放っておくと固着しやすい。\n早めのリセットは、見た目だけでなく塗装面へのいたわりにもなります。",
    enabled: true,
  },
  {
    id: "se-rain",
    themeId: "seasonal",
    text: "梅雨明けの洗車は、気持ちの切り替えでもある。\n雨染みや水垢が乗る前に、一度しっかり整えるタイミングです。",
    enabled: true,
  },
  {
    id: "se-heat",
    themeId: "seasonal",
    text: "猛暑は、車内の状態が特に気になる季節。\n外装だけでなく、内装の埃や手垢も合わせて整える価値があります。",
    enabled: true,
  },
  {
    id: "se-dust",
    themeId: "seasonal",
    text: "黄砂や細かい砂埃は、一見きれいでも摩擦の種になる。\n触る前に落とす——愛車への敬意は、そこから始まります。",
    enabled: true,
  },

  // —— owner-mindset ——
  {
    id: "ow-01",
    themeId: "owner-mindset",
    text: "自慢するためではなく、自分が納得するために整える。\nその静かな基準がある人に、出張洗車はよく合います。",
    enabled: true,
  },
  {
    id: "ow-02",
    themeId: "owner-mindset",
    text: "週末に自分でやる洗車も素敵です。\n時間が削られる季節は、プロに委ねるのも選択肢のひとつ。",
    enabled: true,
  },
  {
    id: "ow-03",
    themeId: "owner-mindset",
    text: "愛車は、移動手段以上のものであることが多い。\nだから仕上げに、丁寧さの余白を残したいのです。",
    enabled: true,
  },
  {
    id: "ow-04",
    themeId: "owner-mindset",
    text: "『きれいにしてほしい』の奥には、傷つけることへの気遣いがある。\nその感覚を尊重して、力任せではないケアを心がけています。",
    enabled: true,
  },

  // —— soft-cta ——
  {
    id: "cta-01",
    themeId: "soft-cta",
    text: "「自分の車でも来てもらえますか？」\nその一言からで大丈夫です。\n\nPRIME CAR WASH は LINE でご相談・ご予約を受け付けています。",
    enabled: true,
  },
  {
    id: "cta-02",
    themeId: "soft-cta",
    text: "料金の目安、サイズ区分、継続プランの違い。\nサイトにもまとめていますが、車種名をいただければより正確にご案内できます。\n\nまずはお気軽にどうぞ。",
    enabled: true,
  },
  {
    id: "cta-03",
    themeId: "soft-cta",
    text: "希望日が二候補ある状態でご連絡いただけると、スムーズです。\n完全予約制の出張洗車——枠の確保からご一緒します。",
    enabled: true,
  },
];

export function getThemeById(themeId: string): ThreadsTheme | undefined {
  return THREADS_THEMES.find((t) => t.id === themeId);
}

export function listEnabledPosts(): ThreadsPost[] {
  return THREADS_POSTS.filter((p) => p.enabled);
}

export async function listRotatingPosts(): Promise<ThreadsPost[]> {
  const { getDisabledPostIds } = await import("@/lib/threads/disabled-store");
  const disabled = await getDisabledPostIds();
  return THREADS_POSTS.filter((p) => p.enabled && !disabled.has(p.id)).sort((a, b) =>
    a.id.localeCompare(b.id),
  );
}

export function getPostById(postId: string): ThreadsPost | undefined {
  return THREADS_POSTS.find((p) => p.id === postId);
}

export function assertPostBank(): void {
  const themeIds = new Set(THREADS_THEMES.map((t) => t.id));
  const postIds = new Set<string>();
  for (const post of THREADS_POSTS) {
    if (!themeIds.has(post.themeId)) {
      throw new Error(`Unknown themeId "${post.themeId}" on post "${post.id}"`);
    }
    if (postIds.has(post.id)) {
      throw new Error(`Duplicate post id "${post.id}"`);
    }
    postIds.add(post.id);
    if (post.text.length > 500) {
      throw new Error(`Post "${post.id}" exceeds 500 characters (${post.text.length})`);
    }
  }
}
