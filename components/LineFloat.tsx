"use client";

import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { QRCodeSVG } from "qrcode.react";
import { useEffect, useMemo, useState } from "react";
import { getLineConsultationUrl } from "@/lib/line-consultation";

const LINE_FLOAT_DISMISSED_KEY = "line-float-dismissed";

const consultationContent = {
  ja: {
    label: "専属コンシェルジュに相談",
    hint: "フォーカスでQR",
  },
  en: {
    label: "Ask your concierge",
    hint: "Focus for QR",
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
  const [isFocused, setIsFocused] = useState(false);
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
  }, [pathname]);

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
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
          transition={{ duration: 0.24, ease: "easeOut" }}
          className="fixed bottom-5 right-4 z-50 md:bottom-10 md:right-6"
        >
          <button
            type="button"
            onClick={handleDismiss}
            aria-label="Close LINE consultation widget"
            className="absolute -right-1.5 -top-1.5 z-10 flex h-6 w-6 items-center justify-center rounded-full border border-[#999999] bg-black text-[10px] text-white hover:border-white"
          >
            x
          </button>

          {/* Desktop: slim bar; larger QR panel only while focused */}
          <div
            tabIndex={0}
            onFocus={() => setIsFocused(true)}
            onBlur={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
                setIsFocused(false);
              }
            }}
            className="hidden outline-none md:block"
          >
            <AnimatePresence initial={false}>
              {isFocused ? (
                <motion.div
                  key="qr"
                  initial={{ opacity: 0, y: 8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.96 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="mb-2 flex justify-end"
                >
                  <div className="rounded-[14px] border border-[#999999] bg-white p-3 shadow-[0_12px_40px_rgba(0,0,0,0.4)]">
                    <QRCodeSVG
                      value={lineConsultationUrl}
                      size={132}
                      bgColor="#ffffff"
                      fgColor="#000000"
                      marginSize={2}
                      title="LINE concierge consultation QR"
                    />
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>
            <div className="flex max-w-[260px] overflow-hidden rounded-full border border-[#999999] bg-black/90 backdrop-blur-sm">
              <a
                href={lineConsultationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex min-h-[40px] flex-1 items-center justify-center bg-[#06C755] px-4 py-2 text-center text-[11px] font-medium leading-snug tracking-[0.06em] text-black"
              >
                {content.label}
              </a>
            </div>
            {!isFocused ? (
              <p className="mt-1 text-right text-[10px] tracking-[0.08em] text-[#777]">
                {content.hint}
              </p>
            ) : null}
          </div>

          {/* Mobile: compact link only (no QR) */}
          <a
            href={lineConsultationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[40px] max-w-[220px] items-center rounded-full bg-[#06C755] px-4 py-2 text-center text-[11px] font-medium leading-snug tracking-[0.06em] text-black md:hidden"
          >
            {content.label}
          </a>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
