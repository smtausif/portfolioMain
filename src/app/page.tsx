import { WebcamPixelGridDemo } from "@/components/webcam-pixel-grid-demo";
import { AboutMe } from "@/components/about-me";
import { TechStack } from "@/components/tech-stack";
import { ExperienceSection } from "@/components/experience-section";
import { SelectedWorkSection } from "@/components/selected-work-section";

export default function Home() {
  return (
    <>
      <WebcamPixelGridDemo />
      <AboutMe />
      <TechStack />
      <ExperienceSection />
      <SelectedWorkSection />
    </>
  );
}
