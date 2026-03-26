import { env } from "@/env";
import { ChatOpenAI } from "@langchain/openai";

type ModelProvider = "openai" | "ollama" | "lmstudio";

function isModelProvider(value: string): value is ModelProvider {
  return value === "openai" || value === "ollama" || value === "lmstudio";
}

function resolveModelSelection(
  modelProviderOrModel: string,
  modelId?: string,
): {
  provider: ModelProvider;
  modelId?: string;
} {
  if (isModelProvider(modelProviderOrModel)) {
    return {
      provider: modelProviderOrModel,
      modelId,
    };
  }

  return {
    provider: "openai",
    modelId: modelProviderOrModel,
  };
}

export function assertModelIsConfigured(
  modelProviderOrModel: string,
  modelId?: string,
) {
  const selection = resolveModelSelection(modelProviderOrModel, modelId);
  const selectedOpenAIModel = selection.modelId || "gpt-4o-mini";
  const selectedLocalModel = selection.modelId?.trim();

  if (selection.provider === "ollama" && !selectedLocalModel) {
    throw new Error("An Ollama model must be selected before continuing.");
  }

  if (selection.provider === "lmstudio" && !selectedLocalModel) {
    throw new Error("An LM Studio model must be selected before continuing.");
  }

  if (selection.provider === "openai" && !env.OPENAI_API_KEY?.trim()) {
    throw new Error(
      `OPENAI_API_KEY is required when using the OpenAI model "${selectedOpenAIModel}".`,
    );
  }
}

/**
 * Centralized model picker for LangChain-based presentation routes.
 * Supports OpenAI and OpenAI-compatible local endpoints.
 */
export function modelPicker(modelProviderOrModel: string, modelId?: string) {
  const selection = resolveModelSelection(modelProviderOrModel, modelId);

  if (selection.provider === "lmstudio") {
    if (!selection.modelId) {
      throw new Error("An LM Studio model must be selected before continuing.");
    }

    return new ChatOpenAI({
      model: selection.modelId,
      apiKey: "lmstudio",
      configuration: {
        baseURL: "http://localhost:1234/v1",
      },
    });
  }

  if (selection.provider === "ollama") {
    if (!selection.modelId) {
      throw new Error("An Ollama model must be selected before continuing.");
    }

    return new ChatOpenAI({
      model: selection.modelId,
      apiKey: "ollama",
      configuration: {
        baseURL: "http://localhost:11434/v1",
      },
    });
  }

  const selectedOpenAIModel = selection.modelId || "gpt-4o-mini";
  const openAIApiKey = env.OPENAI_API_KEY?.trim();

  return new ChatOpenAI({
    model: selectedOpenAIModel,
    ...(openAIApiKey ? { apiKey: openAIApiKey } : {}),
  });
}
