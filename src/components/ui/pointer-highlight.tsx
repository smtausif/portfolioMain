"use client";

// Aceternity UI Pointer Highlight: https://ui.aceternity.com/registry/pointer-highlight.json
// Span markup preserves heading semantics; the pointer stays within its bounds.
import { cn } from "@/lib/utils";
import { motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState, type ReactNode, type SVGProps } from "react";

export function PointerHighlight({ children, rectangleClassName, pointerClassName, containerClassName }: {
  children: ReactNode;
  rectangleClassName?: string;
  pointerClassName?: string;
  containerClassName?: string;
}) {
  const containerRef = useRef<HTMLSpanElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const update = (width: number, height: number) => {
      setDimensions(current => current.width === width && current.height === height ? current : { width, height });
    };
    const frame = requestAnimationFrame(() => {
      const { width, height } = container.getBoundingClientRect();
      update(width, height);
    });
    const observer = new ResizeObserver(entries => {
      for (const entry of entries) update(entry.contentRect.width, entry.contentRect.height);
    });
    observer.observe(container);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, []);

  return (
    <span ref={containerRef} className={cn("relative inline-block w-fit max-w-full align-baseline", containerClassName)}>
      {children}
      {dimensions.width > 0 && dimensions.height > 0 && (
        <motion.span aria-hidden="true" className="pointer-events-none absolute inset-0 z-0"
          initial={reducedMotion ? false : { opacity: 0, scale: 0.95, originX: 0, originY: 0 }}
          animate={{ opacity: 1, scale: 1 }} transition={{ duration: reducedMotion ? 0 : 0.5, ease: "easeOut" }}>
          <motion.span
            className={cn("absolute inset-0 border border-accent/40", rectangleClassName)}
            initial={reducedMotion ? false : { width: 0, height: 0 }}
            whileInView={{ width: dimensions.width, height: dimensions.height }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: reducedMotion ? 0 : 1, ease: "easeInOut" }} />
          <motion.span className="pointer-events-none absolute top-0 left-0 h-5 w-5"
            initial={reducedMotion ? false : { opacity: 0 }}
            whileInView={{ opacity: 1, x: Math.max(0, dimensions.width - 20), y: Math.max(0, dimensions.height - 20) }}
            viewport={{ once: true, amount: 0.3 }} style={{ rotate: -90, lineHeight: 0 }}
            transition={{ opacity: { duration: reducedMotion ? 0 : 0.1, ease: "easeInOut" }, duration: reducedMotion ? 0 : 1, ease: "easeInOut" }}>
            <Pointer className={cn("h-5 w-5 text-accent", pointerClassName)} />
          </motion.span>
        </motion.span>
      )}
    </span>
  );
}

const Pointer = (props: SVGProps<SVGSVGElement>) => (
  <svg stroke="currentColor" fill="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"
    viewBox="0 0 16 16" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg" focusable="false" {...props}>
    <path d="M14.082 2.182a.5.5 0 0 1 .103.557L8.528 15.467a.5.5 0 0 1-.917-.007L5.57 10.694.803 8.652a.5.5 0 0 1-.006-.916l12.728-5.657a.5.5 0 0 1 .556.103z" />
  </svg>
);
