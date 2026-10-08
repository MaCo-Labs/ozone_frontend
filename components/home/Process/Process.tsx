import styles from "./Process.module.css";

const STEPS = [
  {
    number: "01",
    name: "Planning & Approvals",
    description:
      "We begin every project with detailed planning, including site verification, shop drawings, material samples, and product documentation. All submissions are reviewed and approved by the consultant to ensure compliance with project specifications and quality standards.",
  },
  {
    number: "02",
    name: "Material Management",
    description:
      "Materials are carefully inspected, stored, and handled to maintain their quality. Components are delivered at the appropriate stage of construction, protected from damage and moisture, and securely identified for efficient installation.",
  },
  {
    number: "03",
    name: "Installation & Quality Control",
    description:
      "Our experienced team installs all materials in accordance with approved shop drawings, manufacturer guidelines, and site requirements. Continuous quality checks ensure accurate alignment, proper fitting, and high standards of workmanship throughout the installation process.",
  },
  {
    number: "04",
    name: "Final Inspection & Handover",
    description:
      "Upon completion, all installations are tested, adjusted, and thoroughly cleaned. Final inspections are carried out to ensure smooth operation, while surplus materials and debris are removed, leaving the site clean, safe, and ready for handover.",
  },
];

export function Process() {
  return (
    <section className={styles.process} aria-labelledby="process-heading">
      <div className={styles.inner}>
        <h2 id="process-heading" className={styles.heading}>
          OUR PROCESS
        </h2>
        <ol className={styles.list}>
          {STEPS.map((step) => (
            <li key={step.number} className={styles.step}>
              <span className={styles.number}>{step.number}</span>
              <div>
                <h3 className={styles.name}>{step.name}</h3>
                <p className={styles.description}>{step.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
