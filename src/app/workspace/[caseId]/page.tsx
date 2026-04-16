import { redirect } from "next/navigation";

type WorkspaceCasePageProps = {
  params: Promise<{ caseId: string }>;
};

export default async function WorkspaceCasePage({ params }: WorkspaceCasePageProps) {
  const { caseId } = await params;

  redirect(`/workspace/${caseId}/facts`);
}
