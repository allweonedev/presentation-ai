import { modelPicker } from "@/lib/model-picker";
import { streamText, type CoreMessage } from "ai";
import { NextRequest } from "next/server";

interface CommandRequest {
  messages: CoreMessage[];
  modelProvider?: string;
  modelId?: string;
}

export async function POST(req: NextRequest) {
  try {
    const { messages, modelProvider = "openrouter", modelId } = (await req.json()) as CommandRequest;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return Response.json({ error: "Invalid messages" }, { status: 400 });
    }

    console.log("🤖 AI command request:", {
      provider: modelProvider,
      model: modelId,
      messageCount: messages.length,
    });

    // Create model based on selection
    const model = modelPicker(modelProvider, modelId);

    const result = streamText({
      model,
      messages,
      maxTokens: 1000,
      temperature: 0.7,
    });

    console.log("✅ AI command streaming started");
    return result.toDataStreamResponse();
  } catch (error) {
    console.error("Error in AI command:", error);
    return Response.json(
      { error: "Failed to process AI command" },
      { status: 500 }
    );
  }
}
