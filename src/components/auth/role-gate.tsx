import type { ReactNode } from 'react';

import { getCurrentSession, requireRole } from '@/lib/auth-session';
import type { UserRole } from '@/lib/auth-types';

type RoleGateProps = {
  allow: UserRole[];
  children: ReactNode;
};

export async function RoleGate({ allow, children }: RoleGateProps) {
  const session = await getCurrentSession();

  if (!session) {
    await requireRole(allow[0] ?? 'resident');
    return null;
  }

  if (!allow.includes(session.role)) {
    await requireRole(session.role);
    return null;
  }

  return children;
}
