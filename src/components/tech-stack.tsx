
"use client";

import dynamic from "next/dynamic";
import { portfolioTheme } from "@/lib/theme";
import { TechStackSphere } from "@/components/tech-stack-sphere";
import { technologies } from "@/lib/technologies";
import { LearningStatement } from "@/components/learning-statement";
import { Component, useRef, type ReactNode } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import "./tech-stack.css";

const BackgroundCubesGrid = dynamic(
  () =>
    import("@/components/ui/background-cubes-grid").then(
      (module) => module.BackgroundCubesGrid
    ),
  { ssr: false }
);

class CubesBoundary extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}

function SphereDoodles() {
  return (
    <div
      className="tech-sphere-doodles"
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
      }}
    >
      <svg
        viewBox="0 0 600 600"
        preserveAspectRatio="xMidYMid meet"
        style={{
          width: "100%",
          height: "100%",
          overflow: "visible",
        }}
        fill="none"
        stroke="#D0D0D0"
        strokeWidth="7"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* Hand-drawn sparkle */}
        <motion.path
          d="M115 90 Q132 125 165 140 Q132 155 115 190 Q98 155 65 140 Q98 125 115 90Z"
          animate={{
            y: [0, -9, 0],
            rotate: [-3, 3, -3],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Heart-shaped doodle */}
        <motion.path
          d="M430 295 C402 265 366 291 380 330 C392 367 430 395 430 395 C430 395 485 354 485 320 C485 286 449 273 430 295Z"
          animate={{
            y: [0, -12, 0],
            opacity: [0.35, 0.6, 0.35],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />

        {/* Small sparkle */}
        <motion.path
          d="M110 450 Q120 475 145 485 Q120 495 110 520 Q100 495 75 485 Q100 475 110 450Z"
          animate={{
            y: [0, -8, 0],
            rotate: [0, 6, 0],
            opacity: [0.3, 0.55, 0.3],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        />
      </svg>
    </div>
  );
}

export function TechStack() {
  const sectionRef = useRef<HTMLElement>(null);
  const nearby = useInView(sectionRef, { margin: "200px 0px" });
  const reducedMotion = useReducedMotion();

  const initial = reducedMotion
    ? false
    : { opacity: 0, y: 16 };

  return (
    <section
      ref={sectionRef}
      id="tech-stack"
      aria-labelledby="tech-stack-heading"
      className="tech-stack-section relative isolate overflow-clip bg-background text-foreground"
    >
      {/* Animated isometric background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
      >
        {nearby && reducedMotion === false && (
          <CubesBoundary>
            <BackgroundCubesGrid
              variant="isometric"
              cellSize={110}
              gap={0.035}
              topColor={portfolioTheme.cubeTop}
              leftColor={portfolioTheme.cubeLeft}
              rightColor={portfolioTheme.cubeRight}
              glowColor={portfolioTheme.track}
              glow={0}
              amplitude={0.7}
              speed={7}
              damping={0.08}
              idleRipples={true}
              idleDelay={1.5}
            />
          </CubesBoundary>
        )}
      </div>

      <div className="tech-stack-container">
        {/* Centered heading */}
        <motion.header
          initial={initial}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{
            duration: reducedMotion ? 0 : 0.6,
            ease: "easeOut",
          }}
          className="tech-stack-header"
          style={{ textAlign: "center" }}
        >
          <h2
            id="tech-stack-heading"
            className="tech-stack-title leading-none font-extrabold tracking-[-0.05em]"
          >
            TECH STACK
          </h2>

          <p className="tech-stack-subtitle leading-tight font-semibold tracking-tight"
            style={{ marginInline: "auto" }}>
            Technologies I Work With
          </p>

          <p
            className="tech-stack-description text-secondary"
            style={{ marginInline: "auto" }}
          >
            From building responsive interfaces to developing backend
            systems, these are the technologies and tools I use to turn
            ideas into working applications.
          </p>
        </motion.header>

        {/* Sphere and illustration */}
        <div className="tech-stack-content">
          <motion.div
            className="tech-stack-sphere-column"
            initial={initial}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{
              duration: reducedMotion ? 0 : 0.55,
              ease: "easeOut",
            }}
            style={{ position: "relative" }}
          >
            <SphereDoodles />

            <div style={{ position: "relative", zIndex: 1, width: "100%" }}>
              <TechStackSphere technologies={technologies} />
            </div>
          </motion.div>

          <div className="tech-stack-terminal-column">
            <LearningStatement />
          </div>
        </div>

        <motion.p
          initial={initial}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            duration: reducedMotion ? 0 : 0.5,
          }}
          className="tech-stack-footer text-center leading-7 text-secondary"
        >
          Always learning. Always building.
        </motion.p>
      </div>
    </section>
  );
}
