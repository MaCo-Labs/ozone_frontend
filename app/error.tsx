"use client";

import Link from "next/link";
import styles from "./status.module.css";

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <main id="main-content" className={styles.page}>
    <span className={styles.code}>OZONE / CONNECTION INTERRUPTED</span>
    <h1>We couldn’t load this page.</h1>
    <p>Please try again. You can also contact our team directly about your project.</p>
    <div className={styles.actions}><button type="button" onClick={reset}>Try again</button><Link href="/contact">Contact OZONE</Link></div>
  </main>;
}
