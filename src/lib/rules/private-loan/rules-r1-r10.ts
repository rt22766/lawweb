import type { PrivateLoanRuleDefinition } from "./types";

function because(context: Parameters<PrivateLoanRuleDefinition["evaluate"]>[0], ...tags: string[]) {
  return tags
    .map((tag) => context.facts.selectedLabelsByTag[tag])
    .filter((value): value is string => Boolean(value));
}

export const privateLoanRulesR1ToR10: PrivateLoanRuleDefinition[] = [
  {
    id: "R1",
    title: "借贷关系成立判断",
    category: "loan_establishment",
    priority: 100,
    slot: "preliminary_judgment",
    applies: ({ facts }) => facts.signalSet.has("writing_complete") && facts.signalSet.has("transfer_complete"),
    evaluate: (context) => ({
      preliminaryJudgment: {
        label: "借贷关系初步成立",
        summary: "书面借贷材料与款项交付记录能够相互印证，借贷关系已具备初步成立基础。",
      },
      ruleHit: {
        id: "R1",
        title: "借贷关系成立判断",
        severity: "low",
        message: "借贷合意与交付事实均有核心证据支持，可先形成借贷关系初步成立判断。",
        legalBasis: "民间借贷规则树 R1",
        because: because(context, "LOAN_INTENT_WRITING", "FUND_DELIVERY_TRANSFER"),
      },
      coreIssues: ["借贷合意与款项交付链条已经形成初步闭环，借贷关系具备成立基础。"],
    }),
  },
  {
    id: "R2",
    title: "仅有转账时的举证责任转移",
    category: "burden_shift",
    priority: 90,
    slot: "preliminary_judgment",
    applies: ({ facts }) => !facts.signalSet.has("writing_complete") && facts.signalSet.has("transfer_complete"),
    evaluate: (context) => ({
      preliminaryJudgment: {
        label: "举证责任转向被告说明转账性质",
        summary: "当前缺少稳定书面借款凭证，但已有转账交付记录，需要围绕转账性质展开举证责任转移分析。",
      },
      ruleHit: {
        id: "R2",
        title: "仅有转账时的举证责任转移",
        severity: "medium",
        message: "仅有转账记录时，应转入第16条路径，重点审查被告如何说明转账性质。",
        legalBasis: "民间借贷规则树 R2 / 《民间借贷司法解释》第16条",
        because: because(context, "FUND_DELIVERY_TRANSFER", "LOAN_INTENT_WRITING"),
      },
      coreIssues: ["当前核心在于转账性质与基础法律关系的识别，而非单纯是否发生付款。"],
      riskHints: ["仅有转账记录时，需要同步固定转账用途说明、聊天、催收与其他辅助证据。"],
    }),
  },
  {
    id: "R3",
    title: "被告沉默时证明力增强",
    category: "burden_shift",
    priority: 85,
    slot: "core_issue",
    applies: ({ facts }) => facts.signalSet.has("transfer_complete") && facts.signalSet.has("defendant_silent"),
    evaluate: (context) => ({
      ruleHit: {
        id: "R3",
        title: "被告沉默时证明力增强",
        severity: "low",
        message: "被告沉默或未作合理解释时，原告基于转账记录形成的初步证明力增强。",
        legalBasis: "民间借贷规则树 R3 / 民事证据规则",
        because: because(context, "DEFENDANT_RESPONSE"),
      },
      coreIssues: ["被告未对转账性质作出合理说明，争点已转向其能否提出反证。"],
    }),
  },
  {
    id: "R4",
    title: "被告反证触发转账性质审查",
    category: "burden_shift",
    priority: 95,
    slot: "preliminary_judgment",
    applies: ({ facts }) => facts.signalSet.has("transfer_complete") && (facts.signalSet.has("defendant_goods") || facts.signalSet.has("defendant_other_relation") || facts.signalSet.has("repayment_unmapped")),
    evaluate: (context) => ({
      preliminaryJudgment: {
        label: "转账性质真伪不明，需补强证据",
        summary: "被告已提出其他法律关系或反证路径，当前需重点核对转账究竟对应借款还是其他往来。",
      },
      ruleHit: {
        id: "R4",
        title: "被告反证触发转账性质审查",
        severity: "high",
        message: "被告已提出其他法律关系、代付、货款或往来解释，需审查转账性质是否足以指向借款。",
        legalBasis: "民间借贷规则树 R4",
        because: because(context, "DEFENDANT_RESPONSE"),
      },
      coreIssues: ["需要区分案涉转账究竟属于借款、货款、代付还是其他经济往来。"],
      riskHints: ["若不能有效排除其他法律关系，借贷关系结论将被明显削弱。"],
    }),
  },
  {
    id: "R5",
    title: "真伪不明时需补证",
    category: "risk_screening",
    priority: 80,
    slot: "evidence_gap",
    applies: ({ facts }) => facts.signalSet.has("risk_cash_interest") || facts.signalSet.has("risk_relationship_mixing"),
    evaluate: (context) => ({
      ruleHit: {
        id: "R5",
        title: "真伪不明时需补证",
        severity: "high",
        message: "现有材料仍不足以稳定区分借款与其他往来，结果应落到真伪不明并提示继续补证。",
        legalBasis: "民间借贷规则树 R5",
        because: because(context, "RISK_SCREENING"),
      },
      evidenceGaps: ["真伪不明时，应补强借款合意、资金用途、交付背景与催收沟通记录。"],
      actionSuggestions: ["优先补充借款沟通记录、款项用途说明与资金流向证据。"],
    }),
  },
  {
    id: "R6",
    title: "主体关系影响责任范围判断",
    category: "special_circumstance",
    priority: 70,
    slot: "risk_hint",
    applies: ({ facts }) => facts.signalSet.has("party_related_involved") || facts.signalSet.has("party_joint_liability_dispute"),
    evaluate: (context) => ({
      ruleHit: {
        id: "R6",
        title: "主体关系影响责任范围判断",
        severity: "medium",
        message: "主体关系中出现配偶、亲属或关联人参与，需要同步审查责任扩展与举证能力问题。",
        legalBasis: "民间借贷主体责任与特殊情形规则",
        because: because(context, "PARTY_RELATION"),
      },
      coreIssues: ["主体关系显示存在责任扩展或关联人参与，需要区分直接借款人与间接责任主体。"],
      riskHints: ["存在配偶、亲属或关联人参与时，责任承担范围与举证路径会更复杂。"],
      actionSuggestions: ["补充主体关系、意思表示与共同借款/共同经营证据，避免责任范围判断失真。"],
    }),
  },
  {
    id: "R7",
    title: "还款抗辩映射不清",
    category: "repayment_review",
    priority: 75,
    slot: "core_issue",
    applies: ({ facts }) => facts.signalSet.has("repayment_unmapped"),
    evaluate: () => ({
      coreIssues: ["还款抗辩与案涉借款之间的对应关系仍需逐笔核验。"],
      riskHints: ["还款主张尚未完成映射前，本金与剩余欠款口径存在波动风险。"],
    }),
  },
  {
    id: "R8",
    title: "还款抗辩可映射",
    category: "repayment_review",
    priority: 60,
    slot: "action_suggestion",
    applies: ({ facts }) => facts.signalSet.has("repayment_mapped"),
    evaluate: () => ({
      actionSuggestions: ["可进一步核对还款流水与借款批次的映射关系，形成剩余本金口径。"],
    }),
  },
  {
    id: "R9",
    title: "时间线未闭合",
    category: "timeline_review",
    priority: 65,
    slot: "risk_hint",
    applies: ({ facts }) => facts.signalSet.has("timeline_partial") || facts.signalSet.has("timeline_missing"),
    evaluate: () => ({
      riskHints: ["借款发生、到期与还款时间线仍未完全闭合。"],
      evidenceGaps: ["需要补足借款发生时间、到期时间与还款节点的对应材料。"],
    }),
  },
  {
    id: "R10",
    title: "未见明显高风险情形",
    category: "risk_screening",
    priority: 10,
    slot: "risk_hint",
    applies: ({ facts }) => facts.signalSet.has("risk_none"),
    evaluate: () => ({
      riskHints: ["当前未见明显高风险，但仍需持续补强证据闭环。"],
    }),
  },
];
