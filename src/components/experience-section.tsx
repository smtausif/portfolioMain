
"use client";

import React from "react";
import Image from "next/image";
import { Timeline, type TimelineEntry } from "@/components/ui/timeline";
import { motion, useReducedMotion } from "motion/react";
import {
  ExperienceAccent,
  ExperienceBackgroundSketches,
  ExperienceHeaderSketches,
  ExperienceHeaderUnderline,
} from "@/components/experience-accent";
import "./experience-enhancements.css";

type ExperienceImage = {
  src: string;
  alt: string;
};

function ImageGallery({ images }: { images: ExperienceImage[] }) {
  return (
    <div className="mt-6 grid grid-cols-2 gap-3 md:gap-4">
      {images.map((image) => (
        <div
          key={image.src}
          className="experience-image-frame group relative aspect-[4/3] overflow-hidden rounded-xl border border-border bg-card"
        >
          <Image
            src={image.src}
            alt={image.alt}
            fill
            sizes="(max-width: 767px) calc((100vw - 148px) / 2), (max-width: 1279px) 25vw, 360px"
            className="experience-image object-contain p-1"
          />
        </div>
      ))}
    </div>
  );
}

function TechTags({ tags }: { tags: string[] }) {
  return (
    <div className="mt-5 flex flex-wrap gap-2">
      {tags.map((tag) => (
        <span
          key={tag}
          className="experience-tech-tag rounded-full border border-border bg-surface px-3 py-1.5 text-xs text-secondary"
        >
          {tag}
        </span>
      ))}
    </div>
  );
}

type ExperienceCardProps = {
  company: string;
  role: string;
  location?: string;
  period: string;
  description: string;
  points: string[];
  technologies: string[];
  images: ExperienceImage[];
};

function ExperienceCard({
  company,
  role,
  location,
  period,
  description,
  points,
  technologies,
  images,
}: ExperienceCardProps) {
  const reducedMotion = useReducedMotion();

  return (
    <motion.article
      data-company={
        company === "BigBigi Ads"
          ? "bigbigi"
          : company === "HuntigoX"
            ? "huntigox"
            : "skillsshift"
      }
      className="experience-card rounded-2xl border border-border bg-card p-5 shadow-soft md:p-7"
      initial={reducedMotion ? false : { opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      whileHover={reducedMotion ? undefined : { y: -3 }}
      transition={{
        duration: reducedMotion ? 0 : 0.55,
        ease: "easeOut",
      }}
    >
      {company === "BigBigi Ads" && (
        <ExperienceAccent kind="arrow" />
      )}

      {company === "HuntigoX" && (
        <ExperienceAccent kind="spark" />
      )}

      <h3 className="text-2xl font-bold tracking-tight text-foreground">
        <span className="experience-company">
          {company}
          {company !== "HuntigoX" && (
            <ExperienceAccent kind="underline" />
          )}
        </span>
      </h3>

      <p className="mt-2 text-base font-medium text-foreground">
        {role}
      </p>

      {location && (
        <p className="mt-1 text-sm text-label">{location}</p>
      )}

      <p className="mt-1 text-sm text-label">{period}</p>

      <p className="mt-5 text-sm leading-7 text-secondary">
        {description}
      </p>

      {points.length > 0 && (
        <ul className="mt-5 list-disc space-y-2 pl-5 text-sm leading-6 text-secondary">
          {points.map((point) => (
            <li key={point}>{point}</li>
          ))}
        </ul>
      )}

      {technologies.length > 0 && (
        <TechTags tags={technologies} />
      )}

      <ImageGallery images={images} />
    </motion.article>
  );
}

export function ExperienceSection() {
  const reducedMotion = useReducedMotion();

  const data: TimelineEntry[] = [
    {
      title: "June 2026 – Present",
      content: (
        <ExperienceCard
          company="BigBigi Ads"
          role="IT Support Assistant (Remote, Part-time)"
          location="San Jose, USA"
          period="June 2026 – Present"
          description="Provide remote technical support for hardware, software, networking, and business applications, helping employees maintain reliable access to essential IT systems."
          points={[
            "Resolve remote hardware, software, and network issues across 3 support areas, restoring employee access to business-critical systems and reducing disruption.",
            "Configure and maintain Windows workstations, peripherals, Microsoft 365 applications, and user accounts across 4 core IT support areas.",
            "Support employee onboarding from initial account provisioning through application installation and workstation readiness, covering 3 setup stages.",
            "Perform preventive maintenance, troubleshoot recurring connectivity and access issues, and follow secure account-management practices.",
          ]}
          technologies={[
            "Windows",
            "Microsoft 365",
            "Networking",
            "Hardware Troubleshooting",
          ]}
          images={[
            {
              src: "/projects/bigbigi1.png",
              alt: "BigBigi Ads screenshot 1",
            },
            {
              src: "/projects/bigbigi2.png",
              alt: "BigBigi Ads screenshot 2",
            },
          ]}
        />
      ),
    },
    {
      title: "January 2026 – April 2026",
      content: (
        <ExperienceCard
          company="HuntigoX"
          role="Product Developer, Co-op"
          location="Ontario, Canada"
          period="January 2026 – April 2026"
          description="Worked as a Product Developer during a co-op placement, contributing to the development, design, testing, and launch of a mobile-first application."
          points={[
            "Built a mobile-first React and Node.js MVP with responsive workflows across 3 device classes: phones, tablets, and desktops.",
            "Led Figma UI/UX design and reusable component development; initial alpha testing reported a 25% improvement in user retention.",
            "Integrated REST APIs and custom React hooks to streamline key user journeys, reducing average time-to-action by 15%.",
            "Collaborated across a remote Agile team to prioritize product improvements using alpha feedback, usability testing, and iterative releases.",
            "Supported LinkedIn and Instagram launch initiatives, growing the early-access waitlist to 500+ verified student registrations.",
          ]}
          technologies={[
            "React",
            "Node.js",
            "REST APIs",
            "Figma",
            "JavaScript",
            "Agile",
          ]}
          images={[
            {
              src: "/projects/huntigox1.png",
              alt: "HuntigoX candidate sign-in and hiring platform",
            },
            {
              src: "/projects/huntigox2.png",
              alt: "HuntigoX screenshot 2",
            },
            {
              src: "/projects/huntigox3.png",
              alt: "HuntigoX screenshot 3",
            },
            {
              src: "/projects/huntigox4.png",
              alt: "HuntigoX application progress tracking",
            },
          ]}
        />
      ),
    },
    {
      title: "April 2025 – August 2025",
      content: (
        <ExperienceCard
          company="SkillsShift+"
          role="Full Stack Developer, Co-op"
          location="Ontario, Canada"
          period="April 2025 – August 2025"
          description="Worked as a Full Stack Developer during a co-op placement, developing an education and career-readiness platform with subscription management, AI-assisted learning tools, and institutional access features."
          points={[
            "Developed an education platform featuring 35+ structured programs and AI-assisted career-readiness tools.",
            "Architected Stripe and Supabase B2B subscriptions with multi-tenant entitlements supporting institutional plans of 10 to 100+ seats.",
            "Built certificate management and AI interview-coaching workflows; reported a 35% increase in student engagement and course completion.",
            "Optimized PostgreSQL schemas and Prisma queries with indexing and caching, reporting a 40% reduction in database latency on high-concurrency API routes.",
            "Integrated SSO and role-based institutional access controls, enabling administrators to manage seat entitlements and learner progress.",
            "Delivered responsive Next.js and Tailwind CSS interfaces and maintained Vercel deployments with reported 99.9% uptime.",
          ]}
          technologies={[
            "Next.js",
            "React",
            "TypeScript",
            "Tailwind CSS",
            "PostgreSQL",
            "Prisma",
            "Supabase",
            "Stripe",
            "Vercel",
          ]}
          images={[
            {
              src: "/projects/skillshift+1.png",
              alt: "SkillsShift+ workforce learning homepage",
            },
            {
              src: "/projects/skillshift+2.png",
              alt: "SkillsShift+ screenshot 2",
            },
            {
              src: "/projects/skillshit+3.png",
              alt: "SkillsShift+ screenshot 3",
            },
            {
              src: "/projects/skillshift+4.png",
              alt: "SkillsShift+ interview coach",
            },
          ]}
        />
      ),
    },
  ];

  return (
    <section
      id="experience"
      aria-labelledby="experience-heading"
      className="relative w-full bg-background pt-[70px] text-foreground"
    >
      <ExperienceBackgroundSketches />

      <motion.header
        className="experience-header relative z-[1] mx-auto mb-12 w-full max-w-[1400px] px-6 md:px-10 lg:px-14"
        initial={reducedMotion ? false : "hidden"}
        whileInView="visible"
        viewport={{ once: true, amount: 0.18 }}
      >
        <ExperienceHeaderSketches />

        <motion.h2
          id="experience-heading"
          className="experience-editorial-title"
          variants={{
            hidden: { opacity: 0, y: 16 },
            visible: {
              opacity: 1,
              y: 0,
              transition: {
                duration: reducedMotion ? 0 : 0.65,
                ease: "easeOut",
              },
            },
          }}
        >
          <span className="experience-heading-text">
            PROFESSIONAL
          </span>{" "}
          <span className="experience-heading-text">
            EXPERIENCE
          </span>
        </motion.h2>

        <motion.p
          className="experience-subtitle"
          variants={{
            hidden: { opacity: 0, y: 10 },
            visible: {
              opacity: 1,
              y: 0,
              transition: {
                duration: reducedMotion ? 0 : 0.5,
                delay: reducedMotion ? 0 : 0.16,
                ease: "easeOut",
              },
            },
          }}
        >
          My Professional Journey
          <ExperienceHeaderUnderline delay={0.45} />
        </motion.p>

        <motion.div
          className="experience-header-description"
          variants={{
            hidden: { opacity: 0, y: 12 },
            visible: {
              opacity: 1,
              y: 0,
              transition: {
                duration: reducedMotion ? 0 : 0.6,
                delay: reducedMotion ? 0 : 0.28,
                ease: "easeOut",
              },
            },
          }}
        >
          A look at my{" "}
          <strong>
            professional experience
          </strong>
          , the products{" "}
          <span
            className="experience-description-emphasis"
          >
            I&apos;ve helped build
            <ExperienceHeaderUnderline delay={0.85} />
          </span>
          , and the{" "}
          <strong>
            technologies
          </strong>{" "}
          I&apos;ve worked with along the way.
        </motion.div>
      </motion.header>

      <div className="relative z-[1]">
        <Timeline data={data} />
      </div>
    </section>
  );
}
