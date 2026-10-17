import { pageMetadata } from "@/lib/seo";
import { PageStructuredData } from "@/components/ui/StructuredData";
import Image from "next/image";
import Link from "next/link";
import { SERVICES } from "@/lib/siteData";
import styles from "../../editorial.module.css";
const service = SERVICES[1];
const scopeDescriptions: Record<(typeof service.scope)[number], string> = {
  "General contracting": "A single site team coordinates subcontractors, procurement, inspections, and the programme from mobilisation through handover.",
  "Design and build solutions": "Develop design and construction together, resolving buildability, scope, and cost decisions before work starts on site.",
  "Civil and structural construction": "Set out foundations, structural elements, and associated civil works against approved drawings and inspection requirements.",
  "Commercial and residential developments": "Coordinate the building shell, shared areas, and service connections around the needs of occupants, tenants, and operators.",
  "Building renovation and refurbishment": "Survey existing conditions, plan strip-out and alterations, and sequence upgrades to limit disruption to occupied spaces.",
  "Concrete and finishing works": "Control formwork, reinforcement, concrete placement, and surface finishes so the structure supports the final architectural result.",
  "Infrastructure and external works": "Plan drainage, utility routes, access roads, and external finishes as connected parts of the site.",
};
export const metadata = pageMetadata("/services/contracting-construction");
export default function Page(){ return <main id="main-content" className={styles.page}><PageStructuredData path="/services/contracting-construction" /><section className={styles.hero}><div className={styles.heroMedia}><Image src={service.heroImage} alt="Reference image of a construction framework" fill sizes="100vw" priority /></div><div className={styles.heroCopy}><span className={styles.eyebrow}>Contracting & construction</span><h1>Building the framework.</h1><p>{service.description}</p></div></section><section className={`${styles.shell} ${styles.section}`}><span className={styles.eyebrow}>Delivery scope</span><div className={styles.vertical}>{service.scope.map((item,index)=><article key={item}><strong>0{index+1}</strong><h3>{item}</h3><p>{scopeDescriptions[item]}</p></article>)}</div></section><div className={`${styles.shell} ${styles.cta}`}><h2>Build with control.</h2><Link href="/contact">Discuss construction</Link></div></main> }
