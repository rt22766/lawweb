import type { FactField, Precedent, RuleHit, WorkspaceAnalysis } from "../../demo-repository";

import { privateLoanConflictMatrix } from "./dictionaries";
import { normalizePrivateLoanFacts } from "./normalize";
import { privateLoanRulesR1ToR10 } from "./rules-r1-r10";
import type { PrivateLoanRuleOutput, PrivateLoanRuleSlot, PrivateLoanRuleTrace } from "./types";

function createTraceId() {
  return `trace_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

function buildRecommendationBasis(precedents: Precedent[], disputePattern: string) {
  return precedents.map((precedent) => ({
    precedentId: precedent.id,
    reasons: [
      `当前争议模式“${disputePattern}”与类案“${precedent.disputePattern}”具有较高可比性。`,
      `参照等级：${precedent.referenceLevel}，参考度 ${precedent.score}。`,
      ...precedent.differenceImpact.map((item) => `差异影响：${item}`),
    ],
  }));
}

function mergeBySlot(slot: PrivateLoanRuleSlot, current: PrivateLoanRuleOutput, incoming: PrivateLoanRuleOutput) {
  const strategy = privateLoanConflictMatrix[slot];

  return {
    preliminaryJudgment:
      strategy === 'highest_priority_wins'
        ? current.preliminaryJudgment ?? incoming.preliminaryJudgment
        : incoming.preliminaryJudgment ?? current.preliminaryJudgment,
    ruleHit: incoming.ruleHit ?? current.ruleHit,
    traceBecause: incoming.traceBecause ?? current.traceBecause,
    traceReason: incoming.traceReason ?? current.traceReason,
    coreIssues: [...(current.coreIssues ?? []), ...(incoming.coreIssues ?? [])],
    riskHints: [...(current.riskHints ?? []), ...(incoming.riskHints ?? [])],
    evidenceGaps: [...(current.evidenceGaps ?? []), ...(incoming.evidenceGaps ?? [])],
    actionSuggestions: [...(current.actionSuggestions ?? []), ...(incoming.actionSuggestions ?? [])],
  };
}

export function runPrivateLoanRules(facts: FactField[], precedents: Precedent[]): WorkspaceAnalysis & { traceId: string; trace: PrivateLoanRuleTrace[] } {
  const traceId = createTraceId();
  const normalizedFacts = normalizePrivateLoanFacts(facts);
  const matchedRules = privateLoanRulesR1ToR10
    .filter((rule) => rule.applies({ facts: normalizedFacts, traceId }))
    .sort((left, right) => right.priority - left.priority);

  let aggregate: PrivateLoanRuleOutput = {
    coreIssues: [],
    riskHints: [],
    evidenceGaps: [],
    actionSuggestions: [],
  };
  const ruleHits: RuleHit[] = [];
  const trace: PrivateLoanRuleTrace[] = privateLoanRulesR1ToR10.map((rule) => ({
    ruleId: rule.id,
    matched: matchedRules.some((matchedRule) => matchedRule.id === rule.id),
    slot: rule.slot,
    priority: rule.priority,
    because: [],
    reason: '未命中当前事实组合',
  }));

  matchedRules.forEach((rule) => {
    const result = rule.evaluate({ facts: normalizedFacts, traceId });
    aggregate = mergeBySlot(rule.slot, aggregate, result);

    if (result.ruleHit) {
      ruleHits.push(result.ruleHit);
    }

    const traceEntry = trace.find((item) => item.ruleId === rule.id);
    if (traceEntry) {
      traceEntry.because = result.traceBecause ?? result.ruleHit?.because ?? [];
      traceEntry.reason = result.traceReason ?? '命中当前事实组合';
    }
  });

  const preliminaryJudgment =
    aggregate.preliminaryJudgment ?? {
      label: "转账性质真伪不明，需补强证据",
      summary: "现有材料尚不足以稳定排除其他经济往来，借贷关系暂不能下确定性结论。",
    };
  const similarCases = precedents.slice(0, 2);
  const strengths = facts
    .filter((fact) => fact.status === "已确认")
    .slice(0, 2)
    .map((fact) => fact.label);

  return {
    traceId,
    trace,
    disputePattern: preliminaryJudgment.label,
    analysisStatus: preliminaryJudgment.summary,
    riskLevel: ruleHits.some((rule) => rule.severity === "high")
      ? "高"
      : ruleHits.some((rule) => rule.severity === "medium")
        ? "中"
        : "低",
    strengths: strengths.length > 0 ? strengths : ["当前尚缺充分已确认事实"],
    weaknesses: aggregate.coreIssues?.length ? aggregate.coreIssues : ["当前仍需继续核对借贷合意、交付记录与抗辩事实之间的对应关系。"],
    evidenceGaps: aggregate.evidenceGaps?.length ? aggregate.evidenceGaps : aggregate.riskHints?.length ? aggregate.riskHints : ["当前未见明显高风险，但仍需持续补强证据闭环。"],
    actionSuggestions: aggregate.actionSuggestions?.length ? aggregate.actionSuggestions : ["继续围绕借贷合意、转账性质与履行时间线补强事实链。"],
    ruleHits,
    preliminaryJudgment,
    coreIssues: aggregate.coreIssues?.length ? aggregate.coreIssues : ["当前仍需继续核对借贷合意、交付记录与抗辩事实之间的对应关系。"],
    riskHints: aggregate.riskHints?.length ? aggregate.riskHints : ["当前未见明显高风险，但仍需持续补强证据闭环。"],
    similarCases,
    recommendationBasis: buildRecommendationBasis(similarCases, preliminaryJudgment.label),
  };
}
