"use client";

import { motion, useInView, useReducedMotion } from "motion/react";
import { useRef } from "react";

type AccentKind = "underline" | "arrow" | "spark";

const paths: Record<AccentKind, string> = {
  underline:
    "M3 9 C30 3 62 12 92 7 S125 5 137 8 M12 13 Q70 10 130 11",
  arrow:
    "M3 5 C18 0 10 23 27 21 M20 15 L27 21 L19 26",
  spark:
    "M10 2 L12 8 L18 10 L12 12 L10 18 L8 12 L2 10 L8 8 Z",
};

export function ExperienceAccent({
  kind,
}: {
  kind: AccentKind;
}) {
  const reduced = useReducedMotion();

  return (
    <svg
      aria-hidden="true"
      focusable="false"
      className={`experience-sketch experience-sketch-${kind}`}
      viewBox={
        kind === "underline"
          ? "0 0 140 16"
          : kind === "arrow"
            ? "0 0 30 30"
            : "0 0 20 20"
      }
      fill="none"
      stroke="currentColor"
      strokeWidth={kind === "underline" ? 2 : 1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <motion.path
        d={paths[kind]}
        initial={reduced ? false : { pathLength: 0, opacity: 0 }}
        whileInView={{ pathLength: 1, opacity: 0.9 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{
          duration: reduced ? 0 : 1,
          delay: reduced ? 0 : 0.2,
          ease: "easeInOut",
        }}
      />
    </svg>
  );
}

const doodles = [
  {
    className: "experience-doodle-one",
    color: "#9B6DFF",
    viewBox: "0 0 180 130",
    path: "M15 85 C35 15 105 10 145 55 C165 80 125 115 90 95",
  },
  {
    className: "experience-doodle-two",
    color: "#329CFF",
    viewBox: "0 0 130 130",
    path: "M65 10 C70 35 95 55 120 65 M65 10 C55 35 35 55 10 65 M65 10 L65 120",
  },
  {
    className: "experience-doodle-three",
    color: "#E54CD8",
    viewBox: "0 0 200 100",
    path: "M5 65 C45 5 75 95 115 40 S175 20 195 50",
  },
  {
    className: "experience-doodle-four",
    color: "#75C900",
    viewBox: "0 0 130 130",
    path: "M65 12 C92 12 118 38 118 65 C118 92 92 118 65 118 C38 118 12 92 12 65 C12 38 38 12 65 12 Z",
  },
  {
    className: "experience-doodle-five",
    color: "#C44A13",
    viewBox: "0 0 160 100",
    path: "M8 65 C35 15 65 90 95 45 C115 15 135 35 150 15",
  },
];

export function ExperienceBackgroundSketches() {
  const reduced = useReducedMotion();

  return (
    <div className="experience-sketch-background" aria-hidden="true">
      {doodles.map((sketch, index) => (
        <motion.svg
          key={sketch.className}
          className={`experience-doodle ${sketch.className}`}
          viewBox={sketch.viewBox}
          fill="none"
          stroke={sketch.color}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <motion.path
            d={sketch.path}
            initial={reduced ? false : { pathLength: 0, opacity: 0 }}
            whileInView={{ pathLength: 1, opacity: 0.5 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{
              duration: reduced ? 0 : 1.6,
              delay: reduced ? 0 : index * 0.12,
              ease: "easeInOut",
            }}
          />
        </motion.svg>
      ))}

      <span className="experience-floating-circle circle-one" />
      <span className="experience-floating-circle circle-two" />
      <span className="experience-floating-circle circle-three" />
      <span className="experience-floating-circle circle-four" />

      <span className="experience-floating-cross cross-one">+</span>
      <span className="experience-floating-cross cross-two">+</span>

      <span className="experience-sketch-star star-one">✳</span>
      <span className="experience-sketch-star star-two">✳</span>
    </div>
  );
}

// Header-only accents leave the timeline and company decorations unchanged.
export function ExperienceHeaderUnderline({ delay = 0.45 }: { delay?: number }) {
  const reduced = useReducedMotion();
  return (
    <svg className="experience-header-underline" width="300" height="20" viewBox="0 0 300 20"
      preserveAspectRatio="none" aria-hidden="true" focusable="false" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <motion.path d="M4 12 C55 4 111 16 163 9 S246 7 296 10 M19 18 Q149 11 274 15"
        variants={{
          hidden: { pathLength: 0, opacity: 0 },
          visible: { pathLength: 1, opacity: 0.85, transition: { duration: reduced ? 0 : 0.85, delay: reduced ? 0 : delay, ease: "easeInOut" } },
        }} />
    </svg>
  );
}

const headerSketches = [
  { name: "curve", width: 120, height: 70, path: "M8 52 C13 17 58 9 87 27 Q108 43 95 58 M102 49 L95 59 L86 52" },
  { name: "spark", width: 36, height: 40, path: "M18 4 Q19 15 29 20 Q19 21 17 35 Q15 22 5 20 Q16 16 18 4 Z M30 6 l3 -3" },
  { name: "circle", width: 34, height: 34, path: "M28 13 C30 30 7 32 5 18 C2 3 26 0 28 13 Z M28 10 l3 2" },
  { name: "pencil", width: 65, height: 28, path: "M5 8 Q29 4 58 10 M12 17 L43 14 M48 23 l11 -2" },
  { name: "wave", width: 128, height: 36, path: "M4 22 C25 1 36 35 57 16 S88 6 102 19 Q113 28 123 14" },
];

export function ExperienceHeaderSketches() {
  const ref = useRef<HTMLDivElement>(null);
  const visible = useInView(ref, { amount: 0.1 });
  const reduced = useReducedMotion();
  return (
    <div ref={ref} className="experience-header-sketches" aria-hidden="true" data-moving={visible && !reduced ? "true" : undefined}>
      {headerSketches.map((sketch, index) => (
        <svg key={sketch.name} className={`experience-header-drawing experience-header-${sketch.name}`}
          width={sketch.width} height={sketch.height} viewBox={`0 0 ${sketch.width} ${sketch.height}`}
          fill="none" stroke="currentColor" strokeWidth={sketch.name === "pencil" ? 1 : 1.6}
          strokeLinecap="round" strokeLinejoin="round" focusable="false">
          <motion.path d={sketch.path} variants={{
            hidden: { pathLength: 0, opacity: 0 },
            visible: { pathLength: 1, opacity: sketch.name === "pencil" ? 0.65 : 0.75, transition: { duration: reduced ? 0 : 1.1, delay: reduced ? 0 : 0.3 + index * 0.12, ease: "easeInOut" } },
          }} />
        </svg>
      ))}
    </div>
  );
}
