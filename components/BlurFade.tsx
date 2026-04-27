"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

type BlurFadeProps = {
  children: ReactNode;
  delay?: number;
  className?: string;
};

export default function BlurFade({
  children,
  delay = 0,
  className,
}: BlurFadeProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, filter: "blur(10px)", y: 20 }}
      whileInView={{ opacity: 1, filter: "blur(0px)", y: 0 }}
      transition={{ duration: 1.0, ease: "easeOut", delay }}
      viewport={{ once: true, margin: "-50px" }}
    >
      {children}
    </motion.div>
  );
}
