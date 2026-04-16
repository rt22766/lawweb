export type NavItem = {
  href: string;
  label: string;
};

export type Metric = {
  label: string;
  value: string;
  detail: string;
};

export type FeatureCard = {
  title: string;
  description: string;
  eyebrow: string;
};

export type Step = {
  index: string;
  title: string;
  description: string;
  href?: string;
};

export type TrustItem = {
  title: string;
  description: string;
};

export type TrustProof = {
  title: string;
  description: string;
  badge: string;
};

export const siteConfig = {
  name: "FactFlow AI",
  shortName: "FactFlow",
  description:
    "FactFlow AI 将复杂的借贷纠纷材料转化为结构化事实矩阵，结合规则与类案引擎，为司法裁判与争议解决提供高透明度的辅助决策支持。",
  url: "https://example.com",
  email: "cooperation@factflow.ai",
  nav: [
    { href: "/", label: "首页" },
    { href: "/workspace", label: "工作区" },
    { href: "/solutions", label: "核心能力" },
    { href: "/methodology", label: "方法论" },
    { href: "/login", label: "登录" },
    { href: "/register", label: "注册" },
  ] satisfies NavItem[],
};

export const homepageMetrics: Metric[] = [
  {
    label: "事实核查",
    value: "证据优先",
    detail: "摒弃大模型黑盒直出，每一项结论皆可精准溯源至原始材料。",
  },
  {
    label: "辅助决策",
    value: "逻辑可释",
    detail: "系统明确定位风险与证据缺口，规则透明，不越界替代人类裁判。",
  },
  {
    label: "类案参考",
    value: "结构比对",
    detail: "以争议框架和事实特征作为匹配锚点，而非单纯的文字检索。",
  },
];

export const trustProofs: TrustProof[] = [
  {
    badge: "拒绝黑盒",
    title: "规则与逻辑全透明",
    description: "我们不使用生成式 AI 直接预测判决结果。系统所有的风险提示和证据缺口，都通过可见的规则引擎进行推导，确保分析过程100%可解释。"
  },
  {
    badge: "专业协作",
    title: "事实驱动，人工复核",
    description: "设计为“人机协同”工作流。AI 仅负责繁杂材料的抽取、整理与归一化，最终的案件结论与法律判断始终交由专业裁判者核准。"
  },
  {
    badge: "数据合规",
    title: "私有化与合规部署",
    description: "支持法院、律所等机构在私有环境进行隔离部署，严格保障案卷数据的保密性，坚决不将其用作公有模型的语料训练。"
  }
];

export const homepageFeatures: FeatureCard[] = [
  {
    eyebrow: "法院与专业机构",
    title: "专业工作台视图",
    description:
      "高密度信息展示，呈现事实矩阵、规则溯源与类案差异对比，辅助快速阅卷与文书说理。",
  },
  {
    eyebrow: "居民与当事人",
    title: "引导式材料梳理",
    description:
      "低门槛录入，自动进行风险提示与证据缺口导航，帮助当事人理清争议焦点与证明责任。",
  },
  {
    eyebrow: "多方协同",
    title: "透明化分析快照",
    description:
      "生成可分享、可追溯的标准化案件分析报告，打通当事人、律师与法院的信息壁垒。",
  }
];

export const methodologySteps: Step[] = [
  {
    index: "01",
    title: "事实抽取与归一",
    description: "AI 解析繁杂的材料与陈述，提取金额、期限、利息、还款等核心事实元素。",
  },
  {
    index: "02",
    title: "构建事实矩阵",
    description: "通过结构化矩阵标注已确认事实、存在冲突点和证据缺口，形成案卷骨架。",
  },
  {
    index: "03",
    title: "规则追踪与预警",
    description: "基于确定的事实链路触发专业规则库，清晰指出潜在的法律混同风险和行动建议。",
  },
  {
    index: "04",
    title: "类案差异比对",
    description: "对比同争议结构案件的裁判逻辑，拆解相似度构成，并提供限缩参照的专业建议。",
  },
];

export const trustItems: TrustItem[] = [
  {
    title: "专业语料与知识治理",
    description: "内建持续更新的争议模板与规则库，确保分析逻辑贴合司法实践与最新解释。",
  },
  {
    title: "严格数据边界",
    description: "大模型仅用于文本抽取与通俗化翻译，法律倾向性判断和优先级由显式规则引擎主导。",
  },
  {
    title: "企业级合规部署",
    description: "支持机构私有化部署与权限隔离，确保敏感案件数据不被用于外部模型训练。",
  },
];
