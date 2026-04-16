import type { AuthSession, UserRole } from '@/lib/auth-types';
import { getRoleHomePath, getSessionCookieName, parseSessionCookieValue } from '@/lib/auth-repository';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function getCurrentSession(): Promise<AuthSession | null> {
  const cookieStore = await cookies();
  return parseSessionCookieValue(cookieStore.get(getSessionCookieName())?.value);
}

export async function requireSession() {
  const session = await getCurrentSession();
  if (!session) {
    redirect('/login');
  }
  return session;
}

export async function requireRole(role: UserRole) {
  const session = await requireSession();
  if (session.role !== role) {
    redirect(getRoleHomePath(session.role));
  }
  return session;
}
