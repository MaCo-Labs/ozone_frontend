import Link from "next/link";
import { CONTACT } from "@/lib/siteData";
import { pageMetadata } from "@/lib/seo";
import { PageStructuredData } from "@/components/ui/StructuredData";
import styles from "./privacy.module.css";

export const metadata = pageMetadata("/privacy");

export default function PrivacyPage() {
  return <main id="main-content" className={styles.page}>
    <PageStructuredData path="/privacy" />
    <span className={styles.eyebrow}>OZONE / WEBSITE PRIVACY</span>
    <h1>Your project details.</h1>
    <p>This information describes the OZONE website and its project enquiry form.</p>
    <section><h2>Project enquiries</h2><p>The form uses your name, email, company, phone number, service selection and project brief to prepare a WhatsApp message. Name, email and brief are required; other details are optional. The website does not save form submissions to its content database.</p><p>Choosing “Continue on WhatsApp” passes these details to WhatsApp in a prefilled message link. Review the message before sending it. WhatsApp handles the link and your conversation under its own privacy policy. Please include only information needed for the initial project discussion.</p></section>
    <section><h2>After you contact us</h2><p>OZONE uses details you send through WhatsApp, email or telephone to respond to your enquiry and discuss your project. For questions about information you have shared, contact <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>.</p></section>
    <section><h2>Website requests and external services</h2><p>The website loads project media from the OZONE content service. Illustrative reference images are hosted with the website. Website, media and hosting services may process technical information such as IP addresses and request logs to operate the site.</p><p>This website does not include advertising trackers or analytics scripts. External websites, including WhatsApp, manage their own privacy practices.</p></section>
    <section><h2>Contact</h2><p>OZONE Fitout &amp; Contracting W.L.L.<br />{CONTACT.address}<br /><a href={CONTACT.phoneHrefs[0]}>{CONTACT.phones[0]}</a><br /><a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a></p></section>
    <Link href="/contact">Back to project enquiries ↗</Link>
  </main>;
}
