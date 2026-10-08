import Image from "next/image";
import Link from "next/link";
import { CONTACT } from "@/lib/siteData";
import styles from "./Footer.module.css";

const links = [
  ["About", "/about"],
  ["Projects", "/projects"],
  ["Clients", "/clients"],
  ["Process", "/process"],
  ["Quality", "/quality-safety"],
] as const;

const services = [
  ["Interior fit-out", "/services/interior-fit-out"],
  ["Contracting & construction", "/services/contracting-construction"],
  ["MEP services", "/services/mep"],
  ["Engineering & design", "/services/engineering"],
] as const;

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.grid}>
        <div className={styles.brand}>
          <Image
            src="/brand/ozone-logo.png"
            alt="OZONE"
            width={210}
            height={77}
            className={styles.logo}
            style={{ height: "auto" }}
          />
          <p>Integrated fit-out, contracting, MEP, and engineering delivery across Qatar and Bahrain.</p>
          <Link className={styles.quality} href="/quality-safety">ISO 9001:2015 quality management</Link>
        </div>
        <nav className={styles.nav} aria-label="Footer navigation">
          <p className={styles.label}>Company</p>
          {links.map(([label, href]) => (
            <Link key={href} href={href}>{label}</Link>
          ))}
        </nav>
        <nav className={styles.nav} aria-label="Footer services">
          <p className={styles.label}>Our expertise</p>
          {services.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}
        </nav>
        <div className={styles.contact}>
          <p className={styles.label}>Contact OZONE</p>
          <p>{CONTACT.address}</p>
          {CONTACT.phones.map((phone, index) => (
            <a key={phone} href={CONTACT.phoneHrefs[index]}>{phone}</a>
          ))}
          <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
          <a href={`https://wa.me/${CONTACT.phones[0].replace(/\D/g, "")}`}>Chat on WhatsApp ↗</a>
        </div>
      </div>
      <div className={styles.bottom}>
        <span>© {new Date().getFullYear()} OZONE Fitout &amp; Contracting W.L.L.</span>
        <div className={styles.legal}><Link href="/sectors">Sectors</Link><Link href="/insights">Insights</Link><Link href="/privacy">Privacy</Link><span>Qatar · Bahrain</span></div>
      </div>
    </footer>
  );
}
