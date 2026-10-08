"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { SERVICES } from "@/lib/siteData";
import styles from "./ServiceSelector.module.css";

const LINKS: Record<string, string> = {
  "interior-fit-out": "/services/interior-fit-out",
  "contracting-construction": "/services/contracting-construction",
  "mep-services": "/services/mep",
  "engineering-consultancy": "/services/engineering",
};

export function ServiceSelector() {
  const [active, setActive] = useState(0);
  const selected = SERVICES[active];
  return (
    <section className={styles.selector} aria-label="OZONE disciplines">
      <div className={styles.backdrop}>
        {SERVICES.map((service, index) => (
          <Image key={service.slug} src={service.image} alt="" fill sizes="100vw" data-active={index === active} />
        ))}
      </div>
      <div className={styles.scrim} />
      <div className={styles.content}>
        <h1 className={styles.heading}>Our capabilities.</h1>
        <p>{selected.short}</p>
        <div className={styles.words}>
          {SERVICES.map((service, index) => (
            <Link
              key={service.slug}
              href={LINKS[service.slug]}
              data-active={index === active}
              onPointerEnter={() => setActive(index)}
              onFocus={() => setActive(index)}
            >
              <span>0{index + 1}</span>{index === 0 ? "Fit-out" : index === 1 ? "Construction" : index === 2 ? "MEP" : "Engineering"}
            </Link>
          ))}
        </div>
        <Link className={styles.explore} href={LINKS[selected.slug]}>Explore discipline</Link>
      </div>
    </section>
  );
}
