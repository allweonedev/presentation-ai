import { createLogger } from "@/lib/observability/logger";
import { auth } from "@/server/auth";
import { NextResponse } from "next/server";

interface LocalModelInfo {
  id: string;
  name: string;
  provider: "ollama" | "lmstudio";
}

interface OllamaTagsResponse {
  models?: Array<{ name?: string }>;
}

interface LMStudioNativeResponse {
  models?: Array<{
    key?: string;
    display_name?: string;
    loaded_instances?: Array<{ id?: string }>;
  }>;
}

interface LMStudioOpenAIResponse {
  data?: Array<{ id?: string }>;
}

const routeLogger = createLogger("api:presentation-local-models");
const OLLAMA_TAGS_URL = "http://localhost:11434/api/tags";
const LM_STUDIO_NATIVE_MODELS_URL = "http://localhost:1234/api/v1/models";
const LM_STUDIO_OPENAI_MODELS_URL = "http://localhost:1234/v1/models";
const LOCAL_FETCH_TIMEOUT_MS = 2_500;

function createTimeoutSignal(timeoutMs: number): AbortSignal {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  controller.signal.addEventListener("abort", () => clearTimeout(timeout), {
    once: true,
  });
  return controller.signal;
}

function dedupeModels(models: LocalModelInfo[]): LocalModelInfo[] {
  const seen = new Set<string>();

  return models.filter((model) => {
    if (seen.has(model.id)) {
      return false;
    }

    seen.add(model.id);
    return true;
  });
}

async function fetchOllamaModels(): Promise<LocalModelInfo[]> {
  try {
    const response = await fetch(OLLAMA_TAGS_URL, {
      cache: "no-store",
      signal: createTimeoutSignal(LOCAL_FETCH_TIMEOUT_MS),
    });

    if (!response.ok) {
      throw new Error(`Ollama responded with ${response.status}`);
    }

    const data = (await response.json()) as OllamaTagsResponse;
    return (data.models ?? [])
      .map((model) => model.name?.trim())
      .filter((name): name is string => Boolean(name))
      .map((name) => ({
        id: `ollama-${name}`,
        name,
        provider: "ollama" as const,
      }));
  } catch (error) {
    routeLogger.warn("Failed to fetch Ollama models", {
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

async function fetchLMStudioModels(): Promise<LocalModelInfo[]> {
  try {
    const response = await fetch(LM_STUDIO_NATIVE_MODELS_URL, {
      cache: "no-store",
      signal: createTimeoutSignal(LOCAL_FETCH_TIMEOUT_MS),
    });

    if (!response.ok) {
      throw new Error(`LM Studio native endpoint responded with ${response.status}`);
    }

    const data = (await response.json()) as LMStudioNativeResponse;
    const models = (data.models ?? []).flatMap((model) => {
      const loadedInstances = (model.loaded_instances ?? [])
        .map((instance) => instance.id?.trim())
        .filter((id): id is string => Boolean(id));

      if (loadedInstances.length === 0) {
        return [];
      }

      const modelKey = model.key?.trim();
      const displayName = model.display_name?.trim();

      return loadedInstances.map((instanceId) => ({
        id: `lmstudio-${instanceId}`,
        name: displayName || modelKey || instanceId,
        provider: "lmstudio" as const,
      }));
    });

    if (models.length > 0) {
      return dedupeModels(models);
    }
  } catch (error) {
    routeLogger.warn("Failed to fetch LM Studio native model list", {
      error: error instanceof Error ? error.message : String(error),
    });
  }

  try {
    const response = await fetch(LM_STUDIO_OPENAI_MODELS_URL, {
      cache: "no-store",
      signal: createTimeoutSignal(LOCAL_FETCH_TIMEOUT_MS),
    });

    if (!response.ok) {
      throw new Error(`LM Studio OpenAI endpoint responded with ${response.status}`);
    }

    const data = (await response.json()) as LMStudioOpenAIResponse;
    return dedupeModels(
      (data.data ?? [])
        .map((model) => model.id?.trim())
        .filter((id): id is string => Boolean(id))
        .map((id) => ({
          id: `lmstudio-${id}`,
          name: id,
          provider: "lmstudio" as const,
        })),
    );
  } catch (error) {
    routeLogger.warn("Failed to fetch LM Studio OpenAI-compatible model list", {
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export async function GET() {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [ollamaModels, lmStudioModels] = await Promise.all([
    fetchOllamaModels(),
    fetchLMStudioModels(),
  ]);

  return NextResponse.json(
    {
      models: dedupeModels([...ollamaModels, ...lmStudioModels]),
    },
    {
      headers: {
        "Cache-Control": "no-store",
      },
    },
  );
}
