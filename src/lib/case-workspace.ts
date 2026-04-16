import { getWorkspaceRecord, getWorkspaceRecordSync } from "./demo-repository";
import type { UserRole } from "./auth-types";

export async function getCaseWorkspace(caseId?: string, ownerUserId?: string) {
  return getWorkspaceRecord(caseId ?? "loan-case-001", ownerUserId);
}

export function getCaseWorkspaceSync(caseId?: string) {
  return getWorkspaceRecordSync(caseId ?? "loan-case-001");
}

export function buildCaseOwnerInput(userId: string, displayName: string, role: UserRole) {
  return {
    userId,
    displayName,
    role,
  };
}
