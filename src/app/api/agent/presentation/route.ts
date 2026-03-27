import { createPresentationGraph } from "@/ai/agents/presentation/createAgent";
import { ensureCheckpointerSetup } from "@/ai/lib/postgres";
import { getLatestUserMessage } from "@/lib/ai/uiMessageParts";
import { assertModelIsConfigured, ensureModelIsReady } from "@/lib/modelPicker";
import { createLogger } from "@/lib/observability/logger";
import { auth } from "@/server/auth";
import { toBaseMessages, toUIMessageStream } from "@ai-sdk/langchain";
import { type HumanMessage } from "@langchain/core/messages";
import { Command } from "@langchain/langgraph";
import { createUIMessageStreamResponse, type UIMessage } from "ai";

type PresentationStreamOptions = Parameters<
  ReturnType<typeof createPresentationGraph>["stream"]
>[1] & {
  interruptBefore?: string[];
};

export async function POST(req: Request) {
  const requestId = crypto.randomUUID();
  const routeLogger = createLogger("api:presentation-agent");

  try {
    const { id, messages, resumeData, modelProvider, modelId } =
      (await req.json()) as {
      id?: string;
      messages?: UIMessage[];
      resumeData?: Record<string, unknown>;
      modelProvider?: "openai" | "ollama" | "lmstudio";
      modelId?: string;
    };

    if (!id) {
      routeLogger.warn("Presentation agent request rejected: missing presentation id", {
        requestId,
      });
      return new Response("Missing presentation id", { status: 400 });
    }

    routeLogger.info("Presentation agent request received", {
      requestId,
      presentationId: id,
      isResume: Boolean(resumeData),
      messageCount: Array.isArray(messages) ? messages.length : 0,
      modelProvider: modelProvider ?? "openai",
      modelId: modelId || "gpt-4o-mini",
    });
    const session = await auth();

    if (!session?.user) {
      routeLogger.warn("Presentation agent request rejected: unauthorized", {
        requestId,
        presentationId: id,
      });
      return new Response("Unauthorized", { status: 401 });
    }

    await ensureCheckpointerSetup();
    try {
      assertModelIsConfigured(modelProvider ?? "openai", modelId);
    } catch (error) {
      routeLogger.error(
        "Presentation agent request rejected: invalid model configuration",
        error,
        {
          requestId,
          presentationId: id,
          modelProvider: modelProvider ?? "openai",
          modelId: modelId || "gpt-4o-mini",
        },
      );
      return new Response(
        error instanceof Error ? error.message : "Invalid model configuration",
        { status: 400 },
      );
    }
    try {
      await ensureModelIsReady(modelProvider ?? "openai", modelId);
    } catch (error) {
      routeLogger.error(
        "Presentation agent request rejected: selected model could not be prepared",
        error,
        {
          requestId,
          presentationId: id,
          modelProvider: modelProvider ?? "openai",
          modelId: modelId || "gpt-4o-mini",
        },
      );
      return new Response(
        error instanceof Error
          ? error.message
          : "Failed to prepare selected model",
        { status: 503 },
      );
    }

    const graph = createPresentationGraph({
      modelProvider,
      modelId,
    });
    const streamOptions: PresentationStreamOptions = {
      streamMode: ["values", "messages"],
      interruptBefore: ["tools"],
      configurable: {
        thread_id: id,
      },
    };

    routeLogger.info("Presentation agent generation started", {
      requestId,
      presentationId: id,
      isResume: Boolean(resumeData),
    });
    const stream = resumeData
      ? await graph.stream(
          new Command({ resume: resumeData }),
          streamOptions as Parameters<typeof graph.stream>[1],
        )
      : await (async () => {
          const latestUserMessage = getLatestUserMessage(
            Array.isArray(messages) ? messages : [],
          );

          const [lastUserMessage] = latestUserMessage
            ? await toBaseMessages([latestUserMessage])
            : [];

          if (!lastUserMessage) {
            throw new Error("No user message found in request");
          }

          return graph.stream(
            {
              messages: [lastUserMessage as HumanMessage],
            },
            streamOptions as Parameters<typeof graph.stream>[1],
          );
        })();

    routeLogger.info("Presentation agent stream created", {
      requestId,
      presentationId: id,
      isResume: Boolean(resumeData),
    });
    return createUIMessageStreamResponse({
      stream: toUIMessageStream(stream),
    });
  } catch (error) {
    routeLogger.error("Presentation agent request failed", error, {
      requestId,
    });
    return new Response("Internal Server Error", { status: 500 });
  }
}
