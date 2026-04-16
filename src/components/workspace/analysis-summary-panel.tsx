import Link from "next/link";

import type { WorkspaceAnalysis } from "../../lib/demo-repository";
import type { PrivateLoanRuleTrace } from "../../lib/rules/private-loan/types";

type AnalysisWithTrace = WorkspaceAnalysis & {
  traceId?: string;
  trace?: PrivateLoanRuleTrace[];
};

type AnalysisSummaryPanelProps = {
  caseId: string;
  analysis: AnalysisWithTrace;
};

const severityLabelMap = {
  high: "高风险",
  medium: "中风险",
  low: "低风险",
} as const;

const severityClassMap = {
  high: "badge-danger",
  medium: "badge-warning",
  low: "badge-success",
} as const;

export function AnalysisSummaryPanel({ caseId, analysis }: AnalysisSummaryPanelProps) {
  const firstPrecedent = analysis.similarCases[0];

  return (
    <section className="workspace-panel panel result-panel">
      <div className="workspace-panel-head">
        <div>
          <span className="section-eyebrow">结果页</span>
          <h2>{analysis.disputePattern}</h2>
        </div>
        <span className="badge badge-warning">风险等级：{analysis.riskLevel}</span>
      </div>
      <p className="result-panel-intro">
        围绕当前借贷关系、转账性质与抗辩路径，先给出初步判断，再拆解争点、风险与类案参照。
      </p>

      <div className="result-grid">
        <article className="result-card result-card-primary">
          <div className="result-card-head">
            <h3>初步判断</h3>
            <span className="badge">当前结论</span>
          </div>
          <p className="result-primary-text">{analysis.preliminaryJudgment.summary}</p>
          <div className="result-callout">
            <span className="card-eyebrow">判断标签</span>
            <p>{analysis.preliminaryJudgment.label}</p>
          </div>
          <div className="result-callout">
            <span className="card-eyebrow">优先动作</span>
            <p>{analysis.actionSuggestions[0] ?? "继续核验关键事实与证据链。"}</p>
          </div>
          {analysis.traceId ? (
            <div className="result-callout">
              <span className="card-eyebrow">规则追踪</span>
              <p>{analysis.traceId}</p>
            </div>
          ) : null}
        </article>

        <article className="result-card">
          <div className="result-card-head">
            <h3>核心争点</h3>
            <span className="badge badge-outline">{analysis.ruleHits.length} 项焦点</span>
          </div>
          <ul className="result-list">
            {analysis.coreIssues.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <div className="result-rule-list">
            {analysis.ruleHits.map((rule) => (
              <article key={rule.id} className="result-rule-item">
                <div className="rule-hit-head">
                  <div>
                    <strong>{rule.title}</strong>
                    <p>{rule.id}</p>
                  </div>
                  <span className={`badge ${severityClassMap[rule.severity]}`}>
                    {severityLabelMap[rule.severity]}
                  </span>
                </div>
                <p>{rule.message}</p>
                <small>依据：{rule.legalBasis}</small>
                {rule.because.length > 0 ? (
                  <>
                    <small>触发事实：</small>
                    <ul className="result-list">
                      {rule.because.map((reason) => (
                        <li key={`${rule.id}-${reason}`}>{reason}</li>
                      ))}
                    </ul>
                  </>
                ) : null}
                {analysis.trace ? (
                  <small>
                    追踪：
                    {analysis.trace.find((entry: PrivateLoanRuleTrace) => entry.ruleId === rule.id)?.reason ?? '命中当前事实组合'}
                  </small>
                ) : null}
              </article>
            ))}
          </div>
        </article>

        <article className="result-card">
          <div className="result-card-head">
            <h3>风险提示</h3>
            <span className="badge badge-warning">需优先补强</span>
          </div>
          <div className="result-risk-groups">
            <div className="result-subsection">
              <h4>证据优势</h4>
              <ul className="result-list">
                {analysis.strengths.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div className="result-subsection">
              <h4>薄弱环节</h4>
              <ul className="result-list">
                {analysis.weaknesses.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div className="result-subsection">
              <h4>证据缺口</h4>
              <ul className="result-list">
                {analysis.evidenceGaps.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div className="result-subsection">
              <h4>重点补强</h4>
              <ul className="result-list">
                {analysis.riskHints.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div className="result-subsection">
              <h4>建议动作</h4>
              <ul className="result-list">
                {analysis.actionSuggestions.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </article>

        <article className="result-card">
          <div className="result-card-head">
            <h3>相似案件推荐</h3>
            {firstPrecedent ? (
              <Link href={`/workspace/${caseId}/precedents/${firstPrecedent.id}`} className="workspace-back-link">
                查看首个类案详情
              </Link>
            ) : null}
          </div>
          <div className="result-precedent-list">
            {analysis.similarCases.map((item) => {
              const basis = analysis.recommendationBasis.find((entry) => entry.precedentId === item.id);

              return (
                <article key={item.id} className="result-precedent-item">
                  <div className="result-precedent-head">
                    <div>
                      <Link href={`/workspace/${caseId}/precedents/${item.id}`} className="workspace-back-link">
                        {item.title}
                      </Link>
                      <p>{item.disputePattern}</p>
                    </div>
                    <div className="workspace-fact-meta">
                      <span className="badge badge-outline">{item.referenceLevel}</span>
                      <span className="badge">参考度 {item.score}</span>
                    </div>
                  </div>
                  <p>{item.judgment}</p>
                  <ul className="result-list">
                    {(basis?.reasons ?? item.similarities).slice(0, 2).map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                </article>
              );
            })}
          </div>
        </article>
      </div>
    </section>
  );
}
