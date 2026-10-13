import { ProjectDetail } from "@/components/projects/ProjectDetail";
import { getProjectMetadata } from "@/lib/projectMetadata";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  return getProjectMetadata((await params).slug);
}

export default async function Page({ params }: Props) {
  return <ProjectDetail slug={(await params).slug} />;
}
