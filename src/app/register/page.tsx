"use client";

import Link from 'next/link';
import { useActionState } from 'react';
import type { ComponentProps } from 'react';

import { registerAction } from '../../lib/auth-server-actions';

function AuthField(props: ComponentProps<'input'> & { label: string }) {
  const { label, ...inputProps } = props;

  return (
    <label className="auth-field">
      <span>{label}</span>
      <input className="auth-input" {...inputProps} />
    </label>
  );
}

export default function RegisterPage() {
  const [state, formAction, pending] = useActionState(registerAction, { errors: [] });

  return (
    <div className="site-container auth-page-shell">
      <section className="auth-card panel">
        <div className="auth-card-head">
          <span className="section-eyebrow">注册</span>
          <h1>创建 FactFlowAI 账号</h1>
          <p>请选择你的身份，注册成功后将直接进入对应工作区。</p>
        </div>

        <form action={formAction} className="auth-form">
          <AuthField label="姓名" name="name" type="text" placeholder="请输入姓名" required />
          <AuthField label="邮箱" name="email" type="email" placeholder="you@example.com" required />
          <AuthField label="密码" name="password" type="password" placeholder="至少 8 位密码" required />

          <label className="auth-field">
            <span>用户类型</span>
            <select className="auth-input" name="role" defaultValue="resident">
              <option value="resident">居民 / 当事人</option>
              <option value="judge">法官 / 专业用户</option>
            </select>
          </label>

          {state.errors.length > 0 ? (
            <div className="auth-error-list" role="alert">
              {state.errors.map((error) => (
                <p key={error}>{error}</p>
              ))}
            </div>
          ) : null}

          <button type="submit" className="button button-primary auth-submit" disabled={pending}>
            {pending ? '注册中…' : '注册成功后直接进入工作区'}
          </button>
        </form>

        <p className="auth-switch-link">
          已有账号，<Link href="/login">去登录</Link>
        </p>
      </section>
    </div>
  );
}
