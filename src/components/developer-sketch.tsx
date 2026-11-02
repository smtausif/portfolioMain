
"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";

function Ink({
  d,
  delay = 0,
  accent = false,
  fill = "none",
}: {
  d: string;
  delay?: number;
  accent?: boolean;
  fill?: string;
}) {
  return (
    <motion.path
      d={d}
      fill={fill}
      stroke={accent ? "#C44A13" : "#292929"}
      variants={{
        rest: { pathLength: 1, opacity: 1 },
        drawn: {
          pathLength: [0, 1],
          opacity: [0, 1],
          transition: {
            duration: 0.85,
            delay,
            ease: "easeInOut",
          },
        },
      }}
    />
  );
}

export function DeveloperSketch() {
  const ref = useRef<SVGSVGElement>(null);
  const entered = useInView(ref, { once: true, amount: 0.2 });
  const visible = useInView(ref, { amount: 0.1 });
  const reduced = useReducedMotion();

  return (
    <motion.svg
      ref={ref}
      className="tech-developer-sketch"
      viewBox="0 0 500 300"
      role="img"
      aria-label="Hand-drawn developer learning at a laptop with coffee, books and a lightbulb"
      fill="none"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      initial={false}
      animate={entered && !reduced ? "drawn" : "rest"}
      data-moving={visible && !reduced ? "true" : undefined}
    >
      {/* Animated pencil-style wind lines */}
      <g
        className="tech-sketch-wind"
        fill="none"
        stroke="#B9B9B9"
        strokeWidth="3"
        strokeLinecap="round"
      >
        <motion.path
          d="M76 45 Q92 58 105 78"
          animate={
            reduced
              ? undefined
              : {
                  x: [-5, 5, -5],
                  y: [2, -4, 2],
                  rotate: [-3, 3, -3],
                  opacity: [0.3, 0.7, 0.3],
                }
          }
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.path
          d="M157 9 Q169 24 180 43"
          animate={
            reduced
              ? undefined
              : {
                  x: [-3, 5, -3],
                  y: [0, -5, 0],
                  opacity: [0.3, 0.65, 0.3],
                }
          }
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        />
        <motion.path
          d="M440 100 Q455 91 473 72"
          animate={
            reduced
              ? undefined
              : {
                  x: [-5, 6, -5],
                  y: [2, -3, 2],
                  rotate: [-2, 3, -2],
                  opacity: [0.3, 0.65, 0.3],
                }
          }
          transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
        <motion.path
          d="M451 140 Q469 135 486 143"
          animate={
            reduced
              ? undefined
              : {
                  x: [-5, 7, -5],
                  y: [0, -3, 0],
                  opacity: [0.3, 0.7, 0.3],
                }
          }
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
        />
        <motion.path
          d="M20 139 Q38 132 61 140"
          animate={
            reduced
              ? undefined
              : {
                  x: [-6, 5, -6],
                  y: [2, -3, 2],
                  opacity: [0.3, 0.65, 0.3],
                }
          }
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
        />
      </g>

      {/* Chair */}
      <Ink
        d="M282 147 Q319 132 330 160 L330 238 Q329 258 305 260 M317 258 L317 284 M299 287 Q318 280 338 287"
        delay={0.1}
      />

      {/* Body and orange shirt */}
      <Ink
        d="M218 133 Q194 145 184 177 L185 221 L304 221 L302 177 Q292 143 273 133 L259 151 L239 151 Z"
        fill="#F4A36D"
        delay={0.2}
      />
      <Ink d="M237 133 L248 151 L261 150 L273 133" delay={0.25} />

      {/* Head */}
      <Ink
        d="M221 70 Q215 96 226 116 Q237 133 254 133 Q277 132 287 109 L285 76 Q257 54 221 70 Z"
        fill="#FAF9F6"
        delay={0.15}
      />

      {/* Ears */}
      <Ink d="M221 91 Q207 82 209 99 Q211 112 225 111" delay={0.3} />
      <Ink d="M286 91 Q299 83 298 99 Q295 112 283 110" delay={0.3} />

      {/* Messy hand-sketched hair */}
      <Ink
        d="M218 88 Q211 69 218 59 L209 65 L216 51 L226 56 L224 43 L238 51 L246 39 L254 48 L266 39 L273 49 L285 45 L284 57 Q298 61 290 87 L281 77 Q269 80 261 70 Q247 81 235 72 Q229 84 218 88 Z"
        fill="#292929"
        delay={0.1}
      />
      <Ink d="M221 58 L235 47 M237 55 L249 43 M253 53 L268 44 M274 59 L286 53" delay={0.3} />

      {/* Round glasses */}
      <Ink d="M224 94 Q225 81 238 82 Q252 83 252 96 Q251 109 238 109 Q224 108 224 94 Z" delay={0.4} />
      <Ink d="M257 95 Q258 82 272 83 Q285 84 285 97 Q284 109 272 110 Q257 109 257 95 Z" delay={0.4} />
      <Ink d="M252 93 Q254 91 257 93 M224 92 L216 89 M285 93 L291 90" delay={0.45} />

      {/* Eyes, nose and smile */}
      <g className="tech-developer-eyes">
        <Ink d="M234 95 Q238 92 242 95 M267 96 Q271 93 275 96" delay={0.5} />
      </g>
      <Ink d="M254 97 L250 105 L257 106 M240 114 Q254 126 269 113" delay={0.55} />
      <Ink d="M226 108 l7 2 M276 109 l7 -2" accent delay={0.6} />

      {/* Relaxed arms */}
      <Ink d="M202 165 Q190 182 194 204 Q199 216 221 207 L237 130" delay={0.35} />
      <Ink d="M291 165 Q310 181 307 202 Q302 215 283 207 L273 132" delay={0.35} />
      <Ink d="M225 130 Q216 120 221 112 Q226 107 233 117 L237 131" fill="#FAF9F6" delay={0.45} />
      <Ink d="M273 132 Q279 119 286 115 Q293 115 291 126 L283 141" fill="#FAF9F6" delay={0.45} />

      {/* Thought bubble */}
      <Ink
        d="M322 72 Q309 61 319 47 Q315 30 335 27 Q342 14 359 22 Q375 10 391 23 Q411 19 416 37 Q432 48 420 63 Q423 80 405 84 Q389 97 372 87 Q348 96 337 84 Q326 87 322 72 Z"
        fill="#FAF9F6"
        delay={0.4}
      />
      <Ink d="M311 94 Q305 88 301 95 Q300 103 308 102 Q315 101 311 94 Z M294 113 Q289 109 288 116 Q291 121 296 117 Z" delay={0.5} />

      {/* Animated lightbulb */}
      <g className="tech-developer-bulb">
        <Ink
          d="M358 53 Q356 35 374 33 Q391 33 391 51 Q391 61 383 67 L382 74 L367 74 L366 67 Q358 61 358 53 Z"
          accent
          delay={0.55}
        />
        <Ink d="M368 79 L381 79 M371 84 L378 84 M374 74 L374 57 L367 50 M374 57 L382 50" accent delay={0.65} />
        <g className="tech-developer-rays">
          <Ink d="M347 50 l-7 -2 M351 33 l-5 -5 M374 24 l0 -7 M397 33 l6 -5 M401 51 l7 -1" accent delay={0.7} />
        </g>
      </g>

      {/* Coffee */}
      <Ink d="M90 201 Q103 198 117 201 L115 222 Q104 232 93 222 Z M117 206 Q133 199 133 211 Q131 220 117 218" fill="#FAF9F6" delay={0.4} />
      <Ink d="M96 217 Q105 221 113 216" accent delay={0.6} />
      {[0, 1, 2].map((index) => (
        <g key={index} className={`tech-developer-steam tech-developer-steam-${index}`}>
          <Ink d={`M${98 + index * 8} 191 q-7 -8 0 -15 q6 -6 0 -13`} delay={0.7 + index * 0.1} />
        </g>
      ))}

      {/* Laptop */}
      <Ink d="M151 164 L291 165 L306 231 L168 230 Z" fill="#FAF9F6" delay={0.3} />
      <Ink d="M160 171 L284 173 L296 224" delay={0.4} />
      <Ink d="M218 190 l-11 9 l11 9 M244 190 l11 9 l-11 9 M236 186 l-9 25" accent delay={0.65} />
      <Ink d="M166 232 L314 232 L306 240 L159 240 Z M178 236 L292 236" fill="#FAF9F6" delay={0.5} />

      {/* Books */}
      <Ink d="M351 213 L437 213 L436 232 L351 232 Q345 223 351 213 Z" fill="#FAF9F6" delay={0.4} />
      <Ink d="M356 192 L430 192 L430 211 L356 211 Q350 202 356 192 Z" fill="#FAF9F6" delay={0.45} />
      <Ink d="M351 171 L427 171 L427 190 L351 190 Q345 181 351 171 Z" fill="#FAF9F6" delay={0.5} />
      <g className="tech-developer-book-labels" fill="#292929" stroke="none">
        <text x="390" y="185" textAnchor="middle">LEARN</text>
        <text x="393" y="206" textAnchor="middle">BUILD</text>
        <text x="393" y="227" textAnchor="middle">REPEAT</text>
      </g>
      <Ink d="M357 189 L422 189 M362 210 L425 210" accent delay={0.7} />

      {/* Desk */}
      <Ink d="M56 242 L56 233 Q250 231 445 233 L445 242 Z" fill="#FAF9F6" delay={0.2} />
      <Ink d="M72 243 L63 290 M424 243 L434 290" delay={0.5} />
      <Ink d="M49 294 Q151 291 198 294 M287 294 Q369 291 453 294" delay={0.7} />
    </motion.svg>
  );
}
