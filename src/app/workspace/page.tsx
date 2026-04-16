import Link from "next/link";

import { createWorkspaceCaseAction } from "../../lib/auth-server-actions";
import { requireSession } from "../../lib/auth-session";
import { listWorkspaceCases } from "../../lib/demo-repository";

export default async function WorkspaceIndexPage() {
  const session = await requireSession();
  const cases = await listWorkspaceCases(session.userId);

  return (
    <div className="site-container page-stack workspace-stack">
      <section className="workspace-hero panel">
        <div className="workspace-hero-copy">
          <span className="section-eyebrow">系统 MVP</span>
          <h1>{session.role === "resident" ? "我的案件工作区" : "专业案件工作区"}</h1>
          <p>
            {session.role === "resident"
              ? "从这里进入事实确认、结果页和类案详情闭环。"
              : "从这里进入专业分析、结果页和类案详情闭环。"}
          </p>
        </div>
      </section>

      <section className="workspace-panel panel workspace-case-list">
        <div className="workspace-panel-head">
          <div>
            <span className="section-eyebrow">案件清单</span>
            <h2>{cases.length > 0 ? "当前案件" : "当前暂无案件"}</h2>
          </div>
          <form action={createWorkspaceCaseAction} className="workspace-create-case-form">
            <input
              aria-label="新建案件标题"
              className="workspace-field-control"
              defaultValue={`${session.displayName}的案件`}
              name="title"
              placeholder="请输入案件标题"
              type="text"
            />
            <button className="button button-primary" type="submit">
              新建案件
            </button>
          </form>
        </div>

        <div className="document-list">
          {cases.map((item) => (
            <article key={item.id} className="document-row">
              <div>
                <strong>{item.title}</strong>
                <p>{item.caseType} · {item.disputePattern}</p>
              </div>
              <div className="document-row-meta">
                <span className="badge badge-warning">{item.stage}</span>
                <Link href={`/workspace/${item.id}/facts`} className="button button-primary">
                  进入工作区
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
