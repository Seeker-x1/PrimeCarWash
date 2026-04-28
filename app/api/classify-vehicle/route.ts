import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const MODEL_NAME = "gemini-1.5-flash";
const SIZE_VALUES = new Set(["M", "L", "LL", "XL"]);

function parseSizeFromGemini(rawText: string): "M" | "L" | "LL" | "XL" | null {
  const trimmed = rawText.trim();
  const jsonBlock = trimmed.match(/\{[\s\S]*\}/)?.[0];
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

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY is not configured." },
        { status: 500 },
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });
    const prompt =
      'あなたは高級洗車サービスの車両サイズ判定AIです。M(標準/コンパクト/スポーツ), L(中型SUV/大型セダン), LL(大型SUV/ミニバン), XL(超大型SUV/スーパーロング) の4つから判定してください。出力は必ずJSON形式で {"size": "LL"} のように返してください。余計な文章は含めないでください。';

    const result = await model.generateContent(`${prompt}\n\n車名: ${carName}`);
    const text = result.response.text();
    const size = parseSizeFromGemini(text);

    if (!size) {
      return NextResponse.json(
        { error: "Failed to parse Gemini response." },
        { status: 502 },
      );
    }

    return NextResponse.json({ size });
  } catch {
    return NextResponse.json(
      { error: "Vehicle classification failed." },
      { status: 500 },
    );
  }
}

