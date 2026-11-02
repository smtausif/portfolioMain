import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { portfolioThemeVariables } from "@/lib/theme";
import { Geist, Geist_Mono } from "next/font/google";
import { AnimatedCursor } from "@/components/ui/animated-cursor";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "S. M. Tausif | Software Developer",
  description: "S. M. Tausif — Software Developer specializing in full-stack and backend engineering.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      style={portfolioThemeVariables as CSSProperties}
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <AnimatedCursor />
      </body>
    </html>
  );
}
