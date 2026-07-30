import assert from "node:assert/strict";
import { createServer } from "node:http";
import test from "node:test";
import {
  shutdownAgentPond,
  startAgentPond,
} from "@/lib/observability/server/agentpond";

test("the application model picker emits an AgentPond trace", async () => {
  assert.equal(process.env.AGENTPOND_ENABLED, "true");
  assert.equal(process.env.FILES_SDK_PROVIDER, "fs");
  assert.ok(process.env.FILES_SDK_ROOT);

  const requests: Array<{
    authorization?: string;
    body: Record<string, unknown>;
    url?: string;
  }> = [];
  const mockProvider = createServer(async (request, response) => {
    const chunks: Buffer[] = [];
    for await (const chunk of request) {
      chunks.push(Buffer.from(chunk));
    }
    requests.push({
      authorization: request.headers.authorization,
      body: JSON.parse(Buffer.concat(chunks).toString("utf8")) as Record<
        string,
        unknown
      >,
      url: request.url,
    });
    response.writeHead(200, { "content-type": "application/json" });
    response.end(
      JSON.stringify({
        id: "agentpond-e2e",
        object: "chat.completion",
        created: 0,
        model: "agentpond-e2e-model",
        choices: [
          {
            index: 0,
            message: {
              role: "assistant",
              content: "A verified presentation response.",
            },
            finish_reason: "stop",
          },
        ],
        usage: {
          prompt_tokens: 8,
          completion_tokens: 5,
          total_tokens: 13,
        },
      }),
    );
  });

  await new Promise<void>((resolve) => {
    mockProvider.listen(1234, "127.0.0.1", resolve);
  });

  try {
    assert.equal(await startAgentPond(), true);
    const { modelPicker } = await import("@/lib/modelPicker");
    const model = modelPicker("lmstudio", "agentpond-e2e-model");
    const result = await model.invoke("Draft one presentation sentence.");

    assert.equal(result.content, "A verified presentation response.");
    assert.equal(requests.length, 1);
    assert.equal(requests[0]?.url, "/v1/chat/completions");
    assert.equal(requests[0]?.authorization, "Bearer lmstudio");
    assert.equal(requests[0]?.body.model, "agentpond-e2e-model");
  } finally {
    await shutdownAgentPond();
    await new Promise<void>((resolve, reject) => {
      mockProvider.close((error) => (error ? reject(error) : resolve()));
    });
  }
});
