/** Shared by CSS, the webcam canvas, and WebGL so every surface uses one palette. */
export const portfolioTheme = {
  background: "#FAF9F6",
  foreground: "#303030",
  secondary: "#666666",
  muted: "#A9A5A3",
  accent: "#C65A2E",
  surface: "#F0EEEA",
  card: "#FFFFFF",
  border: "#E5E2DD",
  label: "#777777",
  signBorder: "#D8D4CF",
  rope: "#85817D",
  ropeLight: "#AAA6A1",
  ropeDark: "#706C68",
  track: "#DDD8D2",
  cubeTop: "#F0EEEA",
  cubeLeft: "#E1DED8",
  cubeRight: "#EAE7E2",
} as const;

export const portfolioThemeVariables = Object.fromEntries(
  Object.entries(portfolioTheme).map(([name, value]) => [
    `--theme-${name.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`)}`,
    value,
  ]),
);
