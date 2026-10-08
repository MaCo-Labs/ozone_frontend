import { pageMetadata } from "@/lib/seo";
import { PageStructuredData } from "@/components/ui/StructuredData";
import Image from "next/image";
import { ContactForm } from "@/components/contact/ContactForm";
import { CONTACT, IMAGES } from "@/lib/siteData";
import editorial from "../editorial.module.css";
import styles from "../site.module.css";
export const metadata = pageMetadata("/contact");
export default function Page(){return <main id="main-content" className={editorial.page}><PageStructuredData path="/contact" /><section className={editorial.hero}><div className={editorial.heroMedia}><Image src={IMAGES.contactHero} alt="Reference image of a project team in a planning meeting" fill sizes="100vw" priority/></div><div className={editorial.heroCopy}><span className={editorial.eyebrow}>Contact / Doha</span><h1>Have a space in mind?</h1><p>Let’s build it. Share the scope, location, programme, and what has already been decided.</p></div></section><section className={`${styles.shell} ${styles.section} ${styles.contactGrid}`}><div className={styles.contactInfo}><span className={styles.sectionCode}>OZONE FITOUT & CONTRACTING W.L.L.</span><h2>Talk directly to OZONE.</h2><div className={styles.contactDetails}><p>{CONTACT.address}</p>{CONTACT.phones.map((phone,index)=><a key={phone} href={CONTACT.phoneHrefs[index]}>{phone}</a>)}<a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a><a href="https://www.ozonefitout.com">www.ozonefitout.com</a></div></div><div className={styles.contactFormWrap}><span className={styles.sectionCode}>Project brief</span><h2>Start with the essentials.</h2><ContactForm/></div></section></main>}
