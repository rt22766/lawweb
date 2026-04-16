import { NextResponse } from 'next/server';

import { getCurrentSession } from '@/lib/auth-session';
import { createDemoWorkspaceRepository } from '@/lib/demo-repository';

const repository = createDemoWorkspaceRepository();

type UpdatePayload = {
  updates?: Array<{
    factId: string;
    status?: '已确认' | '待核实' | '存在冲突' | '证据不足';
    value?: string;
  }>;
};

type RouteContext = {
  params: Promise<{ caseId: string }>;
};

export async function POST(request: Request, context: RouteContext) {
  const session = await getCurrentSession();

  if (!session) {
    return NextResponse.json({ success: false, error: '请先登录' }, { status: 401 });
  }

  const { caseId } = await context.params;
  const payload = (await request.json()) as UpdatePayload;

  if (!payload.updates || payload.updates.length === 0) {
    return NextResponse.json({ success: false, error: '缺少更新内容' }, { status: 400 });
  }

  const currentRecord = await repository.getCase(caseId, session.userId);
  if (!currentRecord) {
    return NextResponse.json({ success: false, error: '案件不存在或无权访问' }, { status: 404 });
  }

  const record = await repository.updateFacts(caseId, payload.updates, session.userId);
  if (!record) {
    return NextResponse.json({ success: false, error: '案件不存在或无权访问' }, { status: 404 });
  }

  return NextResponse.json({ success: true, data: record });
}
