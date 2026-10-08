import styles from "./SelectedWork.module.css";

const PROJECTS = [
  { name: "Qatar Rail", sector: "Transit" },
  { name: "Maestro Dental Centre", sector: "Healthcare" },
  { name: "Apparel Group Head Office", sector: "Corporate" },
  { name: "360 Play - Mall of Qatar", sector: "Retail & Leisure" },
  { name: "Tim Hortons", sector: "F&B" },
  { name: "Karak Stop", sector: "F&B" },
  { name: "Camel Café", sector: "F&B" },
  { name: "Malabar Gold & Diamonds", sector: "Retail" },
  { name: "Jawhara", sector: "Retail" },
  { name: "Le Coiffeur", sector: "Retail" },
  { name: "Phone Booth", sector: "Retail" },
  { name: "Al Anees Electronics", sector: "Retail" },
  { name: "Lavender", sector: "Retail" },
  { name: "VLCC", sector: "Wellness" },
];

export function SelectedWork() {
  return (
    <section className={styles.work} aria-labelledby="work-heading">
      <div className={styles.inner}>
        <p className={styles.eyebrow}>SELECTED WORK</p>
        <h2 id="work-heading" className={styles.heading}>
          Projects delivered across Qatar
        </h2>
        <ul className={styles.list}>
          {PROJECTS.map((project, i) => (
            <li key={project.name} className={styles.row}>
              <span className={styles.index}>{String(i + 1).padStart(2, "0")}</span>
              <span className={styles.name}>{project.name}</span>
              <span className={styles.sector}>{project.sector}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
