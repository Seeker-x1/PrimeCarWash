import type { Metadata } from "next";
import { getLineShokaiFirstUrl } from "@/lib/line-shokai-first-message";
import { LineLaunch } from "./line-launch";

export const metadata: Metadata = {
  title: "LINEへ移動 | PRIME CAR WASH",
  description:
    "初回6,000円のお申し込み用にLINEを開きます。入力欄の①〜④にご記入のうえ、送信してください。",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default function LineRedirectPage() {
  const lineUrl = getLineShokaiFirstUrl();
  return <LineLaunch lineUrl={lineUrl} />;
}
