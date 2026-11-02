# Warm editorial light theme

The existing portfolio now uses warm off-white backgrounds, charcoal text, white cards, soft borders and shadows, and burnt-orange editorial accents. Geist and Geist Mono are unchanged.

## Palette

`src/lib/theme.ts` is the single palette source. The root layout exposes those values as CSS custom properties, Tailwind v4 maps them to semantic utilities, and the webcam/WebGL integrations consume the same values directly.

| Role | Color |
| --- | --- |
| Background | `#FAF9F6` |
| Primary text | `#303030` |
| Secondary text | `#666666` |
| Muted text | `#A9A5A3` |
| Accent | `#C65A2E` |
| Soft surface | `#F0EEEA` |
| Card | `#FFFFFF` |
| Border | `#E5E2DD` |

## Implementation

- Hero: light overlays and controls preserve the 15-image parallax gallery, scroll transforms, and opt-in webcam renderer. The hero stylesheet was renamed from `hero.module.css` to `hero.css` with scoped class names because the existing Tailwind Turbopack loader does not export CSS Module names.
- About: white hanging sign, warm gray braided ropes, soft shadows, burnt-orange sketches and highlights. Spring physics, hover response, drag handle, typing, and grid interactions remain. SVG dimensions are explicit; rope bounds follow the measured hanging structure.
- Tech Stack: the existing cube engine receives light palette values; its geometry and simulation are unchanged. Logos retain their original files and colors. White brand marks use small charcoal backings for contrast. Per the explicit instruction to omit the terminal, its slot displays the existing “Always learning. Always building.” wording with animated underlines. Reusable terminal source files remain available and untouched.
- Experience: only surface, text, border, progress-beam, dot, shadow, and decorative colors changed. Timeline DOM structure, sticky dates, spacing, card content, and screenshots remain.
- Projects: existing alternating layouts, screenshot stacks, project numbering, technical details, links, dialog interactions, and preview structures remain. Frames are white; sketch accents and progress indicators use the shared accent.
- Cursor: the existing spring, hover, and click behavior remains; its ring and dot now use burnt orange with a restrained hover halo.

## Changed files

- `src/app/globals.css`
- `src/app/layout.tsx`
- `src/components/about-editorial.css`
- `src/components/about-editorial.tsx`
- `src/components/about-me.tsx`
- `src/components/experience-accent.tsx`
- `src/components/experience-enhancements.css`
- `src/components/experience-section.tsx`
- `src/components/hero.css`
- `src/components/learning-statement.tsx`
- `src/components/selected-work-section.tsx`
- `src/components/selected-work.css`
- `src/components/tech-stack-sphere.css`
- `src/components/tech-stack.css`
- `src/components/tech-stack.tsx`
- `src/components/ui/animated-cursor.tsx`
- `src/components/ui/background-ripple-effect.tsx`
- `src/components/ui/hero-parallax.tsx`
- `src/components/ui/pointer-highlight.tsx`
- `src/components/ui/timeline.tsx`
- `src/components/ui/webcam-pixel-grid.tsx`
- `src/components/webcam-pixel-grid-demo.tsx`
- `src/components/work/upcoming-project-preview.tsx`
- `src/lib/theme.ts`

`src/components/hero.module.css` was renamed to `src/components/hero.css`. No dependencies were added. All 47 public asset files are byte-for-byte unchanged.

## Validation

- `npm run lint`: passed.
- `npx tsc --noEmit`: passed.
- `npm run build`: passed.
- Production-browser checks at 1440, 1024, 768, and 390px: passed; shared backgrounds, no horizontal overflow, and no overlap between adjacent sections.
- Content/asset preservation: exact DOM text and links match for About, Experience, and Projects; all 15 hero images, 21 logos, 3 experience entries, and 5 projects remain; all 47 public files match their original hashes.
- Simulated webcam: no permission request on mount; enable, pixel rendering, disable, and stream cleanup passed. A real physical camera was not used.
- Interaction checks: hanging sign and synchronized ropes, reactive WebGL cubes, draggable logo sphere, timeline progress and active dots, project technical details, and screenshot lightbox passed.
- Reduced motion: About text is immediately readable. No browser runtime errors were reported.

## Existing issues outside this theme change

- “View Resume” points to `/resume.pdf`, but there is no corresponding `public/resume.pdf` in the current project.
- “Explore Projects” points to `#projects`, while the existing section ID is `selected-work`. The existing link and section IDs were preserved.
- The referenced screenshot was not attached in the available conversation, and arjun-r.com was inaccessible through the browsing tool. Styling follows the supplied palette and detailed visual direction.
