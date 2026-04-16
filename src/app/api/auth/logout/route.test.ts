import { describe, expect, it } from "vitest";

import { POST } from "./route";

describe("POST /api/auth/logout", () => {
  it("prefers the public origin header instead of the internal request url", async () => {
    const response = await POST(
      new Request("http://localhost:10000/api/auth/logout", {
        method: "POST",
        headers: {
          origin: "https://factflow-ai-demo.onrender.com",
          referer: "https://factflow-ai-demo.onrender.com/workspace/loan-case-3/facts",
        },
      }),
    );

    expect(response.status).toBe(303);
    expect(response.headers.get("location")).toBe("https://factflow-ai-demo.onrender.com/");
  });

  it("falls back to the referer header when origin is unavailable", async () => {
    const response = await POST(
      new Request("http://localhost:10000/api/auth/logout", {
        method: "POST",
        headers: {
          referer: "https://factflow-ai-demo.onrender.com/workspace/loan-case-3/facts",
        },
      }),
    );

    expect(response.status).toBe(303);
    expect(response.headers.get("location")).toBe("https://factflow-ai-demo.onrender.com/");
  });
});
