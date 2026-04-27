"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";

const LINE_QR_URL =
  "https://qr-official.line.me/gs/M_834ecayh_BW.png?oat_content=qr";
const LINE_RESERVATION_URL = "https://line.me/R/ti/p/@834ecayh";

export default function LineFloat() {
  const [isVisible, setIsVisible] = useState(false);

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
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          transition={{ duration: 0.28, ease: "easeOut" }}
          className="fixed bottom-5 right-4 z-50"
        >
          <div className="hidden items-center gap-2 rounded-md border border-[#999999] bg-black/90 p-2 backdrop-blur-sm md:flex">
            <div className="relative h-12 w-12 overflow-hidden rounded-sm bg-white p-0.5">
              <Image
                src={LINE_QR_URL}
                alt="LINE reservation QR"
                fill
                sizes="48px"
                className="object-contain"
              />
            </div>
            <a
              href={LINE_RESERVATION_URL}
              target="_blank"
              rel="noreferrer"
              className="rounded-md bg-[#06C755] px-4 py-2 text-xs font-medium tracking-[0.08em] text-black uppercase"
            >
              LINE予約
            </a>
          </div>

          <a
            href={LINE_RESERVATION_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex rounded-md bg-[#06C755] px-4 py-3 text-xs font-medium tracking-[0.08em] text-black uppercase md:hidden"
          >
            LINE予約
          </a>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
