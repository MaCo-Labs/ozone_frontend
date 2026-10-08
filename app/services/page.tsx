import { pageMetadata } from "@/lib/seo";
import { PageStructuredData } from "@/components/ui/StructuredData";
import { ServiceSelector } from "@/components/services/ServiceSelector";
export const metadata = pageMetadata("/services");
export default function ServicesPage() { return <main id="main-content"><PageStructuredData path="/services" /><ServiceSelector /></main>; }
