import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { vehicles, type CarSize } from "@/constants/vehicles";
import {
  buildVehicleSearchText,
  getVehicleQueryVariants,
  normalizeVehicleSearchValue,
} from "@/lib/vehicle-search";

const MODEL_NAME = "gemini-1.5-flash";
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
  source: "local" | "spec_ai" | "heuristic";
  matchedVehicle?: string;
  dimensions?: VehicleSpecs;
  reason?: string;
};
type HeuristicRule = { size: CarSize; patterns: string[] };
type VehicleSpecs = {
  vehicleName?: string;
  lengthMm?: number | null;
  widthMm?: number | null;
  heightMm?: number | null;
  bodyType?: string;
  similarVehicles?: string[];
  confidence?: "high" | "medium" | "low";
};

const SIZE_RANK: Record<CarSize, number> = {
  M: 1,
  L: 2,
  LL: 3,
  XL: 4,
};

function findLocalVehicle(carName: string): VehicleClassification | null {
  const queryVariants = getVehicleQueryVariants(carName);
  if (queryVariants.length === 0 || queryVariants[0].length < 2) return null;

  const matches = vehicles
    .map((vehicle) => ({
      vehicle,
      normalized: normalizeVehicleSearchValue(buildVehicleSearchText(vehicle)),
    }))
    .filter(({ normalized }) =>
      queryVariants.some((query) => normalized.includes(query)),
    )
    .sort((a, b) => a.normalized.length - b.normalized.length);

  const matched = matches[0]?.vehicle;
  if (!matched) return null;

  return {
    size: matched.size,
    source: "local",
    matchedVehicle: `${matched.brand} ${matched.model}`,
  };
}

function findLocalVehicleSize(carName: string): CarSize | null {
  return findLocalVehicle(carName)?.size ?? null;
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

function classifyByHeuristic(carName: string): VehicleClassification | null {
  const normalized = normalizeVehicleSearchValue(carName);
  for (const rule of HEURISTIC_RULES) {
    const hit = rule.patterns.find((pattern) =>
      normalized.includes(normalizeVehicleSearchValue(pattern)),
    );
    if (hit) {
      return {
        size: rule.size,
        source: "heuristic",
        matchedVehicle: `heuristic:${hit}`,
      };
    }
  }

  return null;
}

function buildReferenceVehicles() {
  return vehicles
    .map((vehicle) => {
      const english = [vehicle.brandEn, vehicle.modelEn].filter(Boolean).join(" ");
      return `- ${vehicle.brand} ${vehicle.model}${english ? ` / ${english}` : ""}: ${vehicle.size}`;
    })
    .join("\n");
}

function pickLargerSize(a: CarSize, b: CarSize) {
  return SIZE_RANK[a] >= SIZE_RANK[b] ? a : b;
}

function classifyByDimensions(specs: VehicleSpecs): VehicleClassification | null {
  const length = specs.lengthMm ?? 0;
  const width = specs.widthMm ?? 0;
  const height = specs.heightMm ?? 0;
  const bodyType = normalizeVehicleSearchValue(specs.bodyType ?? "");
  const similarSizes = (specs.similarVehicles ?? [])
    .map(findLocalVehicleSize)
    .filter((size): size is CarSize => Boolean(size));

  let size: CarSize | null = null;
  const isLongBody =
    bodyType.includes("long") ||
    bodyType.includes("lwb") ||
    bodyType.includes("superlong") ||
    bodyType.includes("スーパーロング") ||
    bodyType.includes("ロング");
  const isLargeTruck =
    bodyType.includes("pickup") ||
    bodyType.includes("truck") ||
    bodyType.includes("ピックアップ");

  if (length || width || height || isLongBody || isLargeTruck) {
    if (length >= 5300 || width >= 2050 || isLongBody || isLargeTruck) {
      size = "XL";
    } else if (length >= 5000 || width >= 1950 || height >= 1800) {
      size = "LL";
    } else if (length >= 4700 || width >= 1850) {
      size = "L";
    } else {
      size = "M";
    }
  }

  const similarSize = similarSizes.reduce<CarSize | null>(
    (current, next) => (current ? pickLargerSize(current, next) : next),
    null,
  );

  if (!size && !similarSize) return null;

  const finalSize = size && similarSize ? pickLargerSize(size, similarSize) : size ?? similarSize;
  if (!finalSize) return null;

  return {
    size: finalSize,
    source: "spec_ai",
    dimensions: specs,
    reason: [
      length ? `全長${length}mm` : null,
      width ? `全幅${width}mm` : null,
      height ? `全高${height}mm` : null,
      specs.bodyType ? `車種タイプ: ${specs.bodyType}` : null,
      similarSizes.length > 0 ? `類似車両サイズ: ${similarSizes.join("/")}` : null,
    ]
      .filter(Boolean)
      .join(" / "),
  };
}

async function withTimeout<T>(promise: Promise<T>, timeoutMs: number) {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error("Gemini request timed out")), timeoutMs),
    ),
  ]);
}

function parseSpecsFromGemini(rawText: string): VehicleSpecs | null {
  const trimmed = rawText.trim();
  const start = trimmed.indexOf("{");
  const end = trimmed.lastIndexOf("}");
  const jsonBlock = start !== -1 && end !== -1 ? trimmed.slice(start, end + 1) : "";
  if (!jsonBlock) return null;

  try {
    const parsed: unknown = JSON.parse(jsonBlock);
    if (!parsed || typeof parsed !== "object") return null;

    const specs = parsed as Record<string, unknown>;
    return {
      vehicleName: typeof specs.vehicleName === "string" ? specs.vehicleName : "",
      lengthMm: typeof specs.lengthMm === "number" ? specs.lengthMm : null,
      widthMm: typeof specs.widthMm === "number" ? specs.widthMm : null,
      heightMm: typeof specs.heightMm === "number" ? specs.heightMm : null,
      bodyType: typeof specs.bodyType === "string" ? specs.bodyType : "",
      similarVehicles: Array.isArray(specs.similarVehicles)
        ? specs.similarVehicles
            .filter((vehicle): vehicle is string => typeof vehicle === "string")
            .slice(0, 5)
        : [],
      confidence:
        specs.confidence === "high" ||
        specs.confidence === "medium" ||
        specs.confidence === "low"
          ? specs.confidence
          : undefined,
    };
  } catch {
    return null;
  }
}

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json().catch(() => null);
    const carName =
      body &&
      typeof body === "object" &&
      "carName" in body &&
      typeof body.carName === "string"
        ? body.carName.trim()
        : "";

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
      const heuristicClassification = classifyByHeuristic(carName);
      if (heuristicClassification) {
        return NextResponse.json(heuristicClassification);
      }

      return NextResponse.json(
        { error: "GEMINI_API_KEY is not configured." },
        { status: 503 },
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: MODEL_NAME,
      generationConfig: {
        temperature: 0,
        responseMimeType: "application/json",
      },
    });
    const prompt = `あなたは高級洗車サービスの車両諸元調査AIです。
M/L/LL/XL のサイズ分類はアプリ側で行います。あなたはサイズ名を判定しないでください。
判定対象車両の諸元と、既存登録車両の中で近い車格の類似車だけを返してください。

アプリ側のサイズ基準:
${SIZE_GUIDE}

既存登録車両とサイズ:
${REFERENCE_VEHICLES}

出力は必ずJSON形式のみで返してください。余計な文章は含めないでください。
{
  "vehicleName": "Rivian R1S",
  "lengthMm": 5100,
  "widthMm": 2015,
  "heightMm": 1960,
  "bodyType": "large SUV",
  "similarVehicles": ["テスラ モデルX", "ランドローバー レンジローバー スポーツ", "ランドローバー ディフェンダー 110"],
  "confidence": "medium"
}`;

    const result = await withTimeout(
      model.generateContent(`${prompt}\n\n判定対象の車名: ${safeCarName}`),
      GEMINI_TIMEOUT_MS,
    );
    const text = result.response.text();
    const specs = parseSpecsFromGemini(text);
    const specClassification = specs ? classifyByDimensions(specs) : null;

    if (!specClassification) {
      const heuristicClassification = classifyByHeuristic(carName);
      if (heuristicClassification) {
        return NextResponse.json(heuristicClassification);
      }

      return NextResponse.json(
        { error: "Failed to classify vehicle size." },
        { status: 502 },
      );
    }

    return NextResponse.json(specClassification);
  } catch {
    return NextResponse.json(
      { error: "Vehicle classification failed." },
      { status: 500 },
    );
  }
}

