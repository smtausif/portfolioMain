"use client";

import { useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";

const CURSOR_MEDIA = "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)";
const MOVEMENT_SPRING = { stiffness: 380, damping: 30, mass: 0.6 };
const HOVER_SPRING = { stiffness: 320, damping: 26, mass: 0.5 };

export function AnimatedCursor({ enabled = true }: { enabled?: boolean }) {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, MOVEMENT_SPRING);
  const ringY = useSpring(y, MOVEMENT_SPRING);
  const visibility = useMotionValue(0);
  const diameter = useMotionValue(32);
  const ringSize = useSpring(diameter, HOVER_SPRING);
  const press = useMotionValue(1);
  const ringScale = useSpring(press, HOVER_SPRING);
  const dotTarget = useMotionValue(1);
  const dotScale = useSpring(dotTarget, HOVER_SPRING);
  const glowTarget = useMotionValue(0);
  const glow = useSpring(glowTarget, HOVER_SPRING);
  const ringShadow = useTransform(glow, [0, 1], [
    "0 0 0 0 color-mix(in srgb, var(--theme-accent) 0%, transparent)",
    "0 0 0 5px color-mix(in srgb, var(--theme-accent) 8%, transparent)",
  ]);
  const labelTarget = useMotionValue(0);
  const labelOpacity = useSpring(labelTarget, HOVER_SPRING);

  useEffect(() => {
    if (!enabled) return;
    const media = window.matchMedia(CURSOR_MEDIA);
    const html = document.documentElement;
    let shown = false;
    let hoverMode = "";
    let scrollFrame = 0;

    const hide = () => {
      visibility.set(0);
      html.removeAttribute("data-cursor-active");
      shown = false;
      press.set(1);
    };

    const updateTarget = (target: Element | null) => {
      // Native editing cursors remain available for text fields and editors.
      if (!media.matches || !target || target.closest(
        "input:not([type='button']):not([type='submit']):not([type='reset']), textarea, [contenteditable]:not([contenteditable='false'])",
      )) {
        hide();
        return;
      }

      if (!shown) {
        ringX.jump(x.get());
        ringY.jump(y.get());
        visibility.set(1);
        html.setAttribute("data-cursor-active", "");
        shown = true;
      }

      // Use the existing card wrapper; no portfolio components need changing.
      const project = target.closest('[class~="group/product"]');
      const projectLink = project?.querySelector("a[href]:not([aria-disabled='true'])");
      const interactive = target.closest("a[href], button, [role='button'], [role='link'], input[type='button'], input[type='submit'], input[type='reset']");
      const actionable = interactive && !interactive.matches(":disabled, [aria-disabled='true']");
      const mode = project ? (projectLink ? "project-link" : "project") : actionable ? "link" : "default";
      if (hoverMode === mode) return;
      hoverMode = mode;
      diameter.set(project ? 65 : actionable ? 55 : 32);
      dotTarget.set(mode === "default" ? 1 : 0.7);
      glowTarget.set(mode === "default" ? 0 : 1);
      labelTarget.set(mode === "project-link" ? 1 : 0);
    };

    const move = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") {
        hide();
        return;
      }
      x.set(event.clientX);
      y.set(event.clientY);
      updateTarget(event.target instanceof Element ? event.target : null);
    };
    const pressDown = (event: PointerEvent) => {
      if (shown && event.pointerType === "mouse" && event.button === 0) press.set(0.82);
    };
    const release = () => press.set(1);
    const leave = (event: PointerEvent) => {
      if (event.relatedTarget === null) hide();
    };
    const checkMedia = () => { if (!media.matches) hide(); };
    const checkVisibility = () => { if (document.hidden) hide(); };
    const checkScroll = () => {
      if (!shown || scrollFrame) return;
      scrollFrame = requestAnimationFrame(() => {
        scrollFrame = 0;
        updateTarget(document.elementFromPoint(x.get(), y.get()));
      });
    };

    document.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerover", move, { passive: true });
    document.addEventListener("pointerout", leave, { passive: true });
    document.addEventListener("pointerdown", pressDown, { passive: true });
    window.addEventListener("pointerup", release, { passive: true });
    window.addEventListener("pointercancel", hide, { passive: true });
    window.addEventListener("blur", hide);
    document.addEventListener("visibilitychange", checkVisibility);
    document.addEventListener("scroll", checkScroll, { passive: true, capture: true });
    media.addEventListener("change", checkMedia);

    return () => {
      hide();
      cancelAnimationFrame(scrollFrame);
      document.removeEventListener("pointermove", move);
      document.removeEventListener("pointerover", move);
      document.removeEventListener("pointerout", leave);
      document.removeEventListener("pointerdown", pressDown);
      window.removeEventListener("pointerup", release);
      window.removeEventListener("pointercancel", hide);
      window.removeEventListener("blur", hide);
      document.removeEventListener("visibilitychange", checkVisibility);
      document.removeEventListener("scroll", checkScroll, true);
      media.removeEventListener("change", checkMedia);
    };
  }, [enabled, x, y, ringX, ringY, visibility, diameter, press, dotTarget, glowTarget, labelTarget]);

  return (
    <motion.div aria-hidden="true" data-animated-cursor=""
      className="pointer-events-none fixed inset-0 z-[2147483647]"
      style={{ opacity: visibility }}>
      <motion.div
        className="pointer-events-none absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 rounded-full border border-accent/70"
        style={{ x: ringX, y: ringY, width: ringSize, height: ringSize, scale: ringScale, boxShadow: ringShadow }}>
        <motion.span className="pointer-events-none absolute top-[calc(50%+6px)] left-1/2 -translate-x-1/2 font-mono text-[9px] leading-none font-medium tracking-wider text-accent"
          style={{ opacity: labelOpacity }}>
          VIEW
        </motion.span>
      </motion.div>
      <motion.div
        className="pointer-events-none absolute top-0 left-0 size-[5px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent"
        style={{ x, y, scale: dotScale }} />
    </motion.div>
  );
}
