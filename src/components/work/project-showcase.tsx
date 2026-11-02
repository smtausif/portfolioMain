
"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";
import { WorkArrow } from "@/components/work/work-arrow";

export interface ProjectShowcaseProps {
  id: string;
  number: string;
  category: string;
  name: string;
  subtitle: string;
  description: string;
  technologies: string[];
  achievements: string[];
  details?: string[];
  note?: string;
  status?: string;
  reverse?: boolean;
  link?: { href: string; label: string };
  children: ReactNode;
}

export function ProjectShowcase({
  id,
  number,
  category,
  name,
  subtitle,
  description,
  technologies,
  achievements,
  details,
  note,
  status,
  reverse = false,
  link,
  children,
}: ProjectShowcaseProps) {
  const reduced = useReducedMotion();

  const reveal = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <article
      id={id}
      className={`work-showcase ${
        reverse ? "work-showcase-reverse" : ""
      }`}
      aria-labelledby={`${id}-title`}
    >
      <div className="work-showcase-decoration" aria-hidden="true">
        <svg viewBox="0 0 180 110" fill="none">
          <motion.path
            d="M12 70 C40 12 82 105 112 43 S160 30 172 18"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            initial={reduced ? false : { pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.4 }}
          />
          <motion.circle
            cx="112"
            cy="43"
            r="9"
            stroke="currentColor"
            strokeWidth="2"
            initial={reduced ? false : { scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.7, type: "spring" }}
          />
        </svg>
      </div>

      <motion.div
        className="work-project-copy"
        initial={reduced ? false : "hidden"}
        whileInView="visible"
        viewport={{ once: true, amount: 0.12 }}
        transition={{ staggerChildren: reduced ? 0 : 0.09 }}
      >
        <motion.div variants={reveal} className="work-eyebrow work-label">
          <span className="work-index">{number}</span>
          <span>{category}</span>
        </motion.div>

        {status && (
          <motion.p variants={reveal} className="work-status work-label">
            <span aria-hidden="true" />
            {status}
          </motion.p>
        )}

        <motion.h3
          variants={reveal}
          id={`${id}-title`}
          className="work-project-title"
        >
          {name}
          <svg
            className="work-title-underline"
            viewBox="0 0 240 14"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <motion.path
              d="M3 8 Q65 2 120 8 T237 5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              initial={reduced ? false : { pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.85, delay: 0.35 }}
            />
          </svg>
        </motion.h3>

        <motion.p variants={reveal} className="work-project-subtitle">
          {subtitle}
        </motion.p>

        <motion.p variants={reveal} className="work-description">
          {description}
        </motion.p>

        <motion.ul variants={reveal} className="work-achievements">
          {achievements.map((point) => (
            <li key={point}>{point}</li>
          ))}
        </motion.ul>

        {details && details.length > 0 && (
          <motion.details variants={reveal} className="work-details">
            <summary className="work-label">
              Technical notes
              <span aria-hidden="true">＋</span>
            </summary>
            <ul>
              {details.map((detail) => (
                <li key={detail}>{detail}</li>
              ))}
            </ul>
          </motion.details>
        )}

        <motion.ul
          variants={reveal}
          className="work-technologies"
          aria-label={`${name} technologies`}
        >
          {technologies.map((technology) => (
            <li className="work-label" key={technology}>
              {technology}
            </li>
          ))}
        </motion.ul>

        {note && (
          <motion.p variants={reveal} className="work-note work-label">
            {note}
          </motion.p>
        )}

        {link && (
          <motion.a
            variants={reveal}
            className="work-project-link work-label"
            href={link.href}
            target="_blank"
            rel="noreferrer"
          >
            {link.label}
            <WorkArrow />
          </motion.a>
        )}
      </motion.div>

      <motion.div
        className="work-project-visual"
        initial={
          reduced
            ? false
            : {
                opacity: 0,
                x: reverse ? -35 : 35,
                scale: 0.96,
              }
        }
        whileInView={{
          opacity: 1,
          x: 0,
          scale: 1,
        }}
        viewport={{ once: true, amount: 0.12 }}
        transition={{
          duration: reduced ? 0 : 0.85,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        {children}
      </motion.div>
    </article>
  );
}
