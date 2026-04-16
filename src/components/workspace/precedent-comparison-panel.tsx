import Link from "next/link";

import type { Precedent, RecommendationBasis } from "@/lib/demo-repository";

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
      <section className="workspace-panel panel precedent-panel">
        <div className="workspace-panel-head">
          <div>
            <span className="section-eyebrow">类案详情</span>
            <h2>类案详情与推荐依据</h2>
          </div>
          <p>当前暂无可参照类案。</p>
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
    <section className="workspace-panel panel precedent-panel">
      <div className="workspace-panel-head">
        <div>
          <span className="section-eyebrow">类案详情</span>
          <h2>类案详情与推荐依据</h2>
        </div>
        <Link href={`/workspace/${caseId}/result`} className="workspace-back-link">
          返回结果页
        </Link>
      </div>

      <div className="precedent-workbench">
        <aside className="precedent-column precedent-list-column">
          {precedents.map((item) => (
            <Link
              key={item.id}
              href={`/workspace/${caseId}/precedents/${encodeURIComponent(item.id)}`}
              aria-current={item.id === selected.id ? "page" : undefined}
              className={item.id === selected.id ? "precedent-item active" : "precedent-item"}
            >
              <strong>{item.title}</strong>
              <span>{item.disputePattern}</span>
              <div className="precedent-item-meta">
                <span className="badge badge-outline">{item.referenceLevel}</span>
                <span className="badge">参考度 {item.score}</span>
              </div>
            </Link>
          ))}
        </aside>

        <div className="precedent-column precedent-detail-column">
          <article className="precedent-detail-card">
            <div className="precedent-detail-head">
              <div>
                <h3>{selected.title}</h3>
                <p>{selected.courtLevel} · {selected.disputePattern}</p>
              </div>
              <div className="precedent-item-meta">
                <span className="badge badge-warning">当前案件：{currentPattern}</span>
                <span className="badge badge-outline">{selected.referenceLevel}</span>
              </div>
            </div>
            <p>{selected.judgment}</p>
          </article>

          <article className="precedent-detail-card">
            <h3>相似案件核心事实</h3>
            <ul>
              {coreFacts.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>

          <article className="precedent-detail-card">
            <h3>裁判理由摘要</h3>
            <ul>
              {reasoningSummary.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>

          <article className="precedent-detail-card">
            <h3>推荐依据</h3>
            <ul>
              {selectedBasis.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>

          <article className="precedent-detail-card">
            <h3>推荐匹配详情</h3>
            <h4>匹配事实标签</h4>
            <ul>
              {matchingFactTags.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <h4>匹配争点结构</h4>
            <ul>
              {matchedIssueStructures.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <h4>关键差异提示</h4>
            <ul>
              {keyDifferenceHints.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        </div>
      </div>
    </section>
  );
}
