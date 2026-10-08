import { breadcrumbSchema, PAGE_SEO, serializeJsonLd, SITE_URL, type SitePath } from "@/lib/seo";

export function StructuredData({ data }: { data: unknown }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }} />;
}

export function PageStructuredData({ path }: { path: SitePath }) {
  const service = path.startsWith("/services/") ? {
    "@context": "https://schema.org", "@type": "Service",
    "@id": `${SITE_URL}${path}#service`, url: `${SITE_URL}${path}`,
    name: PAGE_SEO[path].title, description: PAGE_SEO[path].description,
    provider: { "@id": `${SITE_URL}/#organization` }, areaServed: { "@type": "Country", name: "Qatar" },
  } : null;
  return <><StructuredData data={breadcrumbSchema(path)} />{service && <StructuredData data={service} />}</>;
}
