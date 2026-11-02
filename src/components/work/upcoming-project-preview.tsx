
"use client";

import { useRef } from "react";
import {
  motion,
  useInView,
  useReducedMotion,
} from "motion/react";

const palmSteps = [
  ["Palm Image", "Upload or camera capture"],
  ["API Validation", "Authentication + image checks"],
  ["AI Vision Analysis", "OpenRouter · vision-capable model"],
  ["Structured Reading", "Response parsing + validation"],
  ["Reading Results", "Planned storage + reading history"],
];

export function UpcomingProjectPreview({
  variant,
}: {
  variant: "fortune" | "inspection";
}) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { amount: 0.15 });
  const reduced = useReducedMotion();

  if (variant === "fortune") {
    return (
      <figure
        ref={ref}
        className="work-palm-preview"
        data-active={inView && !reduced}
      >
        <div className="work-diagram-heading work-label">
          <span>TARGET AI WORKFLOW</span>
          <span>COMING SOON</span>
        </div>

        <ol className="work-palm-flow">
          {palmSteps.map(([name, detail], index) => (
            <motion.li
              key={name}
              initial={
                reduced
                  ? false
                  : { opacity: 0, x: -24 }
              }
              whileInView={{
                opacity: 1,
                x: 0,
              }}
              viewport={{ once: true }}
              transition={{
                duration: reduced ? 0 : 0.5,
                delay: reduced ? 0 : index * 0.13,
              }}
            >
              <span className="work-palm-step-number work-label">
                0{index + 1}
              </span>

              <div>
                <strong>{name}</strong>
                <span>{detail}</span>
              </div>

              {index === 0 && (
                <svg
                  className="work-palm-sketch"
                  width="44"
                  height="60"
                  viewBox="0 0 48 64"
                  fill="none"
                  aria-hidden="true"
                >
                  <motion.path
                    d="M14 58c-4-8-6-13-9-19-2-4 1-7 4-4l6 7V17c0-5 5-5 5 0v16-22c0-5 5-5 5 0v22-19c0-5 5-5 5 0v21-15c0-5 5-5 5 0v24c0 7-4 11-5 14M17 44c4-6 8-7 14-6M18 49l10-3"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={
                      reduced ? false : { pathLength: 0 }
                    }
                    whileInView={{ pathLength: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.3 }}
                  />
                </svg>
              )}
            </motion.li>
          ))}
        </ol>

        <figcaption className="work-label">
          Heart Line · Head Line · Life Line · Overall Reading
          <br />
          <span>
            Intended end-to-end flow · For entertainment only.
          </span>
        </figcaption>
      </figure>
    );
  }

  return (
    <figure ref={ref} className="work-inspection-preview">
      <div className="work-diagram-heading work-label">
        <span>CONCEPTUAL PRODUCT PREVIEW</span>
        <span>COMING SOON</span>
      </div>

      <div className="work-inspection-composition">
        <motion.div
          className="work-inspection-desktop"
          initial={
            reduced
              ? false
              : { opacity: 0, x: -25, rotate: -5 }
          }
          whileInView={{
            opacity: 1,
            x: 0,
            rotate: -2,
          }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          aria-label="Conceptual desktop inspection dashboard"
        >
          <div className="work-preview-topbar">
            <strong>
              inspecfri<span>●</span>
            </strong>
            <small>Workspace / Overview</small>
          </div>

          <div className="work-preview-dashboard">
            <aside>
              <span>Dashboard</span>
              <span>Clients</span>
              <span>Inspections</span>
              <span>Reports</span>
              <span>Templates</span>
              <span>Defect Library</span>
              <span>Settings</span>
            </aside>

            <div className="work-preview-main">
              <small>YOUR WORKSPACE</small>
              <h4>A clearer picture.</h4>

              <div className="work-preview-stat-row">
                <span>
                  Clients<strong>—</strong>
                </span>
                <span>
                  Inspections<strong>—</strong>
                </span>
                <span>
                  Reports<strong>—</strong>
                </span>
              </div>

              <div className="work-preview-report">
                <span>Inspection workspace</span>
                <div />
                <div />
                <div />
              </div>

              <p>Illustrative interface · Sample content</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="work-inspection-phone"
          initial={
            reduced
              ? false
              : { opacity: 0, x: 35, y: 20, rotate: 10 }
          }
          whileInView={{
            opacity: 1,
            x: 0,
            y: 0,
            rotate: 4,
          }}
          viewport={{ once: true }}
          transition={{
            duration: 0.8,
            delay: 0.2,
          }}
          aria-label="Conceptual mobile inspection checklist"
        >
          <div className="work-phone-speaker" />

          <small>INSPECTION / CHECKLIST</small>

          <h4>
            Every detail,
            <br />
            documented.
          </h4>

          {[
            ["Roof covering", "Satisfactory"],
            ["Exterior drainage", "Defect"],
            ["Attic access", "Not Inspected"],
            ["Fireplace", "Not Applicable"],
          ].map(([area, status]) => (
            <div className="work-checklist-item" key={area}>
              <span>{area}</span>
              <small>{status}</small>
            </div>
          ))}

          <div className="work-phone-bottom">
            Checklist <span>Findings</span> Photos
          </div>
        </motion.div>
      </div>

      <figcaption className="work-label">
        Designed for the field. Organized for the report.
        <br />
        <span>
          HTML/CSS concept preview · Not a released application
          screenshot.
        </span>
      </figcaption>
    </figure>
  );
}
