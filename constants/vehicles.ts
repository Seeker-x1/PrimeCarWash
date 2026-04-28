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
  // トヨタ (TOYOTA)
  // ==========================================
  { brand: "トヨタ", brandEn: "Toyota", model: "ハイラックス (GUN125等)", modelEn: "Hilux", size: "LL" },
  { brand: "トヨタ", brandEn: "Toyota", model: "ランドクルーザー 300 / 200 / 100", modelEn: "Land Cruiser 300 / 200 / 100", size: "XL" },
  { brand: "トヨタ", brandEn: "Toyota", model: "ランドクルーザー 250 / 70", modelEn: "Land Cruiser 250 / 70", size: "LL" },
  { brand: "トヨタ", brandEn: "Toyota", model: "ランドクルーザー プラド", modelEn: "Land Cruiser Prado", size: "LL" },
  { brand: "トヨタ", brandEn: "Toyota", model: "アルファード / ヴェルファイア", modelEn: "Alphard / Vellfire", size: "LL" },
  { brand: "トヨタ", brandEn: "Toyota", model: "ハリアー / RAV4", modelEn: "Harrier / RAV4", size: "L" },
  { brand: "トヨタ", brandEn: "Toyota", model: "プリウス / プリウスPHV / プリウスα", modelEn: "Prius / Prius PHV / Prius Alpha", size: "M" },
  { brand: "トヨタ", brandEn: "Toyota", model: "クラウン (クロスオーバー / スポーツ / セダン / エステート)", modelEn: "Crown", size: "L" },
  { brand: "トヨタ", brandEn: "Toyota", model: "カローラ / カローラツーリング / カローラクロス", modelEn: "Corolla / Corolla Touring / Corolla Cross", size: "M" },
  { brand: "トヨタ", brandEn: "Toyota", model: "ヤリス / ヤリスクロス / アクア", modelEn: "Yaris / Yaris Cross / Aqua", size: "M" },

  // ==========================================
  // 日産 (NISSAN)
  // ==========================================
  { brand: "日産", brandEn: "Nissan", model: "フェアレディZ (RZ34 / Z34 / Z33 / S30等)", modelEn: "Fairlady Z", size: "M" },
  { brand: "日産", brandEn: "Nissan", model: "GT-R (R35 / R34 / R33 / R32)", modelEn: "GT-R", size: "M" },
  { brand: "日産", brandEn: "Nissan", model: "スカイライン (V37 / V36 / V35)", modelEn: "Skyline", size: "L" },
  { brand: "日産", brandEn: "Nissan", model: "ノート / オーラ / リーフ", modelEn: "Note / Aura / Leaf", size: "M" },
  { brand: "日産", brandEn: "Nissan", model: "アリア", modelEn: "Ariya", size: "L" },
  { brand: "日産", brandEn: "Nissan", model: "エクストレイル / キックス / ジューク", modelEn: "X-Trail / Kicks / Juke", size: "L" },
  { brand: "日産", brandEn: "Nissan", model: "セレナ / エルグランド", modelEn: "Serena / Elgrand", size: "LL" },
  { brand: "日産", brandEn: "Nissan", model: "キャラバン (NV350)", modelEn: "Caravan (NV350)", size: "LL" },

  // ==========================================
  // ホンダ (HONDA)
  // ==========================================
  { brand: "ホンダ", brandEn: "Honda", model: "N-BOX / N-WGN / N-ONE", modelEn: "N-BOX / N-WGN / N-ONE", size: "M" },
  { brand: "ホンダ", brandEn: "Honda", model: "フィット / シビック", modelEn: "Fit / Civic", size: "M" },
  { brand: "ホンダ", brandEn: "Honda", model: "アコード", modelEn: "Accord", size: "L" },
  { brand: "ホンダ", brandEn: "Honda", model: "ヴェゼル / ZR-V", modelEn: "Vezel / ZR-V", size: "L" },
  { brand: "ホンダ", brandEn: "Honda", model: "CR-V", modelEn: "CR-V", size: "LL" },
  { brand: "ホンダ", brandEn: "Honda", model: "ステップワゴン / オデッセイ", modelEn: "Stepwgn / Odyssey", size: "LL" },

  // ==========================================
  // レクサス (LEXUS)
  // ==========================================
  { brand: "レクサス", brandEn: "Lexus", model: "LS / RX / RZ / GX", modelEn: "LS / RX / RZ / GX", size: "LL" },
  { brand: "レクサス", brandEn: "Lexus", model: "IS / ES / LC / RC", modelEn: "IS / ES / LC / RC", size: "L" },
  { brand: "レクサス", brandEn: "Lexus", model: "NX / UX / LBX", modelEn: "NX / UX / LBX", size: "L" },
  { brand: "レクサス", brandEn: "Lexus", model: "LX / LM", modelEn: "LX / LM", size: "XL" },

  // ==========================================
  // メルセデス・ベンツ (MERCEDES-BENZ)
  // ==========================================
  { brand: "メルセデス・ベンツ", brandEn: "Mercedes-Benz", model: "Aクラス / Bクラス", modelEn: "A-Class / B-Class", size: "M" },
  { brand: "メルセデス・ベンツ", brandEn: "Mercedes-Benz", model: "Cクラス / Eクラス", modelEn: "C-Class / E-Class", size: "L" },
  { brand: "メルセデス・ベンツ", brandEn: "Mercedes-Benz", model: "Sクラス / マイバッハ", modelEn: "S-Class / Maybach", size: "LL" },
  { brand: "メルセデス・ベンツ", brandEn: "Mercedes-Benz", model: "GLC / GLE", modelEn: "GLC / GLE", size: "LL" },
  { brand: "メルセデス・ベンツ", brandEn: "Mercedes-Benz", model: "GLS / Gクラス", modelEn: "GLS / G-Class", size: "XL" },
  { brand: "メルセデス・ベンツ", brandEn: "Mercedes-Benz", model: "Vクラス", modelEn: "V-Class", size: "LL" },

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
  { brand: "テスラ", brandEn: "Tesla", model: "モデルX", modelEn: "Model X", size: "LL" },
  { brand: "テスラ", brandEn: "Tesla", model: "サイバートラック", modelEn: "Cybertruck", size: "XL" },

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

  // ==========================================
  // シボレー / フォード (Chevrolet / Ford)
  // ==========================================
  { brand: "シボレー", brandEn: "Chevrolet", model: "コルベット", modelEn: "Corvette", size: "L" },
  { brand: "シボレー", brandEn: "Chevrolet", model: "カマロ", modelEn: "Camaro", size: "L" },
  { brand: "フォード", brandEn: "Ford", model: "ブロンコ", modelEn: "Bronco", size: "LL" },
  { brand: "フォード", brandEn: "Ford", model: "マスタング", modelEn: "Mustang", size: "L" },
  { brand: "フォード", brandEn: "Ford", model: "エクスプローラー", modelEn: "Explorer", size: "LL" },

  // ==========================================
  // フィアット / アバルト / ロータス (Fiat / Abarth / Lotus)
  // ==========================================
  { brand: "フィアット", brandEn: "Fiat", model: "500 (チンクエチェント) / パンダ", modelEn: "500 / Panda", size: "M" },
  { brand: "アバルト", brandEn: "Abarth", model: "595 / 695 / 124スパイダー", modelEn: "595 / 695 / 124 Spider", size: "M" },
  { brand: "ロータス", brandEn: "Lotus", model: "エリーゼ / エキシージ", modelEn: "Elise / Exige", size: "M" },
  { brand: "ロータス", brandEn: "Lotus", model: "エミーラ / エヴォーラ", modelEn: "Emira / Evora", size: "M" },
  { brand: "アルピーヌ", brandEn: "Alpine", model: "A110 / A110S / A110R", modelEn: "A110 / A110S / A110R", size: "M" },
  { brand: "アルピーヌ", brandEn: "Alpine", model: "A290 (EV)", modelEn: "A290 (EV)", size: "M" },

  // ==========================================
  // 既存ブランドの補完 (EV・セダンなど)
  // ==========================================
  { brand: "BMW", brandEn: "BMW", model: "iX / iX3 (電気自動車)", modelEn: "iX / iX3", size: "LL" },
  { brand: "BMW", brandEn: "BMW", model: "i4 / i5 / i7 (電気自動車)", modelEn: "i4 / i5 / i7", size: "L" },
  { brand: "アウディ", brandEn: "Audi", model: "e-tron GT / RS e-tron GT", modelEn: "e-tron GT / RS e-tron GT", size: "L" },
  { brand: "ボルボ", brandEn: "Volvo", model: "S90", modelEn: "S90", size: "L" },
  { brand: "ボルボ", brandEn: "Volvo", model: "S60", modelEn: "S60", size: "M" },
  { brand: "アルファロメオ", brandEn: "Alfa Romeo", model: "トナーレ", modelEn: "Tonale", size: "M" },

  // ==========================================
  // 復元: 国産・輸入車の詳細モデル
  // ==========================================
  { brand: "トヨタ", brandEn: "Toyota", model: "C-HR", modelEn: "C-HR", size: "M" },
  { brand: "トヨタ", brandEn: "Toyota", model: "ライズ / ラッシュ", modelEn: "Raize / Rush", size: "M" },
  { brand: "トヨタ", brandEn: "Toyota", model: "シエンタ", modelEn: "Sienta", size: "M" },
  { brand: "トヨタ", brandEn: "Toyota", model: "ルーミー / タンク", modelEn: "Roomy / Tank", size: "M" },
  { brand: "トヨタ", brandEn: "Toyota", model: "カローラアクシオ", modelEn: "Corolla Axio", size: "M" },
  { brand: "トヨタ", brandEn: "Toyota", model: "カローラフィールダー", modelEn: "Corolla Fielder", size: "M" },
  { brand: "トヨタ", brandEn: "Toyota", model: "カローラスポーツ / GRカローラ", modelEn: "Corolla Sport / GR Corolla", size: "M" },
  { brand: "トヨタ", brandEn: "Toyota", model: "GR86 / 86", modelEn: "GR86 / 86", size: "M" },
  { brand: "トヨタ", brandEn: "Toyota", model: "スープラ (DB / A80)", modelEn: "Supra (DB / A80)", size: "M" },
  { brand: "トヨタ", brandEn: "Toyota", model: "MIRAI", modelEn: "MIRAI", size: "L" },
  { brand: "トヨタ", brandEn: "Toyota", model: "FJクルーザー", modelEn: "FJ Cruiser", size: "LL" },
  { brand: "トヨタ", brandEn: "Toyota", model: "ノア / ヴォクシー / エスクァイア", modelEn: "Noah / Voxy / Esquire", size: "L" },
  { brand: "トヨタ", brandEn: "Toyota", model: "エスティマ", modelEn: "Estima", size: "L" },
  { brand: "トヨタ", brandEn: "Toyota", model: "カムリ", modelEn: "Camry", size: "L" },
  { brand: "トヨタ", brandEn: "Toyota", model: "マークX / マークII / チェイサー / クレスタ", modelEn: "Mark X / Mark II / Chaser / Cresta", size: "L" },
  { brand: "トヨタ", brandEn: "Toyota", model: "セルシオ / アリスト", modelEn: "Celsior / Aristo", size: "LL" },
  { brand: "トヨタ", brandEn: "Toyota", model: "グランエース", modelEn: "GranAce", size: "XL" },
  { brand: "トヨタ", brandEn: "Toyota", model: "ハイエース (標準ボディ)", modelEn: "HiAce Standard Body", size: "LL" },
  { brand: "トヨタ", brandEn: "Toyota", model: "ハイエース (ワイド/スーパーロング/ハイルーフ)", modelEn: "HiAce Wide / Super Long / High Roof", size: "XL" },
  { brand: "日産", brandEn: "Nissan", model: "シルビア / 180SX", modelEn: "Silvia / 180SX", size: "M" },
  { brand: "日産", brandEn: "Nissan", model: "スカイライン GT-R", modelEn: "Skyline GT-R", size: "M" },
  { brand: "日産", brandEn: "Nissan", model: "サクラ / デイズ / ルークス", modelEn: "Sakura / Dayz / Roox", size: "M" },
  { brand: "日産", brandEn: "Nissan", model: "マーチ / キューブ", modelEn: "March / Cube", size: "M" },
  { brand: "日産", brandEn: "Nissan", model: "ブルーバード / プリメーラ", modelEn: "Bluebird / Primera", size: "M" },
  { brand: "日産", brandEn: "Nissan", model: "フーガ / シーマ", modelEn: "Fuga / Cima", size: "L" },
  { brand: "日産", brandEn: "Nissan", model: "ムラーノ", modelEn: "Murano", size: "LL" },
  { brand: "日産", brandEn: "Nissan", model: "サファリ", modelEn: "Safari", size: "XL" },
  { brand: "日産", brandEn: "Nissan", model: "テラノ", modelEn: "Terrano", size: "LL" },
  { brand: "レクサス", brandEn: "Lexus", model: "GS", modelEn: "GS", size: "L" },
  { brand: "レクサス", brandEn: "Lexus", model: "HS / CT", modelEn: "HS / CT", size: "M" },
  { brand: "レクサス", brandEn: "Lexus", model: "RC / RC F", modelEn: "RC / RC F", size: "L" },
  { brand: "メルセデス・ベンツ", brandEn: "Mercedes-Benz", model: "CLA / CLS", modelEn: "CLA / CLS", size: "L" },
  { brand: "メルセデス・ベンツ", brandEn: "Mercedes-Benz", model: "GLB / GLA", modelEn: "GLB / GLA", size: "L" },
  { brand: "メルセデス・ベンツ", brandEn: "Mercedes-Benz", model: "SL / SLC / SLK", modelEn: "SL / SLC / SLK", size: "L" },
  { brand: "メルセデス・ベンツ", brandEn: "Mercedes-Benz", model: "AMG GT (2ドア/4ドア)", modelEn: "AMG GT", size: "L" },
  { brand: "メルセデス・ベンツ", brandEn: "Mercedes-Benz", model: "EQC / EQB / EQA", modelEn: "EQC / EQB / EQA", size: "L" },
  { brand: "メルセデス・ベンツ", brandEn: "Mercedes-Benz", model: "EQS / EQE (SUV含む)", modelEn: "EQS / EQE", size: "LL" },
];

