import { pageMetadata } from "@/lib/seo";
import { PageStructuredData } from "@/components/ui/StructuredData";
import Image from "next/image";
import { getStudioClients } from "@/lib/content-api";
import { CLIENTS, IMAGES } from "@/lib/siteData";
import editorial from "../editorial.module.css";
import styles from "./clients.module.css";
export const metadata = pageMetadata("/clients");

export default async function Page() {
  const studioClients = await getStudioClients();
  const clients = studioClients ?? CLIENTS.map((name) => ({
    name,
    slug: name.toLowerCase(),
    website_url: "",
    logo_url: null,
  }));

  return (
    <main id="main-content" className={editorial.page}><PageStructuredData path="/clients" />
      <section className={editorial.hero}>
        <div className={editorial.heroMedia}>
          <Image
            src={IMAGES.clientsHero}
            alt="Reference image of a contemporary commercial interior"
            fill
            sizes="100vw"
            priority
          />
        </div>
        <div className={editorial.heroCopy}>
          <span className={editorial.eyebrow}>Clients</span>
          <h1>Trust built over time.</h1>
          <p>Working with organisations across transit, healthcare, retail, hospitality, and commercial spaces.</p>
        </div>
      </section>

      <section className={styles.clients} aria-labelledby="client-list-title">
        <header className={styles.heading}>
          <span>Trusted by</span>
          <h2 id="client-list-title">Working relationships made visible.</h2>
          <p>A record of organisations that have trusted OZONE with places where people work, travel, shop, and gather.</p>
        </header>
        <ul className={styles.grid}>
          {clients.filter((client) => client.logo_url).map((client) => (
            <li key={client.slug}>
              {client.website_url ? (
                <a href={client.website_url} target="_blank" rel="noreferrer" aria-label={client.name}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img className={styles.logo} src={client.logo_url!} alt="" loading="lazy" decoding="async" />
                </a>
              ) : (
                // Django may serve uploaded media locally or through the configured object store.
                // eslint-disable-next-line @next/next/no-img-element
                <img className={styles.logo} src={client.logo_url!} alt={`${client.name} logo`} loading="lazy" decoding="async" />
              )}
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
