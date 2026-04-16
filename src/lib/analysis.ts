import type { FactField, Precedent } from "./demo-repository";

import { runPrivateLoanRules } from "./rules/private-loan/run-rules";

export function buildWorkspaceAnalysis(facts: FactField[], precedents: Precedent[]) {
  return runPrivateLoanRules(facts, precedents);
}
