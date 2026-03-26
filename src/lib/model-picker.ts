import { env } from "@/env";
import { createLogger } from "@/lib/observability/logger";
import { ChatOpenAI } from "@langchain/openai";

type ModelProvider = "openai" | "ollama" | "lmstudio";
const modelLogger = createLogger("model-picker");

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
    modelLogger.error("Model configuration failed", undefined, {
      provider: selection.provider,
      reason: "missing_model_id",
    });
    throw new Error("An Ollama model must be selected before continuing.");
  }

  if (selection.provider === "lmstudio" && !selectedLocalModel) {
    modelLogger.error("Model configuration failed", undefined, {
      provider: selection.provider,
      reason: "missing_model_id",
    });
    throw new Error("An LM Studio model must be selected before continuing.");
  }

  if (selection.provider === "openai" && !env.OPENAI_API_KEY?.trim()) {
    modelLogger.error("Model configuration failed", undefined, {
      provider: selection.provider,
      modelId: selectedOpenAIModel,
      reason: "missing_openai_api_key",
    });
    throw new Error(
      `OPENAI_API_KEY is required when using the OpenAI model "${selectedOpenAIModel}".`,
    );
  }

  modelLogger.info("Model configuration validated", {
    provider: selection.provider,
    modelId:
      selection.provider === "openai"
        ? selectedOpenAIModel
        : selectedLocalModel || undefined,
  });
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

    modelLogger.info("Creating LM Studio model client", {
      provider: selection.provider,
      modelId: selection.modelId,
      baseUrl: "http://localhost:1234/v1",
    });

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

    modelLogger.info("Creating Ollama model client", {
      provider: selection.provider,
      modelId: selection.modelId,
      baseUrl: "http://localhost:11434/v1",
    });

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

  modelLogger.info("Creating OpenAI model client", {
    provider: selection.provider,
    modelId: selectedOpenAIModel,
    hasApiKey: Boolean(openAIApiKey),
  });

  return new ChatOpenAI({
    model: selectedOpenAIModel,
    ...(openAIApiKey ? { apiKey: openAIApiKey } : {}),
  });
}
