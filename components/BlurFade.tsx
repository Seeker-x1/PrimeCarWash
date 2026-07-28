"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

type BlurFadeProps = {
  children: ReactNode;
  delay?: number;
  className?: string;
  /** Above-the-fold hero: animate on mount instead of whileInView */
  immediate?: boolean;
};

export default function BlurFade({
  children,
  delay = 0,
  className,
  immediate = false,
}: BlurFadeProps) {
  const motionProps = immediate
    ? {
        initial: { opacity: 0, filter: "blur(10px)", y: 20 },
        animate: { opacity: 1, filter: "blur(0px)", y: 0 },
      }
    : {
        initial: { opacity: 0, filter: "blur(10px)", y: 20 },
        whileInView: { opacity: 1, filter: "blur(0px)", y: 0 },
        viewport: { once: true, margin: "-50px" },
      };

  return (
    <motion.div
      className={className}
      {...motionProps}
      transition={{ duration: 1.0, ease: "easeOut", delay }}
    >
      {children}
    </motion.div>
  );
}
