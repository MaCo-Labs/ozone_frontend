import { pageMetadata } from "@/lib/seo";
import { PageStructuredData } from "@/components/ui/StructuredData";
import Image from "next/image";
import Link from "next/link";
import { SERVICES } from "@/lib/siteData";
import styles from "../../editorial.module.css";
const service = SERVICES[3];
export const metadata = pageMetadata("/services/engineering");
export default function Page(){ return <main id="main-content" className={styles.page}><PageStructuredData path="/services/engineering" /><section className={styles.hero}><div className={styles.heroMedia}><Image src={service.heroImage} alt="Reference image of architectural structure and engineering" fill sizes="100vw" priority /></div><div className={styles.heroCopy}><span className={styles.eyebrow}>Engineering consultancy & design</span><h1>Where vision becomes buildable.</h1><p>{service.description}</p></div></section><section className={`${styles.shell} ${styles.section} ${styles.intro}`}><h2>Resolve before site.</h2><div className={styles.introCopy}><p>Technical design converts intent into coordinated information. Clear drawings, models, programmes, and cost plans reduce ambiguity during delivery.</p></div></section><section className={styles.split}><div className={styles.splitCopy}><span className={styles.eyebrow}>Capability map</span><ul className={styles.wordList}>{service.scope.map((item,index)=><li key={item}><span>0{index+1}</span>{item}</li>)}</ul></div><div className={styles.splitMedia}><Image src={service.detailImage} alt="Reference image of engineering-led architecture" fill sizes="(max-width:760px) 100vw, 50vw" /></div></section><div className={`${styles.shell} ${styles.cta}`}><h2>Design for delivery.</h2><Link href="/contact">Discuss engineering</Link></div></main> }
