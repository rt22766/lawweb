"use server";

import type { AuthSession, LoginInput, RegistrationInput, UserRole } from './auth-types';
import {
  authRepository,
  createSessionCookieValue,
  getRoleHomePath,
  getSessionCookieName,
  parseSessionCookieValue,
  validateLoginInput,
  validateRegistrationInput,
} from './auth-repository';
import { buildCaseOwnerInput } from './case-workspace';
import { createDemoWorkspaceRepository, listWorkspaceCases } from './demo-repository';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export type AuthActionState = {
  errors: string[];
};

const workspaceRepository = createDemoWorkspaceRepository();

async function ensureOnboardingCase(userId: string, displayName: string, role: UserRole) {
  const existingCases = await listWorkspaceCases(userId);

  if (existingCases.length > 0) {
    return;
  }

  await workspaceRepository.createCase({
    owner: buildCaseOwnerInput(userId, displayName, role),
    title: `${displayName}的案件`,
  });
}

export async function registerAction(_previousState: AuthActionState, formData: FormData): Promise<AuthActionState> {
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

  let account;

  try {
    account = await authRepository.registerUser(input);
  } catch (error) {
    return {
      errors: [error instanceof Error ? error.message : '注册失败，请稍后重试'],
    };
  }

  const session = {
    userId: account.id,
    role: account.role,
    displayName: account.name,
  } satisfies AuthSession;
  await ensureOnboardingCase(session.userId, session.displayName, session.role);
  const cookieStore = await cookies();
  cookieStore.set(getSessionCookieName(), createSessionCookieValue(session), {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
  });
  redirect(getRoleHomePath(session.role));
}

export async function createWorkspaceCaseAction(formData: FormData) {
  const cookieStore = await cookies();
  const session = parseSessionCookieValue(cookieStore.get(getSessionCookieName())?.value);

  if (!session) {
    redirect('/login');
  }

  const title = String(formData.get('title') ?? '').trim();
  const nextCase = await workspaceRepository.createCase({
    owner: buildCaseOwnerInput(session.userId, session.displayName, session.role),
    title: title || `${session.displayName}的案件`,
  });

  redirect(`/workspace/${nextCase.summary.id}/facts`);
}

export async function loginAction(_previousState: AuthActionState, formData: FormData): Promise<AuthActionState> {
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

  await ensureOnboardingCase(session.userId, session.displayName, session.role);
  const cookieStore = await cookies();
  cookieStore.set(getSessionCookieName(), createSessionCookieValue(session), {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
  });

  redirect(getRoleHomePath(session.role));
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete(getSessionCookieName());
  redirect('/');
}
