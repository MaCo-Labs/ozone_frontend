"use client";

import { forwardRef } from "react";
import styles from "./StageIndicator.module.css";

export const STAGES = ["DISCOVER", "PLAN", "ENGINEER", "BUILD", "HANDOVER", "OPERATE"];

export const StageIndicator = forwardRef<HTMLOListElement>(function StageIndicator(_props, ref) {
  return (
    <ol ref={ref} className={styles.list} aria-label="Project stages">
      {STAGES.map((stage, i) => (
        <li key={stage} className={styles.item} data-active={i === 0}>
          <span className={styles.number}>{String(i + 1).padStart(2, "0")}</span>
          <span className={styles.label}>{stage}</span>
        </li>
      ))}
    </ol>
  );
});
