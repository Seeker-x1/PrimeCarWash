import { GoogleGenerativeAI } from "@google/generative-ai";
import { GEMINI_MODEL_NAME } from "@/lib/gemini-model";
import { formatAreaUrlsForPrompt } from "@/lib/threads/area-links";
import type { ThreadsPost } from "@/lib/threads/types";

const MODEL_NAME = GEMINI_MODEL_NAME;
const GEMINI_TIMEOUT_MS = 12_000;
const MAX_TEXT = 500;

export type GeneratePostInput = {
  themeId: string;
  themeName: string;
  postingTips: string;
  avoidSnippets: string[];
  /** 毎回異なる切り口にするためのシード */
  variationSeed?: number;
};

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error("Gemini timeout")), ms);
    promise
      .then((v) => {
        clearTimeout(timer);
        resolve(v);
      })
      .catch((e) => {
        clearTimeout(timer);
        reject(e);
      });
  });
}

function parseGeneratedText(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) throw new Error("Empty generation");

  try {
    const parsed = JSON.parse(trimmed) as { text?: string };
    if (typeof parsed.text === "string" && parsed.text.trim()) {
      return parsed.text.trim();
    }
  } catch {
    // plain text fallback
  }

  return trimmed.replace(/^```[\w]*\n?|```$/g, "").trim();
}

export async function generateThreadsPost(input: GeneratePostInput): Promise<ThreadsPost> {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured.");
  }

  const avoidBlock =
    input.avoidSnippets.length > 0
      ? `\n\n次の文面に似た内容・構文は避けてください:\n${input.avoidSnippets
          .slice(0, 8)
          .map((s, i) => `${i + 1}. ${s.replace(/\s+/g, " ").slice(0, 120)}`)
          .join("\n")}`
      : "";

  const variation =
    input.variationSeed != null
      ? `\n- バリエーション番号 ${input.variationSeed}。直前の案と被らない切り口・言い回しにすること。`
      : "";

  const areaUrls = formatAreaUrlsForPrompt("ja");

  const prompt = `あなたは PRIME CAR WASH（渋谷・世田谷・目黒中心の出張洗車）の Threads 投稿ライターです。

テーマ: ${input.themeName}（id: ${input.themeId}）
メモ: ${input.postingTips}

対応エリアLP（local-authority なら該当区を1つ、複数区に触れる場合は最大2つまで本文にURLを入れる）:
${areaUrls}

ルール:
- 日本語、Threads 向け（500文字以内）
- 1行目にフック（問い・数字・断言）
- 渋谷・世田谷・目黒など具体エリアを入れる
- エリア特化テーマでは上記LPの完全URLを入れる（パスは /areas/{slug}）
- 最後は質問で締める
- 価格・割引・硬い営業は禁止
- 改行で読みやすく${variation}${avoidBlock}

JSON のみ返す: {"text":"本文"}`;

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: MODEL_NAME,
    generationConfig: {
      temperature: 0.9,
      responseMimeType: "application/json",
    },
  });

  const result = await withTimeout(model.generateContent(prompt), GEMINI_TIMEOUT_MS);
  let text = parseGeneratedText(result.response.text());
  if (text.length > MAX_TEXT) {
    text = `${text.slice(0, MAX_TEXT - 1)}…`;
  }
  if (!text) throw new Error("Generated text empty");

  return {
    id: `gen-${Date.now()}`,
    themeId: input.themeId,
    text,
    enabled: true,
  };
}
