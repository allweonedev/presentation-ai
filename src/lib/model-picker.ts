import { ChatOpenAI } from "@langchain/openai";

/**
 * Centralized model picker for LangChain-based presentation routes.
 * Supports OpenAI and OpenAI-compatible local endpoints.
 */
export function modelPicker(modelProvider: string, modelId?: string) {
  if (modelProvider === "lmstudio" && modelId) {
    return new ChatOpenAI({
      model: modelId,
      apiKey: "lmstudio",
      configuration: {
        baseURL: "http://localhost:1234/v1",
      },
    });
  }

  if (modelProvider === "ollama" && modelId) {
    return new ChatOpenAI({
      model: modelId,
      apiKey: "ollama",
      configuration: {
        baseURL: "http://localhost:11434/v1",
      },
    });
  }

  if (modelProvider === "openai") {
    return new ChatOpenAI({
      model: "gpt-4o-mini",
    });
  }

  return new ChatOpenAI({
    model: modelProvider || "gpt-4o-mini",
  });
}
