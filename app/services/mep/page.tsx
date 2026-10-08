import { pageMetadata } from "@/lib/seo";
import { PageStructuredData } from "@/components/ui/StructuredData";
import Image from "next/image";
import Link from "next/link";
import { SERVICES } from "@/lib/siteData";
import styles from "../../editorial.module.css";
const service = SERVICES[2];
export const metadata = pageMetadata("/services/mep");
export default function Page(){ return <main id="main-content" className={styles.technical}><PageStructuredData path="/services/mep" /><section className={styles.hero}><div className={styles.heroMedia}><Image src={service.heroImage} alt="Reference image of technical building systems" fill sizes="100vw" priority /></div><div className={styles.heroCopy}><span className={styles.eyebrow}>MEP services</span><h1>The systems behind the space.</h1><p>{service.description}</p></div></section><section className={`${styles.shell} ${styles.section}`}><span className={styles.eyebrow}>Coordinated systems</span><ul className={styles.wordList}>{["Mechanical","Electrical","Plumbing","HVAC","Fire protection","Life safety","Low current","Testing & commissioning","Operations & maintenance"].map((item,index)=><li key={item}><span>0{index+1}</span>{item}</li>)}</ul></section><div className={`${styles.shell} ${styles.cta}`}><h2>Performance is designed in.</h2><Link href="/contact">Discuss MEP scope</Link></div></main> }
