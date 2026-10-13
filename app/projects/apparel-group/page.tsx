import { ProjectDetail } from "@/components/projects/ProjectDetail";
import { getProjectMetadata } from "@/lib/projectMetadata";
import { PageStructuredData } from "@/components/ui/StructuredData";

export const generateMetadata = () => getProjectMetadata("apparel-group");
export default function Page() {
  return <><PageStructuredData path="/projects/apparel-group" /><ProjectDetail slug="apparel-group" /></>;
}
