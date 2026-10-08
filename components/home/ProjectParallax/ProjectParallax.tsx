"use client";

import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import styles from "./ProjectParallax.module.css";

type ProjectParallaxProps = {
  src: string;
  alt: string;
  sizes: string;
  priority?: boolean;
  reverse?: boolean;
};

export function ProjectParallax({ src, alt, sizes, priority, reverse }: ProjectParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], reverse ? ["-6%", "6%"] : ["6%", "-6%"]);

  return (
    <div ref={ref} className={styles.frame}>
      <motion.div className={styles.image} style={{ y: reducedMotion ? "0%" : y }}>
        <Image src={src} alt={alt} fill sizes={sizes} priority={priority} />
      </motion.div>
    </div>
  );
}
