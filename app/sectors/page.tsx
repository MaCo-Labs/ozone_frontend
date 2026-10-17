import { pageMetadata } from "@/lib/seo";
import { PageStructuredData } from "@/components/ui/StructuredData";
import Image from "next/image";
import { PageHero } from "@/components/ui/PageHero";
import { IMAGES, SECTORS } from "@/lib/siteData";
import styles from "../site.module.css";

export const metadata = pageMetadata("/sectors");

export default function SectorsPage() {
  return (
    <main id="main-content" className={styles.page}><PageStructuredData path="/sectors" />
      <PageHero
        index="04 / SECTORS"
        title="Different spaces. Specific demands."
        intro="Every sector brings a different operating model, approval path, technical load, and opening-day reality. The delivery plan should reflect that."
        image={IMAGES.sectorsHero}
        imageAlt="Reference image of a modern city and its built environment"
      />

      <ul className={styles.sectorRows}>
        {SECTORS.map((sector, index) => (
          <li key={sector.title} className={styles.sectorRow} data-reveal>
            <div className={styles.sectorCopy}>
              <span className={styles.sectionCode}>{String(index + 1).padStart(2, "0")} / SECTOR</span>
              <h2>{sector.title}</h2>
              <p>{sector.summary}</p>
              <p className={styles.references}>{sector.references.join(" · ")}</p>
            </div>
            <div className={styles.sectorMedia}>
              <Image src={sector.image} alt={`Representative ${sector.title.toLowerCase()} environment`} fill sizes="(max-width: 760px) 100vw, 62vw" />
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
