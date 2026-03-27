"use client";

import { createLogger } from "@/lib/observability/logger";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

interface ModelInfo {
  id: string;
  name: string;
  provider: "ollama" | "lmstudio";
}

const localModelLogger = createLogger("client:local-models");
const LOCAL_MODELS_API_URL = "/api/presentation/local-models";

function mergeModels(...groups: ModelInfo[][]): ModelInfo[] {
  const merged: ModelInfo[] = [];
  const seen = new Set<string>();

  for (const group of groups) {
    for (const model of group) {
      if (seen.has(model.id)) {
        continue;
      }

      seen.add(model.id);
      merged.push(model);
    }
  }

  return merged;
}

function getSavedLocalModel(): ModelInfo | null {
  const selectedModel = getSelectedModel();
  if (!selectedModel?.modelId) {
    return null;
  }

  if (
    selectedModel.modelProvider !== "ollama" &&
    selectedModel.modelProvider !== "lmstudio"
  ) {
    return null;
  }

  return {
    id: `${selectedModel.modelProvider}-${selectedModel.modelId}`,
    name: selectedModel.modelId,
    provider: selectedModel.modelProvider,
  };
}

interface LocalModelsApiResponse {
  models?: ModelInfo[];
}

async function fetchLocalModels(): Promise<ModelInfo[]> {
  try {
    const response = await fetch(LOCAL_MODELS_API_URL, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Local models API responded with ${response.status}`);
    }

    const data = (await response.json()) as LocalModelsApiResponse;
    const models = Array.isArray(data.models) ? data.models : [];

    localModelLogger.info("Local model discovery completed", {
      total: models.length,
    });

    if (models.length === 0) {
      localModelLogger.warn(
        "No live local models detected; falling back to downloadable Ollama suggestions",
        {
          downloadableModels: downloadableModels.map((model) => model.name),
        },
      );
    }

    return models;
  } catch (error) {
    localModelLogger.warn("Failed to refresh local models from the server", {
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export const downloadableModels: ModelInfo[] = [
  {
    id: "ollama-llama3.1:8b",
    name: "llama3.1:8b",
    provider: "ollama",
  },
  {
    id: "ollama-llama3.1:70b",
    name: "llama3.1:70b",
    provider: "ollama",
  },
  {
    id: "ollama-llama3.2:3b",
    name: "llama3.2:3b",
    provider: "ollama",
  },
  {
    id: "ollama-llama3.2:8b",
    name: "llama3.2:8b",
    provider: "ollama",
  },
  {
    id: "ollama-mistral:7b",
    name: "mistral:7b",
    provider: "ollama",
  },
  {
    id: "ollama-codellama:7b",
    name: "codellama:7b",
    provider: "ollama",
  },
  {
    id: "ollama-qwen2.5:7b",
    name: "qwen2.5:7b",
    provider: "ollama",
  },
  {
    id: "ollama-gemma2:9b",
    name: "gemma2:9b",
    provider: "ollama",
  },
  {
    id: "ollama-phi3:3.8b",
    name: "phi3:3.8b",
    provider: "ollama",
  },
  {
    id: "ollama-neural-chat:7b",
    name: "neural-chat:7b",
    provider: "ollama",
  },
];

export const fallbackModels: ModelInfo[] = downloadableModels;

const MODELS_CACHE_KEY = "presentation-models-cache";
const SELECTED_MODEL_KEY = "presentation-selected-model";
const CACHE_EXPIRY_KEY = "presentation-models-cache-expiry";
const CACHE_DURATION = 5 * 60 * 1000;

function getCachedModels(): ModelInfo[] | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const cached = localStorage.getItem(MODELS_CACHE_KEY);
    const expiry = localStorage.getItem(CACHE_EXPIRY_KEY);

    if (cached && expiry && Date.now() < parseInt(expiry, 10)) {
      return JSON.parse(cached) as ModelInfo[];
    }

    return null;
  } catch {
    return null;
  }
}

function setCachedModels(models: ModelInfo[]): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    localStorage.setItem(MODELS_CACHE_KEY, JSON.stringify(models));
    localStorage.setItem(
      CACHE_EXPIRY_KEY,
      (Date.now() + CACHE_DURATION).toString(),
    );
  } catch {
    // Ignore localStorage errors.
  }
}

export function getSelectedModel(): {
  modelProvider: string;
  modelId: string;
} | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const selected = localStorage.getItem(SELECTED_MODEL_KEY);
    return selected
      ? (JSON.parse(selected) as { modelProvider: string; modelId: string })
      : null;
  } catch (error) {
    localModelLogger.error(
      "Failed to read selected model from localStorage",
      error,
    );
    return null;
  }
}

export function setSelectedModel(modelProvider: string, modelId: string): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    localStorage.setItem(
      SELECTED_MODEL_KEY,
      JSON.stringify({ modelProvider, modelId }),
    );
  } catch (error) {
    localModelLogger.error("Failed to save selected model to localStorage", error);
  }
}

export function useLocalModels() {
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const cachedModels = getCachedModels();

  const query = useQuery({
    queryKey: ["local-models"],
    queryFn: async () => {
      localModelLogger.info("Refreshing local model list");
      const freshModels = await fetchLocalModels();

      if (freshModels.length > 0) {
        setCachedModels(freshModels);
        return freshModels;
      }

      if (cachedModels && cachedModels.length > 0) {
        localModelLogger.info(
          "Local discovery returned no live models; keeping cached models in place",
          {
            cachedCount: cachedModels.length,
          },
        );
        return cachedModels;
      }

      setCachedModels([]);
      return [];
    },
    staleTime: 5 * 60 * 1000,
    retry: 1,
    retryDelay: 1000,
    initialData: cachedModels || undefined,
    select: (data) => {
      const savedLocalModel = getSavedLocalModel();
      const localModels = mergeModels(
        data,
        savedLocalModel ? [savedLocalModel] : [],
      );

      return {
        localModels,
        downloadableModels,
        showDownloadable: downloadableModels.length > 0,
      };
    },
  });

  useEffect(() => {
    if (isInitialLoad) {
      setIsInitialLoad(false);
    }
  }, [isInitialLoad]);

  return {
    ...query,
    isInitialLoad,
  };
}
