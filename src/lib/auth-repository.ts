import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

import type { AuthSession, LoginInput, RegistrationInput, UserAccount, UserRole } from './auth-types';

const SESSION_COOKIE_NAME = 'factflow_session';
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ACCOUNTS_FILE_PATH = path.join(process.cwd(), '.data', 'auth-accounts.json');

type StorageAdapter = {
  loadAccounts?: () => Promise<string | null>;
  saveAccounts?: (value: string) => Promise<void>;
};

const seedAccounts: UserAccount[] = [
  {
    id: 'user_resident_demo',
    name: '张三',
    email: 'resident@example.com',
    password: 'password123',
    role: 'resident',
    createdAt: '2026-04-16T10:00:00.000Z',
  },
  {
    id: 'user_judge_demo',
    name: '李法官',
    email: 'judge@example.com',
    password: 'password123',
    role: 'judge',
    createdAt: '2026-04-16T10:00:00.000Z',
  },
];

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function cloneAccount(account: UserAccount): UserAccount {
  return { ...account };
}

function toSession(account: UserAccount): AuthSession {
  return {
    userId: account.id,
    role: account.role,
    displayName: account.name,
  };
}

function isUserRole(value: unknown): value is UserRole {
  return value === 'resident' || value === 'judge';
}

function isUserAccount(value: unknown): value is UserAccount {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const candidate = value as Partial<UserAccount>;

  return (
    typeof candidate.id === 'string' &&
    typeof candidate.name === 'string' &&
    typeof candidate.email === 'string' &&
    typeof candidate.password === 'string' &&
    isUserRole(candidate.role) &&
    typeof candidate.createdAt === 'string'
  );
}

function sanitizeAccount(account: UserAccount): UserAccount {
  return {
    ...account,
    name: account.name.trim(),
    email: normalizeEmail(account.email),
  };
}

function parseStoredAccounts(raw: string | null, fallbackAccounts: UserAccount[]): UserAccount[] {
  if (!raw) {
    return fallbackAccounts.map((account) => sanitizeAccount(account));
  }

  try {
    const parsed = JSON.parse(raw) as unknown;

    if (!Array.isArray(parsed)) {
      return fallbackAccounts.map((account) => sanitizeAccount(account));
    }

    const accounts = parsed.filter(isUserAccount).map(sanitizeAccount);
    return accounts.length > 0 ? accounts : fallbackAccounts.map((account) => sanitizeAccount(account));
  } catch {
    return fallbackAccounts.map((account) => sanitizeAccount(account));
  }
}

async function readAccountsFromDisk(): Promise<string | null> {
  try {
    return await readFile(ACCOUNTS_FILE_PATH, 'utf8');
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return null;
    }

    throw error;
  }
}

async function writeAccountsToDisk(value: string): Promise<void> {
  await mkdir(path.dirname(ACCOUNTS_FILE_PATH), { recursive: true });
  await writeFile(ACCOUNTS_FILE_PATH, value, 'utf8');
}

function createStorageAdapter(storage?: StorageAdapter) {
  return {
    loadAccounts: storage?.loadAccounts ?? readAccountsFromDisk,
    saveAccounts: storage?.saveAccounts ?? writeAccountsToDisk,
  };
}

export function validateRegistrationInput(input: RegistrationInput): string[] {
  const errors: string[] = [];

  if (!input.name.trim()) {
    errors.push('请输入姓名');
  }

  if (!emailPattern.test(normalizeEmail(input.email))) {
    errors.push('请输入有效邮箱');
  }

  if (input.password.length < 8) {
    errors.push('密码至少需要 8 个字符');
  }

  return errors;
}

export function validateLoginInput(input: LoginInput): string[] {
  const errors: string[] = [];

  if (!emailPattern.test(normalizeEmail(input.email))) {
    errors.push('请输入有效邮箱');
  }

  if (!input.password) {
    errors.push('请输入密码');
  }

  return errors;
}

export function createSessionCookieValue(session: AuthSession): string {
  return encodeURIComponent(JSON.stringify(session));
}

export function parseSessionCookieValue(raw: string | undefined): AuthSession | null {
  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(decodeURIComponent(raw)) as Partial<AuthSession>;

    if (
      typeof parsed.userId === 'string' &&
      (parsed.role === 'resident' || parsed.role === 'judge') &&
      typeof parsed.displayName === 'string'
    ) {
      return {
        userId: parsed.userId,
        role: parsed.role,
        displayName: parsed.displayName,
      };
    }
  } catch {
    return null;
  }

  return null;
}

export function getRoleHomePath(role?: UserRole): string {
  void role;
  return '/workspace';
}

export function getSessionCookieName(): string {
  return SESSION_COOKIE_NAME;
}

export function createAuthRepository(initialAccounts: UserAccount[] = seedAccounts, storage?: StorageAdapter) {
  const storageAdapter = createStorageAdapter(storage);
  let accounts = initialAccounts.map((account) => sanitizeAccount(account));
  let initialized = false;

  async function ensureAccountsLoaded() {
    if (initialized) {
      return;
    }

    const persistedAccounts = await storageAdapter.loadAccounts();
    accounts = parseStoredAccounts(persistedAccounts, initialAccounts);
    initialized = true;
  }

  async function persistAccounts(nextAccounts: UserAccount[]) {
    const serializedAccounts = JSON.stringify(nextAccounts);
    await storageAdapter.saveAccounts(serializedAccounts);
    accounts = nextAccounts;
  }

  return {
    async registerUser(input: RegistrationInput): Promise<UserAccount> {
      await ensureAccountsLoaded();
      const normalizedEmail = normalizeEmail(input.email);

      if (accounts.some((account) => account.email === normalizedEmail)) {
        throw new Error('该邮箱已注册');
      }

      const account: UserAccount = {
        id: `user_${input.role}_${accounts.length + 1}`,
        name: input.name.trim(),
        email: normalizedEmail,
        password: input.password,
        role: input.role,
        createdAt: new Date().toISOString(),
      };

      const nextAccounts = [...accounts, account];
      await persistAccounts(nextAccounts);
      return cloneAccount(account);
    },

    async loginUser(input: LoginInput): Promise<AuthSession | null> {
      await ensureAccountsLoaded();
      const normalizedEmail = normalizeEmail(input.email);
      const account = accounts.find(
        (item) => item.email === normalizedEmail && item.password === input.password,
      );

      return account ? toSession(account) : null;
    },

    async getUserById(userId: string): Promise<UserAccount | null> {
      await ensureAccountsLoaded();
      const account = accounts.find((item) => item.id === userId);
      return account ? cloneAccount(account) : null;
    },

    async listUsers(): Promise<UserAccount[]> {
      await ensureAccountsLoaded();
      return accounts.map(cloneAccount);
    },
  };
}

const defaultRepository = createAuthRepository();

export const authRepository = {
  registerUser: (input: RegistrationInput) => defaultRepository.registerUser(input),
  loginUser: (input: LoginInput) => defaultRepository.loginUser(input),
  getUserById: (userId: string) => defaultRepository.getUserById(userId),
  listUsers: () => defaultRepository.listUsers(),
};
