import { pageMetadata } from "@/lib/seo";
import { PageStructuredData } from "@/components/ui/StructuredData";
import Image from "next/image";
import Link from "next/link";
import { DeliveryJourney } from "@/components/home/DeliveryJourney/DeliveryJourney";
import { SelectedWorkShowcase } from "@/components/home/SelectedWork/SelectedWorkShowcase";
import { Hero } from "@/components/hero/Hero";
import { getStudioClients, getStudioProject, type StudioClient } from "@/lib/content-api";
import { CLIENTS, IMAGES, PROJECTS, SERVICES } from "@/lib/siteData";
import { FEATURED_PROJECT_LINKS, FEATURED_PROJECT_SLUGS, projectImages } from "@/lib/projectMedia";
import styles from "./home.module.css";

export const metadata = pageMetadata("/");

const featuredProjects = PROJECTS.slice(0, 3);
const serviceLinks: Record<string, string> = {
  "interior-fit-out": "/services/interior-fit-out",
  "contracting-construction": "/services/contracting-construction",
  "mep-services": "/services/mep",
  "engineering-consultancy": "/services/engineering",
};

type DisplayClient = Pick<StudioClient, "name" | "logo_url">;

function ClientSequence({ clients, hidden = false }: { clients: readonly DisplayClient[]; hidden?: boolean }) {
  return (
    <div className={styles.clientSequence} aria-hidden={hidden || undefined}>
      {clients.map((client) => (
        <span key={client.name}>
          {/* Django may serve uploaded media locally or through the configured object store. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={client.logo_url!} alt={`${client.name} logo`} />
        </span>
      ))}
    </div>
  );
}

export default async function HomePage() {
  const [studioClients, studioProjects] = await Promise.all([
    getStudioClients(), Promise.all(FEATURED_PROJECT_SLUGS.map((slug) => getStudioProject(slug))),
  ]);
  const clients: DisplayClient[] = studioClients ?? CLIENTS.map((name) => ({ name, logo_url: null }));
  const homepageClients = clients
    .filter((client): client is DisplayClient & { logo_url: string } => Boolean(client.logo_url))
    .slice(0, 12);
  const midpoint = Math.ceil(homepageClients.length / 2);
  const clientRows = [homepageClients.slice(0, midpoint), homepageClients.slice(midpoint)].filter((row) => row.length > 0);
  const mobileClientSlots = homepageClients.slice(0, 6).map((_, slot) =>
    homepageClients.filter((__, index) => index % 6 === slot),
  );

  return (
    <main id="main-content" className={styles.home}><PageStructuredData path="/" />
      <div className={styles.opening}>
        <div className={styles.heroSticky}><Hero /></div>

        <section id="the-work" className={styles.work} aria-labelledby="work-title">
          <header className={styles.workHeading}>
            <span className={styles.sectionCode}>01 / SELECTED WORK</span>
            <h2 id="work-title">Proof, not promises.</h2>
            <p>Selected delivery across transit, healthcare, and corporate environments in Qatar.</p>
          </header>

          <SelectedWorkShowcase projects={featuredProjects.map((project, index) => ({
            name: studioProjects[index]?.title ?? project.name,
            sector: project.sector,
            location: studioProjects[index]?.location || "Doha, Qatar",
            href: FEATURED_PROJECT_LINKS[index],
            images: projectImages(studioProjects[index], index),
          }))} />

          <Link href="/projects" className={styles.textLink}>Explore the project archive <span aria-hidden="true">↗</span></Link>
        </section>
      </div>

      <section className={styles.clients} aria-labelledby="clients-title">
        <header className={styles.clientHeading}>
          <span className={styles.sectionCode}>02 / TRUSTED BY</span>
          <h2 id="clients-title">Brands and places people know.</h2>
        </header>
        {homepageClients.length === 0 && <ul className={styles.clientNames}>{clients.slice(0, 12).map((client) => <li key={client.name}>{client.name}</li>)}</ul>}
        {clientRows.map((row, index) => (
          <div key={`client-row-${index}`} className={styles.marquee} data-direction={index === 0 ? "right" : "left"} data-last={index === clientRows.length - 1 || undefined}>
            <div className={styles.marqueeTrack}>
              <ClientSequence clients={row} />
              <ClientSequence clients={row} hidden />
            </div>
          </div>
        ))}
        <div className={styles.mobileClientGrid}>
          <ul>
            {mobileClientSlots.map((slot, index) => (
              <li key={`mobile-client-slot-${index}`}>
                {slot.map((client, logoIndex) => (
                  // Django may serve uploaded media locally or through the configured object store.
                  // eslint-disable-next-line @next/next/no-img-element
                  <img key={client.name} src={client.logo_url} alt={logoIndex === 0 ? `${client.name} logo` : ""} />
                ))}
              </li>
            ))}
          </ul>
          <Link href="/clients" className={styles.mobileClientLink}>View all clients <span aria-hidden="true">↗</span></Link>
        </div>
        <p className={styles.clientNote}>Selected client marks shown in the OZONE company profile.</p>
      </section>

      <section className={styles.capabilities} aria-labelledby="capabilities-title">
        <header className={styles.capabilityHeading}>
          <span className={styles.sectionCode}>03 / CAPABILITIES</span>
          <h2 id="capabilities-title">One team.<br />Every critical layer.</h2>
        </header>
        <div className={styles.serviceList}>
          {SERVICES.map((service, index) => (
            <Link key={service.slug} href={serviceLinks[service.slug]} className={styles.serviceRow}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h3>{service.title}</h3>
              <p>{service.short}</p>
              <div className={styles.servicePreview} aria-hidden="true"><Image src={service.image} alt="" fill sizes="28vw" /></div>
              <span className={styles.arrow} aria-hidden="true">↗</span>
            </Link>
          ))}
        </div>
      </section>

      <DeliveryJourney />

      <section className={styles.standard} aria-labelledby="standard-title">
        <div className={styles.standardImage}><Image src={IMAGES.homeStandard} alt="Reference image of construction quality control on site" fill sizes="(max-width: 800px) 100vw, 48vw" /></div>
        <div className={styles.standardCopy}>
          <span className={styles.sectionCode}>05 / THE STANDARD</span>
          <h2 id="standard-title">Built to perform. Finished to last.</h2>
          <p>ISO 9001:2015 quality management supports a delivery culture grounded in safety, precision, clear coordination, and accountable handover.</p>
          <div className={styles.principles}>
            {['Quality', 'Safety', 'Precision', 'Delivery'].map((item, index) => (
              <div key={item}><span>0{index + 1}</span><strong>{item}</strong></div>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.contactCta}>
        <Image src={IMAGES.homeContact} alt="Doha skyline and waterfront" fill sizes="100vw" />
        <div className={styles.contactScrim} />
        <div className={styles.contactCopy}>
          <span className={styles.sectionCode}>DOHA / QATAR</span>
          <h2>Bring us the space.<br />We’ll build the certainty.</h2>
          <Link href="/contact">Start a project <span aria-hidden="true">↗</span></Link>
        </div>
      </section>
    </main>
  );
}
