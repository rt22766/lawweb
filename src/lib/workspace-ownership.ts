import type { UserRole } from '@/lib/auth-types';
import type { WorkspaceRecord } from '@/lib/demo-repository';

export type CaseOwner = {
  userId: string;
  displayName: string;
  role: UserRole;
};

export type OwnedWorkspaceRecord = WorkspaceRecord & {
  owner: CaseOwner;
};
