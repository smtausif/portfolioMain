
"use client";

import { Suspense, useRef, useState, useSyncExternalStore } from "react";
import type { ReactNode } from "react";
import Image from "next/image";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  type MotionStyle,
  type MotionValue,
} from "motion/react";
import {
  ArrowUpRight,
  Check,
  CheckCircle2,
  Copy,
  Mail,
} from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";

import "./contact-section.css";

const EMAIL = "smtausif2000@gmail.com";
const LINKEDIN_URL =
  "https://www.linkedin.com/in/s-m-tausif-960524262/";
const GITHUB_URL = "https://github.com/smtausif";

const CHARACTER_IMAGE = "/projects/waving-developer.png.png";

function CopyrightYear() {
  return new Date().getFullYear();
}

const COMPACT_VIEWPORT = "(max-width: 1100px)";

function subscribeToCompactViewport(onChange: () => void) {
  const query = window.matchMedia(COMPACT_VIEWPORT);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

function isCompactViewport() {
  return window.matchMedia(COMPACT_VIEWPORT).matches;
}

function subscribeToReducedMotion(onChange: () => void) {
  const query = window.matchMedia("(prefers-reduced-motion: reduce)");
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

function isReducedMotionEnabled() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function serverMediaSnapshot() {
  return false;
}

function subscribeToYear() {
  return () => {};
}

function currentYearSnapshot() {
  return new Date().getFullYear();
}

function serverYearSnapshot() {
  return null;
}

type CardDepth = {
  range: [number, number];
  side: -1 | 1;
  distance: number;
  tilt: number;
  depth: number;
};

const TERMINAL_DEPTH: CardDepth = {
  range: [0, 0.88], side: -1, distance: 640, tilt: -3, depth: 420,
};
const CHECKLIST_DEPTH: CardDepth = {
  range: [0.1, 1], side: -1, distance: 740, tilt: -5, depth: 560,
};
const BROWSER_DEPTH: CardDepth = {
  range: [0.04, 0.94], side: 1, distance: 660, tilt: 4, depth: 460,
};

function useCardDepth(
  scrollProgress: MotionValue<number>,
  profile: CardDepth,
  compact: boolean,
  reducedMotion: boolean,
): MotionStyle {
  // Spring the scroll position so both directions follow the same continuous path.
  const mappedProgress = useTransform(scrollProgress, profile.range, [0, 1]);
  const springProgress = useSpring(mappedProgress, { stiffness: 100, damping: 25 });
  // Keep even a fast scroll's spring overshoot inside the safe grid endpoints.
  const progress = useTransform(springProgress, (value) => Math.min(1, Math.max(0, value)));
  const distance = compact ? 16 : profile.distance;
  const scale = useTransform(progress, [0, 1], [compact ? 0.93 : 0.64, 1]);
  const x = useTransform(progress, [0, 1], [distance * profile.side, 0]);
  const y = useTransform(progress, [0, 1], [compact ? 18 : 72, 0]);
  const z = useTransform(progress, [0, 1], [compact ? -60 : -profile.depth, 0]);
  const rotateX = useTransform(progress, [0, 1], [compact ? 3 : 14, 0]);
  const rotateY = useTransform(progress, [0, 1], [-profile.side * (compact ? 4 : 30), 0]);
  const opacity = useTransform(progress, [0, 1], [compact ? 0.88 : 0.55, 1]);

  return {
    scale: reducedMotion ? 1 : scale,
    x: reducedMotion ? 0 : x,
    y: reducedMotion ? 0 : y,
    z: reducedMotion ? 0 : z,
    rotateX: reducedMotion ? 0 : rotateX,
    rotateY: reducedMotion ? 0 : rotateY,
    rotate: profile.tilt,
    opacity: reducedMotion ? 1 : opacity,
  };
}

/* =========================================
   HIGHLIGHTED TEXT
   ========================================= */

function Highlight({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <span className="contact-highlight">
      {children}
    </span>
  );
}

/* =========================================
   HAND-DRAWN ARROW
   ========================================= */

function SketchArrow({
  className = "",
}: {
  className?: string;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 150 90"
      fill="none"
      aria-hidden="true"
    >
      <motion.path
        d="M5 74C35 14 72 20 121 34M99 12L124 34L98 54"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.3 }}
      />
    </svg>
  );
}

/* =========================================
   FLOATING TERMINAL WINDOW
   ========================================= */

function BuildWindow({ style }: { style: MotionStyle }) {
  return (
    <motion.div
      className="contact-build-window"
      style={style}
    >
      <div className="contact-window-dots">
        <i />
        <i />
        <i />
      </div>

      <div className="contact-terminal-command">
        &gt; npm run build
      </div>

      <div className="contact-terminal-success">
        <Check size={19} strokeWidth={3} />

        <span>
          Built successfully
          <small>Ready to ship</small>
        </span>
      </div>

      <span className="contact-floating-tag contact-tag-purple">
        Development
      </span>
    </motion.div>
  );
}

/* =========================================
   DEVELOPMENT CHECKLIST
   ========================================= */

function BuildChecklist({ style }: { style: MotionStyle }) {
  const items = [
    { label: "Plan", checked: true },
    { label: "Build", checked: true },
    { label: "Iterate", checked: false },
    { label: "Ship", checked: false },
  ];

  return (
    <motion.div
      className="contact-checklist"
      style={style}
    >
      {items.map((item) => (
        <div
          className="contact-checklist-item"
          key={item.label}
        >
          <span
            className={
              item.checked ? "checked" : ""
            }
          >
            {item.checked && (
              <Check
                size={15}
                strokeWidth={3}
              />
            )}
          </span>

          {item.label}
        </div>
      ))}
    </motion.div>
  );
}

/* =========================================
   BROWSER SKETCH
   ========================================= */

function BrowserSketch({ style }: { style: MotionStyle }) {
  return (
    <motion.div
      className="contact-browser-sketch"
      style={style}
    >
      <div className="contact-browser-dots">
        <span />
        <span />
        <span />
      </div>

      <div className="contact-browser-body">
        <svg
          viewBox="0 0 120 90"
          fill="none"
          aria-hidden="true"
        >
          <rect
            x="8"
            y="8"
            width="104"
            height="74"
            rx="6"
            stroke="currentColor"
            strokeWidth="3"
          />

          <circle
            cx="78"
            cy="28"
            r="8"
            stroke="currentColor"
            strokeWidth="3"
          />

          <path
            d="M15 73L44 43L62 58L78 45L105 73"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        <div className="contact-browser-lines">
          <span />
          <span />
          <span />
        </div>
      </div>

      <span className="contact-floating-tag contact-tag-orange">
        Product
      </span>
    </motion.div>
  );
}

/* =========================================
   YOUR ACTUAL CHARACTER IMAGE
   NO SVG CHARACTER
   NO CHARACTER ANIMATION
   ========================================= */

function WavingDeveloper() {
  return (
    <div className="contact-character">
      <Image
        src={CHARACTER_IMAGE}
        alt="Friendly illustrated developer waving hello"
        width={1312}
        height={1199}
        className="contact-character-image"
        sizes="(max-width: 600px) 464px, (max-width: 900px) 496px, 542px"
      />
    </div>
  );
}

/* =========================================
   MAIN CONTACT SECTION
   ========================================= */

export function ContactSection() {
  const [copied, setCopied] =
    useState(false);
  // Read the clock after hydration; Next.js cannot prerender a live date here.
  const copyrightYear = useSyncExternalStore(subscribeToYear, currentYearSnapshot, serverYearSnapshot);
  const philosophyRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useSyncExternalStore(
    subscribeToReducedMotion,
    isReducedMotionEnabled,
    serverMediaSnapshot,
  );
  const compact = useSyncExternalStore(
    subscribeToCompactViewport,
    isCompactViewport,
    serverMediaSnapshot,
  );
  const { scrollYProgress } = useScroll({
    target: philosophyRef,
    offset: ["start 95%", "start 30%"],
  });
  const terminalStyle = useCardDepth(scrollYProgress, TERMINAL_DEPTH, compact, reducedMotion);
  const checklistStyle = useCardDepth(scrollYProgress, CHECKLIST_DEPTH, compact, reducedMotion);
  const browserStyle = useCardDepth(scrollYProgress, BROWSER_DEPTH, compact, reducedMotion);

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(
        EMAIL
      );

      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      window.location.href =
        `mailto:${EMAIL}`;
    }
  }

  return (
    <section
      className="contact-section"
      id="contact"
    >
      {/* =========================
          PART 1: HOW I THINK
          ========================= */}

      <div ref={philosophyRef} className="contact-philosophy">
        <BuildWindow style={terminalStyle} />

        <BuildChecklist style={checklistStyle} />

        <BrowserSketch style={browserStyle} />

        <motion.div
          className="contact-philosophy-content"
          initial={{
            opacity: 0,
          }}
          whileInView={{
            opacity: 1,
          }}
          viewport={{ once: true }}
          transition={{
            duration: 0.8,
          }}
        >
          <span className="contact-eyebrow">
            HOW I THINK
          </span>

          <h2>
            Good software
            <br />
            isn&apos;t an{" "}
            <span className="contact-headline-highlight">
              accident.
            </span>
          </h2>

          <p>
            It&apos;s the result of
            thoughtful decisions,
            strong foundations,
            and knowing when{" "}
            <Highlight>
              simplicity
            </Highlight>{" "}
            matters more than complexity.
          </p>
        </motion.div>

        <SketchArrow
          className="contact-philosophy-arrow"
        />
      </div>

      <div
        className="contact-handdrawn-divider"
        aria-hidden="true"
      />

      {/* =========================
          PART 2: MY APPROACH
          ========================= */}

      <div className="contact-connect">
        {/* LEFT COLUMN */}

        <div className="contact-approach">
          <span className="contact-handwriting">
            My Approach
          </span>

          <p>
            I focus on{" "}
            <Highlight>
              what matters
            </Highlight>
            , question what
            doesn&apos;t, and build
            with the{" "}
            <Highlight>
              bigger picture
            </Highlight>{" "}
            in mind.
          </p>
        </div>

        {/* CENTER COLUMN */}

        <div className="contact-character-area">
          <WavingDeveloper />

          <motion.div
            className="contact-chat-bubble"
            initial={{
              opacity: 0,
              scale: 0.8,
              y: 15,
            }}
            whileInView={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            viewport={{ once: true }}
            transition={{
              type: "spring",
              stiffness: 180,
              damping: 15,
              delay: 0.2,
            }}
          >
            Have something
            <br />
            in mind?
            <br />
            Let&apos;s talk.
          </motion.div>
        </div>

        {/* RIGHT COLUMN */}

        <div className="contact-links-area">
          <div
            className="contact-down-arrows"
            aria-hidden="true"
          >
            ↓ ↓ ↓
          </div>

          <div className="contact-email-group">
            <button
              className="contact-sketch-button"
              onClick={copyEmail}
              type="button"
              title="Copy email address"
            >
              {copied ? (
                <CheckCircle2 />
              ) : (
                <Mail />
              )}

              <span>
                {copied
                  ? "Copied!"
                  : EMAIL}
              </span>

              <Copy
                className="contact-copy-icon"
                size={17}
              />
            </button>

            <span className="contact-tap-hint">
              tap to copy
            </span>
          </div>

          <a
            className="contact-sketch-button"
            href={LINKEDIN_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaLinkedin />

            <span>LinkedIn</span>

            <ArrowUpRight size={17} />
          </a>

          <a
            className="contact-sketch-button"
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaGithub />

            <span>GitHub</span>

            <ArrowUpRight size={17} />
          </a>
        </div>
      </div>

      {/* =========================
          FOOTER
          ========================= */}

      <footer className="contact-footer">
        <span>
          Made with curiosity
          and a lot of coffee.
        </span>

        <span>
          © {copyrightYear} SM Tausif
        </span>
      </footer>
    </section>
  );
}
