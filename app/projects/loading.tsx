import styles from "./loading.module.css";

export default function Loading() {
  return <main id="main-content" className={styles.loading} aria-busy="true" aria-label="Loading projects"><span className={styles.title} /><div className={styles.grid}><div /><div /><div /></div><p role="status">Loading projects…</p></main>;
}
