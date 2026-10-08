import { pageMetadata } from "@/lib/seo";
import { PageStructuredData } from "@/components/ui/StructuredData";
import Image from "next/image";
import { ProcessJourney } from "@/components/process/ProcessJourney";
import { IMAGES } from "@/lib/siteData";
import styles from "../editorial.module.css";
export const metadata = pageMetadata("/process");
export default function Page(){return <main id="main-content" className={styles.page}><PageStructuredData path="/process" /><section className={styles.hero}><div className={styles.heroMedia}><Image src={IMAGES.processHero} alt="Reference image of project planning and coordination" fill sizes="100vw" priority/></div><div className={styles.heroCopy}><span className={styles.eyebrow}>Process</span><h1>From plan to place.</h1><p>Six connected stages. One accountable delivery path.</p></div></section><ProcessJourney/></main>}
