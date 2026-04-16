import type { FactOption, FactStatus, SourceType } from "@/lib/demo-repository";

export type FactInputType = "text" | "textarea" | "single-select" | "number" | "date";

export type PrivateLoanFieldSchema = {
  id: string;
  groupCode: "A" | "B" | "C" | "D" | "E" | "F";
  groupLabel: string;
  label: string;
  prompt: string;
  inputType: FactInputType;
  options?: FactOption[];
  ruleTag: string;
  required: boolean;
  sourceType: SourceType;
  status: FactStatus;
  sourcePosition: string;
  evidenceStrength: "强" | "中" | "弱";
  helpText: string;
  isKeyField: boolean;
  value: string;
};

export const privateLoanFieldSchema: PrivateLoanFieldSchema[] = [
  {
    id: "party-role-structure",
    groupCode: "A",
    groupLabel: "主体与关系事实",
    label: "借贷双方主体关系",
    prompt: "借款人与出借人之间是什么关系？是否存在配偶、亲属或关联人参与？",
    inputType: "single-select",
    options: [
      { value: "party_direct_only", label: "仅借款人与出借人直接参与" },
      { value: "party_related_involved", label: "存在配偶、亲属或关联人间接参与" },
      { value: "party_joint_liability_dispute", label: "存在共同借款或共同责任争议" },
    ],
    ruleTag: "PARTY_RELATION",
    required: true,
    sourceType: "用户确认",
    status: "待核实",
    sourcePosition: "当事人关系说明",
    evidenceStrength: "中",
    helpText: "主体结构影响后续责任认定与弱支持模块判断。",
    isKeyField: true,
    value: "party_related_involved",
  },
  {
    id: "loan-intent-evidence",
    groupCode: "B",
    groupLabel: "借贷合意事实",
    label: "是否存在借贷合意书面材料",
    prompt: "当前是否存在借条、借款合同、还款计划等足以证明借贷合意的材料？",
    inputType: "single-select",
    options: [
      { value: "writing_complete", label: "有明确书面材料" },
      { value: "writing_partial", label: "仅有部分材料" },
      { value: "writing_none", label: "暂无书面材料" },
    ],
    ruleTag: "LOAN_INTENT_WRITING",
    required: true,
    sourceType: "材料抽取",
    status: "已确认",
    sourcePosition: "借条影像 / 还款计划书 第1页",
    evidenceStrength: "强",
    helpText: "借贷合意是借款关系成立判断的核心入口。",
    isKeyField: true,
    value: "writing_complete",
  },
  {
    id: "fund-delivery-transfer",
    groupCode: "C",
    groupLabel: "款项交付事实",
    label: "是否存在转账交付记录",
    prompt: "是否存在银行、微信、支付宝等转账记录，能够证明款项实际交付？",
    inputType: "single-select",
    options: [
      { value: "transfer_complete", label: "有完整转账记录" },
      { value: "transfer_partial", label: "仅部分记录" },
      { value: "transfer_none", label: "没有转账记录" },
    ],
    ruleTag: "FUND_DELIVERY_TRANSFER",
    required: true,
    sourceType: "材料抽取",
    status: "已确认",
    sourcePosition: "银行流水凭证 / 微信转账记录",
    evidenceStrength: "强",
    helpText: "款项交付直接影响本金认定与举证责任动态转移。",
    isKeyField: true,
    value: "transfer_complete",
  },
  {
    id: "dispute-repayment-defense",
    groupCode: "D",
    groupLabel: "抗辩与争议事实",
    label: "是否存在还款抗辩",
    prompt: "对方是否主张已经全部或部分还款？现有记录是否能映射到具体借款？",
    inputType: "single-select",
    options: [
      { value: "repayment_none", label: "无明确还款抗辩" },
      { value: "repayment_mapped", label: "存在还款抗辩，但还款与借款可基本对应" },
      { value: "repayment_unmapped", label: "存在还款抗辩，但还款与各笔借款缺乏一一对应关系" },
    ],
    ruleTag: "REPAYMENT_DEFENSE",
    required: true,
    sourceType: "系统归一",
    status: "存在冲突",
    sourcePosition: "多笔还款时间线比对结果",
    evidenceStrength: "中",
    helpText: "还款抗辩是民间借贷规则树中高频风险触发点。",
    isKeyField: true,
    value: "repayment_unmapped",
  },
  {
    id: "performance-timeline",
    groupCode: "E",
    groupLabel: "履行与时间事实",
    label: "借款与还款时间线是否清晰",
    prompt: "借款发生时间、到期时间、还款时间线是否已经梳理清楚？",
    inputType: "single-select",
    options: [
      { value: "timeline_complete", label: "时间线已完整闭合" },
      { value: "timeline_partial", label: "时间线已初步整理，但部分还款节点仍需进一步对应" },
      { value: "timeline_missing", label: "时间线混乱，关键节点缺失" },
    ],
    ruleTag: "PERFORMANCE_TIMELINE",
    required: true,
    sourceType: "系统归一",
    status: "待核实",
    sourcePosition: "借还款时间线摘要",
    evidenceStrength: "中",
    helpText: "时间线清晰度决定结果页的争点与风险展示质量。",
    isKeyField: true,
    value: "timeline_partial",
  },
  {
    id: "risk-cash-delivery",
    groupCode: "F",
    groupLabel: "风险筛查事实",
    label: "是否存在大额现金交付或高风险情形",
    prompt: "是否存在大额现金交付、利息争议、其他法律关系混同等高风险事实？",
    inputType: "single-select",
    options: [
      { value: "risk_none", label: "未见明显高风险情形" },
      { value: "risk_cash_interest", label: "存在现金交付与利息争议，但相关证据仍不足" },
      { value: "risk_relationship_mixing", label: "存在其他法律关系混同或高风险往来" },
    ],
    ruleTag: "RISK_SCREENING",
    required: true,
    sourceType: "材料抽取",
    status: "证据不足",
    sourcePosition: "借条照片 / 现金交付截图 / 利息争议材料",
    evidenceStrength: "弱",
    helpText: "风险筛查用于输出证据缺口、虚假诉讼风险和行动建议。",
    isKeyField: true,
    value: "risk_cash_interest",
  },
];
