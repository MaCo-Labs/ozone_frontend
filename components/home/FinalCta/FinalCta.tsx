import Link from "next/link";
import styles from "./FinalCta.module.css";

export function FinalCta() {
  return (
    <section className={styles.cta} aria-labelledby="cta-heading">
      <div className={styles.inner}>
        <h2 id="cta-heading" className={styles.heading}>
          READY TO BUILD?
        </h2>
        <p className={styles.copy}>
          From interior fit-out to MEP and engineering consultancy, OZONE delivers
          integrated project solutions across Qatar and Bahrain.
        </p>
        <div className={styles.actions}>
          <Link href="/contact" className={styles.primary}>
            START A PROJECT <span aria-hidden="true">→</span>
          </Link>
          <Link href="/contact" className={styles.secondary}>
            CONTACT OZONE <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
