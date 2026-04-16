"use client";

import Link from 'next/link';
import { useActionState } from 'react';
import type { ComponentProps } from 'react';

import { loginAction } from '../../lib/auth-server-actions';

function AuthField(props: ComponentProps<'input'> & { label: string }) {
  const { label, ...inputProps } = props;

  return (
    <label className="auth-field">
      <span>{label}</span>
      <input className="auth-input" {...inputProps} />
    </label>
  );
}

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(loginAction, { errors: [] });

  return (
    <div className="site-container auth-page-shell">
      <section className="auth-card panel">
        <div className="auth-card-head">
          <span className="section-eyebrow">登录</span>
          <h1>登录 FactFlowAI</h1>
          <p>已有账号可直接登录，登录成功后立即进入工作区。</p>
        </div>

        <form action={formAction} className="auth-form">
          <AuthField label="邮箱" name="email" type="email" placeholder="you@example.com" required />
          <AuthField label="密码" name="password" type="password" placeholder="请输入密码" required />

          {state.errors.length > 0 ? (
            <div className="auth-error-list" role="alert">
              {state.errors.map((error) => (
                <p key={error}>{error}</p>
              ))}
            </div>
          ) : null}

          <button type="submit" className="button button-primary auth-submit" disabled={pending}>
            {pending ? '登录中…' : '登录后进入工作区'}
          </button>
        </form>

        <p className="auth-switch-link">
          没有账号，<Link href="/register">先注册</Link>
        </p>
      </section>
    </div>
  );
}
