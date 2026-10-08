import { pageMetadata } from "@/lib/seo";
import { PageStructuredData } from "@/components/ui/StructuredData";
import Image from "next/image";
import Link from "next/link";
import { IMAGES } from "@/lib/siteData";
import styles from "../editorial.module.css";

export const metadata = pageMetadata("/about");

export default function AboutPage() {
  const approach = ["Understand", "Plan", "Design", "Engineer", "Build", "Deliver"];
  return <main id="main-content" className={styles.page}><PageStructuredData path="/about" />
    <section className={styles.hero}><div className={styles.heroMedia}><Image src={IMAGES.aboutHero} alt="Reference image of contemporary architecture" fill sizes="100vw" priority /></div><div className={styles.heroCopy}><span className={styles.eyebrow}>About OZONE</span><h1>We don’t just build spaces.</h1><p>We create places that work: planned, coordinated, built, tested, and handed over as one complete effort.</p></div></section>
    <section className={`${styles.shell} ${styles.section} ${styles.intro}`} data-reveal><h2>The people behind the space.</h2><div className={styles.introCopy}><p>Established in 2014 and rebranded in 2021, OZONE brings interior fit-out, contracting, MEP, and engineering expertise together in Doha.</p><p>Our Qatar delivery is supported by an expanding presence in Bahrain.</p></div></section>
    <div className={styles.fullImage}><Image src={IMAGES.aboutInterior} alt="Reference image of a completed commercial interior" fill sizes="100vw" /></div>
    <section className={styles.split}><div className={styles.splitMedia}><Image src={IMAGES.aboutTeam} alt="Reference image of a project team collaborating" fill sizes="(max-width:760px) 100vw, 50vw" /></div><div className={styles.splitCopy}><span className={styles.eyebrow}>Our mission</span><h2>Exceptional value. Clear responsibility.</h2><p>To become the preferred choice for fit-out and contracting solutions by exceeding client expectations while maintaining quality, safety, integrity, sustainability, and compliance.</p></div></section>
    <section className={`${styles.dark} ${styles.section}`}><div className={styles.shell}><span className={styles.eyebrow}>What defines us</span><ul className={styles.wordList}>{["Quality", "Safety", "Innovation", "Sustainability", "Integrity"].map((word, index)=><li key={word}><span>0{index+1}</span>{word}</li>)}</ul></div></section>
    <section className={`${styles.shell} ${styles.section}`}><span className={styles.eyebrow}>The OZONE approach</span><div className={styles.vertical}>{approach.map((item,index)=><article key={item}><strong>0{index+1}</strong><h3>{item}</h3><p>{index === approach.length-1 ? "A complete, accountable handover." : "Each decision resolves the next stage before work advances."}</p></article>)}</div></section>
    <div className={`${styles.shell} ${styles.cta}`}><h2>Let the work tell the story.</h2><Link href="/projects">Explore our work</Link></div>
  </main>;
}
