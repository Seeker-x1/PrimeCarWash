export type CarSize = "M" | "L" | "LL" | "XL";

export interface Vehicle {
  brand: string;
  brandEn?: string;
  model: string;
  modelEn?: string;
  size: CarSize;
}

export const vehicles: Vehicle[] = [
  // ==========================================
  // ポルシェ (PORSCHE)
  // ==========================================
  { brand: "ポルシェ", brandEn: "Porsche", model: "911 カレラ / カレラS / カレラT (992/991/997)", modelEn: "911 Carrera / Carrera S / Carrera T", size: "M" },
  { brand: "ポルシェ", brandEn: "Porsche", model: "911 タルガ (992/991/997)", modelEn: "911 Targa", size: "M" },
  { brand: "ポルシェ", brandEn: "Porsche", model: "911 ターボ / ターボS (992/991/997)", modelEn: "911 Turbo / Turbo S", size: "M" },
  { brand: "ポルシェ", brandEn: "Porsche", model: "911 GT3 / GT3 RS / GT2 RS", modelEn: "911 GT3 / GT3 RS / GT2 RS", size: "M" },
  { brand: "ポルシェ", brandEn: "Porsche", model: "911 ダカール", modelEn: "911 Dakar", size: "M" },
  { brand: "ポルシェ", brandEn: "Porsche", model: "911 空冷モデル (993/964/930/ナロー)", modelEn: "911 Air-Cooled", size: "M" },
  { brand: "ポルシェ", brandEn: "Porsche", model: "718 ケイマン / ケイマンS / ケイマンGTS", modelEn: "718 Cayman / Cayman S / Cayman GTS", size: "M" },
  { brand: "ポルシェ", brandEn: "Porsche", model: "718 ボクスター / ボクスターS / ボクスターGTS", modelEn: "718 Boxster / Boxster S / Boxster GTS", size: "M" },
  { brand: "ポルシェ", brandEn: "Porsche", model: "718 ケイマン GT4 / RS", modelEn: "718 Cayman GT4 / RS", size: "M" },
  { brand: "ポルシェ", brandEn: "Porsche", model: "718 スパイダー / RS スパイダー", modelEn: "718 Spyder / RS Spyder", size: "M" },
  { brand: "ポルシェ", brandEn: "Porsche", model: "981 / 987 ケイマン / ボクスター", modelEn: "981 / 987 Cayman / Boxster", size: "M" },
  { brand: "ポルシェ", brandEn: "Porsche", model: "986 ボクスター", modelEn: "986 Boxster", size: "M" },
  { brand: "ポルシェ", brandEn: "Porsche", model: "マカン / マカンS / マカンGTS / マカンターボ", modelEn: "Macan / Macan S / Macan GTS / Macan Turbo", size: "L" },
  { brand: "ポルシェ", brandEn: "Porsche", model: "マカン EV (電気自動車)", modelEn: "Macan EV", size: "L" },
  { brand: "ポルシェ", brandEn: "Porsche", model: "カイエン / カイエンS / カイエンGTS / カイエンターボ", modelEn: "Cayenne / Cayenne S / Cayenne GTS / Cayenne Turbo", size: "LL" },
  { brand: "ポルシェ", brandEn: "Porsche", model: "カイエン クーペ", modelEn: "Cayenne Coupe", size: "LL" },
  { brand: "ポルシェ", brandEn: "Porsche", model: "カイエン E-ハイブリッド", modelEn: "Cayenne E-Hybrid", size: "LL" },
  { brand: "ポルシェ", brandEn: "Porsche", model: "カイエン ターボGT", modelEn: "Cayenne Turbo GT", size: "LL" },
  { brand: "ポルシェ", brandEn: "Porsche", model: "パナメーラ / パナメーラ4 / パナメーラGTS", modelEn: "Panamera / Panamera 4 / Panamera GTS", size: "L" },
  { brand: "ポルシェ", brandEn: "Porsche", model: "パナメーラ ターボ / ターボS", modelEn: "Panamera Turbo / Turbo S", size: "L" },
  { brand: "ポルシェ", brandEn: "Porsche", model: "パナメーラ スポーツツーリング (ワゴン)", modelEn: "Panamera Sport Turismo", size: "LL" },
  { brand: "ポルシェ", brandEn: "Porsche", model: "パナメーラ エグゼクティブ (ロング)", modelEn: "Panamera Executive", size: "LL" },
  { brand: "ポルシェ", brandEn: "Porsche", model: "タイカン / タイカン4S / タイカンターボ (電気自動車)", modelEn: "Taycan / Taycan 4S / Taycan Turbo", size: "L" },
  { brand: "ポルシェ", brandEn: "Porsche", model: "タイカン クロスツーリング / スポーツツーリング", modelEn: "Taycan Cross Turismo / Sport Turismo", size: "LL" },
  { brand: "ポルシェ", brandEn: "Porsche", model: "カレラGT / 918 スパイダー", modelEn: "Carrera GT / 918 Spyder", size: "L" },
  { brand: "ポルシェ", brandEn: "Porsche", model: "356 / 914 / 924 / 944 / 968", modelEn: "356 / 914 / 924 / 944 / 968", size: "M" },
  { brand: "ポルシェ", brandEn: "Porsche", model: "928", modelEn: "928", size: "L" },

  // ==========================================
  // ランドローバー (LAND ROVER)
  // ==========================================
  { brand: "ランドローバー", brandEn: "Land Rover", model: "レンジローバー (標準ボディ / LWB)", modelEn: "Range Rover (SWB / LWB)", size: "XL" },
  { brand: "ランドローバー", brandEn: "Land Rover", model: "レンジローバー スポーツ", modelEn: "Range Rover Sport", size: "LL" },
  { brand: "ランドローバー", brandEn: "Land Rover", model: "レンジローバー ヴェラール", modelEn: "Range Rover Velar", size: "LL" },
  { brand: "ランドローバー", brandEn: "Land Rover", model: "レンジローバー イヴォーク", modelEn: "Range Rover Evoque", size: "L" },
  { brand: "ランドローバー", brandEn: "Land Rover", model: "クラシック レンジローバー (初代/2代目)", modelEn: "Classic Range Rover", size: "LL" },
  { brand: "ランドローバー", brandEn: "Land Rover", model: "ディフェンダー 90 (現行L663 / 旧型)", modelEn: "Defender 90", size: "LL" },
  { brand: "ランドローバー", brandEn: "Land Rover", model: "ディフェンダー 110 (現行L663 / 旧型)", modelEn: "Defender 110", size: "LL" },
  { brand: "ランドローバー", brandEn: "Land Rover", model: "ディフェンダー 130 (現行L663 / 旧型)", modelEn: "Defender 130", size: "XL" },
  { brand: "ランドローバー", brandEn: "Land Rover", model: "ディスカバリー (1〜5代目)", modelEn: "Discovery", size: "LL" },
  { brand: "ランドローバー", brandEn: "Land Rover", model: "ディスカバリー スポーツ", modelEn: "Discovery Sport", size: "L" },
  { brand: "ランドローバー", brandEn: "Land Rover", model: "フリーランダー (1/2)", modelEn: "Freelander", size: "L" },

  // ==========================================
  // ボルボ (VOLVO)
  // ==========================================
  { brand: "ボルボ", brandEn: "Volvo", model: "XC90", modelEn: "XC90", size: "LL" },
  { brand: "ボルボ", brandEn: "Volvo", model: "XC60", modelEn: "XC60", size: "L" },
  { brand: "ボルボ", brandEn: "Volvo", model: "XC40 / C40", modelEn: "XC40 / C40", size: "M" },
  { brand: "ボルボ", brandEn: "Volvo", model: "V90 / V90 クロスカントリー", modelEn: "V90 / V90 Cross Country", size: "LL" },
  { brand: "ボルボ", brandEn: "Volvo", model: "V60 / V60 クロスカントリー", modelEn: "V60 / V60 Cross Country", size: "L" },
  { brand: "ボルボ", brandEn: "Volvo", model: "V40", modelEn: "V40", size: "M" },

  // ==========================================
  // ジープ (Jeep)
  // ==========================================
  { brand: "ジープ", brandEn: "Jeep", model: "ラングラー アンリミテッド (4ドア)", modelEn: "Wrangler Unlimited (4-Door)", size: "LL" },
  { brand: "ジープ", brandEn: "Jeep", model: "ラングラー (2ドア)", modelEn: "Wrangler (2-Door)", size: "L" },
  { brand: "ジープ", brandEn: "Jeep", model: "グランドチェロキー", modelEn: "Grand Cherokee", size: "LL" },
  { brand: "ジープ", brandEn: "Jeep", model: "チェロキー / コンパス / レネゲード", modelEn: "Cherokee / Compass / Renegade", size: "M" },
  { brand: "ジープ", brandEn: "Jeep", model: "グラディエーター", modelEn: "Gladiator", size: "XL" },

  // ==========================================
  // フォルクスワーゲン (VW) & MINI
  // ==========================================
  { brand: "フォルクスワーゲン", brandEn: "Volkswagen", model: "ゴルフ / ポロ / ビートル", modelEn: "Golf / Polo / Beetle", size: "M" },
  { brand: "フォルクスワーゲン", brandEn: "Volkswagen", model: "ゴルフ ヴァリアント", modelEn: "Golf Variant", size: "M" },
  { brand: "フォルクスワーゲン", brandEn: "Volkswagen", model: "パサート (セダン/ヴァリアント)", modelEn: "Passat", size: "L" },
  { brand: "フォルクスワーゲン", brandEn: "Volkswagen", model: "ティグアン / T-Roc / T-Cross", modelEn: "Tiguan / T-Roc / T-Cross", size: "M" },
  { brand: "フォルクスワーゲン", brandEn: "Volkswagen", model: "トゥアレグ", modelEn: "Touareg", size: "LL" },
  { brand: "MINI", brandEn: "MINI", model: "MINI 3ドア / 5ドア / コンバーチブル", modelEn: "MINI 3-Door / 5-Door / Convertible", size: "M" },
  { brand: "MINI", brandEn: "MINI", model: "MINI クラブマン", modelEn: "MINI Clubman", size: "M" },
  { brand: "MINI", brandEn: "MINI", model: "MINI クロスオーバー", modelEn: "MINI Crossover", size: "L" },

  // ==========================================
  // BMW / アウディ / テスラ 他
  // ==========================================
  { brand: "BMW", brandEn: "BMW", model: "1シリーズ / 2シリーズ", modelEn: "1 Series / 2 Series", size: "M" },
  { brand: "BMW", brandEn: "BMW", model: "3シリーズ / 4シリーズ / Z4", modelEn: "3 Series / 4 Series / Z4", size: "M" },
  { brand: "BMW", brandEn: "BMW", model: "5シリーズ / 6シリーズ", modelEn: "5 Series / 6 Series", size: "L" },
  { brand: "BMW", brandEn: "BMW", model: "7シリーズ / 8シリーズ", modelEn: "7 Series / 8 Series", size: "LL" },
  { brand: "BMW", brandEn: "BMW", model: "X1 / X2", modelEn: "X1 / X2", size: "M" },
  { brand: "BMW", brandEn: "BMW", model: "X3 / X4", modelEn: "X3 / X4", size: "L" },
  { brand: "BMW", brandEn: "BMW", model: "X5 / X6", modelEn: "X5 / X6", size: "LL" },
  { brand: "BMW", brandEn: "BMW", model: "X7 / XM", modelEn: "X7 / XM", size: "XL" },
  { brand: "アウディ", brandEn: "Audi", model: "A1 / A3", modelEn: "A1 / A3", size: "M" },
  { brand: "アウディ", brandEn: "Audi", model: "A4 / A5 / TT", modelEn: "A4 / A5 / TT", size: "M" },
  { brand: "アウディ", brandEn: "Audi", model: "A6 / A7", modelEn: "A6 / A7", size: "L" },
  { brand: "アウディ", brandEn: "Audi", model: "A8", modelEn: "A8", size: "LL" },
  { brand: "アウディ", brandEn: "Audi", model: "Q2 / Q3", modelEn: "Q2 / Q3", size: "M" },
  { brand: "アウディ", brandEn: "Audi", model: "Q5 / e-tron", modelEn: "Q5 / e-tron", size: "L" },
  { brand: "アウディ", brandEn: "Audi", model: "Q7 / Q8", modelEn: "Q7 / Q8", size: "LL" },
  { brand: "アウディ", brandEn: "Audi", model: "R8", modelEn: "R8", size: "M" },
  { brand: "テスラ", brandEn: "Tesla", model: "モデル3", modelEn: "Model 3", size: "M" },
  { brand: "テスラ", brandEn: "Tesla", model: "モデルY / モデルS", modelEn: "Model Y / Model S", size: "L" },
  { brand: "テスラ", brandEn: "Tesla", model: "モデルX / サイバートラック", modelEn: "Model X / Cybertruck", size: "LL" },

  // ==========================================
  // フェラーリ / アストンマーティン / マセラティ / 他スーパーカー
  // ==========================================
  { brand: "フェラーリ", brandEn: "Ferrari", model: "プロサングエ", modelEn: "Purosangue", size: "LL" },
  { brand: "フェラーリ", brandEn: "Ferrari", model: "ローマ / ポルトフィーノ", modelEn: "Roma / Portofino", size: "L" },
  { brand: "フェラーリ", brandEn: "Ferrari", model: "SF90 / 296 GTB", modelEn: "SF90 / 296 GTB", size: "L" },
  { brand: "フェラーリ", brandEn: "Ferrari", model: "F8 / 488 / 458 / 430", modelEn: "F8 / 488 / 458 / 430", size: "M" },
  { brand: "フェラーリ", brandEn: "Ferrari", model: "812 / F12 / 599", modelEn: "812 / F12 / 599", size: "L" },
  { brand: "アストンマーティン", brandEn: "Aston Martin", model: "DBX", modelEn: "DBX", size: "LL" },
  { brand: "アストンマーティン", brandEn: "Aston Martin", model: "DB11 / DB12 / ヴァンテージ / DBS", modelEn: "DB11 / DB12 / Vantage / DBS", size: "L" },
  { brand: "マセラティ", brandEn: "Maserati", model: "レヴァンテ / グレカーレ", modelEn: "Levante / Grecale", size: "LL" },
  { brand: "マセラティ", brandEn: "Maserati", model: "クアトロポルテ", modelEn: "Quattroporte", size: "LL" },
  { brand: "マセラティ", brandEn: "Maserati", model: "ギブリ / MC20 / グラントゥーリズモ", modelEn: "Ghibli / MC20 / GranTurismo", size: "L" },
  { brand: "ジャガー", brandEn: "Jaguar", model: "F-PACE", modelEn: "F-PACE", size: "LL" },
  { brand: "ジャガー", brandEn: "Jaguar", model: "E-PACE", modelEn: "E-PACE", size: "L" },
  { brand: "ジャガー", brandEn: "Jaguar", model: "XJ", modelEn: "XJ", size: "LL" },
  { brand: "ジャガー", brandEn: "Jaguar", model: "XF / XE / F-TYPE", modelEn: "XF / XE / F-TYPE", size: "L" },
  { brand: "マクラーレン", brandEn: "McLaren", model: "750S / 720S / 600LT / GT / アルトゥーラ", modelEn: "750S / 720S / 600LT / GT / Artura", size: "M" },
  { brand: "ランボルギーニ", brandEn: "Lamborghini", model: "ウルス", modelEn: "Urus", size: "XL" },
  { brand: "ランボルギーニ", brandEn: "Lamborghini", model: "アヴェンタドール / ウラカン / レヴエルト", modelEn: "Aventador / Huracan / Revuelto", size: "L" },
  { brand: "ベントレー", brandEn: "Bentley", model: "ベンテイガ / フライングスパー / ミュルザンヌ", modelEn: "Bentayga / Flying Spur / Mulsanne", size: "XL" },
  { brand: "ベントレー", brandEn: "Bentley", model: "コンチネンタルGT", modelEn: "Continental GT", size: "LL" },
  { brand: "ロールスロイス", brandEn: "Rolls-Royce", model: "カリナン / ゴースト / ファントム", modelEn: "Cullinan / Ghost / Phantom", size: "XL" },
  { brand: "ロールスロイス", brandEn: "Rolls-Royce", model: "レイス / ドーン", modelEn: "Wraith / Dawn", size: "LL" },
  { brand: "アルファロメオ", brandEn: "Alfa Romeo", model: "ステルヴィオ", modelEn: "Stelvio", size: "L" },
  { brand: "アルファロメオ", brandEn: "Alfa Romeo", model: "ジュリア", modelEn: "Giulia", size: "M" },
  { brand: "キャデラック", brandEn: "Cadillac", model: "エスカレード", modelEn: "Escalade", size: "XL" },
];

