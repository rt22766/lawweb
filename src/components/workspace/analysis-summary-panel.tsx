import Link from "next/link";

import type { WorkspaceAnalysis } from "../../lib/demo-repository";
import type { PrivateLoanRuleSlot, PrivateLoanRuleTrace } from "../../lib/rules/private-loan/types";

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

const traceSlotLabelMap: Record<PrivateLoanRuleSlot, string> = {
  preliminary_judgment: "初步判断",
  core_issue: "核心争点",
  risk_hint: "风险提示",
  evidence_gap: "证据缺口",
  action_suggestion: "行动建议",
};

const traceSlotOrder: PrivateLoanRuleSlot[] = [
  "preliminary_judgment",
  "core_issue",
  "risk_hint",
  "evidence_gap",
  "action_suggestion",
];

export function AnalysisSummaryPanel({ caseId, analysis }: AnalysisSummaryPanelProps) {
  const firstPrecedent = analysis.similarCases[0];
  const traceEntries = analysis.trace ?? [];
  const matchedTraceEntries = traceEntries.filter((entry) => entry.matched);
  const unmatchedTraceEntries = traceEntries.filter((entry) => !entry.matched);
  const unmatchedTraceGroups = traceSlotOrder
    .map((slot) => ({
      slot,
      entries: unmatchedTraceEntries.filter((entry) => entry.slot === slot),
    }))
    .filter((group) => group.entries.length > 0);

  return (
    <section className="workspace-panel panel result-panel" style={{ padding: '40px', gap: '32px' }}>
      <div className="workspace-panel-head" style={{ borderBottom: '2px solid var(--border-strong)', paddingBottom: '24px' }}>
        <div>
          <span className="section-eyebrow" style={{ marginBottom: '12px' }}>风险评估与行动方案</span>
          <h2 style={{ fontSize: '2.25rem', color: 'var(--brand)', marginBottom: '8px' }}>
            {analysis.disputePattern}
          </h2>
          <p className="result-panel-intro" style={{ fontSize: '1.1rem', maxWidth: '800px' }}>
            基于提取的案件要素与规则引擎比对，已生成如下法律风险评估报告及类案匹配结果。
          </p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <span className="badge badge-warning" style={{ fontSize: '1rem', padding: '8px 16px' }}>
            综合风险：{analysis.riskLevel}
          </span>
          {analysis.traceId ? (
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '12px', fontFamily: 'monospace' }}>
              报告流水号: {analysis.traceId}
            </p>
          ) : null}
        </div>
      </div>

      <div className="result-grid" style={{ gridTemplateColumns: '1fr', gap: '32px' }}>
        
        {/* 初步判断 & 核心争点 - Top level */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}>
          <article className="result-card result-card-primary" style={{ borderTop: '4px solid var(--brand)', boxShadow: 'var(--shadow-md)' }}>
            <div className="result-card-head" style={{ borderBottom: '1px solid rgba(0,0,0,0.05)', paddingBottom: '16px' }}>
              <h3 style={{ fontSize: '1.4rem', margin: 0, color: 'var(--brand)' }}>【案件定性】</h3>
              <span className="badge" style={{ backgroundColor: 'var(--brand)', color: 'white' }}>结论判定</span>
            </div>
            <div style={{ padding: '16px 0' }}>
              <p className="result-primary-text" style={{ fontWeight: '600', fontSize: '1.3rem' }}>
                {analysis.preliminaryJudgment.summary}
              </p>
            </div>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <div className="result-callout" style={{ flex: 1, backgroundColor: 'rgba(255,255,255,0.6)' }}>
                <span className="card-eyebrow">案由/标签</span>
                <p style={{ fontWeight: 600, color: 'var(--brand)' }}>{analysis.preliminaryJudgment.label}</p>
              </div>
              <div className="result-callout" style={{ flex: 1, backgroundColor: 'rgba(255,255,255,0.6)' }}>
                <span className="card-eyebrow">首要建议</span>
                <p style={{ fontWeight: 600, color: 'var(--accent)' }}>{analysis.actionSuggestions[0] ?? "继续核验关键事实与证据链。"}</p>
              </div>
            </div>
          </article>

          <article className="result-card" style={{ borderTop: '4px solid var(--accent)' }}>
            <div className="result-card-head" style={{ borderBottom: '1px solid var(--border)', paddingBottom: '16px' }}>
              <h3 style={{ fontSize: '1.4rem', margin: 0, color: 'var(--brand)' }}>【争议焦点】</h3>
              <span className="badge badge-outline">{analysis.ruleHits.length} 项焦点</span>
            </div>
            <div style={{ paddingTop: '16px' }}>
              <ul className="result-list" style={{ marginBottom: '20px' }}>
                {analysis.coreIssues.map((item) => (
                  <li key={item} style={{ fontWeight: 500 }}>{item}</li>
                ))}
              </ul>
              <div className="result-rule-list" style={{ gap: '16px' }}>
                {analysis.ruleHits.map((rule) => (
                  <div key={rule.id} style={{ background: 'var(--surface)', padding: '16px', borderRadius: 'var(--radius-sm)', borderLeft: `3px solid var(--accent)` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <strong style={{ color: 'var(--brand)' }}>{rule.title}</strong>
                      <span className={`badge ${severityClassMap[rule.severity]}`}>{severityLabelMap[rule.severity]}</span>
                    </div>
                    <p style={{ fontSize: '0.95rem', marginBottom: '8px' }}>{rule.message}</p>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      依据：{rule.legalBasis}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </article>
        </div>

        {/* 证据与风险剖析 - Middle level */}
        <article className="result-card" style={{ padding: '32px', background: 'var(--surface)' }}>
          <div className="result-card-head" style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '1.4rem', margin: 0, color: 'var(--brand)' }}>【证据与风险剖析】</h3>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
            {/* 优势与劣势 */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div style={{ background: 'var(--color-emerald-soft)', padding: '20px', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(5, 150, 105, 0.2)' }}>
                <h4 style={{ color: 'var(--color-emerald)', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                  <span style={{ fontSize: '1.2rem' }}>+</span> 诉讼优势
                </h4>
                <ul className="result-list" style={{ margin: 0 }}>
                  {analysis.strengths.map((item) => (
                    <li key={item} style={{ color: 'var(--ink-strong)' }}>{item}</li>
                  ))}
                </ul>
              </div>
              <div style={{ background: 'var(--color-rose-soft)', padding: '20px', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(190, 18, 60, 0.2)' }}>
                <h4 style={{ color: 'var(--color-rose)', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                  <span style={{ fontSize: '1.2rem' }}>-</span> 风险与劣势
                </h4>
                <ul className="result-list" style={{ margin: 0 }}>
                  {analysis.weaknesses.map((item) => (
                    <li key={item} style={{ color: 'var(--ink-strong)' }}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* 缺口与建议 */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div style={{ background: 'var(--surface-hover)', padding: '20px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', flex: 1 }}>
                <h4 style={{ color: 'var(--brand)', marginBottom: '12px' }}>证据缺口与补强建议</h4>
                <ul className="result-list" style={{ marginBottom: '16px' }}>
                  {analysis.evidenceGaps.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                <div style={{ borderTop: '1px dashed var(--border-strong)', paddingTop: '16px' }}>
                  <h4 style={{ color: 'var(--brand)', marginBottom: '12px' }}>重点行动项</h4>
                  <ul className="result-list">
                    {analysis.riskHints.map((item) => (
                      <li key={item} style={{ fontWeight: 500 }}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </article>

        {/* 相似案件推荐 & 决策推演路径 - Bottom level */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}>
          
          <article className="result-card" style={{ background: 'var(--surface)' }}>
            <div className="result-card-head" style={{ borderBottom: '1px solid var(--border)', paddingBottom: '16px', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.4rem', margin: 0, color: 'var(--brand)' }}>【推荐类案参阅】</h3>
              {firstPrecedent ? (
                <Link href={`/workspace/${caseId}/precedents/${firstPrecedent.id}`} className="workspace-back-link" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  进入类案库 <span>→</span>
                </Link>
              ) : null}
            </div>
            <div className="result-precedent-list">
              {analysis.similarCases.slice(0, 2).map((item) => {
                const basis = analysis.recommendationBasis.find((entry) => entry.precedentId === item.id);
                return (
                  <div key={item.id} style={{ padding: '20px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', background: 'var(--surface-hover)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                      <div>
                        <Link href={`/workspace/${caseId}/precedents/${item.id}`} style={{ fontWeight: 700, color: 'var(--brand)', fontSize: '1.1rem', textDecoration: 'none' }}>
                          {item.title}
                        </Link>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>{item.disputePattern}</div>
                      </div>
                      <span className="badge" style={{ background: 'var(--brand-soft)', color: 'var(--brand)' }}>参考度 {item.score}</span>
                    </div>
                    <p style={{ fontSize: '0.95rem', color: 'var(--ink-strong)', marginBottom: '12px', lineHeight: 1.6 }}>
                      <strong>裁判要旨：</strong>{item.judgment}
                    </p>
                    <div style={{ background: 'var(--surface)', padding: '12px', borderRadius: '4px', fontSize: '0.9rem' }}>
                      <strong style={{ color: 'var(--accent)', display: 'block', marginBottom: '6px' }}>推荐理由：</strong>
                      <ul style={{ paddingLeft: '16px', margin: 0, color: 'var(--text-secondary)' }}>
                        {(basis?.reasons ?? item.similarities).slice(0, 2).map((point) => (
                          <li key={point} style={{ marginBottom: '4px' }}>{point}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                );
              })}
            </div>
          </article>

          <article className="result-card" style={{ background: 'var(--surface)' }}>
            <div className="result-card-head" style={{ borderBottom: '1px solid var(--border)', paddingBottom: '16px', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.4rem', margin: 0, color: 'var(--brand)' }}>【系统推理日志】</h3>
              <span className="badge badge-outline">{traceEntries.length} 项评估节点</span>
            </div>
            
            <div style={{ maxHeight: '600px', overflowY: 'auto', paddingRight: '8px' }}>
              {traceEntries.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  
                  {/* 命中逻辑 */}
                  <div>
                    <h4 style={{ fontSize: '1rem', color: 'var(--color-emerald)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--color-emerald)' }}></span>
                      判定成立逻辑
                    </h4>
                    {matchedTraceEntries.length > 0 ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', borderLeft: '2px solid var(--color-emerald-soft)', paddingLeft: '16px' }}>
                        {matchedTraceEntries.map((entry) => (
                          <div key={entry.ruleId} style={{ background: 'var(--surface-hover)', padding: '12px 16px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                              <strong style={{ color: 'var(--ink-strong)', fontSize: '0.95rem' }}>{entry.ruleId}</strong>
                              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{traceSlotLabelMap[entry.slot] || entry.slot}</span>
                            </div>
                            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>{entry.reason}</p>
                            {entry.because.length > 0 && (
                              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', background: 'var(--surface)', padding: '8px', borderRadius: '4px' }}>
                                <strong>事实支撑：</strong> {entry.because.join('; ')}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>暂无命中的判定逻辑。</p>
                    )}
                  </div>

                  {/* 排除逻辑 */}
                  <div>
                    <h4 style={{ fontSize: '1rem', color: 'var(--text-muted)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--border-strong)' }}></span>
                      已排除逻辑
                    </h4>
                    {unmatchedTraceGroups.length > 0 ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', borderLeft: '2px solid var(--surface-hover)', paddingLeft: '16px' }}>
                        {unmatchedTraceGroups.map((group) => (
                          <details key={group.slot} style={{ background: 'var(--surface-hover)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
                            <summary style={{ padding: '12px 16px', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-secondary)', outline: 'none' }}>
                              {traceSlotLabelMap[group.slot] || group.slot} 类规则 (排除 {group.entries.length} 项)
                            </summary>
                            <div style={{ padding: '0 16px 16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                              {group.entries.map((entry) => (
                                <div key={entry.ruleId} style={{ paddingTop: '8px', borderTop: '1px dashed var(--border-strong)' }}>
                                  <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>{entry.ruleId}</div>
                                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>{entry.reason}</div>
                                </div>
                              ))}
                            </div>
                          </details>
                        ))}
                      </div>
                    ) : (
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>无排除的规则。</p>
                    )}
                  </div>

                </div>
              ) : (
                <div style={{ padding: '32px', textAlign: 'center', background: 'var(--surface-hover)', borderRadius: 'var(--radius-sm)', color: 'var(--text-muted)' }}>
                  <p>引擎分析日志暂未记录。</p>
                </div>
              )}
            </div>
          </article>

        </div>

      </div>
    </section>
  );
}
