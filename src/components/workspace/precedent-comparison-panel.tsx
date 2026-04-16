import Link from "next/link";

import type { Precedent, RecommendationBasis } from "../../lib/demo-repository";
import { precedentDisputeTagDictionary, precedentFactTagDictionary, precedentReferenceTagDictionary } from "../../lib/precedent-tags";

type PrecedentComparisonPanelProps = {
  caseId: string;
  precedents: Precedent[];
  currentPattern: string;
  recommendationBasis?: RecommendationBasis[];
  selectedPrecedentId?: string;
};

export function PrecedentComparisonPanel({
  caseId,
  precedents,
  currentPattern,
  recommendationBasis = [],
  selectedPrecedentId,
}: PrecedentComparisonPanelProps) {
  const selected = precedents.find((item) => item.id === selectedPrecedentId) ?? precedents[0];

  if (!selected) {
    return (
      <section className="workspace-panel panel precedent-panel" style={{ padding: '40px' }}>
        <div className="workspace-panel-head">
          <div>
            <span className="section-eyebrow">案例检索系统</span>
            <h2 style={{ fontSize: '2.25rem', color: 'var(--brand)' }}>类案比对报告</h2>
          </div>
          <p style={{ marginTop: '16px', color: 'var(--text-secondary)' }}>当前案件标签下，暂无可供深度参阅的生效类案。</p>
        </div>
      </section>
    );
  }

  const selectedBasis = recommendationBasis.find((entry) => entry.precedentId === selected.id)?.reasons ?? [
    `当前案件争议模式“${currentPattern}”与该类案的“${selected.disputePattern}”具有较高可比性。`,
    `参照等级：${selected.referenceLevel}，参考度 ${selected.score}。`,
    ...selected.differenceImpact.map((item) => `参照提示：${item}`),
  ];

  const judgmentReasons = [
    `该类案围绕“${selected.disputePattern}”展开审理，并结合证据结构判断是否支持借款主张。`,
    selected.judgment,
    ...(selected.differences.length > 0 ? [`裁判时重点区分：${selected.differences.join("；")}。`] : []),
  ];
  const coreFacts = selected.coreFacts.length > 0 ? selected.coreFacts : selected.similarities;
  const reasoningSummary = selected.reasoningSummary.length > 0 ? selected.reasoningSummary : judgmentReasons;
  const matchingFactTags =
    selected.recommendation.matchingFactTags.length > 0
      ? selected.recommendation.matchingFactTags
      : ["当前暂无稳定匹配标签"];
  const matchedIssueStructures =
    selected.recommendation.matchedIssueStructures.length > 0
      ? selected.recommendation.matchedIssueStructures
      : ["当前暂无稳定争点结构匹配"];
  const keyDifferenceHints =
    selected.recommendation.keyDifferenceHints.length > 0
      ? selected.recommendation.keyDifferenceHints
      : selected.differenceImpact.length > 0
        ? selected.differenceImpact
        : ["当前暂无关键差异提示"];

  return (
    <section className="workspace-panel panel precedent-panel" style={{ padding: '40px', gap: '32px' }}>
      <div className="workspace-panel-head" style={{ borderBottom: '2px solid var(--border-strong)', paddingBottom: '24px' }}>
        <div>
          <span className="section-eyebrow" style={{ marginBottom: '12px' }}>类案研判系统</span>
          <h2 style={{ fontSize: '2.25rem', color: 'var(--brand)', marginBottom: '8px' }}>类案详情与裁判要旨</h2>
          <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)' }}>基于您的案情参数，系统已筛选高关联度生效判决并提取核心要素。</p>
        </div>
        <Link href={`/workspace/${caseId}/result`} className="button button-primary" style={{ height: '44px', display: 'inline-flex', alignItems: 'center' }}>
          返回风险评估
        </Link>
      </div>

      <div className="precedent-workbench" style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '32px', minHeight: '600px' }}>
        
        {/* 左侧类案列表 */}
        <aside className="precedent-column precedent-list-column" style={{ display: 'flex', flexDirection: 'column', gap: '16px', borderRight: '1px solid var(--border)', paddingRight: '24px' }}>
          <h3 style={{ fontSize: '1.1rem', color: 'var(--ink-strong)', margin: '0 0 8px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span>匹配案件库</span>
            <span className="badge badge-outline">{precedents.length} 份</span>
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', overflowY: 'auto', paddingRight: '8px' }}>
            {precedents.map((item) => {
              const isActive = item.id === selected.id;
              return (
                <Link
                  key={item.id}
                  href={`/workspace/${caseId}/precedents/${encodeURIComponent(item.id)}`}
                  aria-current={isActive ? "page" : undefined}
                  className="precedent-item"
                  style={{
                    display: 'block',
                    padding: '16px',
                    borderRadius: 'var(--radius-sm)',
                    border: `1px solid ${isActive ? 'var(--brand)' : 'var(--border)'}`,
                    background: isActive ? 'var(--brand-soft)' : 'var(--surface)',
                    boxShadow: isActive ? 'var(--shadow-sm)' : 'none',
                    borderLeft: isActive ? '4px solid var(--brand)' : '1px solid var(--border)',
                    transition: 'all 0.2s ease',
                    textDecoration: 'none'
                  }}
                >
                  <strong style={{ display: 'block', color: isActive ? 'var(--brand)' : 'var(--ink-strong)', fontSize: '1.05rem', marginBottom: '6px' }}>{item.title}</strong>
                  <span style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>{item.disputePattern}</span>
                  <div className="precedent-item-meta" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <span className="badge badge-outline" style={{ borderColor: isActive ? 'var(--brand)' : 'var(--border-strong)', color: isActive ? 'var(--brand)' : 'var(--text-secondary)' }}>{item.referenceLevel}</span>
                    <span className="badge" style={{ background: isActive ? 'var(--brand)' : 'var(--surface-hover)', color: isActive ? 'white' : 'var(--ink-strong)', border: isActive ? 'none' : '1px solid var(--border)' }}>参考度 {item.score}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </aside>

        {/* 右侧详情面板 */}
        <div className="precedent-column precedent-detail-column" style={{ display: 'flex', flexDirection: 'column', gap: '24px', overflowY: 'auto', paddingRight: '12px' }}>
          
          {/* 【案件名片】 */}
          <article className="precedent-detail-card" style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '24px', borderTop: '4px solid var(--brand)', boxShadow: 'var(--shadow-sm)' }}>
            <div className="precedent-detail-head" style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <span className="badge" style={{ background: 'var(--brand)', color: 'white', marginBottom: '8px' }}>案件名片</span>
                <h3 style={{ fontSize: '1.5rem', color: 'var(--brand)', margin: '0 0 8px 0' }}>{selected.title}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', margin: 0 }}>
                  {selected.courtLevel} <span style={{ padding: '0 8px', color: 'var(--border-strong)' }}>|</span> {selected.disputePattern}
                </p>
              </div>
            </div>
            
            <div style={{ background: 'var(--surface-hover)', padding: '16px', borderRadius: 'var(--radius-sm)', borderLeft: '3px solid var(--accent)', marginTop: '16px' }}>
              <strong style={{ color: 'var(--accent)', fontSize: '0.95rem', display: 'block', marginBottom: '8px' }}>裁判结果</strong>
              <p style={{ color: 'var(--ink-strong)', lineHeight: 1.6, margin: 0 }}>{selected.judgment}</p>
            </div>
          </article>

          {/* 【事实比对】与【裁判要旨】双列结构 */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
            
            <article className="precedent-detail-card" style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '24px' }}>
              <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: '12px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '1.2rem' }}>📑</span>
                <h3 style={{ fontSize: '1.2rem', color: 'var(--ink-strong)', margin: 0 }}>【案件事实】提取</h3>
              </div>
              <ul className="result-list" style={{ paddingLeft: '20px', margin: 0, gap: '8px', display: 'flex', flexDirection: 'column' }}>
                {coreFacts.map((item) => (
                  <li key={item} style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>{item}</li>
                ))}
              </ul>
            </article>

            <article className="precedent-detail-card" style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '24px' }}>
              <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: '12px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '1.2rem' }}>⚖️</span>
                <h3 style={{ fontSize: '1.2rem', color: 'var(--ink-strong)', margin: 0 }}>【裁判理由】摘要</h3>
              </div>
              <ul className="result-list" style={{ paddingLeft: '20px', margin: 0, gap: '8px', display: 'flex', flexDirection: 'column' }}>
                {reasoningSummary.map((item) => (
                  <li key={item} style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>{item}</li>
                ))}
              </ul>
            </article>

          </div>

          {/* 【推荐依据】与匹配详情 */}
          <article className="precedent-detail-card" style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '0', overflow: 'hidden' }}>
            <div style={{ background: 'var(--surface-hover)', borderBottom: '1px solid var(--border)', padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h3 style={{ fontSize: '1.2rem', color: 'var(--brand)', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>🎯</span> 【推荐评估与比对提示】
              </h3>
              <span className="badge badge-warning">本案特征: {currentPattern}</span>
            </div>
            
            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div>
                <strong style={{ fontSize: '1rem', color: 'var(--brand)', display: 'block', marginBottom: '12px' }}>关联推荐理由：</strong>
                <div style={{ background: 'var(--brand-soft)', padding: '16px', borderRadius: 'var(--radius-sm)' }}>
                  <ul className="result-list" style={{ paddingLeft: '20px', margin: 0, gap: '6px', display: 'flex', flexDirection: 'column' }}>
                    {selectedBasis.map((item) => (
                      <li key={item} style={{ color: 'var(--brand)', fontWeight: 500 }}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                <div style={{ padding: '16px', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>匹配事实特征</span>
                  <ul style={{ paddingLeft: '16px', marginTop: '8px', marginBottom: 0, color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                    {matchingFactTags.map((item) => (
                      <li key={item} style={{ marginBottom: '4px' }}>{item}</li>
                    ))}
                  </ul>
                </div>
                
                <div style={{ padding: '16px', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>重合争点结构</span>
                  <ul style={{ paddingLeft: '16px', marginTop: '8px', marginBottom: 0, color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                    {matchedIssueStructures.map((item) => (
                      <li key={item} style={{ marginBottom: '4px' }}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {keyDifferenceHints.length > 0 && keyDifferenceHints[0] !== "当前暂无关键差异提示" && (
                <div style={{ padding: '16px', border: '1px solid rgba(217, 119, 6, 0.3)', background: 'var(--color-amber-soft)', borderRadius: 'var(--radius-sm)' }}>
                  <strong style={{ fontSize: '0.9rem', color: 'var(--color-amber)', display: 'block', marginBottom: '8px' }}>差异预警与注意点：</strong>
                  <ul style={{ paddingLeft: '16px', margin: 0, color: 'var(--ink-strong)', fontSize: '0.95rem' }}>
                    {keyDifferenceHints.map((item) => (
                      <li key={item} style={{ marginBottom: '4px' }}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </article>

          {/* 【数据解析结构】(原"类案标注模板") */}
          <article className="precedent-detail-card" style={{ background: 'var(--surface)', border: '1px dashed var(--border-strong)', borderRadius: 'var(--radius-md)', padding: '24px' }}>
            <div style={{ borderBottom: '1px dashed var(--border-strong)', paddingBottom: '12px', marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <h3 style={{ fontSize: '1rem', color: 'var(--text-muted)', margin: 0 }}>数据底层解析结构</h3>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>v{selected.annotationTemplate.templateVersion}</span>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '20px' }}>
              <div>
                <span className="card-eyebrow" style={{ color: 'var(--text-muted)', borderBottomColor: 'var(--text-muted)' }}>已识别事实标签</span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '8px' }}>
                  {selected.annotation.factTags.map((tag) => (
                    <span key={tag} className="badge badge-outline" style={{ fontSize: '0.75rem', fontWeight: 'normal', color: 'var(--text-secondary)' }}>{precedentFactTagDictionary[tag]}</span>
                  ))}
                </div>
              </div>
              
              <div>
                <span className="card-eyebrow" style={{ color: 'var(--text-muted)', borderBottomColor: 'var(--text-muted)' }}>争点规则挂载点</span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '8px' }}>
                  {selected.annotation.disputeTags.map((tag) => (
                    <span key={tag} className="badge badge-outline" style={{ fontSize: '0.75rem', fontWeight: 'normal', color: 'var(--text-secondary)' }}>{precedentDisputeTagDictionary[tag]}</span>
                  ))}
                </div>
              </div>
              
              <div>
                <span className="card-eyebrow" style={{ color: 'var(--text-muted)', borderBottomColor: 'var(--text-muted)' }}>核心争议关键词</span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '8px' }}>
                  {selected.annotation.keyIssueTags.map((tag) => (
                    <span key={tag} className="badge badge-outline" style={{ fontSize: '0.75rem', fontWeight: 'normal', color: 'var(--text-secondary)' }}>{tag}</span>
                  ))}
                </div>
              </div>
              
              <div>
                <span className="card-eyebrow" style={{ color: 'var(--text-muted)', borderBottomColor: 'var(--text-muted)' }}>系统归类基准</span>
                <div style={{ marginTop: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  {precedentReferenceTagDictionary[selected.annotation.referenceTag]}
                </div>
              </div>
            </div>
          </article>

        </div>
      </div>
    </section>
  );
}
