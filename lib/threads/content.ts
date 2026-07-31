import type { ThreadsPost, ThreadsTheme } from "@/lib/threads/types";

/**
 * PRIME CAR WASH — Threads 投稿テーマ（フォロワー獲得向け）
 *
 * 方針:
 * - 1行目にフック（問い・数字・断言）。詩的コピー・ブローシャー調は禁止
 * - 渋谷・世田谷・目黒など具体エリア・シーンを入れる
 * - 保存・返信・フォローの理由を毎回ひとつ入れる
 * - 売り込みは最後に1行まで。価格煽り・割引は出さない
 */
export const THREADS_THEMES: ThreadsTheme[] = [
  {
    id: "local-authority",
    nameJa: "エリア特化",
    description: "渋谷・世田谷・目黒周辺の具体シーンで地域の専門家感を出す",
    postingTips: "マンション駐車場・狭い区画・帰宅後など地名＋状況。最後は「うちの区来れる？」系の問い。",
  },
  {
    id: "myth-bust",
    nameJa: "誤解つぶし",
    description: "洗車の常識のズレを指摘し、プロ視点の信頼を取る",
    postingTips: "「〇〇は間違い」から入る。結論→理由→質問で締める。",
  },
  {
    id: "save-list",
    nameJa: "保存リスト",
    description: "チェックリスト・〇選で保存・シェアを狙う",
    postingTips: "【保存推奨】を冒頭に。箇条書き3〜5。実務的でコピペできる内容。",
  },
  {
    id: "relatable",
    nameJa: "あるある共感",
    description: "愛車オーナーの日常のモヤモヤに寄り添い、いいね・返信を取る",
    postingTips: "「わかる人いる？」で終える。高級車名は控えめ、状況は具体的に。",
  },
  {
    id: "process-proof",
    nameJa: "仕事の見せ方",
    description: "施工の順番・判断を見せて「この人プロだ」と思わせる",
    postingTips: "Before/After写真なしでも、手順と理由で信頼。専門用語は1つまで。",
  },
  {
    id: "hot-take",
    nameJa: "ちょい意見",
    description: "業界の当たり前に優しく異論。議論・拡散を狙う",
    postingTips: "攻撃的にしない。体験ベース。「あなたはどっち？」で締める。",
  },
  {
    id: "faq-engage",
    nameJa: "FAQ・質問誘導",
    description: "よくある疑問に答えつつ、返信・DMを促す",
    postingTips: "Q. で始めるか、結論を最初に。LINEは「気軽に」とだけ。",
  },
  {
    id: "seasonal-tips",
    nameJa: "季節ネタ",
    description: "花粉・梅雨・猛暑など今の時期だけの実用情報",
    postingTips: "今すぐ役立つ一手。放置のリスクを数字や期限で示す。",
  },
  {
    id: "owner-insight",
    nameJa: "オーナー向け知見",
    description: "愛車を長くきれいに保つ判断軸を教える",
    postingTips: "上から目線にしない。「自分もそう思う」トーン。",
  },
  {
    id: "follow-value",
    nameJa: "フォロー価値",
    description: "このアカウントをフォローする理由を明示する",
    postingTips: "週1で十分。何が得られるかを箇条書きで約束する。",
  },
];

/**
 * 投稿バンク（45本 ≒ 45日ローテーション）
 * 追加時: id ユニーク、text 500字以内、themeId は THREADS_THEMES に存在すること
 */
export const THREADS_POSTS: ThreadsPost[] = [
  // —— local-authority ——
  {
    id: "loc-01",
    themeId: "local-authority",
    text: "渋谷区のマンション駐車場、洗車場まで行くの正直しんどくない？\n\n帰宅したらその場で整う出張洗車。\n完全予約制だから、近所に知らせずに済むことも多いです。\n\n世田谷・目黒も同じ。\n「うちの区、来れる？」は気軽に聞いてください。",
    enabled: true,
  },
  {
    id: "loc-02",
    themeId: "local-authority",
    text: "目黒区の坂道沿い、風で埃が一晩で乗るやつ。\n\n週末に自分で洗うと2時間溶ける人、多いです。\n出張なら帰宅後30分〜1時間で、翌朝きれいな状態から出発。\n\n港区・品川区のオフィス駐車場も、枠が取れれば対応しています。",
    enabled: true,
  },
  {
    id: "loc-03",
    themeId: "local-authority",
    text: "世田谷区、路肩や自宅前の狭いスペースでも施工できるケースが多いです。\n\n「ここ狭いけど大丈夫？」がいちばん多い相談。\n写真1枚いただけると、ほぼその場で可否が分かります。\n\n中野区・杉並区も、まずは場所と車種を教えてください。",
    enabled: true,
  },
  {
    id: "loc-04",
    themeId: "local-authority",
    text: "代官山・恵比寿あたり、外車多いエリアでよく伺います。\n\n輸入車はサイズ区分で料金が変わるので、\n車種名だけ送ってもらえれば目安を返せます（営業電話はしません）。\n\n完全予約制の出張洗車、PRIME CAR WASHです。",
    enabled: true,
  },
  {
    id: "loc-05",
    themeId: "local-authority",
    text: "「渋谷・世田谷・目黒以外は無理？」\n→ いいえ。中心はこの3区ですが、港・品川・中野なども実績あり。\n\n遠いほど日程の調整は必要ですが、\nまず候補日2つと住所の大まかなエリアを送ってもらえると早いです。",
    enabled: true,
  },

  // —— myth-bust ——
  {
    id: "myth-01",
    themeId: "myth-bust",
    text: "「無水洗浄＝傷つく」は半分正解、半分間違い。\n\n傷つけるのは水の有無じゃなく、\n乾いた砂埃をそのままこすったとき。\n\nプロの順番：\n①埃を逃がす ②潤す ③一方向に拭く\n\n自宅洗車で細かい傷が増えた人、いますか？",
    enabled: true,
  },
  {
    id: "myth-02",
    themeId: "myth-bust",
    text: "雨のあとに洗車するのはムダ、は古い話。\n\n酸性の雨ジミは放置すると塗装に残りやすい。\n雨が止んでから24〜48時間以内に落とすのが、\n見た目もリセールも守りやすいです。\n\n雨の日に洗車した方が楽だ、と思う人どれくらいいる？",
    enabled: true,
  },
  {
    id: "myth-03",
    themeId: "myth-bust",
    text: "コンビニの手洗い場、安いのは正しい。\nでも「傷がつかない」は保証されない。\n\n共用ブラシ・古いスポンジ・強い水流は、\n黒い車ほど目立ちやすい。\n\n安さと仕上がり、あなたはどっち優先しますか？",
    enabled: true,
  },
  {
    id: "myth-04",
    themeId: "myth-bust",
    text: "「月1洗車で十分」は、通勤距離次第。\n\n渋谷〜品川を毎日走ると、\n1週間でボディの手触りが変わることも。\n\n頻度の正解は車種×走行×駐車環境。\n一律の答えはないので、\n状況を聞いてから提案するのが出張洗車のやり方です。",
    enabled: true,
  },
  {
    id: "myth-05",
    themeId: "myth-bust",
    text: "コーティングしたから洗車不要、は危険。\n\n被膜の上にも汚れは乗る。\n放置すると被膜ごと剥がれやすくなることも。\n\nコーティング後こそ、\n摩擦の少ない洗い方が大事。\n\nコーティング店に「その後どう洗う？」って聞いたことある？",
    enabled: true,
  },

  // —— save-list ——
  {
    id: "save-01",
    themeId: "save-list",
    text: "【保存推奨】花粉シーズン、やるべき3つ\n\n①黄ばみは72時間が分水嶺（固着前に落とす）\n②拭きは上から下・一方向\n③ホイールはボディとタオル分ける\n\n世田谷・目黒は花粉濃い。\n放置すると次の洗車が2倍しんどくなります。",
    enabled: true,
  },
  {
    id: "save-02",
    themeId: "save-list",
    text: "【保存推奨】出張洗車を頼む前に伝えるとスムーズな5つ\n\n①車種（年式あると尚良）\n②駐車場所の写真\n③水栓・排水の有無\n④希望日2候補\n⑤前回洗車からの経過\n\nこれだけで見積もりと可否がほぼ一発です。",
    enabled: true,
  },
  {
    id: "save-03",
    themeId: "save-list",
    text: "【保存推奨】車内が急にダサく見える原因TOP3\n\n①フロアの砂・葉っぱ\n②内窓の指紋と曇り\n③ドアステップの黒ずみ\n\n外装がきれいでも、ここが汚いと全体が安く見える。\n月1でこの3つだけ整えると印象が変わります。",
    enabled: true,
  },
  {
    id: "save-04",
    themeId: "save-list",
    text: "【保存推奨】梅雨前にやっておくチェック4つ\n\n①雨ジミの初期除去\n②ホイール裏の泥\n③ワイパー周りの黒ずみ\n④内装の湿気・カビ臭の元\n\n梅雨入り後は外で干せない日が続く。\n今のうちにリセットしておくと楽です。",
    enabled: true,
  },
  {
    id: "save-05",
    themeId: "save-list",
    text: "【保存推奨】黒い車をキープするコツ3つ\n\n①日陰または早朝夕方に洗う（乾燥斑防止）\n②マイクロファイバーは汚れたら即交換\n③ドライブスルー洗車機は月1以上避ける\n\n黒は傷も汚れも目立つ。\n手間を減らすならプロに任せるのも合理的です。",
    enabled: true,
  },

  // —— relatable ——
  {
    id: "rel-01",
    themeId: "relatable",
    text: "土曜の朝、洗車場の待ち列見て\u{1F62C}\n\n2時間待って、15分で終わる。\n帰ってきたら午後半分なくなってる。\n\n「週末は家族の時間に使いたい」\nこれ、出張洗車を選ぶ人の本音の一位です。\n\nわかる人いる？",
    enabled: true,
  },
  {
    id: "rel-02",
    themeId: "relatable",
    text: "子どもを車に乗せたあと、\nシートのクッキー屑と足裏の砂……\n\n外はきれいなのに中だけ戦場、\nあるあるすぎる。\n\n車内だけのメニューも相談できます。\n同じ悩みの人、どんな対策してます？",
    enabled: true,
  },
  {
    id: "rel-03",
    themeId: "relatable",
    text: "新車で納車された週、\n鳥のフンを1発食らう絶望。\n\n「まだ1週間も経ってないのに」\n\n早めに落とせば跡が残りにくい。\n放置がいちばんの敵。\n\n似た体験した人、どう対処しました？",
    enabled: true,
  },
  {
    id: "rel-04",
    themeId: "relatable",
    text: "駐車場の隣の車、明らかに自分よりきれい。\n\n嫉妬じゃなくて、ちょっと悔しい。\n\n愛車オーナーあるある。\n\n整える頻度を上げるか、\n仕上がりの質を上げるか、\nどっちのルート取ってます？",
    enabled: true,
  },
  {
    id: "rel-05",
    themeId: "relatable",
    text: "洗車、「いつかやろう」が3週間続いた人へ。\n\n気づいたらボディの手触りがザラザラ。\n汚れは固まる前のほうが、落としやすいです。\n\n今どのくらい放置してます？",
    enabled: true,
  },

  // —— process-proof ——
  {
    id: "proc-01",
    themeId: "process-proof",
    text: "出張洗車で最初にやるのは、洗うことじゃない。\n\n①周囲の安全確認\n②塗装の状態チェック\n③どこを重点的に落とすか決める\n\nいきなり水や剤をかけると、\n傷リスクが上がる。\n\n「見る時間」があるかどうかが、\nプロと雑な作業の差です。",
    enabled: true,
  },
  {
    id: "proc-02",
    themeId: "process-proof",
    text: "ホイールはボディより先にやる派です。\n\nブレーキダストは酸性。\n後からボディに飛ぶと、拭き上げで傷の原因に。\n\n黒いホイールほど差が出る。\n細部までやると、車全体が締まって見えます。\n\nホイール、自分では後回しにしてません？",
    enabled: true,
  },
  {
    id: "proc-03",
    themeId: "process-proof",
    text: "窓ガラスは「きれい」より「クリア」が正解。\n\n外窓の砂埃を残したまま拭くと、\n微細な傷がつく。\n\n乾拭き禁止、潤してから一方向。\n\n運転中の視界と、夜のヘッドライトの映り込みが変わります。\n\nガラス、最後に雑に拭いてない？",
    enabled: true,
  },
  {
    id: "proc-04",
    themeId: "process-proof",
    text: "無水洗浄の剤、濃さと滞留時間で結果が変わる。\n\n濃すぎ→拭き残し\n薄すぎ→汚れが落ちない\n\n車の色・汚れの種類・気温で調整。\n\nマニュアル通りだけでは足りないのが、\n現場の洗車です。\n\nDIYで剤を変えて失敗した人いますか？",
    enabled: true,
  },
  {
    id: "proc-05",
    themeId: "process-proof",
    text: "施工後に必ずやること：\n光の当たり方を変えて最終チェック。\n\n正面だけきれいで、\nルーフやリアクォーターに拭き残し、\nよくあります。\n\nオーナーが気づく前に自分で見つける。\nこれが出張でも変わらない品質基準です。",
    enabled: true,
  },

  // —— hot-take ——
  {
    id: "take-01",
    themeId: "hot-take",
    text: "正直、週末の2時間を洗車に使うのは\nもったいないと思う。\n\nその時間で家族と食事するか、\n副業1本入るか、寝るか。\n\n洗車は「好きだからやる」なら最高。\n義務なら外注のほうが合理的。\n\nあなたはどっち派？",
    enabled: true,
  },
  {
    id: "take-02",
    themeId: "hot-take",
    text: "「安い洗車機で十分」は、\n3年以内に売る車には向かないことが多い。\n\n小傷の蓄積は、査定で効く。\n\n5年以上乗るなら別。\nでも黒・濃色は傷が目立つ。\n\nリセール意識ある人、洗車どうしてます？",
    enabled: true,
  },
  {
    id: "take-03",
    themeId: "hot-take",
    text: "月額洗車プラン、\n「縛り」じゃなく「判断疲れの解消」だと思ってます。\n\n毎回「今週やる？来週？」と悩まない。\n常に80点以上の状態が続く。\n\n割引目的じゃなく、\n習慣化目的で選ぶ人が続きやすい。\n\n都度派と月額派、どっち？",
    enabled: true,
  },
  {
    id: "take-04",
    themeId: "hot-take",
    text: "ガレージのある家、羨ましい。\nでもガレージ洗車がいつもきれい、は嘘。\n\n水はあるのに時間がない。\n道具は揃ってるのに乾燥が面倒。\n\n場所より「続く仕組み」のほうが大事。\n\n自宅洗車、続いてます？",
    enabled: true,
  },

  // —— faq-engage ——
  {
    id: "faq-01",
    themeId: "faq-engage",
    text: "Q. 水や電気、こちらで用意する？\nA. 基本は無水洗浄中心なので、水栓がなくてもOKなことが多いです。\n\n場所によっては水を使う場合もあり、\n事前に写真をもらえれば案内できます。\n\n「うちの駐車場大丈夫？」\n写真1枚送ってみてください。",
    enabled: true,
  },
  {
    id: "faq-02",
    themeId: "faq-engage",
    text: "Q. 料金の目安は？\nA. 車のサイズ区分で変わります。\n\n軽〜SUV・輸入車まで対応。\n車種名を送ってもらえれば、\nサイトの料金表ベースで目安を返します。\n\n営業電話はしません。\n車種だけ教えてもらえますか？",
    enabled: true,
  },
  {
    id: "faq-03",
    themeId: "faq-engage",
    text: "Q. 当日いきなりお願いできる？\nA. 完全予約制です。\n\n仕上がりのため、1日の枠を決めてから伺います。\n\n希望が2日あると調整しやすい。\n「来週の土曜か日曜」くらいの情報でも大丈夫。\n\n候補日、いつが空いてます？",
    enabled: true,
  },
  {
    id: "faq-04",
    themeId: "faq-engage",
    text: "Q. 継続プランとビジター、どっちが得？\nA. 月2回以上なら継続のほうが単価は下がります。\n\nでも得かどうかは頻度次第。\n月1で十分な人には無理に勧めません。\n\n走行距離と駐車環境を教えてもらえれば、\n正直にオススメします。月何回くらい洗車してます？",
    enabled: true,
  },
  {
    id: "faq-05",
    themeId: "faq-engage",
    text: "Q. 雨の日は来てくれる？\nA. 小雨なら屋内・屋根付き駐車なら対応することが多いです。\n\n露天で大雨の日は reschedule します。\n\n完全予約制なので、\n天気が怪しいときは前日に相談してもらえると助かります。\n\nうちの駐車場、屋根あります？",
    enabled: true,
  },

  // —— seasonal-tips ——
  {
    id: "sea-01",
    themeId: "seasonal-tips",
    text: "花粉のピーク、ボディが黄色く見えてきたら要注意。\n\n固着前の72時間が勝負。\n世田谷・目黒は特に花粉が乗りやすい。\n\n水だけでは落ちにくい。\n専用の落とし方が必要なことも。\n\nもう花粉で悩んでます？それともまだ大丈夫？",
    enabled: true,
  },
  {
    id: "sea-02",
    themeId: "seasonal-tips",
    text: "梅雨入り前の2週間、いちばん洗車効果が高い。\n\n雨ジミがつく前にリセットすると、\n梅雨の間も「まあまあきれい」が続きやすい。\n\n梅雨明けに一気にやるより、\n入り前の予防のほうが楽。\n\n今年は梅雨前にやる派？明け派？",
    enabled: true,
  },
  {
    id: "sea-03",
    themeId: "seasonal-tips",
    text: "猛暑の車内、50度超える日がある。\n\nダッシュボードのベタつき、\nハンドルの油汚れが加速する季節。\n\n外装だけ整えても、\n乗った瞬間の印象は車内で決まる。\n\n今年の夏、車内ケアもセットでやります？",
    enabled: true,
  },
  {
    id: "sea-04",
    themeId: "seasonal-tips",
    text: "黄砂が来た週、一見きれいでもボディに砂が乗ってる。\n\nこの状態でスポンジ洗いすると、\n細かい傷が一気に増える。\n\nまず埃を逃がす、が鉄則。\n\n黄砂のあと、\n自分で洗った？プロに頼んだ？何もしてない？",
    enabled: true,
  },

  // —— owner-insight ——
  {
    id: "own-01",
    themeId: "owner-insight",
    text: "愛車をきれいに保つコツは、\n「完璧にする」じゃなく「戻らない状態を作る」こと。\n\n月1〜2回のリズムで、\n汚れが固着する前に整える。\n\nイベント前だけ頑張るより、\n平時の80点を続けるほうがラク。\n\n今のリズム、月何回くらい？",
    enabled: true,
  },
  {
    id: "own-02",
    themeId: "owner-insight",
    text: "撥水コートは魔法じゃない。\nでも雨の日の手間は確実に減る。\n\n継続プランだと6ヶ月に1回プロテクトが付く。\n\n水滴が玉になって流れる感覚、\n一度体験すると戻れない人多い。\n\n撥水、やったことあります？",
    enabled: true,
  },
  {
    id: "own-03",
    themeId: "owner-insight",
    text: "「きれいにしてほしい」の裏には、\n傷つけてほしくない、が必ずある。\n\n力任せの洗車はしない。\n塗装の状態を見てから力加減を変える。\n\nそれが出張洗車で一番聞かれる安心の理由です。\n\n傷が怖くて洗車できない、経験あります？",
    enabled: true,
  },
  {
    id: "own-04",
    themeId: "owner-insight",
    text: "SUV・ミニバンは「大きいから汚れない」は嘘。\n\n高さがあるぶん、ルーフと上段に\n花粉・落ち葉・鳥のフンが乗りやすい。\n\n見えない場所ほど放置されがち。\n\nアルファード・ハリアー乗りの人、\nルーフ、最後に見たのいつ？",
    enabled: true,
  },

  // —— follow-value ——
  {
    id: "fol-01",
    themeId: "follow-value",
    text: "このアカウントで出すこと\u{1F447}\n\n・渋谷・世田谷・目黒の出張洗車のリアル\n・洗車の誤解をプロ視点でつぶす\n・保存できるチェックリスト\n・季節ごとの「今やる一手」\n\nフォローしておくと、\n愛車の判断がラクになります。",
    enabled: true,
  },
  {
    id: "fol-02",
    themeId: "follow-value",
    text: "PRIME CAR WASHは完全予約制の出張洗車。\n\n毎日、愛車オーナー向けに\n「明日から使える一手」を1つ投稿します。\n\n売り込みばかりはしません。\n役立つ情報が欲しい人はフォローしてください。\n\n質問はコメントでもLINEでもOKです。",
    enabled: true,
  },
  {
    id: "fol-03",
    themeId: "follow-value",
    text: "1000人の愛車オーナーとつながりたい。\n\n洗車場の待ち時間ゼロ。\n渋谷・世田谷・目黒を中心に、\nあなたの駐車場へ伺います。\n\nフォロー＋質問1つくらいでもらえると、\n次に投稿するネタが増えます。\n\n今の愛車、何乗ってます？",
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
