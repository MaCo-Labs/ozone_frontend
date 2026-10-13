import { PortfolioImage } from "./PortfolioImage";
import type { PortfolioCard } from "@/lib/portfolio";
import styles from "./ProjectIndex.module.css";

export function ProjectIndex({ cover }: { cover: PortfolioCard["cover"] }) {
  return <section className={styles.index} aria-labelledby="project-index-title">
    <div className={styles.backdrop} aria-hidden="true"><PortfolioImage image={cover} sizes="100vw" eager /></div>
    <div className={styles.copy}><h1 id="project-index-title">Explore <em>our</em> projects.</h1><p>Spaces shaped by purpose. Delivered with precision across Qatar.</p></div>
  </section>;
}
