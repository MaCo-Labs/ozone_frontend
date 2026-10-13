import { ProjectDetail } from "@/components/projects/ProjectDetail";
import { getProjectMetadata } from "@/lib/projectMetadata";
import { PageStructuredData } from "@/components/ui/StructuredData";

export const generateMetadata = () => getProjectMetadata("qatar-rail");
export default function Page() {
  return <><PageStructuredData path="/projects/qatar-rail" /><ProjectDetail slug="qatar-rail" /></>;
}
