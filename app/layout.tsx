import type { Metadata } from "next";
import { display, plexSans } from "@/lib/fonts";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MotionObserver } from "@/components/ui/MotionObserver";
import { StructuredData } from "@/components/ui/StructuredData";
import { organizationSchema, SITE_URL, SITE_NAME, PAGE_SEO, SOCIAL_IMAGE } from "@/lib/seo";
import "./globals.css";
import { getStudioProjects } from "@/lib/content-api";
import { portfolioCards } from "@/lib/portfolio";

const SITE_DESCRIPTION = PAGE_SEO["/"].description;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME,
    template: "%s | OZONE",
  },
  description: SITE_DESCRIPTION,
  openGraph: {
    type: "website",
    url: "/",
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    images: [SOCIAL_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    images: [SOCIAL_IMAGE],
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const projects = portfolioCards(await getStudioProjects());
  const featured = projects.filter((project) => project.featured);
  return (
    <html lang="en" className={`${display.variable} ${plexSans.variable}`}>
      <body>
        <a className="skipLink" href="#main-content">
          Skip to content
        </a>
        <Header projects={(featured.length ? featured : projects).slice(0, 5)} />
        <StructuredData data={organizationSchema} />
        <MotionObserver />
        {children}
        <Footer />
      </body>
    </html>
  );
}
