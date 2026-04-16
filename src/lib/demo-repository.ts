import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import type { Step } from "./site";

import { buildWorkspaceAnalysis } from "./analysis";
import { privateLoanFieldSchema } from "./private-loan-schema";
import type { CaseOwner, OwnedWorkspaceRecord } from "./workspace-ownership";

export type FactStatus = "已确认" | "待核实" | "存在冲突" | "证据不足";
export type SourceType = "材料抽取" | "用户确认" | "系统归一" | "人工标注";
export type RuleSeverity = "high" | "medium" | "low";
export type ReferenceLevel = "可直接参照" | "需限缩参照" | "仅作背景参考";

export type CaseWorkspaceSummary = {
  id: string;
  title: string;
  caseType: string;
  stage: string;
  updatedAt: string;
  riskLevel: "高" | "中" | "低";
  disputePattern: string;
};

export type FactOption = {
  value: string;
  label: string;
};

export type FactField = {
  id: string;
  groupCode: "A" | "B" | "C" | "D" | "E" | "F";
  groupLabel: string;
  label: string;
  prompt: string;
  inputType: "text" | "textarea" | "single-select" | "number" | "date";
  options?: FactOption[];
  ruleTag: string;
  required: boolean;
  value: string;
  status: FactStatus;
  sourceType: SourceType;
  sourcePosition: string;
  evidenceStrength: "强" | "中" | "弱";
  helpText: string;
  isKeyField: boolean;
};

export type RuleHit = {
  id: string;
  title: string;
  severity: RuleSeverity;
  message: string;
  legalBasis: string;
  because: string[];
};

export type PrecedentRecommendation = {
  matchingFactTags: string[];
  matchedIssueStructures: string[];
  keyDifferenceHints: string[];
};

export type Precedent = {
  id: string;
  title: string;
  disputePattern: string;
  courtLevel: string;
  referenceLevel: ReferenceLevel;
  score: number;
  similarities: string[];
  differences: string[];
  differenceImpact: string[];
  judgment: string;
  coreFacts: string[];
  reasoningSummary: string[];
  recommendation: PrecedentRecommendation;
};

export type RecommendationBasis = {
  precedentId: string;
  reasons: string[];
};

export type PreliminaryJudgment = {
  label: string;
  summary: string;
};

export type WorkspaceAnalysis = {
  disputePattern: string;
  analysisStatus: string;
  riskLevel: "高" | "中" | "低";
  strengths: string[];
  weaknesses: string[];
  evidenceGaps: string[];
  actionSuggestions: string[];
  ruleHits: RuleHit[];
  preliminaryJudgment: PreliminaryJudgment;
  coreIssues: string[];
  riskHints: string[];
  similarCases: Precedent[];
  recommendationBasis: RecommendationBasis[];
};

export type WorkspaceRecord = {
  summary: CaseWorkspaceSummary;
  steps: Step[];
  facts: FactField[];
  analysis: WorkspaceAnalysis;
  precedents: Precedent[];
};

type OwnedWorkspaceStore = Record<string, OwnedWorkspaceRecord>;

type CreateWorkspaceInput = {
  owner: CaseOwner;
  title: string;
};

type FactUpdateInput = {
  factId: string;
  status?: FactStatus;
  value?: string;
};

const WORKSPACE_STORE_PATH = path.join(process.cwd(), ".data", "workspace-records.json");

const defaultCaseOwner: CaseOwner = {
  userId: "user_resident_demo",
  displayName: "张三",
  role: "resident",
};

const workspaceSteps: Step[] = [
  {
    index: "01",
    title: "事实确认",
    description: "按 A-F 六组核对借贷事实与证据状态",
  },
  {
    index: "02",
    title: "结果页",
    description: "汇总初步判断、争点、风险与相似案件推荐",
  },
  {
    index: "03",
    title: "类案详情",
    description: "查看单个类案的核心事实、裁判理由与推荐依据",
  },
];

const workspaceFacts: FactField[] = privateLoanFieldSchema;

const workspacePrecedents: Precedent[] = [
  {
    id: "precedent-zhou-yang",
    title: "周某1与杨某某民间借贷纠纷二审民事判决书",
    disputePattern: "还款抗辩 + 多笔借还款混同",
    courtLevel: "二审",
    referenceLevel: "可直接参照",
    score: 89,
    similarities: ["存在书面借条与还款计划", "存在还款抗辩", "还款对应关系不清"],
    differences: ["部分现金交付未被支持", "结算性利息被限缩处理"],
    differenceImpact: ["影响本金数额认定", "影响可参照强度与风险等级"],
    judgment: "部分改判，确认尚欠借款本金并支持逾期利息。",
    coreFacts: ["存在书面借条", "存在转账记录", "被告提出还款抗辩"],
    reasoningSummary: ["法院重点审查借贷合意与还款映射关系。", "对不能对应的还款主张未直接支持。"],
    recommendation: {
      matchingFactTags: ["LOAN_INTENT_WRITING", "FUND_DELIVERY_TRANSFER", "REPAYMENT_DEFENSE"],
      matchedIssueStructures: ["借贷关系成立", "还款抗辩审查"],
      keyDifferenceHints: ["现金交付部分支持度较弱", "利息处理需限缩比对"],
    },
  },
  {
    id: "precedent-cao-long",
    title: "曹某某与黄某某、龙某某民间借贷纠纷二审民事判决书",
    disputePattern: "共同债务争议 + 利息抵本",
    courtLevel: "二审",
    referenceLevel: "需限缩参照",
    score: 71,
    similarities: ["涉及责任扩展判断", "存在长期利息与本金争议"],
    differences: ["争议重心在夫妻共同债务而非还款对应关系", "配偶责任最终未获支持"],
    differenceImpact: ["适合提醒共同债务举证门槛", "不宜直接替代本案的还款抗辩分析"],
    judgment: "改判由实际借款人单独偿还本息，驳回对配偶的责任主张。",
    coreFacts: ["存在配偶责任争议", "长期利息与本金计算存在冲突"],
    reasoningSummary: ["法院未认可配偶共同债务。", "裁判理由集中在责任范围与利息处理。"],
    recommendation: {
      matchingFactTags: ["PARTY_RELATION", "RISK_SCREENING"],
      matchedIssueStructures: ["责任扩展审查", "利息与本金争议"],
      keyDifferenceHints: ["不适合替代还款抗辩路径", "更适合作为责任扩展提醒"],
    },
  },
];

const workspaceSummary: CaseWorkspaceSummary = {
  id: "loan-case-001",
  title: "杨某某诉周某1民间借贷纠纷",
  caseType: "民间借贷纠纷",
  stage: "事实确认中",
  updatedAt: "2026-04-16 22:00",
  riskLevel: "中",
  disputePattern: "还款抗辩型借贷纠纷",
};

const workspaceAnalysis = buildWorkspaceAnalysis(workspaceFacts, workspacePrecedents);

const workspaceRecords: Record<string, OwnedWorkspaceRecord> = {
  [workspaceSummary.id]: {
    owner: defaultCaseOwner,
    summary: {
      ...workspaceSummary,
      riskLevel: workspaceAnalysis.riskLevel,
      disputePattern: workspaceAnalysis.disputePattern,
    },
    steps: workspaceSteps,
    facts: workspaceFacts,
    analysis: workspaceAnalysis,
    precedents: workspacePrecedents,
  },
};

function cloneCaseOwner(owner: CaseOwner): CaseOwner {
  return {
    userId: owner.userId,
    displayName: owner.displayName,
    role: owner.role,
  };
}

function buildDefaultOwnedRecord(owner: CaseOwner, input?: Partial<CaseWorkspaceSummary>): OwnedWorkspaceRecord {
  const baseFacts = privateLoanFieldSchema.map((fact) => ({ ...fact, options: fact.options ? [...fact.options] : undefined }));
  const basePrecedents = workspacePrecedents.map((precedent) => ({
    ...precedent,
    similarities: [...precedent.similarities],
    differences: [...precedent.differences],
    differenceImpact: [...precedent.differenceImpact],
    coreFacts: [...precedent.coreFacts],
    reasoningSummary: [...precedent.reasoningSummary],
    recommendation: {
      matchingFactTags: [...precedent.recommendation.matchingFactTags],
      matchedIssueStructures: [...precedent.recommendation.matchedIssueStructures],
      keyDifferenceHints: [...precedent.recommendation.keyDifferenceHints],
    },
  }));
  const analysis = buildWorkspaceAnalysis(baseFacts, basePrecedents);
  const summary: CaseWorkspaceSummary = {
    id: input?.id ?? workspaceSummary.id,
    title: input?.title ?? workspaceSummary.title,
    caseType: input?.caseType ?? workspaceSummary.caseType,
    stage: input?.stage ?? workspaceSummary.stage,
    updatedAt: input?.updatedAt ?? workspaceSummary.updatedAt,
    riskLevel: analysis.riskLevel,
    disputePattern: analysis.disputePattern,
  };

  return {
    owner: cloneCaseOwner(owner),
    summary,
    steps: workspaceSteps.map((step) => ({ ...step })),
    facts: baseFacts,
    analysis,
    precedents: basePrecedents,
  };
}

function cloneWorkspaceRecord(record: OwnedWorkspaceRecord): OwnedWorkspaceRecord {
  return {
    owner: cloneCaseOwner(record.owner),
    summary: { ...record.summary },
    steps: record.steps.map((step) => ({ ...step })),
    facts: record.facts.map((fact) => ({ ...fact, options: fact.options ? [...fact.options] : undefined })),
    analysis: {
      ...record.analysis,
      strengths: [...record.analysis.strengths],
      weaknesses: [...record.analysis.weaknesses],
      evidenceGaps: [...record.analysis.evidenceGaps],
      actionSuggestions: [...record.analysis.actionSuggestions],
      ruleHits: record.analysis.ruleHits.map((rule) => ({ ...rule, because: [...rule.because] })),
      preliminaryJudgment: { ...record.analysis.preliminaryJudgment },
      coreIssues: [...record.analysis.coreIssues],
      riskHints: [...record.analysis.riskHints],
      similarCases: record.analysis.similarCases.map((precedent) => ({
        ...precedent,
        similarities: [...precedent.similarities],
        differences: [...precedent.differences],
        differenceImpact: [...precedent.differenceImpact],
        coreFacts: [...precedent.coreFacts],
        reasoningSummary: [...precedent.reasoningSummary],
        recommendation: {
          matchingFactTags: [...precedent.recommendation.matchingFactTags],
          matchedIssueStructures: [...precedent.recommendation.matchedIssueStructures],
          keyDifferenceHints: [...precedent.recommendation.keyDifferenceHints],
        },
      })),
      recommendationBasis: record.analysis.recommendationBasis.map((entry) => ({
        precedentId: entry.precedentId,
        reasons: [...entry.reasons],
      })),
    },
    precedents: record.precedents.map((precedent) => ({
      ...precedent,
      similarities: [...precedent.similarities],
      differences: [...precedent.differences],
      differenceImpact: [...precedent.differenceImpact],
      coreFacts: [...precedent.coreFacts],
      reasoningSummary: [...precedent.reasoningSummary],
      recommendation: {
        matchingFactTags: [...precedent.recommendation.matchingFactTags],
        matchedIssueStructures: [...precedent.recommendation.matchedIssueStructures],
        keyDifferenceHints: [...precedent.recommendation.keyDifferenceHints],
      },
    })),
  };
}

function toWorkspaceRecord(record: OwnedWorkspaceRecord): WorkspaceRecord {
  return {
    summary: { ...record.summary },
    steps: record.steps.map((step) => ({ ...step })),
    facts: record.facts.map((fact) => ({ ...fact, options: fact.options ? [...fact.options] : undefined })),
    analysis: {
      ...record.analysis,
      strengths: [...record.analysis.strengths],
      weaknesses: [...record.analysis.weaknesses],
      evidenceGaps: [...record.analysis.evidenceGaps],
      actionSuggestions: [...record.analysis.actionSuggestions],
      ruleHits: record.analysis.ruleHits.map((rule) => ({ ...rule, because: [...rule.because] })),
      preliminaryJudgment: { ...record.analysis.preliminaryJudgment },
      coreIssues: [...record.analysis.coreIssues],
      riskHints: [...record.analysis.riskHints],
      similarCases: record.analysis.similarCases.map((precedent) => ({
        ...precedent,
        similarities: [...precedent.similarities],
        differences: [...precedent.differences],
        differenceImpact: [...precedent.differenceImpact],
        coreFacts: [...precedent.coreFacts],
        reasoningSummary: [...precedent.reasoningSummary],
        recommendation: {
          matchingFactTags: [...precedent.recommendation.matchingFactTags],
          matchedIssueStructures: [...precedent.recommendation.matchedIssueStructures],
          keyDifferenceHints: [...precedent.recommendation.keyDifferenceHints],
        },
      })),
      recommendationBasis: record.analysis.recommendationBasis.map((entry) => ({
        precedentId: entry.precedentId,
        reasons: [...entry.reasons],
      })),
    },
    precedents: record.precedents.map((precedent) => ({
      ...precedent,
      similarities: [...precedent.similarities],
      differences: [...precedent.differences],
      differenceImpact: [...precedent.differenceImpact],
      coreFacts: [...precedent.coreFacts],
      reasoningSummary: [...precedent.reasoningSummary],
      recommendation: {
        matchingFactTags: [...precedent.recommendation.matchingFactTags],
        matchedIssueStructures: [...precedent.recommendation.matchedIssueStructures],
        keyDifferenceHints: [...precedent.recommendation.keyDifferenceHints],
      },
    })),
  };
}

function sanitizeOwnedWorkspaceRecord(record: OwnedWorkspaceRecord): OwnedWorkspaceRecord {
  return {
    owner: cloneCaseOwner(record.owner),
    summary: { ...record.summary },
    steps: record.steps.map((step) => ({ ...step })),
    facts: record.facts.map((fact) => ({ ...fact, options: fact.options ? [...fact.options] : undefined })),
    analysis: buildWorkspaceAnalysis(
      record.facts.map((fact) => ({ ...fact, options: fact.options ? [...fact.options] : undefined })),
      record.precedents.map((precedent) => ({
        ...precedent,
        similarities: [...precedent.similarities],
        differences: [...precedent.differences],
        differenceImpact: [...precedent.differenceImpact],
        coreFacts: [...precedent.coreFacts],
        reasoningSummary: [...precedent.reasoningSummary],
        recommendation: {
          matchingFactTags: [...precedent.recommendation.matchingFactTags],
          matchedIssueStructures: [...precedent.recommendation.matchedIssueStructures],
          keyDifferenceHints: [...precedent.recommendation.keyDifferenceHints],
        },
      })),
    ),
    precedents: record.precedents.map((precedent) => ({
      ...precedent,
      similarities: [...precedent.similarities],
      differences: [...precedent.differences],
      differenceImpact: [...precedent.differenceImpact],
      coreFacts: [...precedent.coreFacts],
      reasoningSummary: [...precedent.reasoningSummary],
      recommendation: {
        matchingFactTags: [...precedent.recommendation.matchingFactTags],
        matchedIssueStructures: [...precedent.recommendation.matchedIssueStructures],
        keyDifferenceHints: [...precedent.recommendation.keyDifferenceHints],
      },
    })),
  };
}

function getOwnedWorkspaceRecord(records: OwnedWorkspaceStore, caseId: string, ownerUserId?: string): OwnedWorkspaceRecord | null {
  const record = records[caseId];

  if (!record) {
    return null;
  }

  if (ownerUserId && record.owner.userId !== ownerUserId) {
    return null;
  }

  return record;
}

async function readWorkspaceStore(): Promise<Record<string, OwnedWorkspaceRecord>> {
  try {
    const raw = await readFile(WORKSPACE_STORE_PATH, "utf8");
    const parsed = JSON.parse(raw) as Record<string, OwnedWorkspaceRecord>;

    return Object.fromEntries(
      Object.entries(parsed).map(([key, value]) => [key, sanitizeOwnedWorkspaceRecord(value)]),
    );
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return Object.fromEntries(
        Object.entries(workspaceRecords).map(([key, value]) => [key, cloneWorkspaceRecord(value)]),
      );
    }

    throw error;
  }
}

async function writeWorkspaceStore(records: Record<string, OwnedWorkspaceRecord>) {
  await mkdir(path.dirname(WORKSPACE_STORE_PATH), { recursive: true });
  await writeFile(WORKSPACE_STORE_PATH, JSON.stringify(records), "utf8");
}


export function createDemoWorkspaceRepository() {
  let records: OwnedWorkspaceStore = Object.fromEntries(
    Object.entries(workspaceRecords).map(([key, value]) => [key, cloneWorkspaceRecord(value)]),
  );
  let initialized = false;

  async function ensureRecordsLoaded() {
    if (initialized) {
      return;
    }

    records = await readWorkspaceStore();
    initialized = true;
  }

  async function persistRecords(nextRecords: OwnedWorkspaceStore) {
    await writeWorkspaceStore(nextRecords);
    records = nextRecords;
  }

  return {
    async getCase(caseId: string, ownerUserId?: string) {
      await ensureRecordsLoaded();
      const record = getOwnedWorkspaceRecord(records, caseId, ownerUserId);
      return record ? toWorkspaceRecord(record) : null;
    },
    async createCase(input: CreateWorkspaceInput) {
      await ensureRecordsLoaded();
      const nextId = `loan-case-${Object.keys(records).length + 1}`;
      const nextRecord = buildDefaultOwnedRecord(input.owner, {
        id: nextId,
        title: input.title,
        stage: "事实确认中",
        updatedAt: new Date().toISOString(),
      });
      const nextRecords = {
        ...records,
        [nextId]: cloneWorkspaceRecord(nextRecord),
      };
      await persistRecords(nextRecords);
      return toWorkspaceRecord(nextRecord);
    },
    async updateFacts(caseId: string, updates: FactUpdateInput[], ownerUserId?: string) {
      await ensureRecordsLoaded();
      const current = getOwnedWorkspaceRecord(records, caseId, ownerUserId);

      if (!current) {
        return null;
      }

      const nextFacts = current.facts.map((fact) => {
        const update = updates.find((item) => item.factId === fact.id);

        return update
          ? {
              ...fact,
              status: update.status ?? fact.status,
              value: update.value ?? fact.value,
            }
          : { ...fact };
      });
      const nextAnalysis = buildWorkspaceAnalysis(nextFacts, current.precedents);
      const nextRecord: OwnedWorkspaceRecord = {
        ...current,
        facts: nextFacts,
        analysis: nextAnalysis,
        summary: {
          ...current.summary,
          updatedAt: new Date().toISOString(),
          riskLevel: nextAnalysis.riskLevel,
          disputePattern: nextAnalysis.disputePattern,
        },
      };

      const nextRecords = {
        ...records,
        [current.summary.id]: cloneWorkspaceRecord(nextRecord),
      };
      await persistRecords(nextRecords);
      return toWorkspaceRecord(nextRecord);
    },
    async saveAnalysisResult(caseId: string, analysis: WorkspaceAnalysis, ownerUserId?: string) {
      await ensureRecordsLoaded();
      const current = getOwnedWorkspaceRecord(records, caseId, ownerUserId);

      if (!current) {
        return null;
      }

      const nextRecord: OwnedWorkspaceRecord = {
        ...current,
        analysis: {
          ...analysis,
          strengths: [...analysis.strengths],
          weaknesses: [...analysis.weaknesses],
          evidenceGaps: [...analysis.evidenceGaps],
          actionSuggestions: [...analysis.actionSuggestions],
          ruleHits: analysis.ruleHits.map((rule) => ({ ...rule, because: [...rule.because] })),
          preliminaryJudgment: { ...analysis.preliminaryJudgment },
          coreIssues: [...analysis.coreIssues],
          riskHints: [...analysis.riskHints],
          similarCases: analysis.similarCases.map((precedent) => ({
            ...precedent,
            similarities: [...precedent.similarities],
            differences: [...precedent.differences],
            differenceImpact: [...precedent.differenceImpact],
            coreFacts: [...precedent.coreFacts],
            reasoningSummary: [...precedent.reasoningSummary],
            recommendation: {
              matchingFactTags: [...precedent.recommendation.matchingFactTags],
              matchedIssueStructures: [...precedent.recommendation.matchedIssueStructures],
              keyDifferenceHints: [...precedent.recommendation.keyDifferenceHints],
            },
          })),
          recommendationBasis: analysis.recommendationBasis.map((entry) => ({
            precedentId: entry.precedentId,
            reasons: [...entry.reasons],
          })),
        },
      };

      const nextRecords = {
        ...records,
        [current.summary.id]: cloneWorkspaceRecord(nextRecord),
      };
      await persistRecords(nextRecords);
      return toWorkspaceRecord(nextRecord);
    },
  };
}

const defaultWorkspaceRepository = createDemoWorkspaceRepository();

export function listWorkspaceCasesSync(): CaseWorkspaceSummary[] {
  return Object.values(workspaceRecords).map((record) => ({ ...record.summary }));
}

export function getWorkspaceRecordSync(caseId: string): WorkspaceRecord {
  const record = workspaceRecords[caseId] ?? workspaceRecords[workspaceSummary.id];
  return toWorkspaceRecord(record);
}

export async function listWorkspaceCases(ownerUserId?: string): Promise<CaseWorkspaceSummary[]> {
  const records = await readWorkspaceStore();
  return Object.values(records)
    .filter((record) => (ownerUserId ? record.owner.userId === ownerUserId : true))
    .map((record) => ({ ...record.summary }));
}

export async function getWorkspaceRecord(caseId: string, ownerUserId?: string): Promise<WorkspaceRecord | null> {
  return defaultWorkspaceRepository.getCase(caseId, ownerUserId);
}
