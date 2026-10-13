import { ProjectDetail } from "@/components/projects/ProjectDetail";
import { getProjectMetadata } from "@/lib/projectMetadata";
import { PageStructuredData } from "@/components/ui/StructuredData";

export const generateMetadata = () => getProjectMetadata("maestro");
export default function Page() {
  return <><PageStructuredData path="/projects/maestro" /><ProjectDetail slug="maestro" /></>;
}
