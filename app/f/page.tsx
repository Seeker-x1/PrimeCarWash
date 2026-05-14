import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "初回6,000円のご案内",
  description:
    "初回洗車6,000円キャンペーン。LINEの入力欄に案内文が表示されます。①〜④にご記入のうえ、送信してください。返信はLINEのトークで届きます。",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default function FirstVisitCampaignPage() {
  return (
    <main className="min-h-screen bg-black px-6 py-16 text-white">
      <div className="mx-auto max-w-lg">
        <p className="font-serif text-xs tracking-[0.25em] text-[#888]">
          PRIME CAR WASH
        </p>
        <h1 className="mt-4 font-serif text-2xl tracking-tight md:text-3xl">
          初回洗車 6,000円
        </h1>
        <p className="mt-2 text-sm text-[#888]">店頭・キャンペーン導線</p>

        <section className="mt-10 space-y-4 text-sm leading-relaxed text-[#ccc]">
          <p>
            このページで流れをご確認のうえ、
            <strong className="text-white"> LINEからお申し込み</strong>
            ください。
          </p>
          <p>
            LINEでは、
            <strong className="text-white">
              ご予約に必要な項目（ご希望日時・車種・住所・電話番号）
            </strong>
            を、表示された①〜④に
            <strong className="text-white">ご記入のうえ送信</strong>
            してください。
          </p>
          <p>
            送信後は、
            <strong className="text-white">
              お使いのLINEのトーク画面に自動返信
            </strong>
            で続きのご案内が届きます（設定に応じてスタッフからのメッセージが続く場合もあります）。
          </p>
        </section>

        <ol className="mt-10 space-y-4 text-sm leading-relaxed text-[#aaa]">
          <li className="flex gap-3">
            <span className="shrink-0 font-medium text-white">1</span>
            <span>下のボタンをタップしてLINEを開きます。</span>
          </li>
          <li className="flex gap-3">
            <span className="shrink-0 font-medium text-white">2</span>
            <span>
              入力欄の
              <strong className="text-white">①〜④に必要事項をご記入</strong>
              のうえ、送信してください。
            </span>
          </li>
          <li className="flex gap-3">
            <span className="shrink-0 font-medium text-white">3</span>
            <span>
              <strong className="text-white">同じLINEのトーク</strong>
              に届く返信をご確認ください。
            </span>
          </li>
        </ol>

        <div className="mt-12">
          <a
            href="/l"
            className="inline-flex w-full items-center justify-center rounded-full bg-[#06C755] px-6 py-4 text-center text-sm font-medium tracking-wide text-black hover:opacity-90"
          >
            LINEに進む
          </a>
          <p className="mt-3 text-center text-xs text-[#666]">
            LINEでは①〜④にご記入のうえ、送信してください。
            <br />
            PCではLINEに切り替わりにくいことがあります。スマートフォンでのご利用をおすすめします。
          </p>
        </div>

        <p className="mt-16 border-t border-[#333] pt-8 text-xs leading-relaxed text-[#555]">
          返信が届かない場合は、通信環境をご確認のうえ、時間をおいて再度お試しください。
        </p>

        <p className="mt-8 text-center text-xs">
          <Link href="/" className="text-[#888] underline">
            トップへ戻る
          </Link>
        </p>
      </div>
    </main>
  );
}
