import { pageMetadata } from "@/lib/seo";
import { PageStructuredData } from "@/components/ui/StructuredData";
import Image from "next/image";
import Link from "next/link";
import { SERVICES } from "@/lib/siteData";
import styles from "../../editorial.module.css";
const service = SERVICES[1];
export const metadata = pageMetadata("/services/contracting-construction");
export default function Page(){ return <main id="main-content" className={styles.page}><PageStructuredData path="/services/contracting-construction" /><section className={styles.hero}><div className={styles.heroMedia}><Image src={service.heroImage} alt="Reference image of a construction framework" fill sizes="100vw" priority /></div><div className={styles.heroCopy}><span className={styles.eyebrow}>Contracting & construction</span><h1>Building the framework.</h1><p>{service.description}</p></div></section><section className={`${styles.shell} ${styles.section}`}><span className={styles.eyebrow}>Delivery scope</span><div className={styles.vertical}>{service.scope.map((item,index)=><article key={item}><strong>0{index+1}</strong><h3>{item}</h3><p>Planned, sequenced, inspected, and coordinated within one delivery structure.</p></article>)}</div></section><div className={`${styles.shell} ${styles.cta}`}><h2>Build with control.</h2><Link href="/contact">Discuss construction</Link></div></main> }
