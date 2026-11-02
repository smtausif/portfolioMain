"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { AboutEditorial } from "@/components/about-editorial";
import { BackgroundRippleEffect } from "@/components/ui/background-ripple-effect";

export function AboutMe() {
  const sectionRef = useRef<HTMLElement>(null);
  const [grid, setGrid] = useState({ rows: 8, cols: 27 });
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const observer = new ResizeObserver(() => {
      const bounds = section.getBoundingClientRect();
      const rows = Math.max(1, Math.ceil(bounds.height / 56));
      const cols = Math.max(1, Math.ceil(bounds.width / 56));
      setGrid((current) =>
        current.rows === rows && current.cols === cols ? current : { rows, cols },
      );
    });
    // Border-box dimensions include the section's generous padding.
    observer.observe(section, { box: "border-box" });
    return () => observer.disconnect();
  }, []);
  const reducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "start 20%"],
  });
  const rippleOpacity = useTransform(scrollYProgress, [0, 0.15, 0.75, 1], [0, 0.04, 1, 1]);

  return (
    <section ref={sectionRef} id="about" aria-labelledby="about-heading"
      className="about-section relative isolate overflow-hidden bg-background px-6 py-16 text-foreground sm:px-10 sm:py-20 lg:py-24">
      <motion.div style={{ opacity: reducedMotion ? 1 : rippleOpacity,
        maskImage: "linear-gradient(to bottom, transparent, black 10rem)" }}
        className="about-section-ripple absolute inset-0">
        <BackgroundRippleEffect rows={grid.rows} cols={grid.cols} />
      </motion.div>

      <AboutEditorial />
    </section>
  );
}
