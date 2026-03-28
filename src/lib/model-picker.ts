import { env } from "@/env";
import { createLogger } from "@/lib/observability/logger";
import { ChatOpenAI } from "@langchain/openai";

type ModelProvider = "openai" | "ollama" | "lmstudio";
const modelLogger = createLogger("model-picker");
const OLLAMA_BASE_URL = "http://localhost:11434";
const OLLAMA_TAGS_URL = `${OLLAMA_BASE_URL}/api/tags`;
const OLLAMA_PULL_URL = `${OLLAMA_BASE_URL}/api/pull`;
const LM_STUDIO_BASE_URL = "http://localhost:1234";
const LM_STUDIO_API_BASE_URL = `${LM_STUDIO_BASE_URL}/v1`;
const LM_STUDIO_MODELS_URLS = [
  `${LM_STUDIO_API_BASE_URL}/models`,
  `${LM_STUDIO_BASE_URL}/api/v0/models`,
] as const;

interface OllamaTagsResponse {
  models?: Array<{ name?: string }>;
}

interface OllamaPullProgressChunk {
  status?: string;
  error?: string;
  completed?: number;
  total?: number;
}

function extractLMStudioModelIds(payload: unknown): string[] {
  const candidateArrays: unknown[][] = [
    Array.isArray((payload as { data?: unknown[] } | null)?.data)
      ? ((payload as { data: unknown[] }).data ?? [])
      : [],
    Array.isArray((payload as { models?: unknown[] } | null)?.models)
      ? ((payload as { models: unknown[] }).models ?? [])
      : [],
    Array.isArray(payload) ? payload : [],
  ];

  const modelIds = candidateArrays.flatMap((candidates) =>
    candidates.flatMap((candidate) => {
      if (!candidate || typeof candidate !== "object" || Array.isArray(candidate)) {
        return [];
      }

      const record = candidate as Record<string, unknown>;
      const modelId = [record.id, record.model, record.modelKey, record.name].find(
        (value) => typeof value === "string" && value.trim().length > 0,
      );

      return typeof modelId === "string" ? [modelId.trim()] : [];
    }),
  );

  return [...new Set(modelIds)];
}

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

async function fetchInstalledOllamaModels(): Promise<Set<string>> {
  const response = await fetch(OLLAMA_TAGS_URL, {
    method: "GET",
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Ollama is not available. Start Ollama and try again.");
  }

  const data = (await response.json()) as OllamaTagsResponse;
  const installedModels = new Set(
    (data.models ?? [])
      .map((model) => model.name?.trim())
      .filter((name): name is string => Boolean(name)),
  );

  return installedModels;
}

async function fetchInstalledLMStudioModels(): Promise<Set<string>> {
  let lastError: Error | null = null;
  let receivedResponse = false;

  for (const url of LM_STUDIO_MODELS_URLS) {
    try {
      const response = await fetch(url, {
        method: "GET",
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error(`LM Studio responded with ${response.status}`);
      }

      receivedResponse = true;
      const modelIds = extractLMStudioModelIds(await response.json());

      modelLogger.info("Fetched LM Studio model catalog", {
        provider: "lmstudio",
        source: url,
        count: modelIds.length,
      });

      return new Set(modelIds);
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
    }
  }

  if (receivedResponse) {
    return new Set();
  }

  throw new Error(
    lastError?.message ??
      "LM Studio is not available. Start LM Studio and try again.",
  );
}

async function ensureOllamaModelIsReady(modelId: string): Promise<void> {
  const installedModels = await fetchInstalledOllamaModels();
  if (installedModels.has(modelId)) {
    modelLogger.info("Ollama model already installed", {
      provider: "ollama",
      modelId,
    });
    return;
  }

  modelLogger.info("Ollama model missing; starting download", {
    provider: "ollama",
    modelId,
  });

  const response = await fetch(OLLAMA_PULL_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: modelId,
      stream: true,
    }),
  });

  if (!response.ok) {
    throw new Error(
      `Failed to download Ollama model "${modelId}". Ensure Ollama is running and try again.`,
    );
  }

  if (!response.body) {
    throw new Error(
      `Ollama did not return a download stream for model "${modelId}".`,
    );
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let lastStatus: string | undefined;
  const processProgressLine = (line: string): void => {
    let chunk: OllamaPullProgressChunk;
    try {
      chunk = JSON.parse(line) as OllamaPullProgressChunk;
    } catch (error) {
      modelLogger.warn("Failed to parse Ollama pull progress chunk", {
        provider: "ollama",
        modelId,
        line,
        error: error instanceof Error ? error.message : String(error),
      });
      return;
    }

    if (chunk.error) {
      throw new Error(
        `Failed to download Ollama model "${modelId}": ${chunk.error}`,
      );
    }

    if (chunk.status) {
      lastStatus = chunk.status;
    }
  };

  while (true) {
    const { done, value } = await reader.read();

    if (done) {
      break;
    }

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";

    for (const rawLine of lines) {
      const line = rawLine.trim();
      if (!line) {
        continue;
      }
      processProgressLine(line);
    }
  }

  if (buffer.trim()) {
    processProgressLine(buffer.trim());
  }

  const refreshedModels = await fetchInstalledOllamaModels();
  if (!refreshedModels.has(modelId)) {
    throw new Error(
      `Ollama finished downloading "${modelId}" but the model is still unavailable. Last status: ${lastStatus ?? "unknown"}.`,
    );
  }

  modelLogger.info("Ollama model download completed", {
    provider: "ollama",
    modelId,
    lastStatus: lastStatus ?? "unknown",
  });
}

async function ensureLMStudioModelIsReady(modelId: string): Promise<void> {
  const availableModels = await fetchInstalledLMStudioModels();

  if (availableModels.has(modelId)) {
    modelLogger.info("LM Studio model is available", {
      provider: "lmstudio",
      modelId,
    });
    return;
  }

  if (availableModels.size === 0) {
    throw new Error(
      `LM Studio is running but no models are currently available. Load "${modelId}" in LM Studio and try again.`,
    );
  }

  throw new Error(
    `LM Studio model "${modelId}" is not available. Load it in LM Studio and make sure the local server is running.`,
  );
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

export async function ensureModelIsReady(
  modelProviderOrModel: string,
  modelId?: string,
) {
  const selection = resolveModelSelection(modelProviderOrModel, modelId);
  if (!selection.modelId) {
    return;
  }

  if (selection.provider === "ollama") {
    await ensureOllamaModelIsReady(selection.modelId);
    return;
  }

  if (selection.provider === "lmstudio") {
    await ensureLMStudioModelIsReady(selection.modelId);
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

    modelLogger.info("Creating LM Studio model client", {
      provider: selection.provider,
      modelId: selection.modelId,
      baseUrl: LM_STUDIO_API_BASE_URL,
    });

    return new ChatOpenAI({
      model: selection.modelId,
      apiKey: "lmstudio",
      configuration: {
        baseURL: LM_STUDIO_API_BASE_URL,
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
      baseUrl: `${OLLAMA_BASE_URL}/v1`,
    });

    return new ChatOpenAI({
      model: selection.modelId,
      apiKey: "ollama",
      configuration: {
        baseURL: `${OLLAMA_BASE_URL}/v1`,
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
