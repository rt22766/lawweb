import { SectionShell } from "../../components/site/section-shell";
import { methodologySteps, trustItems } from "../../lib/site";

export const metadata = {
  title: "方法论",
};

// Inline SVG icons for the steps to make it look pro max
const stepIcons = [
  <svg key="0" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-file-text"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/></svg>,
  <svg key="1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-layout-grid"><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/></svg>,
  <svg key="2" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-git-merge"><circle cx="18" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><path d="M6 21V9a9 9 0 0 0 9 9"/></svg>,
  <svg key="3" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-scale"><path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="M7 21h10"/><path d="M12 3v18"/><path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2"/></svg>
];

const trustIcons = [
  <svg key="0" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--brand)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  <svg key="1" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--brand)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>,
  <svg key="2" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--brand)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
];

export default function MethodologyPage() {
  return (
    <div className="site-container page-stack">
      {/* Hero Section */}
      <section className="hero-shell">
        <div className="hero-copy">
          <span className="hero-kicker">Methodology</span>
          <h1>把事实驱动、AI 辅助和规则解释拆成可理解的方法链路。</h1>
          <p>
            法律决策需要绝对的严谨与透明。FactFlow AI 的方法论建立在“重构事实链路”之上，摒弃黑盒模型，确保所有的风险提示、证据缺口和类案推荐都能被清晰溯源。
          </p>
        </div>
        <div className="hero-aside">
          {/* Custom graphic showing the pipeline conceptually */}
          <div className="dossier-mockup method-graphic">
            <div className="mg-node">
              <span className="mg-icon">📄</span>
              <div className="mg-text">
                <span className="mg-title">繁杂案卷与证据</span>
                <span className="mg-desc">非结构化自然语言材料</span>
              </div>
            </div>
            <div className="mg-connector" />
            <div className="mg-node mg-highlight">
              <span className="mg-icon">⚡</span>
              <div className="mg-text">
                <span className="mg-title">事实结构化抽取</span>
                <span className="mg-desc">AI大模型降维归一</span>
              </div>
            </div>
            <div className="mg-connector" />
            <div className="mg-node mg-brand">
              <span className="mg-icon">⚖️</span>
              <div className="mg-text">
                <span className="mg-title">民间借贷规则引擎</span>
                <span className="mg-desc">100%显式逻辑判断与预警</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Methodology Steps Timeline */}
      <SectionShell
        eyebrow="核心链路"
        title="透明可溯的四步工作流"
        description="我们将案件分析过程解构为四个独立而连贯的步骤。大语言模型专注于繁杂材料的降维，而最终的规则触达与法律判断完全基于领域专家构建的显式逻辑引擎。"
      >
        <div className="timeline-layout">
          {methodologySteps.map((step, idx) => (
            <article key={step.index} className="timeline-step">
              <div className="ts-connector-area">
                <div className="ts-icon-wrapper">
                  {stepIcons[idx]}
                </div>
                {idx < methodologySteps.length - 1 && <div className="ts-line" />}
              </div>
              <div className="ts-content panel">
                <span className="step-index">{step.index}</span>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </div>
            </article>
          ))}
        </div>
      </SectionShell>

      {/* Trust Items / Design Philosophy */}
      <SectionShell
        eyebrow="设计哲学"
        title="人机协同的边界与守则"
        description="我们坚信工具应当成为专业人员的杠杆，而非替代品。我们围绕信任与安全，为系统的每一个环节构建了严格的护栏。"
      >
        <div className="metric-grid">
          {trustItems.map((item, idx) => (
            <article key={item.title} className="trust-card panel">
              <div className="trust-icon">
                {trustIcons[idx]}
              </div>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </SectionShell>
    </div>
  );
}
