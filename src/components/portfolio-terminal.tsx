"use client";

import { useMemo } from "react";
import { Terminal } from "@/components/ui/terminal";

export function PortfolioTerminal() {
  const commands = useMemo(
    () => [
      "whoami",
      "cat skills.txt",
      "ls projects/",
      "git status",
      "echo 'Always learning. Always building.'",
    ],
    []
  );

  const outputs = useMemo<Record<number, string[]>>(
    () => ({
      0: [
        "S. M. Tausif",
        "Software Developer",
        "Full-Stack & Backend Engineering",
      ],
      1: [
        "Languages: JavaScript, TypeScript, Python, Java, SQL",
        "Frontend: React, Next.js, HTML5, CSS3, Tailwind",
        "Backend: Node.js, Express.js, REST APIs",
        "Databases: PostgreSQL, Supabase, H2",
        "Tools: AWS, Docker, Git, GitHub, VS Code",
      ],
      2: [
        "HuntigoX/",
        "SkillsShift+/",
        "MaplewoodHotelSystem/",
        "Trackwo/",
      ],
      3: [
        "On branch main",
        "Working on something awesome...",
      ],
      4: ["Always learning. Always building."],
    }),
    []
  );

  return (
    <Terminal
      username="tausif@portfolio"
      commands={commands}
      outputs={outputs}
      typingSpeed={45}
      delayBetweenCommands={1000}
      initialDelay={600}
      enableSound={false}
      className="w-full !max-w-none !px-0"
    />
  );
}
