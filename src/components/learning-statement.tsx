"use client";

import { motion, useReducedMotion } from "motion/react";
import { DeveloperSketch } from "@/components/developer-sketch";

function LearningAccent({ marker = false }: { marker?: boolean }) {
  const reduced = useReducedMotion();
  return (
    <svg className={marker ? "tech-learning-marker" : "tech-learning-underline"} aria-hidden="true"
      width="300" height="24" viewBox="0 0 300 24" preserveAspectRatio="none" fill="none"
      stroke="currentColor" strokeWidth={marker ? 15 : 2.5} strokeLinecap="round" strokeLinejoin="round">
      <motion.path d={marker ? "M8 15 Q80 8 151 13 T292 12" : "M4 14 C65 5 120 18 180 11 S254 9 296 12 M18 20 Q160 14 276 18"}
        initial={reduced ? false : { pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: reduced ? 0 : 0.9, delay: reduced ? 0 : 0.25, ease: "easeInOut" }} />
    </svg>
  );
}

export function LearningStatement() {
  return (
    <div className="tech-learning-panel">
      <DeveloperSketch />
      <p className="tech-learning-statement">I think I can <span className="tech-learning-emphasis">never stop learning<LearningAccent /></span> new things...</p>
      <p className="tech-learning-caption"><span className="tech-learning-word">Coffee<LearningAccent marker /></span> and my <span className="tech-learning-word">laptop<LearningAccent marker /></span> are all I need to build something new.</p>
    </div>
  );
}
