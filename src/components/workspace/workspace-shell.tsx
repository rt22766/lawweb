import type { ReactNode } from "react";
import Link from "next/link";

import type { AuthSession } from "../../lib/auth-types";
import type { CaseWorkspaceSummary } from "../../lib/demo-repository";
import type { Step } from "../../lib/site";

type WorkspaceShellProps = {
  summary: CaseWorkspaceSummary;
  steps: Step[];
  activeStep: string;
  children: ReactNode;
  session?: AuthSession | null;
  rightRail?: ReactNode;
};

export function WorkspaceShell({
  summary,
  steps,
  activeStep,
  children,
  session,
  rightRail,
}: WorkspaceShellProps) {
  return (
    <div className="site-container page-stack workspace-stack">
      <section className="workspace-hero panel">
        <div className="workspace-hero-copy">
          <span className="section-eyebrow">{session?.role === "judge" ? "专业案件工作区" : "案件工作区"}</span>
          <h1>{summary.title}</h1>
          <p>
            {summary.caseType} · {summary.disputePattern}
          </p>
        </div>
        <div className="workspace-hero-meta">
          <span className="badge badge-warning">{summary.stage}</span>
          <span className="badge">风险等级：{summary.riskLevel}</span>
          <span className="workspace-timestamp">最近更新：{summary.updatedAt}</span>
          {session ? (
            <span className="badge badge-outline">
              当前用户：{session.displayName} · {session.role === "resident" ? "居民/当事人" : "法官/专业用户"}
            </span>
          ) : null}
        </div>
      </section>

      <div className="workspace-layout">
        <aside className="workspace-sidebar panel">
          <div className="workspace-sidebar-head">
            <h2>{session?.role === "judge" ? "专业分析流程" : "案件流程"}</h2>
            <Link href="/workspace" className="workspace-back-link">
              返回案件列表
            </Link>
          </div>
          <ol className="workspace-step-list">
            {steps.map((step) => (
              <li
                key={step.index}
                className={step.title === activeStep ? "workspace-step active" : "workspace-step"}
              >
                <span className="workspace-step-index">{step.index}</span>
                {step.href ? (
                  <Link href={step.href} aria-current={step.title === activeStep ? "page" : undefined}>
                    <strong>{step.title}</strong>
                    <p>{step.description}</p>
                  </Link>
                ) : (
                  <div>
                    <strong>{step.title}</strong>
                    <p>{step.description}</p>
                  </div>
                )}
              </li>
            ))}
          </ol>
        </aside>

        <div className="workspace-main">{children}</div>

        <aside className="workspace-rail panel">{rightRail}</aside>
      </div>
    </div>
  );
}
