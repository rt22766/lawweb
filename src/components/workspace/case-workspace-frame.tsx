import type { ReactNode } from "react";

import type { AuthSession } from "@/lib/auth-types";
import type { WorkspaceRecord } from "@/lib/demo-repository";
import { WorkspaceShell } from "@/components/workspace/workspace-shell";

type CaseWorkspaceFrameProps = {
  caseId: string;
  activeStep: "事实确认" | "结果页" | "类案详情";
  children: ReactNode;
  workspaceRecord: WorkspaceRecord;
  session?: AuthSession | null;
};

export function CaseWorkspaceFrame({
  caseId,
  activeStep,
  children,
  workspaceRecord,
  session = null,
}: CaseWorkspaceFrameProps) {
  const record = workspaceRecord;
  const firstPrecedentId = record.precedents[0]?.id;
  const steps = record.steps.map((step) => {
    if (step.title === "事实确认") {
      return {
        ...step,
        href: `/workspace/${caseId}/facts`,
      };
    }

    if (step.title === "结果页") {
      return {
        ...step,
        href: `/workspace/${caseId}/result`,
      };
    }

    return {
      ...step,
      href: firstPrecedentId ? `/workspace/${caseId}/precedents/${firstPrecedentId}` : undefined,
    };
  });

  return (
    <WorkspaceShell
      summary={record.summary}
      steps={steps}
      activeStep={activeStep}
      session={session}
      rightRail={
        <>
          <div className="sidebar-block">
            <strong>当前风险</strong>
            <p>{record.analysis.preliminaryJudgment.summary}</p>
          </div>
          <div className="sidebar-block">
            <strong>待办重点</strong>
            <ul className="summary-list compact-list">
              {record.analysis.riskHints.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </>
      }
    >
      {children}
    </WorkspaceShell>
  );
}
