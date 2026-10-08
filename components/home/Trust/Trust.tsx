import styles from "./Trust.module.css";

const REASONS = [
  "Experienced & Skilled Professionals",
  "End-to-End Project Solutions",
  "ISO 9001:2015 Certified Quality Management",
  "Safety-First Work Culture",
  "Timely Project Delivery",
  "High-Quality Materials & Workmanship",
  "Innovative & Cost-Effective Solutions",
  "Customer-Centric Approach",
];

export function Trust() {
  return (
    <section className={styles.trust} aria-labelledby="trust-heading">
      <div className={styles.inner}>
        <h2 id="trust-heading" className={styles.heading}>
          WHY CHOOSE OZONE
        </h2>
        <p className={styles.intro}>
          Choosing OZONE means partnering with a team dedicated to excellence,
          innovation, and customer satisfaction. We combine technical expertise with
          efficient project management to deliver high-quality solutions on time and
          within budget.
        </p>
        <ul className={styles.grid}>
          {REASONS.map((reason) => (
            <li key={reason} className={styles.item}>
              {reason}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
