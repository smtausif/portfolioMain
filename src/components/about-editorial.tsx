
"use client";

import {
  motion,
  useInView,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type PanInfo,
} from "motion/react";
import { useEffect, useRef, type CSSProperties } from "react";
import "./about-editorial.css";

const clamp = (value: number, limit: number) =>
  Math.max(-limit, Math.min(limit, value));

function Sketch({
  kind = "underline",
  className = "",
  delay = 0,
}: {
  kind?: "underline" | "circle" | "laptop" | "arrow" | "marks";
  className?: string;
  delay?: number;
}) {
  const paths = {
    underline: [
      "M5 17 C35 10 57 18 88 13 S139 11 173 14",
      "M151 5 l7 -4 M181 12 l8 -3",
    ],
    circle: [
      "M104 12 C78 1 22 3 9 20 C-5 40 30 54 69 49 C105 47 124 29 110 15 C99 5 76 3 54 6",
    ],
    laptop: [
      "M22 9 L82 13 L78 54 L19 50 Z",
      "M27 15 L76 18 L73 46 L25 43 Z",
      "M19 50 L5 61 Q40 69 88 65 L78 54",
      "M36 57 L57 59 M39 25 L33 30 L39 35 M59 27 L65 32 L59 37 M52 24 L47 38",
      "M89 18 L97 13 M90 28 L102 27",
    ],
    arrow: [
      "M5 15 C38 2 62 12 60 36 C57 58 91 62 116 42",
      "M102 42 L119 39 L115 55",
    ],
    marks: [
      "M5 21 Q9 12 16 7",
      "M13 30 Q18 23 23 21",
    ],
  }[kind];

  const dimensions = {
    underline: [195, 25],
    circle: [124, 56],
    laptop: [108, 74],
    arrow: [130, 70],
    marks: [30, 40],
  }[kind];

  return (
    <svg
      aria-hidden="true"
      width={dimensions[0]}
      height={dimensions[1]}
      viewBox={`0 0 ${dimensions[0]} ${dimensions[1]}`}
      className={`about-editorial-sketch ${className}`}
      fill="none"
      stroke="currentColor"
      strokeWidth={kind === "laptop" ? 1.8 : 2.6}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {paths.map((d, index) => (
        <path
          key={d}
          d={d}
          pathLength="1"
          style={
            {
              "--draw-delay": `${delay + index * 0.22}s`,
            } as CSSProperties
          }
        />
      ))}
    </svg>
  );
}

function WallPin({ side }: { side: "left" | "right" }) {
  return (
    <svg
      className={`about-editorial-pin about-editorial-${side}Pin`}
      aria-hidden="true"
      width="24"
      height="28"
      viewBox="0 0 24 28"
      fill="none"
      stroke="#383838"
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <ellipse
        cx="13"
        cy="15"
        rx="8"
        ry="8.5"
        fill="#383838"
        stroke="none"
        opacity="0.08"
      />
      <path
        d="M12 4 C22 3 23 18 15 20 C4 24 0 10 7 6 Q10 4 12 4 Z"
        fill="#B9BAB6"
      />
      <path
        d="M7 8 Q12 4 17 9 M5 14 Q5 21 13 21"
        strokeWidth="0.7"
      />
      <path d="M8 8 L11 7" stroke="#F5F5F1" strokeWidth="2" />
      <path d="M10 14 Q7 20 12 22 Q17 22 15 17" />
    </svg>
  );
}

function HangingSign({ active }: { active: boolean }) {
  const rigRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const dragStart = useRef(-5);

  const reduced = useReducedMotion();

  const target = useMotionValue(-5);

  const spring = useSpring(target, {
    stiffness: 42,
    damping: 8.5,
    mass: 1.5,
    restDelta: 0.005,
    restSpeed: 0.005,
  });

  const width = useMotionValue(440);
  const ropeLength = useMotionValue(95);
  const rigHeight = useMotionValue(650);

  const ropeViewBox = useMotionTemplate`0 0 ${width} ${rigHeight}`;

  const angle = useTransform(() =>
    ropeLength.get() <= 100
      ? clamp(spring.get() * 0.6, 4)
      : clamp(spring.get(), 10)
  );

  const ropePath = (side: "left" | "right") => () => {
    const w = width.get();
    const length = ropeLength.get();

    const x = side === "left" ? 28 : w - 28;
    const radians = (angle.get() * Math.PI) / 180;

    const dx = x - w / 2;
    const dy = length + 12 - 16;

    const endX =
      w / 2 +
      dx * Math.cos(radians) -
      dy * Math.sin(radians);

    const endY =
      16 +
      dx * Math.sin(radians) +
      dy * Math.cos(radians);

    return `M ${x} 16 Q ${(x + endX) / 2 + 1.5} ${
      (16 + endY) / 2
    } ${endX} ${endY}`;
  };

  const leftRope = useTransform(ropePath("left"));
  const rightRope = useTransform(ropePath("right"));

  useEffect(() => {
    const rig = rigRef.current;
    if (!rig) return;

    const observer = new ResizeObserver(() => {
      const bounds = rig.getBoundingClientRect();

      width.set(bounds.width);
      rigHeight.set(bounds.height);

      ropeLength.set(
        parseFloat(
          getComputedStyle(rig).getPropertyValue("--rope-length")
        ) || 95
      );
    });

    observer.observe(rig);

    return () => observer.disconnect();
  }, [width, ropeLength, rigHeight]);

  useEffect(() => {
    if (reduced) {
      spring.jump(-5);
      return;
    }

    if (!active) return;

    target.set(3);
    spring.jump(3);
    target.set(-5);

    let settle: ReturnType<typeof setTimeout> | undefined;

    const idle = setInterval(() => {
      if (
        dragging.current ||
        !rigRef.current ||
        document.hidden
      ) {
        return;
      }

      const bounds = rigRef.current.getBoundingClientRect();

      if (
        bounds.bottom < 0 ||
        bounds.top > window.innerHeight
      ) {
        return;
      }

      target.set(-4.65);

      settle = setTimeout(() => target.set(-5), 700);
    }, 9000);

    return () => {
      clearInterval(idle);
      clearTimeout(settle);
    };
  }, [active, reduced, spring, target]);

  function panMove(_: unknown, info: PanInfo) {
    if (reduced) return;

    const limit = ropeLength.get() <= 100 ? 8 : 10;

    target.set(
      clamp(
        dragStart.current + info.offset.x * 0.1,
        limit
      )
    );
  }

  return (
    <div className="about-editorial-leftColumn">
      <div ref={rigRef} className="about-editorial-rig">
        <WallPin side="left" />
        <WallPin side="right" />

        <motion.svg
          className="about-editorial-ropes"
          aria-hidden="true"
          width={width}
          height={rigHeight}
          viewBox={ropeViewBox}
          preserveAspectRatio="none"
          fill="none"
          strokeLinecap="round"
        >
          {[leftRope, rightRope].map((path, index) => (
            <g key={index}>
              <motion.path
                d={path}
                stroke="#383838"
                strokeWidth="3.6"
              />
              <motion.path
                d={path}
                stroke="#B9AD98"
                strokeWidth="2.3"
              />
              <motion.path
                d={path}
                stroke="#F0E8D9"
                strokeWidth="1.6"
                strokeDasharray="1 4"
              />
              <motion.path
                d={path}
                stroke="#383838"
                strokeWidth="1.1"
                strokeDasharray="1 4"
                strokeDashoffset="2.5"
              />
            </g>
          ))}
        </motion.svg>

        <motion.article
          className="about-editorial-sign"
          style={{ rotate: angle }}
          onPointerMove={(event) => {
            if (
              reduced ||
              dragging.current ||
              event.pointerType === "touch"
            ) {
              return;
            }

            const bounds =
              event.currentTarget.getBoundingClientRect();

            target.set(
              -5 +
                clamp(
                  (event.clientX - bounds.left) /
                    bounds.width -
                    0.5,
                  0.5
                ) *
                  4
            );
          }}
          onPointerLeave={() => {
            if (!dragging.current) target.set(-5);
          }}
        >
          <svg
            className="about-editorial-signBorder"
            aria-hidden="true"
            width="440"
            height="420"
            viewBox="0 0 440 420"
            preserveAspectRatio="none"
            fill="none"
            stroke="#383838"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path
              d="M5 4 Q212 1 435 5 L437 209 L434 415 Q217 418 4 414 L3 202 Z"
              strokeWidth="1.5"
              vectorEffect="non-scaling-stroke"
            />
            <path
              d="M8 7 L432 3 M437 17 L435 402 M426 417 L11 416 M5 408 L2 18"
              strokeWidth="0.6"
              opacity="0.55"
              vectorEffect="non-scaling-stroke"
            />
          </svg>

          <span
            className="about-editorial-ring about-editorial-leftRing"
            aria-hidden="true"
          />

          <span
            className="about-editorial-ring about-editorial-rightRing"
            aria-hidden="true"
          />

          <motion.button
            type="button"
            className="about-editorial-grabHandle"
            aria-label="Swing the hanging About Me sign. Use left and right arrow keys, or drag horizontally."
            onPanStart={() => {
              dragging.current = true;
              dragStart.current = spring.get();
            }}
            onPan={panMove}
            onPanEnd={() => {
              dragging.current = false;
              target.set(-5);
            }}
            onPointerCancel={() => {
              dragging.current = false;
              target.set(-5);
            }}
            onClick={() => {
              if (!reduced) {
                target.set(1);
                spring.jump(1);
                target.set(-5);
              }
            }}
            onKeyDown={(event) => {
              if (
                reduced ||
                !["ArrowLeft", "ArrowRight"].includes(
                  event.key
                )
              ) {
                return;
              }

              event.preventDefault();

              target.set(
                event.key === "ArrowLeft" ? -9 : 2
              );
            }}
            onKeyUp={() => target.set(-5)}
            onBlur={() => target.set(-5)}
          >
            <span aria-hidden="true">⠿</span>
          </motion.button>

          <h2
            id="about-heading"
            className="about-editorial-heading"
          >
            ABOUT ME
            <Sketch
              className="about-editorial-meUnderline"
              delay={0.25}
            />
          </h2>

          <h3 className="about-editorial-greeting">
            Hey, I&apos;m{" "}
            <span className="about-editorial-name">
              Tausif
              <Sketch
                kind="circle"
                className="about-editorial-nameCircle"
                delay={0.7}
              />
            </span>
            .
          </h3>

          <p className="about-editorial-intro">
            I&apos;m a software developer based in
            Toronto, Canada, with a passion for
            building applications that solve{" "}
            <span className="about-editorial-brush">
              real-world problems.
            </span>
          </p>
        </motion.article>

        <Sketch
          kind="marks"
          className="about-editorial-motionLines"
          delay={0.7}
        />
      </div>

      <Sketch
        kind="arrow"
        className="about-editorial-arrow"
        delay={1.25}
      />
    </div>
  );
}

/* =========================================
   ABOUT ME CONTENT
========================================= */

const paragraphs = [
  "My focus is on full-stack development and backend engineering, where I enjoy turning complex ideas into reliable, scalable, and user-friendly software.",
  "I studied Advanced Diploma in Computer Programming & Analysis at Seneca Polytechnic, while gaining hands-on experience through professional IT support, collaborative development, and independent projects.",
  "From developing AI-powered applications to building web platforms and backend systems, I enjoy exploring new technologies and challenging myself to create something meaningful.",
  "Curiosity, continuous learning, and the satisfaction of turning an idea into something people can actually use.",
  "I'm always looking for opportunities to grow as a developer, collaborate with talented people, and build software that makes a difference.",
];

const accentPattern =
  /(full-stack development|backend engineering|AI-powered applications|Seneca Polytechnic|backend systems|continuous learning|makes a difference)/g;

const accentPhrases = new Set([
  "full-stack development",
  "backend engineering",
  "AI-powered applications",
  "Seneca Polytechnic",
  "backend systems",
  "continuous learning",
  "makes a difference",
]);

const markerPhrases = new Set([
  "Seneca Polytechnic",
  "continuous learning",
  "makes a difference",
]);

/* =========================================
   WHAT DRIVES ME
========================================= */

function DrivesHeading() {
  const ref = useRef<HTMLHeadingElement>(null);

  const active = useInView(ref, {
    once: true,
    amount: 0.5,
  });

  return (
    <h3
      ref={ref}
      className="about-editorial-drives about-editorial-brush"
      data-sketch-active={
        active ? "true" : undefined
      }
    >
      What drives me?

      <Sketch
        className="about-editorial-drivesUnderline"
        delay={0.1}
      />

      <Sketch
        kind="marks"
        className="about-editorial-drivesMarks"
        delay={0.6}
      />
    </h3>
  );
}

/* =========================================
   NORMAL TEXT FLOW
   FIXES BROKEN WORD SPACING
========================================= */

function TypedParagraph({
  text,
  offset,
}: {
  text: string;
  offset: number;
}) {
  const parts = text.split(accentPattern);

  return (
    <motion.p
      className="about-editorial-paragraph"
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{
        once: true,
        amount: 0.15,
      }}
      transition={{
        duration: 0.55,
        delay: Math.min(offset * 0.15, 0.35),
        ease: "easeOut",
      }}
    >
      {parts.map((part, index) => {
        if (!accentPhrases.has(part)) {
          return (
            <span key={index}>
              {part}
            </span>
          );
        }

        const marker = markerPhrases.has(part);

        return (
          <span
            key={index}
            className={
              marker
                ? "about-editorial-highlight about-editorial-markerWord"
                : "about-editorial-highlight about-editorial-underlinedWord"
            }
          >
            {part}
          </span>
        );
      })}
    </motion.p>
  );
}

/* =========================================
   COMPLETE ABOUT EDITORIAL
========================================= */

export function AboutEditorial() {
  const ref = useRef<HTMLDivElement>(null);

  const active = useInView(ref, {
    once: true,
    amount: 0.12,
  });

  return (
    <div
      ref={ref}
      className="about-editorial"
      data-animate={
        active ? "true" : undefined
      }
    >
      <HangingSign active={active} />

      <div className="about-editorial-copy">
        <Sketch
          kind="laptop"
          className="about-editorial-laptop"
          delay={0.5}
        />

        {paragraphs.map((paragraph, index) => (
          <div
            key={index}
            className="about-editorial-copyBlock"
          >
            {index === 3 && <DrivesHeading />}

            <TypedParagraph
              text={paragraph}
              offset={index * 0.2}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
