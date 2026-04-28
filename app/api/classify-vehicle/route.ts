import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { vehicles, type CarSize } from "@/constants/vehicles";

const MODEL_NAME = "gemini-1.5-flash";
const SIZE_VALUES = new Set(["M", "L", "LL", "XL"]);
const MAX_CAR_NAME_LENGTH = 80;
const GEMINI_TIMEOUT_MS = 8000;
const SIZE_GUIDE = `
M: 標準/コンパクト/スポーツ。例: プリウス, フィット, 911, 718, Golf, Model 3
L: 中型SUV/大型セダン/幅広スポーツ。例: ハリアー, RAV4, Macan, Panamera, Corvette, Mustang, Model Y
LL: 大型SUV/ミニバン/大型EV。例: アルファード, Defender 90/110, Cayenne, Range Rover Sport, Wrangler Unlimited, Model X
XL: 超大型SUV/スーパーロング/大型ピックアップ。例: Land Cruiser 300, Gクラス, Defender 130, Range Rover LWB, Escalade, Urus, Cybertruck
`.trim();
const REFERENCE_VEHICLES = buildReferenceVehicles();

type VehicleClassification = {
  size: CarSize;
  source: "local" | "ai" | "heuristic";
  matchedVehicle?: string;
};
type HeuristicRule = { size: CarSize; patterns: string[] };

function normalizeSearchText(value: string) {
  return value
    .normalize("NFKC")
    .toLowerCase()
    .replace(/[‐‑‒–—―ー\-_\s/／・,、.。()（）]/g, "");
}

function buildVehicleSearchText(vehicle: (typeof vehicles)[number]) {
  return [
    vehicle.brand,
    vehicle.model,
    vehicle.brandEn ?? "",
    vehicle.modelEn ?? "",
  ]
    .join(" ")
    .normalize("NFKC")
    .toLowerCase();
}

function findLocalVehicle(carName: string): VehicleClassification | null {
  const query = normalizeSearchText(carName);
  if (query.length < 2) return null;

  const matches = vehicles
    .map((vehicle) => ({
      vehicle,
      normalized: normalizeSearchText(buildVehicleSearchText(vehicle)),
    }))
    .filter(({ normalized }) => normalized.includes(query))
    .sort((a, b) => a.normalized.length - b.normalized.length);

  const matched = matches[0]?.vehicle;
  if (!matched) return null;

  return {
    size: matched.size,
    source: "local",
    matchedVehicle: `${matched.brand} ${matched.model}`,
  };
}

const HEURISTIC_RULES: HeuristicRule[] = [
  {
    size: "XL",
    patterns: [
      "cybertruck",
      "サイバートラック",
      "escalade",
      "エスカレード",
      "defender 130",
      "ディフェンダー130",
      "land cruiser 300",
      "ランドクルーザー300",
      "g class",
      "gクラス",
      "urus",
      "ウルス",
      "cullinan",
      "カリナン",
    ],
  },
  {
    size: "LL",
    patterns: [
      "alphard",
      "アルファード",
      "vellfire",
      "ヴェルファイア",
      "model x",
      "モデルx",
      "defender 110",
      "ディフェンダー110",
      "defender 90",
      "ディフェンダー90",
      "wrangler unlimited",
      "ラングラー アンリミテッド",
      "cayenne",
      "カイエン",
      "range rover sport",
      "レンジローバー スポーツ",
      "minivan",
      "ミニバン",
    ],
  },
  {
    size: "M",
    patterns: [
      "911",
      "718",
      "prius",
      "プリウス",
      "fit",
      "フィット",
      "golf",
      "ゴルフ",
      "model 3",
      "モデル3",
      "a110",
      "ミニ",
      "mini",
    ],
  },
];

function classifyByHeuristic(carName: string): VehicleClassification {
  const normalized = normalizeSearchText(carName);
  for (const rule of HEURISTIC_RULES) {
    const hit = rule.patterns.find((pattern) =>
      normalized.includes(normalizeSearchText(pattern)),
    );
    if (hit) {
      return {
        size: rule.size,
        source: "heuristic",
        matchedVehicle: `heuristic:${hit}`,
      };
    }
  }

  // Unknown vehicles default to L as safe middle tier.
  return { size: "L", source: "heuristic", matchedVehicle: "heuristic:default-l" };
}

function buildReferenceVehicles() {
  return vehicles
    .map((vehicle) => {
      const english = [vehicle.brandEn, vehicle.modelEn].filter(Boolean).join(" ");
      return `- ${vehicle.brand} ${vehicle.model}${english ? ` / ${english}` : ""}: ${vehicle.size}`;
    })
    .join("\n");
}

async function withTimeout<T>(promise: Promise<T>, timeoutMs: number) {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error("Gemini request timed out")), timeoutMs),
    ),
  ]);
}

function parseSizeFromGemini(rawText: string): "M" | "L" | "LL" | "XL" | null {
  const trimmed = rawText.trim();
  const jsonBlock = trimmed.match(/\{[^{}]*\}/)?.[0];
  if (!jsonBlock) return null;

  try {
    const parsed = JSON.parse(jsonBlock) as { size?: string };
    const size = parsed.size?.toUpperCase();
    if (size && SIZE_VALUES.has(size)) {
      return size as "M" | "L" | "LL" | "XL";
    }
  } catch {
    return null;
  }

  return null;
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null) as { carName?: string } | null;
    const carName = body?.carName?.trim();

    if (!carName) {
      return NextResponse.json(
        { error: "carName is required." },
        { status: 400 },
      );
    }

    if (carName.length > MAX_CAR_NAME_LENGTH) {
      return NextResponse.json(
        { error: "carName is too long." },
        { status: 400 },
      );
    }

    const localClassification = findLocalVehicle(carName);
    if (localClassification) {
      return NextResponse.json(localClassification);
    }

    const safeCarName = carName.replace(/[\r\n]+/g, " ");

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(classifyByHeuristic(carName));
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: MODEL_NAME,
      generationConfig: {
        temperature: 0,
        responseMimeType: "application/json",
      },
    });
    const prompt = `あなたは高級洗車サービスの車両サイズ判定AIです。
M/L/LL/XL は一般的な車格ではなく、出張洗車の作業負荷・全長・全幅・全高・ボディ面積で判定します。

サイズ基準:
${SIZE_GUIDE}

既存登録車両とサイズ:
${REFERENCE_VEHICLES}

未登録車両は、上記の登録車両のうち最も近い車格・ボディサイズ・作業負荷の車と比較して分類してください。
迷う場合は1段階大きめに判定してください。

出力は必ずJSON形式のみで {"size": "LL"} のように返してください。余計な文章は含めないでください。`;

    const result = await withTimeout(
      model.generateContent(`${prompt}\n\n判定対象の車名: ${safeCarName}`),
      GEMINI_TIMEOUT_MS,
    );
    const text = result.response.text();
    const size = parseSizeFromGemini(text);

    if (!size) {
      return NextResponse.json(classifyByHeuristic(carName));
    }

    return NextResponse.json({ size, source: "ai" });
  } catch {
    return NextResponse.json({ size: "L", source: "heuristic" });
  }
}

