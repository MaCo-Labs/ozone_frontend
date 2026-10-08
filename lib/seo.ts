import type { Metadata } from "next";
import { CONTACT } from "./siteData";

export const SITE_URL = "https://www.ozonefitout.com";
export const SITE_NAME = "OZONE Fitout & Contracting W.L.L.";
export const SOCIAL_IMAGE = { url: "/social/ozone-share.png", width: 1200, height: 630, alt: "OZONE — Fit-out, contracting, MEP and engineering in Doha, Qatar" };

export const PAGE_SEO = {
  "/": { title: "Fit-Out & Contracting Company in Doha, Qatar", description: "OZONE delivers interior fit-out, construction, MEP and engineering services in Doha, Qatar. Explore our transit, healthcare, corporate and retail portfolio." },
  "/about": { title: "About OZONE | Fit-Out & Contracting in Qatar", description: "Meet OZONE Fitout & Contracting W.L.L. Explore the people, principles and coordinated approach behind our interior and construction delivery in Qatar." },
  "/services": { title: "Fit-Out, Construction, MEP & Engineering Services", description: "Explore OZONE's four coordinated disciplines in Qatar: interior fit-out, contracting and construction, MEP services, and engineering consultancy and design." },
  "/services/interior-fit-out": { title: "Interior Fit-Out Services in Doha, Qatar", description: "Office, retail, hospitality and residential interior fit-out in Qatar. OZONE coordinates joinery, ceilings, partitions, flooring, finishes and specialist trades." },
  "/services/contracting-construction": { title: "Contracting & Construction Services in Qatar", description: "OZONE provides general contracting, design and build, civil works, renovation and refurbishment in Qatar, with coordinated site delivery and quality control." },
  "/services/mep": { title: "MEP Services in Doha, Qatar", description: "Mechanical, electrical and plumbing services in Qatar: HVAC, lighting, fire protection, ELV, testing and commissioning coordinated by OZONE." },
  "/services/engineering": { title: "Engineering Consultancy & Design in Qatar", description: "OZONE engineering consultancy in Qatar covers architectural, structural and MEP design, BIM coordination, shop drawings, project planning and cost consultancy." },
  "/projects": { title: "Fit-Out Projects & Portfolio in Qatar", description: "Explore the OZONE project portfolio, including Qatar Rail, Maestro Medical Centre and Apparel Group Head Office, plus retail, F&B and commercial references." },
  "/projects/qatar-rail": { title: "Qatar Rail | Interior Fit-Out Project", description: "Explore OZONE's Qatar Rail interior fit-out portfolio in Doha, Qatar. View complete project photographs and architectural details in the project gallery." },
  "/projects/maestro": { title: "Maestro Medical Centre | Healthcare Fit-Out", description: "View Maestro Medical Centre in the OZONE healthcare portfolio in Doha, Qatar. Explore the complete interior composition and coordinated approach to clinical spaces." },
  "/projects/apparel-group": { title: "Apparel Group Head Office | Corporate Fit-Out", description: "Explore Apparel Group Head Office in OZONE's corporate fit-out portfolio in Doha, Qatar. View workplace interiors, finishes and the complete project composition." },
  "/clients": { title: "Clients & Portfolio References in Qatar", description: "Explore clients and portfolio references listed in the OZONE company profile, spanning transit, aviation, healthcare, retail, hospitality and corporate spaces." },
  "/process": { title: "Our Fit-Out & Construction Delivery Process", description: "Follow OZONE's project delivery process: planning and approvals, material management, installation, quality checks, inspection, testing and handover." },
  "/quality-safety": { title: "Quality Management & Site Safety", description: "Learn about OZONE's ISO 9001:2015 quality management, site safety practices, material controls, inspections and accountable project handover." },
  "/sectors": { title: "Fit-Out Sectors in Qatar", description: "OZONE's sector experience covers transit and aviation, healthcare, corporate and commercial offices, retail and F&B interiors across Qatar." },
  "/insights": { title: "Fit-Out Planning, MEP & Handover Guides", description: "Practical OZONE guidance on commercial fit-out planning, MEP coordination before ceiling closure, and the records needed for a complete project handover." },
  "/contact": { title: "Contact OZONE in Doha | Project Enquiries", description: "Discuss your fit-out, construction, MEP or engineering project with OZONE in Doha. Call +974 3330 7095 or prepare a project enquiry through WhatsApp." },
  "/privacy": { title: "Website Privacy Information", description: "How the OZONE website handles project enquiry details, WhatsApp links, third-party images and technical requests. Contact OZONE for privacy questions." },
} as const;

export type SitePath = keyof typeof PAGE_SEO;

export function pageMetadata(path: SitePath): Metadata {
  const { title, description } = PAGE_SEO[path];
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { type: "website", url: path, title, description, siteName: SITE_NAME, locale: "en_QA", images: [SOCIAL_IMAGE] },
    twitter: { card: "summary_large_image", title, description, images: [SOCIAL_IMAGE] },
  };
}

export const organizationSchema = {
  "@context": "https://schema.org",
  "@graph": [{
    "@type": "GeneralContractor",
    "@id": `${SITE_URL}/#organization`,
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/brand/ozone-logo.png`,
    image: `${SITE_URL}${SOCIAL_IMAGE.url}`,
    description: PAGE_SEO["/"].description,
    telephone: CONTACT.phones[0],
    email: CONTACT.email,
    address: { "@type": "PostalAddress", addressLocality: "Doha", addressCountry: "QA", postOfficeBoxNumber: "22657" },
    areaServed: ["Qatar", "Bahrain"],
    contactPoint: CONTACT.phones.map((telephone) => ({ "@type": "ContactPoint", telephone, contactType: "Project enquiries", availableLanguage: "English" })),
  }, {
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    name: SITE_NAME,
    url: SITE_URL,
    inLanguage: "en",
    publisher: { "@id": `${SITE_URL}/#organization` },
  }],
};

export function breadcrumbSchema(path: SitePath) {
  const segments = path.split("/").filter(Boolean);
  const paths = segments.map((_, index) => `/${segments.slice(0, index + 1).join("/")}` as SitePath);
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: ["/" as SitePath, ...paths].map((item, index) => ({
      "@type": "ListItem", position: index + 1,
      name: item === "/" ? "Home" : PAGE_SEO[item].title.split(" | ")[0],
      item: `${SITE_URL}${item}`,
    })),
  };
}

export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
