import Link from "next/link";
import styles from "./status.module.css";

export default function NotFound() {
  return <main id="main-content" className={styles.page}>
    <span className={styles.code}>OZONE / 404</span>
    <h1>Let’s find the right space.</h1>
    <p>The page you requested could not be found. Explore our projects or return to the home page.</p>
    <div className={styles.actions}><Link href="/">Back to home</Link><Link href="/projects">View projects</Link><Link href="/contact">Contact OZONE</Link></div>
  </main>;
}
