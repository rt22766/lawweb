import { notFound } from "next/navigation";

import { RoleGate } from "@/components/auth/role-gate";
import { AnalysisSummaryPanel } from "@/components/workspace/analysis-summary-panel";
import { CaseWorkspaceFrame } from "@/components/workspace/case-workspace-frame";
import { requireSession } from "@/lib/auth-session";
import { getCaseWorkspace } from "@/lib/case-workspace";

type ResultPageProps = {
  params: Promise<{ caseId: string }>;
};

export default async function WorkspaceResultPage({ params }: ResultPageProps) {
  const { caseId } = await params;
  const session = await requireSession();
  const record = await getCaseWorkspace(caseId, session.userId);

  if (!record) {
    notFound();
  }

  return (
    <RoleGate allow={["resident", "judge"]}>
      <CaseWorkspaceFrame caseId={caseId} activeStep="结果页" session={session} workspaceRecord={record}>
        <AnalysisSummaryPanel caseId={caseId} analysis={record.analysis} />
      </CaseWorkspaceFrame>
    </RoleGate>
  );
}
