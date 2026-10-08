"use client";

import Image from "next/image";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import { useRef } from "react";
import { IMAGES, PROCESS } from "@/lib/siteData";
import styles from "./DeliveryJourney.module.css";

const stages = [
  { word: "Idea", label: PROCESS[0].title, text: PROCESS[0].text, image: IMAGES.homePlan },
  { word: "Design", label: "Technical design & coordination", text: "Architecture, MEP, shop drawings, materials, and programme resolve into one buildable direction.", image: IMAGES.homeDesign },
  { word: "Build", label: PROCESS[2].title, text: PROCESS[2].text, image: IMAGES.homeBuild },
  { word: "Space", label: PROCESS[3].title, text: PROCESS[3].text, image: IMAGES.homeSpace },
] as const;

export function DeliveryJourney() {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 95, damping: 26, mass: 0.35 });
  const x = useTransform(smoothProgress, [0, 1], ["0%", "-75%"]);
  const mobileDashOffset = useTransform(smoothProgress, [0, 1], [1, 0]);

  return (
    <section ref={sectionRef} className={styles.journey} aria-labelledby="journey-title">
      <div className={styles.sticky}>
        <header className={styles.heading}>
          <span>04 / HOW WE DELIVER</span>
          <h2 id="journey-title">From idea to operational space.</h2>
        </header>

        <motion.div className={styles.track} style={{ x: reducedMotion ? "0%" : x }}>
          <svg className={styles.path} viewBox="0 0 4000 240" preserveAspectRatio="none" aria-hidden="true">
            <path d="M20 130 C 430 20, 570 220, 980 120 S 1550 30, 1980 125 S 2560 220, 2990 115 S 3560 20, 3980 120" />
            <motion.path
              d="M20 130 C 430 20, 570 220, 980 120 S 1550 30, 1980 125 S 2560 220, 2990 115 S 3560 20, 3980 120"
              style={{ pathLength: reducedMotion ? 1 : smoothProgress }}
            />
          </svg>
          <svg className={styles.mobilePath} viewBox="0 0 80 100" preserveAspectRatio="none" aria-hidden="true">
            <path d="M20 0 C20 8 58 12 58 20 S20 27 20 33 C20 41 58 45 58 53 S20 60 20 66 C20 74 58 80 58 87 S20 94 20 100" />
            <motion.path
              d="M20 0 C20 8 58 12 58 20 S20 27 20 33 C20 41 58 45 58 53 S20 60 20 66 C20 74 58 80 58 87 S20 94 20 100"
              pathLength="1"
              strokeDasharray="1"
              style={{ strokeDashoffset: reducedMotion ? 0 : mobileDashOffset }}
            />
          </svg>
          {stages.map((stage, index) => (
            <motion.article
              key={stage.word}
              className={styles.stage} data-horizontal-stage
              initial={reducedMotion ? false : { opacity: 0.35, y: 38 }}
              whileInView={reducedMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ amount: 0.35, once: true }}
              transition={{ duration: 0.6, ease: [0.2, 0.7, 0.2, 1] }}
            >
              <div className={styles.stageNumber}>0{index + 1}</div>
              <div className={styles.image}><Image src={stage.image} alt="" fill sizes="(max-width: 800px) 100vw, 46vw" /></div>
              <div className={styles.stageCopy}>
                <h3>{stage.word}</h3>
                <strong>{stage.label}</strong>
                <p>{stage.text}</p>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
