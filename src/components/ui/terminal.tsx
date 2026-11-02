"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";
import "./terminal.css";

export interface TerminalProps {
  commands: string[];
  outputs?: Record<number, string[]>;
  username?: string;
  className?: string;
  typingSpeed?: number;
  delayBetweenCommands?: number;
  initialDelay?: number;
  enableSound?: boolean;
}

function Command({ text }: { text: string }) {
  const [executable, ...args] = text.split(" ");
  return <><span className="developer-terminal-executable">{executable}</span>{args.length > 0 && <span className={args.join(" ").startsWith("'") ? "developer-terminal-string" : "developer-terminal-argument"}> {args.join(" ")}</span>}</>;
}

export function Terminal({ commands, outputs, username = "developer@terminal", className,
  typingSpeed = 45, delayBetweenCommands = 1000, initialDelay = 600, enableSound = false,
}: TerminalProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inView = useInView(rootRef, { once: true, amount: 0.15 });
  const reducedMotion = useReducedMotion();
  const [progress, setProgress] = useState({ index: 0, characters: 0, showOutput: false });

  useEffect(() => {
    if (!inView || reducedMotion) return;
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout>;
    let soundTimer: ReturnType<typeof setTimeout>;
    let index = 0;
    let characters = 0;
    let sprite = 0;
    const audio = enableSound ? new Audio("/sounds/sound.ogg") : null;
    if (audio) {
      audio.volume = 0.15;
      audio.preload = "auto";
      // Keep sound optional when the local asset is unavailable.
      audio.addEventListener("error", () => {
        audio.src = "https://ui.aceternity.com/sounds/sound.ogg";
      }, { once: true });
    }
    const playKey = () => {
      if (!audio || audio.readyState < 2) return;
      clearTimeout(soundTimer);
      audio.currentTime = (sprite++ % 4) * 0.12;
      void audio.play().catch(() => { /* Browsers may require a user gesture. */ });
      soundTimer = setTimeout(() => audio.pause(), 85);
    };
    const type = () => {
      if (cancelled) return;
      if (index >= commands.length) {
        setProgress({ index: commands.length, characters: 0, showOutput: false });
        return;
      }
      if (characters < commands[index].length) {
        characters++;
        setProgress({ index, characters, showOutput: false });
        playKey();
        timer = setTimeout(type, Math.max(1, typingSpeed));
      } else {
        setProgress({ index, characters, showOutput: true });
        timer = setTimeout(() => {
          index++;
          characters = 0;
          setProgress({ index, characters, showOutput: false });
          timer = setTimeout(type, Math.max(1, typingSpeed));
        }, Math.max(0, delayBetweenCommands));
      }
    };
    timer = setTimeout(type, Math.max(0, initialDelay));
    return () => {
      cancelled = true;
      clearTimeout(timer);
      clearTimeout(soundTimer);
      audio?.pause();
    };
  }, [commands, inView, reducedMotion, typingSpeed, delayBetweenCommands, initialDelay, enableSound]);

  const index = reducedMotion && inView ? commands.length : progress.index;
  useEffect(() => {
    const scroller = scrollRef.current;
    if (scroller && inView) scroller.scrollTop = scroller.scrollHeight;
  }, [progress, index, inView]);

  return (
    <div ref={rootRef} className={cn("developer-terminal", className)}>
      <div className="developer-terminal-titlebar">
        <div className="developer-terminal-controls" aria-hidden="true"><span /><span /><span /></div>
        <span className="developer-terminal-title">{username}</span>
      </div>
      <div ref={scrollRef} className="developer-terminal-body" tabIndex={0} role="region" aria-label={`${username} terminal transcript`}>
        <div className="sr-only">
          {commands.map((command, i) => <div key={i}>$ {command}{outputs?.[i]?.map((line, j) => <div key={j}>{line}</div>)}</div>)}
        </div>
        <div aria-hidden="true">
          {commands.slice(0, index).map((command, i) => (
            <div key={i} className="developer-terminal-entry">
              <div><span className="developer-terminal-prompt">$ </span><Command text={command} /></div>
              {outputs?.[i]?.map((line, j) => <div className="developer-terminal-output" key={j}>{line}</div>)}
            </div>
          ))}
          <div>
            <span className="developer-terminal-prompt">$ </span>
            {index < commands.length && <Command text={commands[index].slice(0, progress.characters)} />}
            <span className="developer-terminal-cursor">▌</span>
          </div>
          {index < commands.length && progress.showOutput && outputs?.[index]?.map((line, j) => <div className="developer-terminal-output" key={j}>{line}</div>)}
        </div>
      </div>
    </div>
  );
}
