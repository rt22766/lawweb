import type { UserRole } from './auth-types';
import type { WorkspaceRecord } from './demo-repository';

export type CaseOwner = {
  userId: string;
  displayName: string;
  role: UserRole;
};

export type OwnedWorkspaceRecord = WorkspaceRecord & {
  owner: CaseOwner;
};
