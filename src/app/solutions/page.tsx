import { SectionShell } from "@/components/site/section-shell";
import { homepageFeatures } from "@/lib/site";
import Link from "next/link";

const solutionGroups = [
  {
    id: "judicial",
    title: "司法与专业使用者",
    audience: "法院、调解组织、律所",
    description: "通过高密度案卷核对与结构化差异比对，将复杂的证据材料转化为可用于文书说理的严谨分析。",
    benefits: [
      "基于 A-F 六组标准表单的事实归一",
      "案件冲突点与证据缺口红绿灯预警",
      "类案差异下钻比对与推荐权重解析",
    ],
    ctaText: "查看专业工作台视图",
  },
  {
    id: "institution",
    title: "机构合作方",
    audience: "SaaS 平台、数字政务、金融机构",
    description: "通过标准化 API 与私有化部署，为业务系统注入透明、可溯源的民间借贷案件分析能力。",
    benefits: [
      "100% 私有化容器隔离部署支持",
      "全链路分析过程（不使用大模型预测裁判）",
      "符合保密规范的分析报告生成与导出",
    ],
    ctaText: "获取机构合作方案",
  },
  {
    id: "public",
    title: "公众与服务入口",
    audience: "当事人、案件初步咨询者",
    description: "提供极低门槛的案情梳理导航，帮助非法律专业人士在起诉或应诉前厘清争议焦点与证明责任。",
    benefits: [
      "自然语言转化为结构化要素",
      "虚假诉讼及其他法律关系混同风险筛查",
      "可直接分享给代理律师的案件分析快照",
    ],
    ctaText: "体验案件结构化梳理",
  },
];

const groupIcons = [
  <svg key="0" xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-scale"><path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="M7 21h10"/><path d="M12 3v18"/><path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2"/></svg>,
  <svg key="1" xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-building-2"><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/><path d="M10 6h4"/><path d="M10 10h4"/><path d="M10 14h4"/><path d="M10 18h4"/></svg>,
  <svg key="2" xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-users"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
];

export const metadata = {
  title: "核心能力与分层场景",
};

export default function SolutionsPage() {
  return (
    <div className="site-container page-stack">
      {/* Hero Section */}
      <section className="hero-shell">
        <div className="hero-copy">
          <span className="hero-kicker">Solutions</span>
          <h1>统一分析内核，匹配不同视角的业务视图。</h1>
          <p>
            FactFlow AI 为多类受众提供标准化的事实处理能力。无论是当事人初次录入，还是专业人员深度阅卷，底层皆为统一的结构化规则。
          </p>
        </div>
        <div className="hero-aside">
          {/* Concept diagram of core layering */}
          <div className="dossier-mockup solution-graphic">
            <div className="sg-layer sg-layer-top">
              <span className="sg-label">展示层 (Views)</span>
              <div className="sg-pills">
                <span className="badge badge-success">专业工作台</span>
                <span className="badge badge-warning">引导表单</span>
              </div>
            </div>
            <div className="sg-layer sg-layer-mid">
              <span className="sg-label">引擎层 (Engines)</span>
              <div className="sg-pills">
                <span className="badge">R1-R20 规则树</span>
                <span className="badge">核心争点聚合</span>
              </div>
            </div>
            <div className="sg-layer sg-layer-bottom">
              <span className="sg-label">数据层 (Data)</span>
              <div className="sg-pills">
                <span className="badge">A-F 事实矩阵</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Role-based Breakdown */}
      <SectionShell
        eyebrow="角色拆解"
        title="不同身份，一致的严谨性"
        description="我们在统一的民间借贷事实表单与规则树之上，针对三种不同的应用场景，封装了开箱即用的交付方案。"
      >
        <div className="solution-split">
          {solutionGroups.map((item, idx) => (
            <article key={item.id} className="panel solution-card">
              <div className="sc-header">
                <div className="sc-icon">{groupIcons[idx]}</div>
                <div className="sc-title-group">
                  <h3>{item.title}</h3>
                  <span className="sc-audience">面向：{item.audience}</span>
                </div>
              </div>
              <div className="sc-body">
                <p className="sc-desc">{item.description}</p>
                <ul className="sc-benefits">
                  {item.benefits.map((b, i) => (
                    <li key={i}>{b}</li>
                  ))}
                </ul>
              </div>
              <div className="sc-footer">
                <Link href="/workspace" className="sc-link">
                  {item.ctaText} <span className="sc-arrow">→</span>
                </Link>
              </div>
            </article>
          ))}
        </div>
      </SectionShell>
      
      {/* Capability Deep Dive based on homepageFeatures */}
      <SectionShell
        eyebrow="核心能力映射"
        title="从需求到功能落地的直接支撑"
        description="方案中的每一个场景，都有确切的产品模块为其提供功能实现。"
      >
        <div className="metric-grid">
          {homepageFeatures.map((item) => (
             <article key={item.title} className="metric-card panel">
               <span>{item.eyebrow}</span>
               <strong>{item.title}</strong>
               <p>{item.description}</p>
             </article>
          ))}
        </div>
      </SectionShell>

    </div>
  );
}
