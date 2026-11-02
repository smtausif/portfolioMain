
"use client";

import Image from "next/image";
import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type PointerEvent,
} from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { createSpherePoints, rotateSpherePoints } from "@/lib/tech-sphere";
import "./tech-stack-sphere.css";

export interface TechStackSphereProps {
  technologies: readonly { name: string; logo: string }[];
  className?: string;
}

function SketchArrow() {
  const reducedMotion = useReducedMotion();

  return (
    <div
      className="tech-sphere-hint"
      aria-hidden="true"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginTop: "0px",
        height: "85px",
        pointerEvents: "none",
      }}
    >
      <motion.svg
        viewBox="0 0 150 160"
        width="90"
        height="96"
        fill="none"
        stroke="#444444"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{
          overflow: "visible",
          rotate: -20,
        }}
      >
        <motion.path
          d="
            M112 12
            C87 33 59 68 63 91
            C67 112 94 108 106 92
            C124 65 99 46 78 55
            C48 68 38 111 43 141
            M43 141
            L16 119
            M43 141
            L61 112
          "
          initial={reducedMotion ? false : { pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{
            duration: reducedMotion ? 0 : 1.6,
            ease: "easeInOut",
          }}
        />
      </motion.svg>
    </div>
  );
}

export function TechStackSphere({
  technologies,
  className = "",
}: TechStackSphereProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const nodes = useRef<(HTMLDivElement | null)[]>([]);

  const initialPoints = useMemo(
    () => createSpherePoints(technologies.length),
    [technologies.length],
  );

  const points = useRef(initialPoints.map((point) => ({ ...point })));
  const radius = useRef(165);
  const hovered = useRef(false);
  const focused = useRef(false);

  const drag = useRef<{
    id: number;
    x: number;
    y: number;
    time: number;
  } | null>(null);

  const velocity = useRef({ pitch: 0, yaw: 0 });
  const animationFrame = useRef<number | null>(null);

  const inView = useInView(rootRef, { amount: 0.1 });

  const entered = useInView(rootRef, {
    once: true,
    amount: 0.3,
  });

  const reducedMotion = useReducedMotion();
  const [assembled, setAssembled] = useState(false);
  const tooltipId = useId();

  const arrivals = useMemo(
    () =>
      technologies.map((_, index) => {
        const angle = index * 2.399963229728653;

        return {
          x: Math.cos(angle) * (420 + (index % 3) * 70),
          y: Math.sin(angle) * (350 + (index % 4) * 45),
          rotation: index % 2 === 0 ? -45 : 45,
        };
      }),
    [technologies],
  );

  const paint = useCallback(() => {
    points.current.forEach((point, index) => {
      const node = nodes.current[index];
      if (!node) return;

      node.style.transform = `translate3d(
        ${point.x * radius.current}px,
        ${point.y * radius.current}px,
        ${point.z * radius.current}px
      )`;

      node.style.setProperty(
        "--sphere-brightness",
        String(0.55 + ((point.z + 1) / 2) * 0.45),
      );

      const projectedX =
        (point.x * radius.current) /
        (1 - (point.z * radius.current) / 800);

      const halfWidth = (rootRef.current?.clientWidth ?? 450) / 2;

      const labelX = Math.max(
        -halfWidth + 92,
        Math.min(halfWidth - 92, projectedX),
      );

      node.style.setProperty(
        "--sphere-tooltip-shift",
        `${labelX - projectedX}px`,
      );
    });
  }, []);

  useEffect(() => {
    points.current = initialPoints.map((point) => ({ ...point }));

    const root = rootRef.current;
    if (!root) return;

    const resize = () => {
      radius.current =
        Math.min(root.clientWidth, root.clientHeight) * 0.37;

      paint();
    };

    resize();

    const observer = new ResizeObserver(resize);
    observer.observe(root);

    return () => observer.disconnect();
  }, [initialPoints, paint]);

  useEffect(() => {
    if (!entered) return;

    if (reducedMotion) {
      return;
    }

    const timeout = window.setTimeout(() => {
      setAssembled(true);
    }, 100);

    return () => window.clearTimeout(timeout);
  }, [entered, reducedMotion]);

  useEffect(() => {
    if (!inView || reducedMotion) return;

    let previous = 0;

    const tick = (time: number) => {
      const delta = previous
        ? Math.min((time - previous) / 1000, 0.05)
        : 0;

      previous = time;

      if (!drag.current && !focused.current) {
        const decay = Math.exp(-3.2 * delta);

        velocity.current.pitch *= decay;
        velocity.current.yaw *= decay;

        const idleYaw = hovered.current ? 0 : 0.11;

        rotateSpherePoints(
          points.current,
          velocity.current.pitch * delta,
          (idleYaw + velocity.current.yaw) * delta,
        );

        paint();
      }

      animationFrame.current = requestAnimationFrame(tick);
    };

    const visibility = () => {
      if (animationFrame.current !== null) {
        cancelAnimationFrame(animationFrame.current);
        animationFrame.current = null;
      }

      previous = 0;

      if (!document.hidden) {
        animationFrame.current = requestAnimationFrame(tick);
      }
    };

    visibility();

    document.addEventListener("visibilitychange", visibility);

    return () => {
      if (animationFrame.current !== null) {
        cancelAnimationFrame(animationFrame.current);
        animationFrame.current = null;
      }

      document.removeEventListener("visibilitychange", visibility);
    };
  }, [inView, reducedMotion, paint]);

  const pointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (!event.isPrimary || event.button !== 0 || drag.current) return;

    event.currentTarget.setPointerCapture(event.pointerId);

    drag.current = {
      id: event.pointerId,
      x: event.clientX,
      y: event.clientY,
      time: event.timeStamp,
    };

    velocity.current = { pitch: 0, yaw: 0 };
    event.currentTarget.dataset.dragging = "true";
  };

  const pointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const previous = drag.current;

    if (!previous || event.pointerId !== previous.id) return;

    const yaw = (event.clientX - previous.x) * 0.006;
    const pitch = -(event.clientY - previous.y) * 0.006;

    const elapsed = Math.max(
      (event.timeStamp - previous.time) / 1000,
      0.008,
    );

    velocity.current = reducedMotion
      ? { pitch: 0, yaw: 0 }
      : {
          pitch: Math.max(-3, Math.min(3, pitch / elapsed)),
          yaw: Math.max(-3, Math.min(3, yaw / elapsed)),
        };

    rotateSpherePoints(points.current, pitch, yaw);

    drag.current = {
      id: previous.id,
      x: event.clientX,
      y: event.clientY,
      time: event.timeStamp,
    };

    paint();
  };

  const pointerEnd = (event: PointerEvent<HTMLDivElement>) => {
    if (drag.current?.id !== event.pointerId) return;

    drag.current = null;
    event.currentTarget.dataset.dragging = "false";

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  const keyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const directions: Record<string, [number, number]> = {
      ArrowLeft: [0, -0.15],
      ArrowRight: [0, 0.15],
      ArrowUp: [0.15, 0],
      ArrowDown: [-0.15, 0],
    };

    const direction = directions[event.key];
    if (!direction) return;

    event.preventDefault();

    rotateSpherePoints(points.current, direction[0], direction[1]);
    paint();
  };

  return (
    <div className={`tech-sphere-column ${className}`}>
      <div
        ref={rootRef}
        className="tech-sphere"
        role="group"
        aria-label="Interactive technology sphere. Drag or use arrow keys to rotate."
        data-assembled={assembled || reducedMotion ? "true" : "false"}
        onPointerDown={pointerDown}
        onPointerMove={pointerMove}
        onPointerUp={pointerEnd}
        onPointerCancel={pointerEnd}
        onLostPointerCapture={pointerEnd}
        onPointerEnter={(event) => {
          if (event.pointerType !== "touch") hovered.current = true;
        }}
        onPointerLeave={() => {
          hovered.current = false;
        }}
        onFocusCapture={() => {
          focused.current = true;
          velocity.current = { pitch: 0, yaw: 0 };
        }}
        onBlurCapture={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) {
            focused.current = false;
          }
        }}
        onKeyDown={keyDown}
      >
        <div className="tech-sphere-stage">
          {technologies.map((technology, index) => (
            <div
              key={technology.name}
              ref={(node) => {
                nodes.current[index] = node;
              }}
              className="tech-sphere-point"
              style={{
                transform: `translate3d(
                  ${initialPoints[index].x * 165}px,
                  ${initialPoints[index].y * 165}px,
                  ${initialPoints[index].z * 165}px
                )`,
              }}
            >
              <div
                className="tech-sphere-arrival"
                style={
                  {
                    "--arrival-x": `${arrivals[index].x}px`,
                    "--arrival-y": `${arrivals[index].y}px`,
                    "--arrival-rotation": `${arrivals[index].rotation}deg`,
                    "--arrival-delay": `${index * 65}ms`,
                  } as CSSProperties
                }
              >
                <button
                  type="button"
                  className="tech-sphere-logo"
                  aria-label={technology.name}
                  aria-describedby={`${tooltipId}-${index}`}
                >
                  <Image
                    src={technology.logo}
                    alt=""
                    aria-hidden="true"
                    width={44}
                    height={44}
                    draggable={false}
                  />

                  <span
                    role="tooltip"
                    id={`${tooltipId}-${index}`}
                    className="tech-sphere-tooltip"
                  >
                    {technology.name}
                  </span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

     <div className="tech-sphere-instructions">
  <svg
    className="tech-sphere-guide-arrow"
    viewBox="0 0 100 65"
    fill="none"
    aria-hidden="true"
  >
    <path
      d="M82 55 C52 58 25 42 35 12 C39 2 51 7 48 19"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M35 12 L26 23 M35 12 L43 25"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>

  <p className="tech-sphere-instruction-text">
    <span>Drag</span> to explore
    <span className="tech-sphere-divider"> · </span>
    <span>Hover</span> to discover
  </p>
</div>  

    </div>
  );
}
