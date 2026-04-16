import type { AuthSession, LoginInput, RegistrationInput, UserRole } from '@/lib/auth-types';
import {
  authRepository,
  createSessionCookieValue,
  getSessionCookieName,
  validateLoginInput,
  validateRegistrationInput,
} from '@/lib/auth-repository';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export type AuthActionState = {
  errors: string[];
};

function buildSession(account: { id: string; role: UserRole; name: string }): AuthSession {
  return {
    userId: account.id,
    role: account.role,
    displayName: account.name,
  };
}

function getRoleRedirectPath(role: UserRole) {
  void role;
  return '/workspace';
}

export async function registerAction(_previousState: AuthActionState, formData: FormData): Promise<AuthActionState> {
  'use server';

  const input: RegistrationInput = {
    name: String(formData.get('name') ?? ''),
    email: String(formData.get('email') ?? ''),
    password: String(formData.get('password') ?? ''),
    role: String(formData.get('role') ?? 'resident') as UserRole,
  };

  const errors = validateRegistrationInput(input);
  if (errors.length > 0) {
    return { errors };
  }

  try {
    const account = await authRepository.registerUser(input);
    const session = buildSession(account);
    const cookieStore = await cookies();
    cookieStore.set(getSessionCookieName(), createSessionCookieValue(session), {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
    });
    redirect(getRoleRedirectPath(session.role));
  } catch (error) {
    return {
      errors: [error instanceof Error ? error.message : '注册失败，请稍后重试'],
    };
  }
}

export async function loginAction(_previousState: AuthActionState, formData: FormData): Promise<AuthActionState> {
  'use server';

  const input: LoginInput = {
    email: String(formData.get('email') ?? ''),
    password: String(formData.get('password') ?? ''),
  };

  const errors = validateLoginInput(input);
  if (errors.length > 0) {
    return { errors };
  }

  const session = await authRepository.loginUser(input);
  if (!session) {
    return {
      errors: ['邮箱或密码错误'],
    };
  }

  const cookieStore = await cookies();
  cookieStore.set(getSessionCookieName(), createSessionCookieValue(session), {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
  });

  redirect(getRoleRedirectPath(session.role));
}

export async function logoutAction() {
  'use server';

  const cookieStore = await cookies();
  cookieStore.delete(getSessionCookieName());
  redirect('/');
}
