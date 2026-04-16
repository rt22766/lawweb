import type { PrivateLoanConflictStrategy, PrivateLoanRuleSlot } from './types';

export const privateLoanFactDictionary = Object.freeze({
  PARTY_RELATION: '主体与关系事实',
  LOAN_INTENT_WRITING: '借贷合意事实',
  FUND_DELIVERY_TRANSFER: '款项交付事实',
  REPAYMENT_DEFENSE: '抗辩与争议事实',
  PERFORMANCE_TIMELINE: '履行与时间事实',
  RISK_SCREENING: '风险筛查事实',
  DEFENDANT_RESPONSE: '被告回应事实',
  RELATIONSHIP_MIXING_RISK: '关系混同风险',
} as const);

export const privateLoanDerivedSignalDictionary = Object.freeze({
  writing_complete: '存在明确书面借贷材料',
  writing_partial: '仅有部分书面借贷材料',
  writing_none: '暂无书面借贷材料',
  transfer_complete: '存在完整转账交付记录',
  transfer_partial: '仅有部分转账交付记录',
  transfer_none: '没有转账交付记录',
  repayment_none: '无明确还款抗辩',
  repayment_mapped: '存在还款抗辩且可基本映射',
  repayment_unmapped: '存在还款抗辩但无法一一映射',
  timeline_complete: '借还款时间线完整闭合',
  timeline_partial: '借还款时间线仅部分闭合',
  timeline_missing: '借还款时间线关键节点缺失',
  party_direct_only: '仅借款人与出借人直接参与',
  party_related_involved: '存在配偶、亲属或关联人间接参与',
  party_joint_liability_dispute: '存在共同借款或共同责任争议',
  risk_none: '未见明显高风险情形',
  risk_cash_interest: '存在现金交付或利息争议风险',
  risk_relationship_mixing: '存在其他法律关系混同风险',
  defendant_silent: '被告沉默或未作合理说明',
  defendant_goods: '被告主张货款等其他往来',
  defendant_other_relation: '被告主张其他法律关系',
} as const);

export const privateLoanTagDictionary = Object.freeze({
  establishment: ['PARTY_RELATION', 'LOAN_INTENT_WRITING', 'FUND_DELIVERY_TRANSFER'],
  repayment: ['REPAYMENT_DEFENSE', 'PERFORMANCE_TIMELINE'],
  risk: ['RISK_SCREENING', 'RELATIONSHIP_MIXING_RISK'],
} as const);

export const privateLoanConflictMatrix = Object.freeze<Record<PrivateLoanRuleSlot, PrivateLoanConflictStrategy>>({
  preliminary_judgment: 'highest_priority_wins',
  core_issue: 'append',
  risk_hint: 'append',
  evidence_gap: 'append',
  action_suggestion: 'append',
});
