import type { FactField } from "@/lib/demo-repository";

type FactFormPanelProps = {
  facts: FactField[];
};

export function FactFormPanel({ facts }: FactFormPanelProps) {
  return (
    <section className="workspace-panel panel">
      <div className="workspace-panel-head">
        <div>
          <span className="section-eyebrow">事实确认</span>
          <h2>结构化事实表</h2>
        </div>
        <p>候选事实、来源与证据状态统一展示，先确认再进入分析。</p>
      </div>

      <div className="workspace-fact-list">
        {facts.map((fact) => (
          <article key={fact.id} className="workspace-fact-row">
            <div className="workspace-fact-main">
              <div className="workspace-fact-meta">
                <span className="badge">{fact.groupCode} {fact.groupLabel}</span>
                {fact.isKeyField ? <span className="badge badge-warning">关键字段</span> : null}
                <span className="badge badge-outline">{fact.status}</span>
              </div>
              <h3>{fact.label}</h3>
              <p>{fact.prompt}</p>
              <div className="workspace-fact-value">{fact.value}</div>
            </div>

            <div className="workspace-fact-side">
              <div>
                <strong>来源类型</strong>
                <p>{fact.sourceType}</p>
              </div>
              <div>
                <strong>定位</strong>
                <p>{fact.sourcePosition}</p>
              </div>
              <div>
                <strong>证据强度</strong>
                <p>{fact.evidenceStrength}</p>
              </div>
              <div>
                <strong>为什么重要</strong>
                <p>{fact.helpText}</p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
