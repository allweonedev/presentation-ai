import { ChatOpenAI } from "@langchain/openai";

/**
 * Centralized model picker for LangChain-based presentation routes.
 * Supports OpenAI and OpenAI-compatible local endpoints.
 */
export function modelPicker(modelProvider: string, modelId?: string) {
  const provider = modelId ? modelProvider : "openai";
  const resolvedModelId = modelId ?? modelProvider ?? "gpt-4o-mini";

  if (provider === "lmstudio") {
    return new ChatOpenAI({
      model: resolvedModelId,
      apiKey: "lmstudio",
      configuration: {
        baseURL: "http://localhost:1234/v1",
      },
    });
  }

  if (provider === "ollama") {
    return new ChatOpenAI({
      model: resolvedModelId,
      apiKey: "ollama",
      configuration: {
        baseURL: "http://localhost:11434/v1",
      },
    });
  }

  return new ChatOpenAI({
    model: resolvedModelId,
  });
}
