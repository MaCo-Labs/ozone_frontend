import { pageMetadata } from "@/lib/seo";
import { PageStructuredData } from "@/components/ui/StructuredData";
import { PageHero } from "@/components/ui/PageHero";
import { IMAGES } from "@/lib/siteData";
import styles from "../site.module.css";

export const metadata = pageMetadata("/insights");

const INSIGHTS = [
  {
    code: "GUIDE 01",
    title: "Planning a commercial fit-out before site mobilisation",
    body: "A reliable start depends on verified site conditions, a coordinated information release schedule, consultant approvals, and material decisions made before they affect the programme.",
    points: ["Verify existing conditions", "Freeze authority and consultant submissions", "Link long-lead materials to the programme"],
  },
  {
    code: "GUIDE 02",
    title: "Why MEP coordination must happen before the ceiling closes",
    body: "Ceiling zones carry lighting, air distribution, fire protection, containment, access panels, and architectural details. Coordinating them early prevents clashes and protects ceiling quality.",
    points: ["Coordinate every service zone", "Keep access and maintenance clear", "Inspect before closing works"],
  },
  {
    code: "GUIDE 03",
    title: "What a clean project handover should contain",
    body: "Handover is more than a final walkthrough. Testing records, as-built information, warranties, operating guidance, and closed snags give the operator a dependable starting point.",
    points: ["Complete testing and commissioning", "Close and record snags", "Deliver usable project documentation"],
  },
] as const;

export default function InsightsPage() {
  return (
    <main id="main-content" className={styles.page}><PageStructuredData path="/insights" />
      <PageHero
        index="05 / INSIGHTS"
        title="Useful knowledge from the work."
        intro="Plain guidance for clients planning spaces, coordinating technical services, and preparing for a controlled handover."
        image={IMAGES.insightsHero}
        imageAlt="Reference image of a project team in a planning workshop"
      />

      <section className={`${styles.shell} ${styles.section}`} data-reveal>
        <div className={styles.statement}>
          <span className={styles.sectionCode}>FIELD NOTES</span>
          <p>The decisions made before installation usually have the greatest effect on time, quality, and rework.</p>
        </div>
      </section>

      <section className={styles.insights} data-reveal>
        {INSIGHTS.map((insight) => (
          <article key={insight.code} className={styles.insight}>
            <span>{insight.code}</span>
            <h2>{insight.title}</h2>
            <p>{insight.body}</p>
            <ul>{insight.points.map((point) => <li key={point}>{point}</li>)}</ul>
          </article>
        ))}
      </section>
    </main>
  );
}
