export type PrivateLoanDerivedSignal =
  | "writing_complete"
  | "writing_partial"
  | "writing_none"
  | "transfer_complete"
  | "transfer_partial"
  | "transfer_none"
  | "repayment_none"
  | "repayment_mapped"
  | "repayment_unmapped"
  | "timeline_complete"
  | "timeline_partial"
  | "timeline_missing"
  | "party_direct_only"
  | "party_related_involved"
  | "party_joint_liability_dispute"
  | "risk_none"
  | "risk_cash_interest"
  | "risk_relationship_mixing"
  | "defendant_silent"
  | "defendant_goods"
  | "defendant_other_relation";

export type PrivateLoanRuleSlot =
  | "preliminary_judgment"
  | "core_issue"
  | "risk_hint"
  | "evidence_gap"
  | "action_suggestion";

export type PrivateLoanRuleCategory =
  | "loan_establishment"
  | "burden_shift"
  | "repayment_review"
  | "timeline_review"
  | "risk_screening"
  | "special_circumstance";

export type NormalizedPrivateLoanFacts = {
  appliedFactTags: string[];
  selectedLabelsByTag: Record<string, string>;
  selectedValuesByTag: Record<string, string>;
  signalSet: Set<PrivateLoanDerivedSignal>;
};

export type PrivateLoanRuleContext = {
  facts: NormalizedPrivateLoanFacts;
  traceId: string;
};

export type PrivateLoanRuleTrace = {
  ruleId: string;
  matched: boolean;
  slot: PrivateLoanRuleSlot;
  priority: number;
  because: string[];
};

export type PrivateLoanRuleOutput = {
  ruleHit?: {
    id: string;
    title: string;
    severity: "high" | "medium" | "low";
    message: string;
    legalBasis: string;
    because: string[];
  };
  preliminaryJudgment?: {
    label: string;
    summary: string;
  };
  coreIssues?: string[];
  riskHints?: string[];
  evidenceGaps?: string[];
  actionSuggestions?: string[];
};

export type PrivateLoanRuleDefinition = {
  id: string;
  title: string;
  category: PrivateLoanRuleCategory;
  priority: number;
  slot: PrivateLoanRuleSlot;
  applies: (context: PrivateLoanRuleContext) => boolean;
  evaluate: (context: PrivateLoanRuleContext) => PrivateLoanRuleOutput;
};

export type PrivateLoanConflictStrategy = "append" | "highest_priority_wins";
