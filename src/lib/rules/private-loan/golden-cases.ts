import type { FactField } from '@/lib/demo-repository';

export type GoldenCaseFixture = {
  id: string;
  title: string;
  facts: FactField[];
  expectedRuleIds: string[];
  expectedJudgment: string;
};

function cloneFact(fact: FactField): FactField {
  return {
    ...fact,
    options: fact.options ? fact.options.map((option) => ({ ...option })) : undefined,
  };
}

function applyOverrides(facts: FactField[], overrides: Record<string, Partial<FactField>>) {
  return facts.map((fact) => {
    const override = overrides[fact.ruleTag];
    return override ? { ...cloneFact(fact), ...override } : cloneFact(fact);
  });
}

export function createGoldenCases(baseFacts: FactField[]): GoldenCaseFixture[] {
  return [
    {
      id: 'golden-positive-establishment',
      title: '有书面材料且有转账记录',
      facts: applyOverrides(baseFacts, {
        LOAN_INTENT_WRITING: { value: 'writing_complete', status: '已确认' },
        FUND_DELIVERY_TRANSFER: { value: 'transfer_complete', status: '已确认' },
        REPAYMENT_DEFENSE: { value: 'repayment_none', status: '已确认' },
        RISK_SCREENING: { value: 'risk_none', status: '待核实' },
        RELATIONSHIP_MIXING_RISK: { value: 'risk_none', status: '待核实' },
      }),
      expectedRuleIds: ['R1', 'R6'],
      expectedJudgment: '借贷关系初步成立',
    },
    {
      id: 'golden-transfer-only',
      title: '仅有转账，缺少书面材料',
      facts: applyOverrides(baseFacts, {
        LOAN_INTENT_WRITING: { value: 'writing_none', status: '证据不足' },
        FUND_DELIVERY_TRANSFER: { value: 'transfer_complete', status: '已确认' },
        REPAYMENT_DEFENSE: { value: 'repayment_mapped', status: '待核实' },
        RISK_SCREENING: { value: 'risk_none', status: '待核实' },
        RELATIONSHIP_MIXING_RISK: { value: 'risk_none', status: '待核实' },
      }),
      expectedRuleIds: ['R2', 'R6'],
      expectedJudgment: '举证责任转向被告说明转账性质',
    },
    {
      id: 'golden-counter-explanation',
      title: '仅有转账且存在其他法律关系解释',
      facts: applyOverrides(baseFacts, {
        LOAN_INTENT_WRITING: { value: 'writing_none', status: '证据不足' },
        FUND_DELIVERY_TRANSFER: { value: 'transfer_complete', status: '已确认' },
        REPAYMENT_DEFENSE: { value: 'defendant_goods', status: '存在冲突' },
        RISK_SCREENING: { value: 'risk_none', status: '待核实' },
        RELATIONSHIP_MIXING_RISK: { value: 'risk_relationship_mixing', status: '已确认' },
      }),
      expectedRuleIds: ['R2', 'R4', 'R5', 'R6'],
      expectedJudgment: '转账性质真伪不明，需补强证据',
    },
  ];
}
