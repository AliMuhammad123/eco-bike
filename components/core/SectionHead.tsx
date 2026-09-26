"use client";

import { motion } from "framer-motion";
import SplitText from "./SplitText";

/** Consistent section opener: index + eyebrow, split headline, optional lede. */
export default function SectionHead({
  index,
  eyebrow,
  title,
  lede,
  id,
  align = "left",
  className = "",
}: {
  index: string;
  eyebrow: string;
  title: string;
  lede?: string;
  id: string;
  align?: "left" | "center";
  className?: string;
}) {
  const center = align === "center";
  return (
    <div className={`${center ? "mx-auto text-center" : ""} max-w-4xl ${className}`}>
      <div className={`mb-6 flex items-center gap-4 ${center ? "justify-center" : ""}`}>
        <span className="font-mono text-[11px] text-volt">{index}</span>
        <motion.span
          className="h-px w-12 origin-left bg-white/30"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.1, ease: [0.19, 1, 0.22, 1] }}
        />
        <span className="eyebrow">{eyebrow}</span>
      </div>
      <SplitText
        id={id}
        text={title}
        className="display text-[clamp(2.4rem,6.2vw,5.6rem)]"
      />
      {lede && (
        <motion.p
          className={`mt-6 max-w-xl text-base leading-relaxed text-mist md:text-lg ${center ? "mx-auto" : ""}`}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "0px 0px -10% 0px" }}
          transition={{ duration: 1, delay: 0.3, ease: [0.19, 1, 0.22, 1] }}
        >
          {lede}
        </motion.p>
      )}
    </div>
  );
}
