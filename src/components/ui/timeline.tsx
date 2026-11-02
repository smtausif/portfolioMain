"use client";

import { useScroll, useTransform, useMotionValueEvent, useReducedMotion, motion } from "motion/react";
import React, { useCallback, useEffect, useRef, useState } from "react";

export interface TimelineEntry {
  title: string;
  content: React.ReactNode;
}

const dateHeadingColors: Record<string, string> = {
  "June 2026 – Present": "#9B6DFF",
  "January 2026 – April 2026": "#329CFF",
  "April 2025 – August 2025": "#75C900",
};

// Adapted from the supplied Aceternity Timeline: sticky labels and circles,
// a measured content track, and a scroll-driven beam retain their structure.
export const Timeline = ({ data }: { data: TimelineEntry[] }) => {
  const ref = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);
  const milestoneHeights = useRef<number[]>([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const reducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 10%", "end 50%"],
  });
  const heightTransform = useTransform(scrollYProgress, [0, 1], [0, height]);
  const opacityTransform = useTransform(scrollYProgress, [0, 0.1], [0, 1]);
  const glowOpacity = useTransform(scrollYProgress, [0, 0.02, 0.98, 1], [0, 0.6, 0.6, 0]);
  const updateMilestones = useCallback((progressHeight: number) => {
    let reached = -1;
    milestoneHeights.current.forEach((position, i) => { if (progressHeight >= position) reached = i; });
    setActiveIndex(current => current === reached ? current : reached);
  }, []);
  useMotionValueEvent(heightTransform, "change", updateMilestones);

  useEffect(() => {
    const content = ref.current;
    if (!content) return;
    const measure = () => {
      const nextHeight = content.getBoundingClientRect().height;
      milestoneHeights.current = Array.from(content.querySelectorAll<HTMLElement>("[data-timeline-entry]"), entry =>
        entry.offsetTop + (parseFloat(getComputedStyle(entry).paddingTop) || 0) + 20,
      );
      setHeight(current => current === nextHeight ? current : nextHeight);
      updateMilestones(scrollYProgress.get() * nextHeight);
    };
    const observer = new ResizeObserver(measure);
    observer.observe(content);
    const frame = requestAnimationFrame(measure);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [scrollYProgress, updateMilestones]);

  return (
    <div className="relative w-full bg-background font-sans md:px-10" ref={containerRef}>
      <div ref={ref} className="relative mx-auto max-w-7xl">
        {data.map((item, index) => (
          <div key={index} data-timeline-entry={index} data-reached={index <= activeIndex} className="flex justify-start pt-10 md:gap-10 md:pt-20">
            <div className="sticky top-40 z-40 flex max-w-xs shrink-0 self-start flex-col items-center md:w-full md:basis-[32%] md:flex-row lg:max-w-sm">
              <div className="absolute left-3 flex h-10 w-10 items-center justify-center rounded-full bg-background md:left-3">
                <motion.div data-active={index <= activeIndex}
                  animate={{ scale: reducedMotion ? 1 : index === activeIndex ? [1, 1.18, 1.08] : index < activeIndex ? 1.08 : 1 }}
                  transition={{ duration: reducedMotion ? 0 : 0.5, ease: "easeOut" }}
                  className="experience-milestone h-4 w-4 rounded-full border border-border bg-track p-2" />
              </div>
              <h3 style={{ color: dateHeadingColors[item.title] }} className="experience-date hidden text-xl font-bold break-words text-label md:block md:pl-20 md:text-2xl lg:text-4xl xl:text-5xl">
                {item.title}
              </h3>
            </div>
            <div className="relative w-full min-w-0 pr-4 pl-20 md:pl-4">
              <h3 style={{ color: dateHeadingColors[item.title] }} className="experience-date mb-4 block text-left text-2xl font-bold text-label md:hidden">
                {item.title}
              </h3>
              {item.content}
            </div>
          </div>
        ))}
        <div data-timeline-track="" aria-hidden="true" style={{ height: height + "px" }}
          className="pointer-events-none absolute top-0 left-[31px] z-10 w-[2px] overflow-hidden bg-track">
          <motion.div
            style={{ height: heightTransform, opacity: opacityTransform }}
            className="absolute inset-x-0 top-0 w-[2px] rounded-full bg-linear-to-t from-accent from-[0%] via-accent/70 via-[10%] to-transparent"
          />
        </div>
        <motion.div aria-hidden="true" className="experience-progress-glow"
          style={{ y: heightTransform, opacity: reducedMotion ? 0 : glowOpacity }} />
      </div>
    </div>
  );
};
