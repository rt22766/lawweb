export type PrecedentFactTag =
  | 'writing_complete'
  | 'writing_partial'
  | 'writing_none'
  | 'transfer_complete'
  | 'transfer_partial'
  | 'transfer_none'
  | 'repayment_none'
  | 'repayment_mapped'
  | 'repayment_unmapped'
  | 'timeline_complete'
  | 'timeline_partial'
  | 'timeline_missing'
  | 'party_direct_only'
  | 'party_related_involved'
  | 'party_joint_liability_dispute'
  | 'risk_none'
  | 'risk_cash_interest'
  | 'risk_relationship_mixing'
  | 'interest_dispute_present'
  | 'cash_delivery_present';

export type PrecedentDisputeTag =
  | 'loan_establishment'
  | 'burden_shift'
  | 'repayment_review'
  | 'timeline_review'
  | 'interest_adjustment'
  | 'special_circumstance';

export type PrecedentReferenceTag = 'direct_reference' | 'limited_reference' | 'background_only';

export type PrecedentAnnotation = {
  factTags: PrecedentFactTag[];
  disputeTags: PrecedentDisputeTag[];
  referenceTag: PrecedentReferenceTag;
  keyIssueTags: string[];
};

export const precedentFactTagDictionary: Record<PrecedentFactTag, string> = {
  writing_complete: '有明确书面借贷材料',
  writing_partial: '仅有部分书面借贷材料',
  writing_none: '暂无书面借贷材料',
  transfer_complete: '存在完整转账记录',
  transfer_partial: '仅有部分转账记录',
  transfer_none: '没有转账记录',
  repayment_none: '无明确还款抗辩',
  repayment_mapped: '还款抗辩可基本映射',
  repayment_unmapped: '还款抗辩无法一一映射',
  timeline_complete: '借还款时间线完整',
  timeline_partial: '借还款时间线部分闭合',
  timeline_missing: '借还款时间线关键节点缺失',
  party_direct_only: '仅借款人与出借人直接参与',
  party_related_involved: '存在配偶、亲属或关联人参与',
  party_joint_liability_dispute: '存在共同借款或共同责任争议',
  risk_none: '未见明显高风险情形',
  risk_cash_interest: '存在现金交付或利息争议风险',
  risk_relationship_mixing: '存在其他法律关系混同风险',
  interest_dispute_present: '存在利息争议',
  cash_delivery_present: '存在现金交付',
};

export const precedentDisputeTagDictionary: Record<PrecedentDisputeTag, string> = {
  loan_establishment: '借贷关系成立判断',
  burden_shift: '举证责任转移',
  repayment_review: '还款抗辩审查',
  timeline_review: '履行与时间线审查',
  interest_adjustment: '利息与金额调整',
  special_circumstance: '特殊情形处理',
};

export const precedentReferenceTagDictionary: Record<PrecedentReferenceTag, string> = {
  direct_reference: '可直接参照',
  limited_reference: '需限缩参照',
  background_only: '仅作背景参考',
};
