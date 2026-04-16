import { mkdtemp, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const originalCwd = process.cwd();

describe("createDemoWorkspaceRepository", () => {
  let tempDir: string;

  beforeEach(async () => {
    tempDir = await mkdtemp(path.join(os.tmpdir(), "factflow-workspace-"));
    process.chdir(tempDir);
  });

  afterEach(async () => {
    process.chdir(originalCwd);
    await rm(tempDir, { recursive: true, force: true });
  });

  it("returns the latest facts even when another repository instance updated the case", async () => {
    vi.resetModules();
    const { createDemoWorkspaceRepository } = await import("./demo-repository");
    const owner = {
      userId: "user-test-resident",
      displayName: "测试用户",
      role: "resident" as const,
    };
    const creatorRepository = createDemoWorkspaceRepository();
    const staleReaderRepository = createDemoWorkspaceRepository();
    const writerRepository = createDemoWorkspaceRepository();

    const createdCase = await creatorRepository.createCase({
      owner,
      title: "测试案件",
    });

    const initialRead = await staleReaderRepository.getCase(createdCase.summary.id, owner.userId);

    expect(initialRead?.facts.find((fact) => fact.id === "performance-timeline")?.value).toBe("timeline_partial");

    const updatedCase = await writerRepository.updateFacts(
      createdCase.summary.id,
      [
        {
          factId: "performance-timeline",
          value: "timeline_complete",
          status: "待核实",
        },
      ],
      owner.userId,
    );

    expect(updatedCase?.facts.find((fact) => fact.id === "performance-timeline")?.value).toBe("timeline_complete");

    const rereadCase = await staleReaderRepository.getCase(createdCase.summary.id, owner.userId);

    expect(rereadCase?.facts.find((fact) => fact.id === "performance-timeline")?.value).toBe("timeline_complete");
  });
});
