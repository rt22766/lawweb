import Link from "next/link";

import { SectionShell } from "../components/site/section-shell";
import { FactMatrix } from "../components/site/fact-matrix";
import { RuleTraceability } from "../components/site/rule-traceability";
import {
  homepageFeatures,
  homepageMetrics,
  methodologySteps,
  trustProofs,
} from "../lib/site";

export default function HomePage() {
  return (
    <div className="site-container page-stack">
      {/* Hero Section */}
      <section className="hero-shell">
        <div className="hero-copy">
          <span className="hero-kicker">AI + 法律事实 + 数据分析</span>
          <h1>重构事实链路，让法律分析有迹可循。</h1>
          <p>
            FactFlow AI 将复杂的借贷纠纷材料转化为结构化事实矩阵，结合规则与类案引擎，为司法裁判与争议解决提供高透明度的辅助决策支持。
          </p>
          <div className="hero-actions">
            <Link href="/register" className="button button-primary">
              注册后进入工作区
            </Link>
            <Link href="/login" className="button button-secondary">
              已有账号，直接登录
            </Link>
          </div>
        </div>

        <div className="hero-aside">
          {/* Dossier Mockup snippet representing the 'Matrix' */}
          <div className="dossier-mockup">
            <div className="mockup-row">
              <span className="mockup-label">事实状态</span>
              <span className="badge badge-success">证据完备</span>
            </div>
            <div className="mockup-row">
              <span className="mockup-label">借款本金</span>
              <span className="mockup-value">¥ 500,000.00</span>
            </div>
            <div className="mockup-row">
              <span className="mockup-label">约定年化利率</span>
              <span className="mockup-value">14.6%</span>
            </div>
            <div className="mockup-row">
              <span className="mockup-label">还款记录核对</span>
              <span className="badge badge-warning">关系不清</span>
            </div>
          </div>
        </div>
      </section>

      {/* Value Props / Metrics */}
      <section className="metric-grid">
        {homepageMetrics.map((item) => (
          <article key={item.label} className="metric-card panel">
            <span>{item.label}</span>
            <strong>{item.value}</strong>
            <p>{item.detail}</p>
          </article>
        ))}
      </section>

      {/* Institutional Trust Proofs */}
      <SectionShell
        eyebrow="合规与信任"
        title="为什么专业机构选择 FactFlow"
        description="法律是一项严肃的工作。我们深知机构用户的底线，系统从架构上避免了泛 AI 产品的合规与黑盒风险。"
      >
        <div className="card-grid">
          {trustProofs.map((item) => (
            <article key={item.title} className="panel feature-card">
              <span className="card-eyebrow">{item.badge}</span>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </SectionShell>

      {/* Interactive Module: Fact Matrix */}
      <SectionShell
        title="结构化事实矩阵"
        description="系统不输出聊天对话，而是输出一张经得起交叉质证的事实表。所有提取结论自动关联原始材料证据链。"
      >
        <FactMatrix />
      </SectionShell>
      
      {/* Interactive Module: Rule Traceability */}
      <SectionShell
        title="规则触发与逻辑溯源"
        description="所有辅助决策都基于可见的规则引擎触发。系统明确定位风险与证据缺口，不越界替代裁判。"
      >
        <RuleTraceability />
      </SectionShell>

      {/* Layered Solutions */}
      <SectionShell
        eyebrow="分层场景"
        title="统一分析内核，匹配不同视角的业务视图"
        description="无论是当事人引导录入，还是专业人员的深度核卷，FactFlow 都提供了最适宜的结构层。"
      >
        <div className="card-grid">
          {homepageFeatures.map((item) => (
            <article key={item.title} className="panel feature-card">
              <span className="card-eyebrow">{item.eyebrow}</span>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </SectionShell>

      {/* Methodology Steps */}
      <SectionShell
        eyebrow="工作方法论"
        title="从散乱叙述到清晰判断"
        description="严谨的案卷梳理和法律逻辑建模，让争议解决的过程透明、有序。"
      >
        <div className="step-grid">
          {methodologySteps.map((step) => (
            <article key={step.index} className="panel step-card">
              <span className="step-index">{step.index}</span>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </article>
          ))}
        </div>
      </SectionShell>

    </div>
  );
}
