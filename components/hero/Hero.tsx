"use client";

import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { HeroVideo } from "./HeroVideo";
import styles from "./Hero.module.css";

const HEADLINES = [
  ["We build spaces", "that work."],
  ["We shape spaces", "built to last."],
] as const;

export function Hero() {
  const reducedMotion = useReducedMotion();
  const heroRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const [headlineIndex, setHeadlineIndex] = useState(0);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const videoOffset = useTransform(scrollYProgress, [0, 1], ["0%", "-4%"]);
  const headline = HEADLINES[reducedMotion ? 0 : headlineIndex];

  useEffect(() => {
    const title = titleRef.current;
    if (!title) return;
    let cancelled = false;
    const measure = () => {
      if (cancelled) return;
      const typography = getComputedStyle(title);
      const probe = document.createElement("span");
      Object.assign(probe.style, {
        position: "absolute", visibility: "hidden", whiteSpace: "nowrap",
        fontFamily: typography.fontFamily, fontWeight: typography.fontWeight,
        fontSize: "var(--type-page)", letterSpacing: "var(--heading-tracking)",
        textTransform: "uppercase", lineHeight: "1",
      });
      document.body.append(probe);
      const baseSize = parseFloat(getComputedStyle(probe).fontSize);
      const longest = Math.max(...HEADLINES.flat().map((line) => {
        probe.textContent = line;
        return probe.getBoundingClientRect().width;
      }));
      probe.remove();
      title.style.setProperty("--hero-title-size", `${baseSize * Math.min(1, (title.clientWidth - 12) / longest)}px`);
    };
    const observer = new ResizeObserver(measure);
    observer.observe(title);
    measure();
    void document.fonts.ready.then(measure);
    return () => { cancelled = true; observer.disconnect(); };
  }, []);

  return (
    <section ref={heroRef} className={styles.hero} aria-labelledby="home-hero-title">
      <motion.div className={styles.video} style={{ y: reducedMotion ? "0%" : videoOffset }}>
        <HeroVideo className={styles.videoMedia} onPhaseChange={setHeadlineIndex} />
      </motion.div>
      <div className={styles.scrim} aria-hidden="true" />

      <div className={styles.content}>
        <p className={styles.kicker}>OZONE / Doha, Qatar</p>
        <h1 ref={titleRef} id="home-hero-title" className={styles.title}>
          <span className={styles.visuallyHidden}>
            We build spaces that work. We shape spaces built to last.
          </span>
          <AnimatePresence initial={false} mode="sync">
            <motion.span key={headlineIndex} className={styles.phrase} aria-hidden="true">
              {headline.map((line, index) => (
                <span key={line} className={styles.lineMask}>
                  <motion.span
                    initial={reducedMotion ? false : { y: "112%", opacity: 0 }}
                    animate={{ y: "0%", opacity: 1 }}
                    exit={reducedMotion ? undefined : { y: "-112%", opacity: 0 }}
                    transition={{
                      duration: reducedMotion ? 0 : 0.86,
                      delay: reducedMotion ? 0 : index * 0.11,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                  >
                    {line}
                  </motion.span>
                </span>
              ))}
            </motion.span>
          </AnimatePresence>
        </h1>
        <p className={styles.intro}>
          Fit-out / Contracting / MEP / Engineering
        </p>
      </div>
    </section>
  );
}
