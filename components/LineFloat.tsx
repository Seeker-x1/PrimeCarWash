"use client";

import { AnimatePresence, motion } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import { useEffect, useState } from "react";

const LINE_OFFICIAL_ID =
  process.env.NEXT_PUBLIC_LINE_OFFICIAL_ID ?? "@834ecayh";
const LINE_CONSULTATION_MESSAGE = `[WEB相談]
【プライム出張洗車 コンシェルジュ相談】
■ 流入元: フローティングLINE導線

愛車のケアについて、専属コンシェルジュに相談したいです。`;
const LINE_CONSULTATION_URL = `https://line.me/R/oaMessage/${LINE_OFFICIAL_ID}/?${encodeURIComponent(
  LINE_CONSULTATION_MESSAGE,
)}`;

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
          key="line-float"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          transition={{ duration: 0.28, ease: "easeOut" }}
          className="fixed bottom-5 right-4 z-50"
        >
          <div className="hidden items-center gap-4 rounded-[18px] border border-[#999999] bg-black/90 p-3 backdrop-blur-sm md:flex">
            <div className="rounded-[10px] bg-white p-2">
              <QRCodeSVG
                value={LINE_CONSULTATION_URL}
                size={86}
                bgColor="#ffffff"
                fgColor="#000000"
                marginSize={1}
                title="LINE concierge consultation QR"
              />
            </div>
            <a
              href={LINE_CONSULTATION_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-[18px] bg-[#06C755] px-8 py-5 text-center text-sm font-medium leading-relaxed tracking-[0.08em] text-black"
            >
              愛車のケアを、
              <br />
              専属コンシェルジュに相談
            </a>
          </div>

          <a
            href={LINE_CONSULTATION_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex rounded-[18px] bg-[#06C755] px-5 py-4 text-center text-xs font-medium leading-relaxed tracking-[0.08em] text-black md:hidden"
          >
            愛車のケアを、専属コンシェルジュに相談
          </a>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
