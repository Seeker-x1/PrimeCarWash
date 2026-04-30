"use client";

import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { QRCodeSVG } from "qrcode.react";
import { useEffect, useMemo, useState } from "react";
import { getLineConsultationUrl } from "@/lib/line-consultation";

const consultationContent = {
  ja: {
    label: (
      <>
        愛車のケアを、
        <br />
        専属コンシェルジュに相談
      </>
    ),
    mobileLabel: "愛車のケアを、専属コンシェルジュに相談",
  },
  en: {
    label: (
      <>
        Consult your dedicated concierge
        <br />
        about your car care
      </>
    ),
    mobileLabel: "Consult your concierge about your car care",
  },
};

export default function LineFloat() {
  const [isVisible, setIsVisible] = useState(false);
  const pathname = usePathname();
  const locale = pathname?.startsWith("/en") ? "en" : "ja";
  const content = consultationContent[locale];
  const lineConsultationUrl = useMemo(
    () => getLineConsultationUrl(locale),
    [locale],
  );

  useEffect(() => {
    const onScroll = () => {
      setIsVisible(window.scrollY > 300);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {isVisible ? (
        <motion.div
          key="line-float"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          transition={{ duration: 0.28, ease: "easeOut" }}
          className="fixed bottom-5 right-4 z-50 md:bottom-16 md:right-8"
        >
          <div className="hidden items-center gap-5 rounded-[20px] border border-[#999999] bg-black/90 p-4 shadow-[0_18px_60px_rgba(0,0,0,0.45)] backdrop-blur-sm md:flex">
            <div className="rounded-[12px] bg-white p-3">
              <QRCodeSVG
                value={lineConsultationUrl}
                size={120}
                bgColor="#ffffff"
                fgColor="#000000"
                marginSize={2}
                title="LINE concierge consultation QR"
              />
            </div>
            <a
              href={lineConsultationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-[18px] bg-[#06C755] px-8 py-6 text-center text-sm font-medium leading-relaxed tracking-[0.08em] text-black"
            >
              {content.label}
            </a>
          </div>

          <a
            href={lineConsultationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex rounded-[18px] bg-[#06C755] px-5 py-4 text-center text-xs font-medium leading-relaxed tracking-[0.08em] text-black md:hidden"
          >
            {content.mobileLabel}
          </a>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
