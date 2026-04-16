export type UserRole = 'resident' | 'judge';

export type UserAccount = {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  createdAt: string;
};

export type AuthSession = {
  userId: string;
  role: UserRole;
  displayName: string;
};

export type RegistrationInput = {
  name: string;
  email: string;
  password: string;
  role: UserRole;
};

export type LoginInput = {
  email: string;
  password: string;
};
