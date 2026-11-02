"use client";

import type { MotionValue } from "motion/react";
import { HeroParallax, type Product } from "@/components/ui/hero-parallax";

export function HeroParallaxDemo({ scrollProgress }: {
  scrollProgress: MotionValue<number>;
}) {
  return <HeroParallax products={products} scrollProgress={scrollProgress} />;
}

export const products: Product[] = [
  { title: "GitHub", link: "https://github.com/smtausif", thumbnail: "/projects/Github.png" },
  { title: "HuntigoX", link: "https://huntigox.com/", thumbnail: "/projects/huntigox1.png" },
  { title: "Maplewood Hotel Kiosk", link: "https://github.com/smtausif/MaplewoodHotelSystem", thumbnail: "/projects/Maplewood1.png" },
  { title: "SkillsShift+", link: "https://skillsshift.ca", thumbnail: "/projects/skillshift+1.png" },
  { title: "Trackwo", thumbnail: "/projects/Trackwo1.png" },
  { title: "LinkedIn", link: "https://www.linkedin.com/in/s-m-tausif-960524262/", thumbnail: "/projects/Linkedin.png" },
  { title: "HuntigoX", link: "https://huntigox.com/", thumbnail: "/projects/huntigox2.png" },
  { title: "SkillsShift+", link: "https://skillsshift.ca", thumbnail: "/projects/skillshift+2.png" },
  { title: "GitHub", link: "https://github.com/smtausif", thumbnail: "/projects/Github.png" },
  { title: "Trackwo", thumbnail: "/projects/Trackwo2.png" },
  { title: "SkillsShift+", link: "https://skillsshift.ca", thumbnail: "/projects/skillshit+3.png" },
  { title: "Maplewood Hotel Kiosk", link: "https://github.com/smtausif/MaplewoodHotelSystem", thumbnail: "/projects/maplewood2.png" },
  { title: "HuntigoX", link: "https://huntigox.com/", thumbnail: "/projects/huntigox3.png" },
  { title: "LinkedIn", link: "https://www.linkedin.com/in/s-m-tausif-960524262/", thumbnail: "/projects/Linkedin.png" },
  { title: "Trackwo", thumbnail: "/projects/Trackwo3.png" },
];
