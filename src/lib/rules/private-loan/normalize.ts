import type { FactField } from "../../demo-repository";

import type { NormalizedPrivateLoanFacts, PrivateLoanDerivedSignal } from "./types";

const signalValues = [
  "writing_complete",
  "writing_partial",
  "writing_none",
  "transfer_complete",
  "transfer_partial",
  "transfer_none",
  "repayment_none",
  "repayment_mapped",
  "repayment_unmapped",
  "timeline_complete",
  "timeline_partial",
  "timeline_missing",
  "party_direct_only",
  "party_related_involved",
  "party_joint_liability_dispute",
  "risk_none",
  "risk_cash_interest",
  "risk_relationship_mixing",
  "defendant_silent",
  "defendant_goods",
  "defendant_other_relation",
] as const satisfies PrivateLoanDerivedSignal[];

const signalSet = new Set<string>(signalValues);

function isDerivedSignal(value: string): value is PrivateLoanDerivedSignal {
  return signalSet.has(value);
}

export function normalizePrivateLoanFacts(facts: FactField[]): NormalizedPrivateLoanFacts {
  const appliedFactTags: string[] = [];
  const selectedLabelsByTag: Record<string, string> = {};
  const selectedValuesByTag: Record<string, string> = {};
  const derivedSignals = new Set<PrivateLoanDerivedSignal>();

  facts.forEach((fact) => {
    appliedFactTags.push(fact.ruleTag);
    selectedValuesByTag[fact.ruleTag] = fact.value;

    const selectedOption = fact.options?.find((option) => option.value === fact.value);
    selectedLabelsByTag[fact.ruleTag] = selectedOption?.label ?? fact.label;

    if (isDerivedSignal(fact.value)) {
      derivedSignals.add(fact.value);
    }
  });

  // 风险字段拆分为可并存信号后，risk_none 仅在无风险信号时保留。
  if (derivedSignals.has("risk_cash_interest") || derivedSignals.has("risk_relationship_mixing")) {
    derivedSignals.delete("risk_none");
  } else if (
    selectedValuesByTag.RISK_SCREENING === "risk_none" ||
    selectedValuesByTag.RELATIONSHIP_MIXING_RISK === "risk_none"
  ) {
    derivedSignals.add("risk_none");
  }

  return {
    appliedFactTags,
    selectedLabelsByTag,
    selectedValuesByTag,
    signalSet: derivedSignals,
  };
}
