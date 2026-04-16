import type { FactField, Precedent } from "@/lib/demo-repository";

import { runPrivateLoanRules } from "@/lib/rules/private-loan/run-rules";

export function buildWorkspaceAnalysis(facts: FactField[], precedents: Precedent[]) {
  return runPrivateLoanRules(facts, precedents);
}
