"use client";

import { useEffect } from "react";

export function LineLaunch({ lineUrl }: { lineUrl: string }) {
  useEffect(() => {
    window.location.replace(lineUrl);
  }, [lineUrl]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-black px-6 text-center text-white">
      <p className="font-serif text-xs tracking-[0.25em] text-[#888]">
        PRIME CAR WASH
      </p>
      <h1 className="mt-6 max-w-sm text-lg font-medium leading-relaxed tracking-wide">
        LINEを開いています…
      </h1>
      <p className="mt-3 max-w-sm text-sm leading-relaxed text-[#aaa]">
        開いたら、①〜④に必要事項をご記入のうえ、送信してください。
      </p>
      <p className="mt-4 max-w-sm text-sm leading-relaxed text-[#999]">
        数秒経っても切り替わらない場合は、下のボタンからお進みください。
      </p>
      <a
        href={lineUrl}
        className="mt-10 inline-flex rounded-full bg-[#06C755] px-8 py-4 text-sm font-medium tracking-wide text-black hover:opacity-90"
      >
        LINEで開く
      </a>
    </main>
  );
}
