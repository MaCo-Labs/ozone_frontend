import { pageMetadata } from "@/lib/seo";
import { PageStructuredData } from "@/components/ui/StructuredData";
import Image from "next/image";
import Link from "next/link";
import { SERVICES } from "@/lib/siteData";
import styles from "../../editorial.module.css";
const service = SERVICES[0];
export const metadata = pageMetadata("/services/interior-fit-out");
export default function Page(){ return <main id="main-content" className={styles.page}><PageStructuredData path="/services/interior-fit-out" /><section className={styles.hero}><div className={styles.heroMedia}><Image src={service.heroImage} alt="Reference image of a premium completed interior" fill sizes="100vw" priority /></div><div className={styles.heroCopy}><span className={styles.eyebrow}>Interior fit-out</span><h1>From empty space to experience.</h1><p>{service.description}</p></div></section><section className={`${styles.shell} ${styles.section}`}><h2 className={styles.sectionTitle}>One space. Every visible layer.</h2><ul className={styles.wordList}>{service.scope.map((item,index)=><li key={item}><span>0{index+1}</span>{item}</li>)}</ul></section><div className={styles.fullImage}><Image src={service.detailImage} alt="Reference image of a detailed hospitality interior" fill sizes="100vw" /></div><div className={`${styles.shell} ${styles.cta}`}><h2>Make the space work.</h2><Link href="/contact">Discuss your fit-out</Link></div></main> }
