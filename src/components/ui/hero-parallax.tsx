"use client";

import Image from "next/image";
import { portfolioTheme } from "@/lib/theme";
import {
  motion,
  useTransform,
  useSpring,
  useReducedMotion,
  type MotionValue,
} from "motion/react";

export type Product = {
  title: string;
  link?: string;
  thumbnail: string;
};

type HeroParallaxProps = {
  products: Product[];
  scrollProgress: MotionValue<number>;
};

export function HeroParallax({ products, scrollProgress }: HeroParallaxProps) {
  const firstRow = products.slice(0, 5);
  const secondRow = products.slice(5, 10);
  const thirdRow = products.slice(10, 15);
  const reducedMotion = useReducedMotion();
  // Run the complete expanded-to-compact timeline backward. All transforms
  // share this progress, rather than independently reversing movement signs.
  const reversedProgress = useTransform(scrollProgress, [0, 1], [1, 0]);
  const springConfig = { stiffness: 300, damping: 30, bounce: 100 };
  const translateX = useSpring(useTransform(reversedProgress, [0, 1], [0, 1000]), springConfig);
  const translateXReverse = useSpring(useTransform(reversedProgress, [0, 1], [0, -1000]), springConfig);
  const rotateX = useSpring(useTransform(reversedProgress, [0, 1], [0, 15]), springConfig);
  const rotateZ = useSpring(useTransform(reversedProgress, [0, 1], [0, 20]), springConfig);
  // Zero centers the final three-row arrangement in the existing viewport.
  const translateY = useSpring(useTransform(reversedProgress, [0, 1], [0, -400]), springConfig);
  const exitOpacity = useTransform(scrollProgress, [0, 0.72, 1], [1, 1, 0]);
  const exitVisibility = useTransform(exitOpacity, (value) => value <= 0 ? "hidden" : "visible");

  return (
    <motion.div style={{ backgroundColor: portfolioTheme.background, opacity: exitOpacity, visibility: exitVisibility }}
      className="absolute inset-0 overflow-hidden bg-background antialiased [perspective:1000px] [transform-style:preserve-3d]">
      <motion.div
        className="absolute top-[calc(50%-400px)] left-1/2 w-max -translate-x-1/2 md:top-[calc(50%-600px)]"
        style={reducedMotion
          ? { rotateX: 0, rotateZ: 0, y: 0 }
          : { rotateX, rotateZ, translateY }}
      >
        {[firstRow, secondRow, thirdRow].map((row, index) => (
          <motion.div
            key={index}
            className={index === 1
              ? "mb-8 flex flex-row gap-8 md:mb-20 md:gap-20"
              : "mb-8 flex flex-row-reverse gap-8 md:mb-20 md:gap-20"}
          >
            {row.map((product) => (
              <ProductCard key={product.thumbnail} product={product}
                translate={index === 1 ? translateXReverse : translateX}
                reducedMotion={Boolean(reducedMotion)} />
            ))}
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}

export function ProductCard({ product, translate, reducedMotion }: {
  product: Product;
  translate: MotionValue<number>;
  reducedMotion: boolean;
}) {
  const cardContent = (
    <>
      <Image src={product.thumbnail} height={600} width={600} unoptimized
        className="absolute inset-0 h-full w-full object-cover object-left-top"
        alt={product.title} />
      <span className="absolute bottom-4 left-4 rounded-md border border-border bg-card px-3 py-1.5 text-sm text-foreground shadow-soft opacity-0 transition-opacity group-hover/product:opacity-100 group-focus-within/product:opacity-100">
        {product.title}
      </span>
    </>
  );

  return (
    <motion.div style={{ x: reducedMotion ? 0 : translate }}
      whileHover={reducedMotion ? undefined : { y: -20 }}
      className="group/product relative h-72 w-96 shrink-0 overflow-hidden rounded-lg border border-border md:h-96 md:w-[30rem]">
      {product.link ? (
        <a href={product.link} target="_blank" rel="noopener noreferrer"
          aria-label={`${product.title} (opens in a new tab)`}
          className="absolute inset-0 block focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-accent">
          {cardContent}
        </a>
      ) : (
        <div className="absolute inset-0">{cardContent}</div>
      )}
    </motion.div>
  );
}
