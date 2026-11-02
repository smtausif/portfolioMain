"use client";

import Image from "next/image";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
} from "motion/react";
import {
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import "./selected-work.css";

type Project = {
  id: string;
  number: string;
  name: string;
  category: string;
  subtitle: string;
  description: string;
  technologies: string[];
  achievements: string[];
  details?: string[];
  note?: string;
  status?: string;
  images: { src: string; alt: string }[];
  link?: { href: string; label: string };
  color: string;
};

const projects: Project[] = [
  {
    id: "trackwo",
    number: "01",
    name: "TRACKwo",
    category: "FULL-STACK APPLICATION",
    subtitle: "Freelancer Command Center",
    description:
      "A freelancer command center bringing client management, projects, task boards, time tracking, invoicing, financial reporting, and business insights into one workspace.",
    technologies: [
      "Next.js 15",
      "React 19",
      "Prisma",
      "SQLite",
      "Tailwind CSS",
      "pdf-lib",
    ],
    achievements: [
      "Built a unified workspace for managing clients, projects, tasks, and invoices.",
      "Implemented manual and real-time time tracking with CSV exports.",
      "Developed itemized invoices, partial payment tracking, and PDF generation.",
      "Created financial reports and a KPI dashboard with six-month revenue insights.",
      "Implemented authentication, account recovery, and structured Prisma data models.",
    ],
    images: [
      { src: "/projects/Trackwo1.png", alt: "TRACKwo homepage" },
      { src: "/projects/Trackwo2.png", alt: "TRACKwo dashboard" },
      { src: "/projects/Trackwo3.png", alt: "TRACKwo project management" },
    ],
    color: "#C44A13",
  },
  {
    id: "maplewood",
    number: "02",
    name: "Maplewood Hotel",
    category: "DESKTOP APPLICATION",
    subtitle: "Hotel Management System",
    description:
      "A Java desktop hotel reservation and management application with a guest booking kiosk and an administrative console.",
    technologies: [
      "Java 21",
      "JavaFX",
      "Hibernate 6",
      "H2",
      "JUnit 5",
      "BCrypt",
    ],
    achievements: [
      "Developed an eight-step guest booking kiosk supporting four room categories.",
      "Implemented multi-room reservations, live cost calculations, loyalty features, and 13% tax estimates.",
      "Built administrative tools for payments, waitlists, guest feedback, and hotel operations.",
      "Added role-based permissions and BCrypt password protection.",
      "Implemented occupancy and revenue reporting with CSV and PDF exports.",
      "Used the observer pattern for notifications and JUnit for testing.",
    ],
    images: [
      { src: "/projects/Maplewood1.png", alt: "Maplewood hotel booking interface" },
      { src: "/projects/maplewood2.png", alt: "Maplewood administration interface" },
    ],
    link: {
      href: "https://github.com/smtausif/MaplewoodHotelSystem",
      label: "View GitHub Repository",
    },
    color: "#329CFF",
  },
  {
    id: "context-engineering",
    number: "03",
    name: "Context Engineering",
    category: "AI RESEARCH",
    subtitle: "Context Engineering for Large Language Models",
    description:
      "A team research project investigating how different context management strategies affect language model accuracy, citation quality, latency, token usage, and cost.",
    technologies: [
      "TypeScript",
      "Node.js",
      "OpenRouter",
      "HotpotQA",
      "Apache Parquet",
    ],
    achievements: [
      "Leading research comparing five context engineering strategies.",
      "Investigating Full Context, Prompt Caching, RAG, Summarization, and Hybrid approaches.",
      "Using HotpotQA FullWiki passages to evaluate multi-hop question answering.",
      "Comparing Gemini 2.5 Flash Lite and GPT-4.1 Mini.",
      "Tracking exact match, F1, citation F1, latency, token usage, cache behavior, and cost.",
    ],
    details: [
      "Full Context and explicit Prompt Caching experiments have been evaluated.",
      "RAG, Summarization, and Hybrid evaluations are planned.",
      "Experiments include 10-passage and 30-passage configurations.",
    ],
    note: "Research in progress.",
    images: [
      { src: "/projects/contexteng1.jpg", alt: "Context Engineering research visual one" },
      { src: "/projects/contexteng2.jpg", alt: "Context Engineering research visual two" },
    ],
    color: "#C44A13",
  },
  {
    id: "fortune-teller",
    number: "04",
    name: "Fortune Teller",
    category: "AI APPLICATION",
    subtitle: "AI-Powered Palm Reading",
    description:
      "An upcoming AI-powered palm-reading web application that analyzes uploaded palm images and presents structured readings through an interactive user experience.",
    technologies: [
      "Next.js 15",
      "Node.js",
      "Express",
      "Supabase",
      "OpenRouter",
    ],
    achievements: [
      "Developing a palm image upload and analysis workflow.",
      "Building backend validation and structured reading responses.",
      "Integrating AI-powered interpretation through OpenRouter.",
      "Connecting the Next.js frontend with Node.js and Express services.",
    ],
    details: [
      "Target workflow: Palm Image → API Validation → AI Vision Analysis → Structured Reading → Reading Results.",
      "Planned reading categories include Heart Line, Head Line, Life Line, and Overall Reading.",
      "Reading history and storage are planned features.",
    ],
    status: "UPCOMING",
    note: "AI readings are intended for entertainment only.",
    images: [
      { src: "/projects/fortuneteller1.jpeg", alt: "Fortune Teller screenshot 1" },
      { src: "/projects/fortuneteller2.jpeg", alt: "Fortune Teller screenshot 2" },
    ],
    color: "#9B6DFF",
  },
  {
    id: "inspecfri",
    number: "05",
    name: "inspecfri",
    category: "SAAS APPLICATION",
    subtitle: "Home Inspection Workspace",
    description:
      "An upcoming mobile-first platform designed to help home inspectors manage clients, inspections, findings, reports, and daily workflows in one place.",
    technologies: [
      "Next.js 15",
      "TypeScript",
      "Tailwind CSS",
      "Lucide React",
    ],
    achievements: [
      "Designing client profiles with notes, tags, priorities, and linked inspections.",
      "Building inspection workflows with reusable checklists and multiple findings per item.",
      "Supporting photos, videos, defect priorities, and inspection statuses.",
      "Developing report, template, and defect-library interfaces.",
      "Planning responsive workflows for phones, tablets, and desktops.",
    ],
    details: [
      "Frontend development is the current priority.",
      "Backend implementation is planned.",
    ],
    status: "UPCOMING",
    images: [],
    color: "#75C900",
  },
];

function SketchPath() {
  return (
    <svg
      className="journey-path"
      viewBox="0 0 1200 360"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <motion.path
        d="M-40 220 C130 220 135 90 300 130 S520 310 650 195 S880 75 1000 160 S1130 255 1240 95"
        fill="none"
        stroke="#292929"
        strokeWidth="5"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 2.2, ease: "easeInOut" }}
      />
    </svg>
  );
}

function SketchAccent({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      aria-hidden="true"
      className={`journey-decoration ${className}`}
      animate={{
        rotate: [-4, 5, -4],
        y: [0, -7, 0],
      }}
      transition={{
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      {children}
    </motion.div>
  );
}

function ProjectModal({
  project,
  onClose,
  onNext,
  onPrevious,
}: {
  project: Project;
  onClose: () => void;
  onNext: () => void;
  onPrevious: () => void;
}) {
  const reducedMotion = useReducedMotion();
  const closeRef = useRef<HTMLButtonElement>(null);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowRight") onNext();
      if (event.key === "ArrowLeft") onPrevious();
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose, onNext, onPrevious]);

  return (
    <motion.div
      className="journey-modal-backdrop"
      role="presentation"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <motion.section
        role="dialog"
        aria-modal="true"
        aria-labelledby="journey-modal-title"
        className="journey-modal"
        style={{ "--project-color": project.color } as React.CSSProperties}
        initial={reducedMotion ? false : { opacity: 0, y: 45, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 25, scale: 0.97 }}
        transition={{ type: "spring", stiffness: 260, damping: 28 }}
      >
        <div className="journey-modal-toolbar">
          <span>PROJECT {project.number} / 05</span>

          <button
            ref={closeRef}
            type="button"
            className="journey-close"
            onClick={onClose}
            aria-label="Close project details"
          >
            ×
          </button>
        </div>

        <div className="journey-modal-scroll">
          <div className="journey-modal-heading">
            <span className="journey-modal-category">
              {project.category}
            </span>

            <h2 id="journey-modal-title">{project.name}</h2>
            <h3>{project.subtitle}</h3>

            {project.status && (
              <span className="journey-status">{project.status}</span>
            )}
          </div>

          <div className="journey-modal-grid">
            <div className="journey-modal-copy">
              <p className="journey-modal-description">
                {project.description}
              </p>

              <h4>What I built / explored</h4>

              <ul className="journey-achievements">
                {project.achievements.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>

              {project.details && project.details.length > 0 && (
                <details className="journey-technical-notes">
                  <summary>Technical notes +</summary>
                  <ul>
                    {project.details.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </details>
              )}

              <h4>Technologies</h4>

              <div className="journey-tags">
                {project.technologies.map((tech) => (
                  <span key={tech}>{tech}</span>
                ))}
              </div>

              {project.note && (
                <p className="journey-note">{project.note}</p>
              )}

              {project.link && (
                <a
                  className="journey-external-link"
                  href={project.link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {project.link.label} ↗
                </a>
              )}
            </div>

            <div className="journey-modal-media">
              {project.images.length > 0 ? (
                <>
                  <div className="journey-featured-image">
                    <Image
                      key={project.images[activeImage].src}
                      src={project.images[activeImage].src}
                      alt={project.images[activeImage].alt}
                      fill
                      sizes="(max-width: 900px) 90vw, 45vw"
                      className="object-contain"
                    />
                  </div>

                  <div className="journey-thumbnails">
                    {project.images.map((image, index) => (
                      <button
                        key={image.src}
                        type="button"
                        onClick={() => setActiveImage(index)}
                        className={activeImage === index ? "active" : ""}
                        aria-label={`View screenshot ${index + 1}`}
                        aria-pressed={activeImage === index}
                      >
                        <Image
                          src={image.src}
                          alt={image.alt}
                          fill
                          sizes="110px"
                          className="object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </>
              ) : (
                <div className="journey-upcoming-visual">
                  <motion.div
                    className="journey-upcoming-orbit"
                    animate={reducedMotion ? undefined : { rotate: 360 }}
                    transition={{
                      duration: 35,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  />
                  <span className="journey-upcoming-number">
                    {project.number}
                  </span>
                  <strong>{project.name}</strong>
                  <span>WORK IN PROGRESS</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="journey-modal-navigation">
          <button type="button" onClick={onPrevious}>
            ← Previous
          </button>

          <span>{project.number} / 05</span>

          <button type="button" onClick={onNext}>
            Next →
          </button>
        </div>
      </motion.section>
    </motion.div>
  );
}

export function SelectedWorkSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const reducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 80%", "end 20%"],
  });

  const progress = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 25,
  });

  const close = () => setSelectedIndex(null);

  const next = () =>
    setSelectedIndex((current) =>
      current === null ? 0 : (current + 1) % projects.length,
    );

  const previous = () =>
    setSelectedIndex((current) =>
      current === null
        ? 0
        : (current - 1 + projects.length) % projects.length,
    );

  return (
    <section
      ref={sectionRef}
      id="projects"
      className="journey-section"
      aria-labelledby="journey-heading"
    >
      <div className="journey-container">
        <motion.div
          className="journey-header"
          initial={reducedMotion ? false : { opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65 }}
        >
          <span className="journey-eyebrow">SELECTED WORK / 2025–2026</span>

          <h2 id="journey-heading">
            PROJECTS <span>&</span> RESEARCH
          </h2>

          <p>
            A collection of things I&apos;ve built, explored,
            and learned along the way.
          </p>

          <span className="journey-handwriting">
            Every project has a story.
          </span>
        </motion.div>

        <div className="journey-canvas">
          <SketchPath />

          <SketchAccent className="journey-star">
            <svg viewBox="0 0 60 60" fill="none">
              <path
                d="M30 2 Q34 26 58 30 Q34 34 30 58 Q26 34 2 30 Q26 26 30 2Z"
                stroke="currentColor"
                strokeWidth="2"
              />
            </svg>
          </SketchAccent>

          <SketchAccent className="journey-loop">
            <svg viewBox="0 0 100 70" fill="none">
              <path
                d="M5 40 C20 0 75 5 68 35 C62 62 28 50 40 28 C55 0 95 20 95 55"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </SketchAccent>

          <div className="journey-milestones">
            {projects.map((project, index) => (
              <motion.button
                key={project.id}
                type="button"
                className={`journey-milestone journey-milestone-${index + 1}`}
                style={{
                  "--project-color": project.color,
                } as React.CSSProperties}
                onClick={() => setSelectedIndex(index)}
                initial={reducedMotion ? false : { opacity: 0, scale: 0.7 }}
                whileInView={{ opacity: 1, scale: 1 }}
                whileHover={reducedMotion ? undefined : { scale: 1.09 }}
                whileTap={{ scale: 0.96 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.12,
                }}
                aria-label={`Explore ${project.name}`}
              >
                <span className="journey-node">
                  <span>{project.number}</span>
                </span>

                <span className="journey-node-copy">
                  <strong>{project.name}</strong>
                  <small>{project.category}</small>
                </span>
              </motion.button>
            ))}
          </div>

          <div className="journey-instruction">
            <span>Pick a stop</span>
            <svg viewBox="0 0 65 50" fill="none" aria-hidden="true">
              <path
                d="M4 5 C10 38 38 5 55 38 M43 32 L55 39 L58 24"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <p>Click any circle to explore a project</p>
          </div>
        </div>

        <motion.div
          className="journey-progress"
          style={{ scaleX: progress }}
          aria-hidden="true"
        />

        <p className="journey-footer">
          Five projects. Different challenges. Always building.
        </p>
      </div>

      <AnimatePresence mode="wait">
        {selectedIndex !== null && (
          <ProjectModal
            key={projects[selectedIndex].id}
            project={projects[selectedIndex]}
            onClose={close}
            onNext={next}
            onPrevious={previous}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
