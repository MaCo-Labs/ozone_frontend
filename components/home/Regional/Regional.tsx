import styles from "./Regional.module.css";

export function Regional() {
  return (
    <section className={styles.regional} aria-labelledby="regional-heading">
      <div className={styles.inner}>
        <h2 id="regional-heading" className={styles.heading}>
          REGIONAL PRESENCE
        </h2>
        <div className={styles.columns}>
          <div>
            <h3 className={styles.country}>Qatar</h3>
            <p className={styles.detail}>C.R. 15190, P.O. Box 22657, Doha, Qatar</p>
            <a className={styles.detail} href="tel:+97433307095">
              +974 3330 7095
            </a>
            <a className={styles.detail} href="tel:+97477551044">
              +974 7755 1044
            </a>
          </div>
          <div>
            <h3 className={styles.country}>Bahrain</h3>
            <p className={styles.detail}>Expanding presence in the Kingdom of Bahrain.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
