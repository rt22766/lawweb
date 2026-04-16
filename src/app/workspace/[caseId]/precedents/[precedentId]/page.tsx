import { notFound } from "next/navigation";

import { RoleGate } from "../../../../../components/auth/role-gate";
import { CaseWorkspaceFrame } from "../../../../../components/workspace/case-workspace-frame";
import { PrecedentComparisonPanel } from "../../../../../components/workspace/precedent-comparison-panel";
import { requireSession } from "../../../../../lib/auth-session";
import { getCaseWorkspace } from "../../../../../lib/case-workspace";

type PrecedentDetailPageProps = {
  params: Promise<{ caseId: string; precedentId: string }>;
};

export default async function WorkspacePrecedentDetailPage({ params }: PrecedentDetailPageProps) {
  const { caseId, precedentId } = await params;
  const session = await requireSession();
  const record = await getCaseWorkspace(caseId, session.userId);

  if (!record) {
    notFound();
  }

  return (
    <RoleGate allow={["resident", "judge"]}>
      <CaseWorkspaceFrame caseId={caseId} activeStep="类案详情" session={session} workspaceRecord={record}>
        <PrecedentComparisonPanel
          caseId={caseId}
          precedents={record.precedents}
          currentPattern={record.analysis.disputePattern}
          recommendationBasis={record.analysis.recommendationBasis}
          selectedPrecedentId={precedentId}
        />
      </CaseWorkspaceFrame>
    </RoleGate>
  );
}
