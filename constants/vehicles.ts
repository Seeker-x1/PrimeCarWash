// プレミアム出張洗車用 車種データベース（日産・トヨタ大幅強化版）
// サイズ基準: M (1.0x), L (1.2x), LL (1.4x), XL (1.8x)

export type CarSize = 'M' | 'L' | 'LL' | 'XL';

export interface Vehicle {
  brand: string;
  model: string;
  size: CarSize;
}

export const vehicles: Vehicle[] = [
  // ==========================================
  // トヨタ (TOYOTA) - 35車種以上
  // ==========================================
  { brand: "トヨタ", model: "ハイラックス (GUN125等)", size: "LL" },
  { brand: "トヨタ", model: "ランドクルーザー 300 / 200 / 100", size: "XL" },
  { brand: "トヨタ", model: "ランドクルーザー 250 / 70", size: "LL" },
  { brand: "トヨタ", model: "ランドクルーザー プラド", size: "LL" },
  { brand: "トヨタ", model: "センチュリー / センチュリーSUV", size: "XL" },
  { brand: "トヨタ", model: "アルファード", size: "LL" },
  { brand: "トヨタ", model: "ヴェルファイア", size: "LL" },
  { brand: "トヨタ", model: "グランエース", size: "XL" },
  { brand: "トヨタ", model: "ハイエース (ワイド/スーパーロング/ハイルーフ)", size: "XL" },
  { brand: "トヨタ", model: "ハイエース (標準ボディ)", size: "LL" },
  { brand: "トヨタ", model: "タンドラ / セコイア (逆輸入車)", size: "XL" },
  { brand: "トヨタ", model: "シエナ (逆輸入車)", size: "LL" },
  { brand: "トヨタ", model: "ハリアー", size: "L" },
  { brand: "トヨタ", model: "RAV4 / ヴァンガード", size: "L" },
  { brand: "トヨタ", model: "クラウン (クロスオーバー/スポーツ/セダン/エステート)", size: "L" },
  { brand: "トヨタ", model: "クラウン マジェスタ", size: "LL" },
  { brand: "トヨタ", model: "カムリ", size: "L" },
  { brand: "トヨタ", model: "マークX / マークII / チェイサー / クレスタ", size: "L" },
  { brand: "トヨタ", model: "セルシオ / アリスト", size: "LL" },
  { brand: "トヨタ", model: "ソアラ", size: "L" },
  { brand: "トヨタ", model: "ノア / ヴォクシー / エスクァイア", size: "L" },
  { brand: "トヨタ", model: "エスティマ", size: "L" },
  { brand: "トヨタ", model: "プリウス / プリウスPHV / プリウスα", size: "M" },
  { brand: "トヨタ", model: "カローラ / カローラアクシオ", size: "M" },
  { brand: "トヨタ", model: "カローラツーリング / カローラフィールダー", size: "M" },
  { brand: "トヨタ", model: "カローラスポーツ / GRカローラ", size: "M" },
  { brand: "トヨタ", model: "カローラクロス", size: "M" },
  { brand: "トヨタ", model: "ヤリス / ヤリスクロス", size: "M" },
  { brand: "トヨタ", model: "アクア", size: "M" },
  { brand: "トヨタ", model: "C-HR", size: "M" },
  { brand: "トヨタ", model: "ライズ / ラッシュ", size: "M" },
  { brand: "トヨタ", model: "シエンタ", size: "M" },
  { brand: "トヨタ", model: "ルーミー / タンク", size: "M" },
  { brand: "トヨタ", model: "GR86 / 86", size: "M" },
  { brand: "トヨタ", model: "スープラ (DB / A80)", size: "M" },
  { brand: "トヨタ", model: "MIRAI", size: "L" },
  { brand: "トヨタ", model: "FJクルーザー", size: "LL" },

  // ==========================================
  // 日産 (NISSAN) - 30車種以上
  // ==========================================
  { brand: "日産", model: "フェアレディZ (RZ34 / Z34 / Z33 / S30等)", size: "M" },
  { brand: "日産", model: "GT-R (R35 / R34 / R33 / R32)", size: "M" },
  { brand: "日産", model: "スカイライン (V37 / V36 / V35)", size: "L" },
  { brand: "日産", model: "スカイライン GT-R", size: "M" },
  { brand: "日産", model: "シルビア / 180SX", size: "M" },
  { brand: "日産", model: "フーガ / シーマ", size: "L" },
  { brand: "日産", model: "プレジデント", size: "LL" },
  { brand: "日産", model: "ティアナ", size: "L" },
  { brand: "日産", model: "セドリック / グロリア / レパード", size: "L" },
  { brand: "日産", model: "ノート / オーラ / ノートNISMO", size: "M" },
  { brand: "日産", model: "サクラ / デイズ / ルークス", size: "M" },
  { brand: "日産", model: "マーチ / キューブ", size: "M" },
  { brand: "日産", model: "リーフ", size: "M" },
  { brand: "日産", model: "アリア (ARIYA)", size: "L" },
  { brand: "日産", model: "エクストレイル", size: "L" },
  { brand: "日産", model: "キックス", size: "M" },
  { brand: "日産", model: "ジューク", size: "M" },
  { brand: "日産", model: "デュアリス", size: "L" },
  { brand: "日産", model: "ムラーノ", size: "LL" },
  { brand: "日産", model: "サファリ", size: "XL" },
  { brand: "日産", model: "テラノ", size: "LL" },
  { brand: "日産", model: "スカイラインクロスオーバー", size: "L" },
  { brand: "日産", model: "セレナ", size: "L" },
  { brand: "日産", model: "エルグランド", size: "LL" },
  { brand: "日産", model: "キャラバン (NV350)", size: "LL" },
  { brand: "日産", model: "バネット / セレナカーゴ", size: "L" },
  { brand: "日産", model: "ブルーバード / プリメーラ", size: "M" },

  // ==========================================
  // レクサス (LEXUS) - 全ラインナップ
  // ==========================================
  { brand: "レクサス", model: "LS", size: "LL" },
  { brand: "レクサス", model: "GS", size: "L" },
  { brand: "レクサス", model: "ES", size: "L" },
  { brand: "レクサス", model: "IS", size: "L" },
  { brand: "レクサス", model: "HS / CT", size: "M" },
  { brand: "レクサス", model: "LC / SC", size: "L" },
  { brand: "レクサス", model: "RC / RC F", size: "L" },
  { brand: "レクサス", model: "LX", size: "XL" },
  { brand: "レクサス", model: "RX / RZ / GX", size: "LL" },
  { brand: "レクサス", model: "NX / UX / LBX", size: "L" },
  { brand: "レクサス", model: "LM", size: "XL" },

  // ==========================================
  // メルセデス・ベンツ (Mercedes-Benz) - 25車種以上
  // ==========================================
  { brand: "メルセデス・ベンツ", model: "Gクラス (ゲレンデ)", size: "XL" },
  { brand: "メルセデス・ベンツ", model: "GLS / GL", size: "XL" },
  { brand: "メルセデス・ベンツ", model: "GLE / Mクラス", size: "LL" },
  { brand: "メルセデス・ベンツ", model: "Sクラス / マイバッハ", size: "LL" },
  { brand: "メルセデス・ベンツ", model: "Eクラス (セダン/ワゴン)", size: "L" },
  { brand: "メルセデス・ベンツ", model: "Cクラス (セダン/ワゴン)", size: "L" },
  { brand: "メルセデス・ベンツ", model: "CLA / CLS", size: "L" },
  { brand: "メルセデス・ベンツ", model: "GLC / GLK", size: "L" },
  { brand: "メルセデス・ベンツ", model: "GLB / GLA", size: "L" },
  { brand: "メルセデス・ベンツ", model: "Aクラス / Bクラス", size: "M" },
  { brand: "メルセデス・ベンツ", model: "Vクラス", size: "LL" },
  { brand: "メルセデス・ベンツ", model: "SL / SLC / SLK", size: "L" },
  { brand: "メルセデス・ベンツ", model: "AMG GT (2ドア/4ドア)", size: "L" },
  { brand: "メルセデス・ベンツ", model: "EQS / EQE (SUV含む)", size: "LL" },
  { brand: "メルセデス・ベンツ", model: "EQC / EQB / EQA", size: "L" },

  // 補完: 既存ハイエンド輸入車
  { brand: "ランドローバー", model: "レンジローバー イヴォーク", size: "L" },
  { brand: "ランドローバー", model: "レンジローバー", size: "XL" },
  { brand: "ランドローバー", model: "ディフェンダー 90/110", size: "LL" },
  { brand: "ランドローバー", model: "ディフェンダー 130", size: "XL" },
  { brand: "ポルシェ", model: "パナメーラ", size: "L" },
  { brand: "キャデラック", model: "エスカレード", size: "XL" },
  { brand: "ランボルギーニ", model: "ウルス", size: "XL" },
  { brand: "ベントレー", model: "ベンテイガ / フライングスパー", size: "XL" },
  { brand: "ロールスロイス", model: "カリナン / ゴースト", size: "XL" }
];
