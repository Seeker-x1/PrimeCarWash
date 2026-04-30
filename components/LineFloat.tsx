"use client";

import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { QRCodeSVG } from "qrcode.react";
import { useEffect, useMemo, useState } from "react";
import { getLineConsultationUrl } from "@/lib/line-consultation";
const LINE_FLOAT_DISMISSED_KEY = "line-float-dismissed";

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
  const [isDismissed, setIsDismissed] = useState(() => {
    if (typeof window === "undefined") return false;
    try {
      return window.sessionStorage.getItem(LINE_FLOAT_DISMISSED_KEY) === "1";
    } catch {
      return false;
    }
  });
  const [isReservationFormInView, setIsReservationFormInView] = useState(false);
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
  useEffect(() => {
    const target = document.getElementById("reservation-form");
    if (!target) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsReservationFormInView(entry.isIntersecting);
      },
      { threshold: 0.2 },
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  const shouldShow = isVisible && !isDismissed && !isReservationFormInView;
  const handleDismiss = () => {
    setIsDismissed(true);
    try {
      window.sessionStorage.setItem(LINE_FLOAT_DISMISSED_KEY, "1");
    } catch {
      // ignore sessionStorage write errors
    }
  };

  return (
    <AnimatePresence>
      {shouldShow ? (
        <motion.div
          key="line-float"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          transition={{ duration: 0.28, ease: "easeOut" }}
          className="fixed bottom-5 right-4 z-50 md:bottom-16 md:right-8"
        >
          <button
            type="button"
            onClick={handleDismiss}
            aria-label="Close LINE consultation widget"
            className="absolute -right-2 -top-2 z-10 flex h-7 w-7 items-center justify-center rounded-full border border-[#999999] bg-black text-[11px] text-white hover:border-white"
          >
            x
          </button>
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
