import type { PrivateLoanRuleDefinition } from "./types";

function because(context: Parameters<PrivateLoanRuleDefinition["evaluate"]>[0], ...tags: string[]) {
  return tags
    .map((tag) => context.facts.selectedLabelsByTag[tag])
    .filter((value): value is string => Boolean(value));
}

function riskBecause(context: Parameters<PrivateLoanRuleDefinition["evaluate"]>[0]) {
  const reasons: string[] = [];

  if (context.facts.selectedValuesByTag.RISK_SCREENING === "risk_cash_interest") {
    const label = context.facts.selectedLabelsByTag.RISK_SCREENING;
    if (label) {
      reasons.push(label);
    }
  }

  if (context.facts.selectedValuesByTag.RELATIONSHIP_MIXING_RISK === "risk_relationship_mixing") {
    const label = context.facts.selectedLabelsByTag.RELATIONSHIP_MIXING_RISK;
    if (label) {
      reasons.push(label);
    }
  }

  return reasons;
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
      traceBecause: because(context, "LOAN_INTENT_WRITING", "FUND_DELIVERY_TRANSFER"),
      traceReason: '存在明确书面材料且存在完整转账记录',
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
      traceBecause: because(context, "FUND_DELIVERY_TRANSFER", "LOAN_INTENT_WRITING"),
      traceReason: '缺少稳定书面借贷材料，但存在完整转账记录',
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
      traceBecause: because(context, "REPAYMENT_DEFENSE"),
      traceReason: '被告沉默或未作合理说明',
      ruleHit: {
        id: "R3",
        title: "被告沉默时证明力增强",
        severity: "low",
        message: "被告沉默或未作合理解释时，原告基于转账记录形成的初步证明力增强。",
        legalBasis: "民间借贷规则树 R3 / 民事证据规则",
        because: because(context, "REPAYMENT_DEFENSE"),
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
      traceBecause: because(context, "REPAYMENT_DEFENSE"),
      traceReason: '存在其他法律关系解释、货款解释或还款映射不清',
      ruleHit: {
        id: "R4",
        title: "被告反证触发转账性质审查",
        severity: "high",
        message: "被告已提出其他法律关系、代付、货款或往来解释，需审查转账性质是否足以指向借款。",
        legalBasis: "民间借贷规则树 R4",
        because: because(context, "REPAYMENT_DEFENSE"),
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
      traceBecause: riskBecause(context),
      traceReason: '存在现金交付或其他法律关系混同风险',
      ruleHit: {
        id: "R5",
        title: "真伪不明时需补证",
        severity: "high",
        message: "现有材料仍不足以稳定区分借款与其他往来，结果应落到真伪不明并提示继续补证。",
        legalBasis: "民间借贷规则树 R5",
        because: riskBecause(context),
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
      traceBecause: because(context, "PARTY_RELATION"),
      traceReason: '主体关系显示存在责任扩展或关联人参与',
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
    evaluate: (context) => ({
      traceBecause: because(context, "REPAYMENT_DEFENSE"),
      traceReason: '还款抗辩与案涉借款尚未完成映射',
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
    evaluate: (context) => ({
      traceBecause: because(context, "REPAYMENT_DEFENSE"),
      traceReason: '还款抗辩与借款批次可基本映射',
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
    evaluate: (context) => ({
      traceBecause: because(context, "PERFORMANCE_TIMELINE"),
      traceReason: '借还款时间线仍未完全闭合',
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
    evaluate: (context) => ({
      traceBecause: because(context, "RISK_SCREENING", "RELATIONSHIP_MIXING_RISK"),
      traceReason: '当前未见明显高风险情形',
      riskHints: ["当前未见明显高风险，但仍需持续补强证据闭环。"],
    }),
  },
  {
    id: "R11",
    title: "现金交付场景需严格补强本金交付",
    category: "risk_screening",
    priority: 78,
    slot: "evidence_gap",
    applies: ({ facts }) => facts.signalSet.has("risk_cash_interest"),
    evaluate: (context) => ({
      traceBecause: because(context, "RISK_SCREENING", "FUND_DELIVERY_TRANSFER"),
      traceReason: '存在现金交付或利息争议风险，款项交付证明需进一步补强',
      ruleHit: {
        id: "R11",
        title: "现金交付场景需严格补强本金交付",
        severity: "high",
        message: "存在现金交付风险时，本金交付事实不能仅凭单方陈述，需要补强交付来源、在场人员与资金去向。",
        legalBasis: "民间借贷规则树 R11",
        because: because(context, "RISK_SCREENING", "FUND_DELIVERY_TRANSFER"),
      },
      evidenceGaps: ["如主张现金交付，应补强取现记录、交付在场情况、收条或后续确认材料。"],
      riskHints: ["现金交付缺少客观留痕时，本金认定与虚假陈述风险会同步上升。"],
    }),
  },
  {
    id: "R12",
    title: "仅部分交付记录时本金口径需限缩",
    category: "loan_establishment",
    priority: 72,
    slot: "core_issue",
    applies: ({ facts }) => facts.signalSet.has("transfer_partial"),
    evaluate: (context) => ({
      traceBecause: because(context, "FUND_DELIVERY_TRANSFER"),
      traceReason: '仅有部分款项交付记录，本金口径尚不能完整闭合',
      ruleHit: {
        id: "R12",
        title: "仅部分交付记录时本金口径需限缩",
        severity: "medium",
        message: "现有交付记录仅覆盖部分借款，本金主张应按已证明部分先行核验，不宜直接全额认定。",
        legalBasis: "民间借贷规则树 R12",
        because: because(context, "FUND_DELIVERY_TRANSFER"),
      },
      coreIssues: ["本金交付链条仅部分闭合，需区分已被证明的交付金额与未被证明部分。"],
      evidenceGaps: ["补充剩余款项的转账流水、交付凭据或对账确认，避免本金口径失真。"],
    }),
  },
  {
    id: "R13",
    title: "利息争议存在时需拆分本金与利息口径",
    category: "risk_screening",
    priority: 68,
    slot: "core_issue",
    applies: ({ facts }) => facts.signalSet.has("risk_cash_interest"),
    evaluate: (context) => ({
      traceBecause: because(context, "RISK_SCREENING", "REPAYMENT_DEFENSE"),
      traceReason: '存在现金交付或利息争议风险，本息口径需要拆分核验',
      ruleHit: {
        id: "R13",
        title: "利息争议存在时需拆分本金与利息口径",
        severity: "medium",
        message: "涉及利息争议时，应将本金、已付利息、逾期利息分别核对，避免以息抵本或重复计算。",
        legalBasis: "民间借贷规则树 R13",
        because: because(context, "RISK_SCREENING", "REPAYMENT_DEFENSE"),
      },
      coreIssues: ["利息争议可能影响剩余本金、已清偿金额与后续支持范围，需要拆分核算。"],
      actionSuggestions: ["分别整理本金、利息、逾期部分的计算口径，并固定约定利率与实际支付记录。"],
    }),
  },
  {
    id: "R14",
    title: "长期未催收时需关注交易合理性",
    category: "special_circumstance",
    priority: 58,
    slot: "risk_hint",
    applies: ({ facts }) => facts.signalSet.has("timeline_missing") && facts.signalSet.has("writing_none"),
    evaluate: (context) => ({
      traceBecause: because(context, "PERFORMANCE_TIMELINE", "LOAN_INTENT_WRITING"),
      traceReason: '时间线关键节点缺失且无书面借贷材料，需关注长期未催收的合理性',
      ruleHit: {
        id: "R14",
        title: "长期未催收时需关注交易合理性",
        severity: "medium",
        message: "长时间未见催收或履行节点记录，且缺少书面材料时，应重点审查借贷发生背景与交易习惯是否合理。",
        legalBasis: "民间借贷规则树 R14",
        because: because(context, "PERFORMANCE_TIMELINE", "LOAN_INTENT_WRITING"),
      },
      riskHints: ["长期未催收且时间线缺失时，交易真实性、到期时间与双方往来背景都需要额外说明。"],
      evidenceGaps: ["补充催收记录、到期提醒、聊天经过或阶段性确认材料，以证明借贷关系持续存在。"],
    }),
  },
  {
    id: "R15",
    title: "关系混同与现金交付并存时提示虚假诉讼风险",
    category: "risk_screening",
    priority: 82,
    slot: "risk_hint",
    applies: ({ facts }) => facts.signalSet.has("risk_relationship_mixing") && facts.signalSet.has("risk_cash_interest"),
    evaluate: (context) => ({
      traceBecause: riskBecause(context),
      traceReason: '同时存在关系混同与现金交付/利息争议风险，需提高虚假诉讼筛查强度',
      ruleHit: {
        id: "R15",
        title: "关系混同与现金交付并存时提示虚假诉讼风险",
        severity: "high",
        message: "当其他法律关系混同与现金交付风险同时出现时，应显著提高对虚假诉讼、账目重组或口径拼接的警惕。",
        legalBasis: "民间借贷规则树 R15",
        because: riskBecause(context),
      },
      riskHints: ["关系混同与现金交付风险叠加时，需重点筛查是否存在以其他往来包装借款或事后拼接证据的情形。"],
      actionSuggestions: ["优先核对资金来源、基础交易背景、形成时间顺序与关键证据原件，必要时单列虚假诉讼风险审查。"],
    }),
  },
];
