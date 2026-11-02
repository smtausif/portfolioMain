
"use client";

import Image from "next/image";
import { WorkArrow } from "@/components/work/work-arrow";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "motion/react";
import {
  useEffect,
  useRef,
  useState,
  type PointerEvent,
} from "react";

export interface ProjectScreenshot {
  src: string;
  alt: string;
  width: number;
  height: number;
}

export function ProjectImageComposition({
  images,
  annotation,
  layout = "layered",
  caption = "Actual application screens",
}: {
  images: ProjectScreenshot[];
  annotation: string;
  layout?: "layered" | "gallery";
  caption?: string;
}) {
  const reduced = useReducedMotion();

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springX = useSpring(x, {
    stiffness: 100,
    damping: 25,
  });

  const springY = useSpring(y, {
    stiffness: 100,
    damping: 25,
  });

  const dialog = useRef<HTMLDialogElement>(null);

  const [selected, setSelected] =
    useState<ProjectScreenshot | null>(null);

  useEffect(() => {
    if (!selected) return;

    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previous;
    };
  }, [selected]);

  const follow = (event: PointerEvent<HTMLDivElement>) => {
    if (reduced || event.pointerType !== "mouse") return;

    const bounds = event.currentTarget.getBoundingClientRect();

    x.set(
      ((event.clientX - bounds.left) / bounds.width - 0.5) * 12
    );

    y.set(
      ((event.clientY - bounds.top) / bounds.height - 0.5) * 10
    );
  };

  const openImage = (image: ProjectScreenshot) => {
    setSelected(image);
    dialog.current?.showModal();
  };

  return (
    <>
      <div
        className={`work-image-composition ${
          layout === "gallery" ? "work-image-gallery" : ""
        }`}
        onPointerMove={follow}
        onPointerLeave={() => {
          x.set(0);
          y.set(0);
        }}
      >
        <div
          className="work-image-annotation work-label"
          aria-hidden="true"
        >
          <span>{annotation}</span>
          <WorkArrow direction="curved" />
        </div>

        <motion.div
          className={`work-screenshot-stack work-screenshot-count-${images.length}`}
          style={{
            x: reduced ? 0 : springX,
            y: reduced ? 0 : springY,
          }}
        >
          {images.map((image, index) => (
            <motion.button
              type="button"
              key={image.src}
              className={`work-screenshot work-screenshot-${index + 1}`}
              aria-label={`Enlarge ${image.alt}`}
              onClick={() => openImage(image)}
              initial={
                reduced
                  ? false
                  : {
                      opacity: 0,
                      y: 28,
                      scale: 0.94,
                    }
              }
              whileInView={{
                opacity: 1,
                y: 0,
                scale: 1,
              }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{
                duration: reduced ? 0 : 0.7,
                delay: reduced ? 0 : index * 0.12,
              }}
            >
              <span
                className="work-window-bar work-label"
                aria-hidden="true"
              >
                <i />
                <i />
                <i />
                <span className="work-label">
                  {String(index + 1).padStart(2, "0")} /{" "}
                  {String(images.length).padStart(2, "0")}
                </span>
                <WorkArrow />
              </span>

              <Image
                src={image.src}
                alt={image.alt}
                width={image.width}
                height={image.height}
                sizes={
                  layout === "gallery"
                    ? "(max-width: 767px) 90vw, (max-width: 899px) 44vw, 25vw"
                    : index === 0
                      ? "(max-width: 899px) 90vw, 50vw"
                      : "(max-width: 899px) 44vw, 25vw"
                }
              />
            </motion.button>
          ))}
        </motion.div>

        <p className="work-image-caption work-label">
          {caption}
          <span>
            Click to explore <WorkArrow />
          </span>
        </p>
      </div>

      <dialog
        ref={dialog}
        className="work-lightbox"
        aria-label={selected?.alt ?? "Project screenshot"}
        onClose={() => setSelected(null)}
        onClick={(event) => {
          if (event.target === event.currentTarget) {
            dialog.current?.close();
          }
        }}
      >
        <div className="work-lightbox-content">
          <div className="work-lightbox-toolbar work-label">
            <span>{selected?.alt}</span>

            <button
              type="button"
              onClick={() => dialog.current?.close()}
              aria-label="Close enlarged screenshot"
            >
              Close ×
            </button>
          </div>

          {selected && (
            <Image
              src={selected.src}
              alt={selected.alt}
              width={selected.width}
              height={selected.height}
              sizes="94vw"
            />
          )}
        </div>
      </dialog>
    </>
  );
}
