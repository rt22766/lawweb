"use client";

import { useState } from "react";

const matrixData = [
  {
    id: 1,
    fact: "借贷合意",
    value: "存在书面借条",
    status: "已确认",
    evidence: "《借款协议》 第2页",
    ocrText: "“本人张三向李四借款人民币伍拾万元整...”",
  },
  {
    id: 2,
    fact: "资金交付",
    value: "已转账 500,000.00",
    status: "已确认",
    evidence: "银行流水凭证",
    ocrText: "跨行转账：附言“借款”，交易时间 2024-02-15",
  },
  {
    id: 3,
    fact: "还款记录",
    value: "微信转账 50,000.00",
    status: "待核实",
    evidence: "聊天截图",
    ocrText: "“先还你五万，剩下的下个月给”",
    isWarning: true,
  },
];

export function FactMatrix() {
  // 默认选中第一条
  const [selectedId, setSelectedId] = useState<number>(matrixData[0].id);

  return (
    <div className="fact-matrix-wrapper">
      <div className="fm-table">
        <div className="fm-header">
          <div className="fm-cell">核心事实项</div>
          <div className="fm-cell">抽取内容</div>
          <div className="fm-cell">置信状态</div>
          <div className="fm-cell">支撑证据</div>
        </div>
        <div className="fm-body">
          {matrixData.map((row) => (
            <div 
              key={row.id} 
              className={`fm-row ${selectedId === row.id ? "active" : ""}`}
              onClick={() => setSelectedId(row.id)}
              tabIndex={0}
              role="button"
              aria-pressed={selectedId === row.id}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setSelectedId(row.id);
                }
              }}
            >
              <div className="fm-cell fw-medium">{row.fact}</div>
              <div className="fm-cell fm-mono">{row.value}</div>
              <div className="fm-cell">
                <span className={`badge ${row.isWarning ? "badge-warning" : "badge-success"}`}>
                  {row.status}
                </span>
              </div>
              <div className="fm-cell fm-evidence">
                <span className="evidence-link">{row.evidence}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="fm-inspector">
        <div className="inspector-head">证据快照 OCR 溯源</div>
        <div className="inspector-body">
          {selectedId && (
            <div className="ocr-snippet fade-in" key={selectedId}>
              <span className="ocr-label">系统提取原文：</span>
              <blockquote>{matrixData.find((d) => d.id === selectedId)?.ocrText}</blockquote>
              <div className="ocr-meta">与原始材料高度匹配 (置信度 99%)</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
