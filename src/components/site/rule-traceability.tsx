export function RuleTraceability() {
  return (
    <div className="rule-trace-wrapper">
      <div className="rt-node rt-fact">
        <span className="rt-label">事实节点</span>
        <strong>还款对应关系不清</strong>
        <p>存在微信还款记录，但未明确指向案涉借条。</p>
      </div>

      <div className="rt-connector"></div>

      <div className="rt-node rt-rule">
        <span className="rt-label">规则引擎 [民间借贷司法解释相关规则]</span>
        <strong>存在被认定为其他经济往来的风险</strong>
        <p>条件：存在还款主张 AND 还款映射不清晰</p>
      </div>

      <div className="rt-connector rt-connector-warning"></div>

      <div className="rt-node rt-output">
        <span className="rt-label">系统输出</span>
        <span className="badge badge-warning rt-badge">证据缺口提示</span>
        <strong>需重点核验还款性质</strong>
      </div>
    </div>
  );
}
