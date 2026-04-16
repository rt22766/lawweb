import { notFound } from "next/navigation";

import { RoleGate } from "@/components/auth/role-gate";
import { CaseWorkspaceFrame } from "@/components/workspace/case-workspace-frame";
import { FactWorkspaceClient } from "@/components/workspace/fact-workspace-client";
import { requireSession } from "@/lib/auth-session";
import { getCaseWorkspace } from "@/lib/case-workspace";

type FactsPageProps = {
  params: Promise<{ caseId: string }>;
};

export default async function WorkspaceFactsPage({ params }: FactsPageProps) {
  const { caseId } = await params;
  const session = await requireSession();
  const record = await getCaseWorkspace(caseId, session.userId);

  if (!record) {
    notFound();
  }

  return (
    <RoleGate allow={["resident", "judge"]}>
      <CaseWorkspaceFrame caseId={caseId} activeStep="事实确认" session={session} workspaceRecord={record}>
        <FactWorkspaceClient
          caseId={caseId}
          initialFacts={record.facts}
          initialAnalysis={record.analysis}
          precedents={record.precedents}
        />
      </CaseWorkspaceFrame>
    </RoleGate>
  );
}
