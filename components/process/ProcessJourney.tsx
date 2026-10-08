"use client";

import Image from "next/image";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import { useRef } from "react";
import { IMAGES } from "@/lib/siteData";
import styles from "./ProcessJourney.module.css";

const stages = [
  ["Planning", "Site verification, approvals, shop drawings, and material samples establish a clear baseline.", IMAGES.processPlanning],
  ["Material management", "Materials are inspected, identified, protected, and sequenced for installation.", IMAGES.processMaterials],
  ["Installation", "Approved information guides coordinated work on site.", IMAGES.processInstallation],
  ["Quality control", "Continuous checks protect alignment, fit, and workmanship.", IMAGES.processQuality],
  ["Final inspection", "Systems, finishes, and outstanding work are reviewed before closeout.", IMAGES.processInspection],
  ["Handover", "Snags close and project documentation supports a clean operational handover.", IMAGES.processHandover],
] as const;

export function ProcessJourney(){
  const ref=useRef<HTMLElement>(null); const reduce=useReducedMotion();
  const {scrollYProgress}=useScroll({target:ref,offset:["start start","end end"]});
  const smoothProgress=useSpring(scrollYProgress,{stiffness:95,damping:26,mass:.35});
  const x=useTransform(smoothProgress,[0,1],["0%","-83.333%"]);
  const mobileDashOffset=useTransform(smoothProgress,[0,1],[1,0]);
  return <section ref={ref} className={styles.journey}><div className={styles.sticky}><motion.div className={styles.track} style={{x:reduce?"0%":x}}><svg className={styles.path} viewBox="0 0 6000 260" preserveAspectRatio="none" aria-hidden="true"><path d="M20 142 C 420 26, 680 238, 1040 132 S 1660 30, 2040 142 S 2660 236, 3040 126 S 3660 34, 4040 142 S 4660 236, 5040 126 S 5660 34, 5980 142"/><motion.path d="M20 142 C 420 26, 680 238, 1040 132 S 1660 30, 2040 142 S 2660 236, 3040 126 S 3660 34, 4040 142 S 4660 236, 5040 126 S 5660 34, 5980 142" style={{pathLength:reduce?1:smoothProgress}}/></svg><svg className={styles.mobilePath} viewBox="0 0 80 100" preserveAspectRatio="none" aria-hidden="true"><path d="M20 0 C20 6 56 8 56 14 S20 19 20 21 C20 27 56 29 56 35 S20 40 20 42 C20 48 56 50 56 56 S20 61 20 63 C20 69 56 71 56 77 S20 82 20 84 C20 90 56 93 56 96 S20 99 20 100"/><motion.path d="M20 0 C20 6 56 8 56 14 S20 19 20 21 C20 27 56 29 56 35 S20 40 20 42 C20 48 56 50 56 56 S20 61 20 63 C20 69 56 71 56 77 S20 82 20 84 C20 90 56 93 56 96 S20 99 20 100" pathLength="1" strokeDasharray="1" style={{strokeDashoffset:reduce?0:mobileDashOffset}}/></svg>{stages.map((stage,index)=><motion.article key={stage[0]} className={styles.stage} data-horizontal-stage initial={reduce?false:{opacity:.25,y:44}} whileInView={reduce?undefined:{opacity:1,y:0}} viewport={{amount:.35,once:true}} transition={{duration:.55}}><div className={styles.image}><Image src={stage[2]} alt="" fill sizes="(max-width:760px) 100vw, 52vw" /></div><div className={styles.copy}><span>0{index+1}</span><h2>{stage[0]}</h2><p>{stage[1]}</p></div></motion.article>)}</motion.div></div></section>
}
