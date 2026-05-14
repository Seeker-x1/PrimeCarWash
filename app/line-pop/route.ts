import { NextRequest, NextResponse } from "next/server";

const LINE_OFFICIAL_ID =
  process.env.NEXT_PUBLIC_LINE_OFFICIAL_ID ?? "@834ecayh";

/**
 * POP限定特典用: このURLをQRに載せると、LINE起動時の文面に証明コードが含まる。
 * LINE Official Account Manager で「キーワード応答」を設定し、POP_PROMO_SECRET と
 * 同じ文字列（または文面の一部）を受け取ったときに初回特典の案内を返す。
 */
export function GET(request: NextRequest) {
  const secret = process.env.POP_PROMO_SECRET ?? "PRM-POP-6000";
  const lang = request.nextUrl.searchParams.get("lang") === "en" ? "en" : "ja";
  const message =
    lang === "en"
      ? `[Store POP · first-visit ¥6,000 offer]\nProof code: ${secret}\nI'd like to book a mobile valet wash.`
      : `【店頭POP・初回6,000円特典】\n証明コード: ${secret}\n出張洗車の予約を希望します。`;
  const lineUrl = `https://line.me/R/oaMessage/${LINE_OFFICIAL_ID}/?${encodeURIComponent(
    message,
  )}`;
  return NextResponse.redirect(lineUrl, 302);
}

export const dynamic = "force-dynamic";
