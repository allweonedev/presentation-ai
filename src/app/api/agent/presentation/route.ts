import { createPresentationGraph } from "@/ai/agents/presentation/createAgent";
import { ensureCheckpointerSetup } from "@/ai/lib/postgres";
import { getLatestUserMessage } from "@/lib/ai/uiMessageParts";
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
  try {
    const { id, messages, resumeData } = (await req.json()) as {
      id?: string;
      messages?: UIMessage[];
      resumeData?: Record<string, unknown>;
    };

    if (!id) {
      return new Response("Missing presentation id", { status: 400 });
    }

    const session = await auth();

    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 });
    }

    await ensureCheckpointerSetup();

    const graph = createPresentationGraph();
    const streamOptions: PresentationStreamOptions = {
      streamMode: ["values", "messages"],
      interruptBefore: ["tools"],
      configurable: {
        thread_id: id,
      },
    };

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

    return createUIMessageStreamResponse({
      stream: toUIMessageStream(stream),
    });
  } catch (error) {
    console.error("Request error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
