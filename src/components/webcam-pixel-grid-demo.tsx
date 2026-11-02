"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring, useTransform } from "motion/react";
import { HeroParallaxDemo } from "@/components/hero-parallax-demo";
import { WebcamPixelGrid } from "@/components/ui/webcam-pixel-grid";
import { portfolioTheme } from "@/lib/theme";
import "./hero.css";

export function WebcamPixelGridDemo() {
  const scrollTarget = useRef<HTMLElement>(null);
  // The sticky viewport travels until the bottom of the hero meets the viewport
  // bottom. This makes the entire 0–100% timeline reachable on this page.
  const { scrollYProgress } = useScroll({
    target: scrollTarget,
    offset: ["start start", "end end"],
  });
  const heroOpacity = useSpring(
    useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.5, 0]),
    { stiffness: 300, damping: 30 },
  );
  // Hidden links must also leave keyboard navigation once the fade finishes.
  const heroVisibility = useTransform(heroOpacity, (opacity) =>
    opacity <= 0.001 ? "hidden" : "visible",
  );

  return (
    <main ref={scrollTarget} style={{ backgroundColor: portfolioTheme.background }} className="relative isolate h-[300svh] w-full bg-background text-foreground">
      <div style={{ backgroundColor: portfolioTheme.background }} className="sticky top-0 isolate h-svh min-h-[34rem] w-full overflow-hidden">
        <div style={{ backgroundColor: portfolioTheme.background }} className="absolute inset-0">
          <WebcamPixelGrid
            gridCols={60}
            gridRows={40}
            maxElevation={50}
            motionSensitivity={0.25}
            elevationSmoothing={0.2}
            colorMode="webcam"
            backgroundColor={portfolioTheme.background}
            mirror={true}
            gapRatio={0.05}
            invertColors={false}
            darken={0.6}
            borderColor={portfolioTheme.border}
            borderOpacity={0.06}
            className="h-full w-full"
            fallback={<HeroParallaxDemo scrollProgress={scrollYProgress} />}
          />
        </div>

        <motion.div style={{ opacity: heroOpacity, visibility: heroVisibility }}
          className="hero-editorial-copy pointer-events-none relative z-30 flex h-full w-full flex-col items-center justify-center px-5 pt-28 pb-12 sm:px-10 sm:pt-32 sm:pb-16">
          <div className="hero-editorial-content w-full max-w-6xl text-center">
            <p className="hero-editorial-intro">Hi, I&apos;m Tausif</p>
            <h1 className="hero-editorial-headline">
              I turn complex ideas into software that <span className="hero-editorial-marker"><span>actually works.</span></span>
            </h1>
            <p className="hero-editorial-subtitle mx-auto mt-6 max-w-3xl text-[clamp(0.6875rem,1.15vw,0.875rem)] leading-relaxed font-medium tracking-[0.12em] text-secondary sm:tracking-[0.16em]">
              SOFTWARE DEVELOPER | FULL-STACK &amp; BACKEND ENGINEERING
            </p>
            <p className="hero-editorial-note"><span>Recently, I worked at HuntigoX as a Product Developer, building user-focused applications and turning ideas into real products.</span></p>
            <div className="hero-editorial-actions mt-7 flex flex-col items-center justify-center gap-4 sm:mt-8 sm:flex-row">
              <a href="#projects"
                className="hero-editorial-button pointer-events-auto group inline-flex h-13 w-full max-w-64 items-center justify-center gap-3 rounded-full border border-border bg-card px-8 text-sm font-semibold text-foreground shadow-soft transition-[background-color,border-color,color,box-shadow,translate] duration-300 hover:border-accent/50 hover:bg-surface hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent motion-safe:hover:-translate-y-0.5 sm:w-auto">
                Explore Projects
                <svg aria-hidden="true" width="16" height="16" className="size-4 transition-transform motion-safe:group-hover:translate-x-1 motion-reduce:transition-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 12h16m-6-6 6 6-6 6" />
                </svg>
              </a>
              <a href="/resume.pdf" target="_blank" rel="noopener noreferrer"
                aria-label="View Resume (PDF, opens in a new tab)"
                className="hero-editorial-button pointer-events-auto inline-flex h-13 w-full max-w-64 items-center justify-center gap-3 rounded-full border border-border bg-card px-8 text-sm font-semibold text-foreground shadow-soft transition-[background-color,border-color,color,box-shadow,translate] duration-300 hover:border-accent/50 hover:bg-surface hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent motion-safe:hover:-translate-y-0.5 sm:w-auto">
                View Resume
                <svg aria-hidden="true" width="16" height="16" className="size-4 text-current" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7 17 17 7M7 7h10v10" />
                </svg>
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
