"use client";

import { useMemo, useState, useTransition } from "react";

import { buildWorkspaceAnalysis } from "../../lib/analysis";
import type { FactField, FactStatus, Precedent, WorkspaceAnalysis } from "../../lib/demo-repository";

const groupTitles: Record<FactField["groupCode"], string> = {
  A: "A 主体与关系事实",
  B: "B 借贷合意事实",
  C: "C 款项交付事实",
  D: "D 抗辩与争议事实",
  E: "E 履行与时间事实",
  F: "F 风险筛查事实",
};

type WorkspaceState = {
  facts: FactField[];
  analysis: WorkspaceAnalysis;
  errors: Record<string, string>;
};

type FactWorkspaceClientProps = {
  caseId: string;
  initialFacts: FactField[];
  initialAnalysis: WorkspaceAnalysis;
  precedents: Precedent[];
};

type FactUpdatePayload = {
  factId: string;
  status?: FactStatus;
  value?: string;
};

export function createInitialWorkspaceState(facts: FactField[], analysis: WorkspaceAnalysis): WorkspaceState {
  return {
    facts,
    analysis,
    errors: {},
  };
}

export function updateFactStatus(
  state: WorkspaceState,
  factId: string,
  nextStatus: FactStatus,
  precedents: Precedent[],
): WorkspaceState {
  const nextFacts = state.facts.map((fact) =>
    fact.id === factId
      ? {
          ...fact,
          status: nextStatus,
        }
      : fact,
  );

  return {
    ...state,
    facts: nextFacts,
    analysis: buildWorkspaceAnalysis(nextFacts, precedents),
  };
}

function updateFactValue(state: WorkspaceState, factId: string, nextValue: string, precedents: Precedent[]): WorkspaceState {
  const nextFacts = state.facts.map((fact) =>
    fact.id === factId
      ? {
          ...fact,
          value: nextValue,
        }
      : fact,
  );

  const { [factId]: removedError, ...restErrors } = state.errors;

  void removedError;

  return {
    ...state,
    facts: nextFacts,
    errors: restErrors,
    analysis: buildWorkspaceAnalysis(nextFacts, precedents),
  };
}

function validateFact(state: WorkspaceState, factId: string): WorkspaceState {
  const target = state.facts.find((fact) => fact.id === factId);
  if (!target || !target.required) {
    return state;
  }

  if (target.value.trim().length > 0) {
    const { [factId]: removedError, ...restErrors } = state.errors;
    void removedError;
    return {
      ...state,
      errors: restErrors,
    };
  }

  return {
    ...state,
    errors: {
      ...state.errors,
      [factId]: "该字段为必填项",
    },
  };
}

function renderInput(
  fact: FactField,
  value: string,
  error: string | undefined,
  onValueChange: (nextValue: string) => void,
  onBlur: () => void,
) {
  const commonProps = {
    id: fact.id,
    name: fact.id,
    value,
    onBlur,
    "aria-invalid": Boolean(error),
  };

  if (fact.inputType === "textarea") {
    return (
      <textarea
        {...commonProps}
        className="workspace-field-control workspace-textarea"
        onChange={(event) => onValueChange(event.target.value)}
        rows={4}
      />
    );
  }

  if (fact.inputType === "single-select") {
    return (
      <select
        {...commonProps}
        className="workspace-field-control"
        onChange={(event) => onValueChange(event.target.value)}
      >
        <option value="">请选择</option>
        {fact.options?.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    );
  }

  return (
    <input
      {...commonProps}
      className="workspace-field-control"
      onChange={(event) => onValueChange(event.target.value)}
      type={fact.inputType === "number" ? "number" : fact.inputType === "date" ? "date" : "text"}
    />
  );
}

export function FactWorkspaceClient({
  caseId,
  initialFacts,
  initialAnalysis,
  precedents,
}: FactWorkspaceClientProps) {
  const initialState = useMemo(() => createInitialWorkspaceState(initialFacts, initialAnalysis), [initialFacts, initialAnalysis]);
  const [state, setState] = useState<WorkspaceState>(initialState);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [isSaving, startTransition] = useTransition();

  async function persistFactChange(previousState: WorkspaceState, nextState: WorkspaceState, payload: FactUpdatePayload) {
    setSaveError(null);

    const response = await fetch(`/api/workspace/${caseId}/facts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        updates: [payload],
      }),
    });

    if (!response.ok) {
      const result = (await response.json().catch(() => null)) as { error?: string } | null;
      setState(previousState);
      setSaveError(result?.error ?? "保存失败，请稍后重试");
      return;
    }

    const result = (await response.json()) as {
      data?: {
        facts: FactField[];
        analysis: WorkspaceAnalysis;
      };
    };

    if (!result.data) {
      setState(previousState);
      setSaveError("保存失败，请稍后重试");
      return;
    }

    setState({
      ...nextState,
      facts: result.data.facts,
      analysis: result.data.analysis,
    });
  }

  const groupedFacts = useMemo(() => {
    const grouped = new Map<FactField["groupCode"], FactField[]>();

    state.facts.forEach((fact) => {
      const current = grouped.get(fact.groupCode) ?? [];
      grouped.set(fact.groupCode, [...current, fact]);
    });

    return Array.from(grouped.entries());
  }, [state.facts]);

  return (
    <section className="workspace-panel panel">
      <div className="workspace-panel-head">
        <div>
          <span className="section-eyebrow">事实确认</span>
          <h2>民间借贷正式结构化事实表单</h2>
        </div>
        <p>按 A-F 六组组织字段，并为每个字段保留稳定 ruleTag，供规则引擎使用。</p>
      </div>

      <div className="workspace-analysis-inline panel">
        <div>
          <strong>当前分析状态</strong>
          <p>{state.analysis.preliminaryJudgment.summary}</p>
          {saveError ? <p className="workspace-field-error">{saveError}</p> : null}
        </div>
        <div className="workspace-analysis-inline-meta">
          <span className="badge badge-warning">风险等级：{state.analysis.riskLevel}</span>
          <span className="badge badge-outline">{isSaving ? "正在保存" : "已同步到当前案件"}</span>
        </div>
      </div>

      <div className="workspace-group-stack">
        {groupedFacts.map(([groupCode, facts]) => (
          <section key={groupCode} className="workspace-group-section">
            <div className="workspace-group-header">
              <h3>{groupTitles[groupCode]}</h3>
            </div>

            <div className="workspace-fact-list">
              {facts.map((fact) => (
                <article key={fact.id} className="workspace-fact-row">
                  <div className="workspace-fact-main">
                    <div className="workspace-fact-meta">
                      <span className="badge">{fact.groupLabel}</span>
                      {fact.isKeyField ? <span className="badge badge-warning">关键字段</span> : null}
                      <span className="badge badge-outline">{fact.status}</span>
                      <span className="badge">{fact.inputType}</span>
                      {fact.required ? <span className="badge badge-outline">必填</span> : null}
                    </div>
                    <label className="workspace-field-label" htmlFor={fact.id}>
                      {fact.label}
                    </label>
                    <p>{fact.prompt}</p>
                    {renderInput(
                      fact,
                      fact.value,
                      state.errors[fact.id],
                      (nextValue) => {
                        const previousState = state;
                        const nextState = updateFactValue(state, fact.id, nextValue, precedents);
                        setState(nextState);
                        startTransition(async () => {
                          await persistFactChange(previousState, nextState, {
                            factId: fact.id,
                            value: nextValue,
                            status: nextState.facts.find((item) => item.id === fact.id)?.status ?? fact.status,
                          });
                        });
                      },
                      () => setState((current) => validateFact(current, fact.id)),
                    )}
                    {state.errors[fact.id] ? <p className="workspace-field-error">{state.errors[fact.id]}</p> : null}
                  </div>

                  <div className="workspace-fact-side">
                    <div>
                      <strong>ruleTag</strong>
                      <p>{fact.ruleTag}</p>
                    </div>
                    <div>
                      <strong>来源类型</strong>
                      <p>{fact.sourceType}</p>
                    </div>
                    <div>
                      <strong>定位</strong>
                      <p>{fact.sourcePosition}</p>
                    </div>
                    <div>
                      <strong>证据强度</strong>
                      <p>{fact.evidenceStrength}</p>
                    </div>
                    <div>
                      <strong>为什么重要</strong>
                      <p>{fact.helpText}</p>
                    </div>
                    <div>
                      <strong>更新状态</strong>
                      <div className="workspace-status-actions">
                        {(["已确认", "待核实", "存在冲突", "证据不足"] as FactStatus[]).map((status) => (
                          <button
                            key={status}
                            type="button"
                            className={status === fact.status ? "workspace-status-chip active" : "workspace-status-chip"}
                            onClick={() => {
                              const previousState = state;
                              const nextState = updateFactStatus(state, fact.id, status, precedents);
                              setState(nextState);
                              startTransition(async () => {
                                await persistFactChange(previousState, nextState, {
                                  factId: fact.id,
                                  status,
                                  value: nextState.facts.find((item) => item.id === fact.id)?.value ?? fact.value,
                                });
                              });
                            }}
                          >
                            {status}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        ))}
      </div>
    </section>
  );
}
