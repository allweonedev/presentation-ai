"use client";

import { fetchOpenRouterModels, fetchGroqModels, fetchPollinationsTextModels, type OpenRouterModel } from "@/app/_actions/models/openrouter";
import { fetchPollinationsModels, type PollinationsModel } from "@/app/_actions/image/models";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import {
  fallbackModels,
  getSelectedModel,
  setSelectedModel,
  useLocalModels,
} from "@/hooks/presentation/useLocalModels";
import { usePresentationState } from "@/states/presentation-state";
import { Bot, Cpu, Image, Loader2, Monitor, Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export function ModelPicker({
  shouldShowLabel = true,
}: {
  shouldShowLabel?: boolean;
}) {
  const { modelProvider, setModelProvider, modelId, setModelId, imageModel, setImageModel } =
    usePresentationState();

  const [openRouterModels, setOpenRouterModels] = useState<OpenRouterModel[]>([]);
  const [groqModels, setGroqModels] = useState<OpenRouterModel[]>([]);
  const [pollinationsTextModels, setPollinationsTextModels] = useState<OpenRouterModel[]>([]);
  const [pollinationsModels, setPollinationsModels] = useState<PollinationsModel[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFreeOnly, setShowFreeOnly] = useState(false);
  const [loadingModels, setLoadingModels] = useState(true);

  const { data: localModelsData, isLoading, isInitialLoad } = useLocalModels();
  const hasRestoredFromStorage = useRef(false);

  // Load saved model selection from localStorage on mount
  useEffect(() => {
    if (!hasRestoredFromStorage.current) {
      const savedModel = getSelectedModel();
      if (savedModel) {
        console.log("Restoring model from localStorage:", savedModel);
        setModelProvider(
          savedModel.modelProvider as "openai" | "ollama" | "lmstudio" | "openrouter" | "groq" | "pollinations",
        );
        setModelId(savedModel.modelId);
      }
      hasRestoredFromStorage.current = true;
    }
  }, [setModelProvider, setModelId]);

  // Load models on mount
  useEffect(() => {
    const loadModels = async () => {
      try {
        const [openRouter, groq, pollinationsText, pollinationsImage] = await Promise.all([
          fetchOpenRouterModels(),
          fetchGroqModels(),
          fetchPollinationsTextModels(),
          fetchPollinationsModels(),
        ]);
        setOpenRouterModels(openRouter);
        setGroqModels(groq);
        setPollinationsTextModels(pollinationsText);
        setPollinationsModels(pollinationsImage);
      } catch (error) {
        console.error("Failed to load models:", error);
      } finally {
        setLoadingModels(false);
      }
    };
    loadModels();
  }, []);

  // Use cached data if available, otherwise show fallback
  const displayData = localModelsData || {
    localModels: fallbackModels,
    downloadableModels: [],
    showDownloadable: true,
  };

  const { localModels, downloadableModels, showDownloadable } = displayData;

  // Filter models based on search and free toggle
  const filteredOpenRouterModels = openRouterModels.filter((model) => {
    const matchesSearch = model.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         model.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFreeFilter = !showFreeOnly || model.isFree;
    return matchesSearch && matchesFreeFilter;
  });

  const filteredGroqModels = groqModels.filter((model) => {
    const matchesSearch = model.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         model.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFreeFilter = !showFreeOnly || model.isFree;
    return matchesSearch && matchesFreeFilter;
  });

  const filteredPollinationsTextModels = pollinationsTextModels.filter((model) => {
    const matchesSearch = model.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         model.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFreeFilter = !showFreeOnly || model.isFree;
    return matchesSearch && matchesFreeFilter;
  });

  const filteredPollinationsModels = pollinationsModels.filter((model) => {
    const matchesSearch = model.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         model.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFreeFilter = !showFreeOnly || model.isFree;
    return matchesSearch && matchesFreeFilter;
  });

  // Group models by provider
  const ollamaModels = localModels.filter(
    (model) => model.provider === "ollama",
  );
  const lmStudioModels = localModels.filter(
    (model) => model.provider === "lmstudio",
  );
  const downloadableOllamaModels = downloadableModels.filter(
    (model) => model.provider === "ollama",
  );

  // Helper function to create model option
  const createModelOption = (
    model: (typeof localModels)[0],
    isDownloadable = false,
  ) => ({
    id: model.id,
    label: model.name,
    displayLabel:
      model.provider === "ollama"
        ? `ollama ${model.name}`
        : `lm-studio ${model.name}`,
    icon: model.provider === "ollama" ? Cpu : Monitor,
    description: isDownloadable
      ? `Downloadable ${model.provider === "ollama" ? "Ollama" : "LM Studio"} model (will auto-download)`
      : `Local ${model.provider === "ollama" ? "Ollama" : "LM Studio"} model`,
    isDownloadable,
  });

  // Get current model value
  const getCurrentModelValue = () => {
    if (modelProvider === "ollama") {
      return `ollama-${modelId}`;
    } else if (modelProvider === "lmstudio") {
      return `lmstudio-${modelId}`;
    } else if (modelProvider === "openrouter") {
      return `openrouter-${modelId}`;
    } else if (modelProvider === "groq") {
      return `groq-${modelId}`;
    } else if (modelProvider === "pollinations") {
      return `pollinations-${modelId}`;
    }
    return `openrouter-openai/gpt-4o-mini`; // Default
  };

  // Get current model option for display
  const getCurrentModelOption = () => {
    const currentValue = getCurrentModelValue();

    if (currentValue.startsWith("openrouter-")) {
      const modelId = currentValue.replace("openrouter-", "");
      const model = openRouterModels.find((m) => m.id === modelId);
      return {
        label: model?.name || "OpenRouter Model",
        icon: Bot,
      };
    }

    if (currentValue.startsWith("groq-")) {
      const modelId = currentValue.replace("groq-", "");
      const model = groqModels.find((m) => m.id === modelId);
      return {
        label: model?.name || "Groq Model",
        icon: Bot,
      };
    }

    if (currentValue.startsWith("pollinations-")) {
      const modelId = currentValue.replace("pollinations-", "");
      // Check text models first
      const textModel = pollinationsTextModels.find((m) => m.id === modelId);
      if (textModel) {
        return {
          label: textModel.name || "Pollinations Text Model",
          icon: Bot,
        };
      }
      // Then check image models
      const imageModel = pollinationsModels.find((m) => m.id === modelId);
      return {
        label: imageModel?.name || "Pollinations Image Model",
        icon: Image,
      };
    }

    if (currentValue === "openai") {
      return {
        label: "GPT-4o-mini",
        icon: Bot,
      };
    }

    // Check local models first
    const localModel = localModels.find((model) => model.id === currentValue);
    if (localModel) {
      return {
        label: localModel.name,
        icon: localModel.provider === "ollama" ? Cpu : Monitor,
      };
    }

    // Check downloadable models
    const downloadableModel = downloadableModels.find(
      (model) => model.id === currentValue,
    );
    if (downloadableModel) {
      return {
        label: downloadableModel.name,
        icon: downloadableModel.provider === "ollama" ? Cpu : Monitor,
      };
    }

    return {
      label: "Select model",
      icon: Bot,
    };
  };

  // Handle model change
  const handleModelChange = (value: string) => {
    console.log("Model changed to:", value);
    if (value === "openai") {
      setModelProvider("openai");
      setModelId("");
      setSelectedModel("openai", "");
      console.log("Saved to localStorage: openai, ''");
    } else if (value.startsWith("ollama-")) {
      const model = value.replace("ollama-", "");
      setModelProvider("ollama");
      setModelId(model);
      setSelectedModel("ollama", model);
      console.log("Saved to localStorage: ollama,", model);
    } else if (value.startsWith("lmstudio-")) {
      const model = value.replace("lmstudio-", "");
      setModelProvider("lmstudio");
      setModelId(model);
      setSelectedModel("lmstudio", model);
      console.log("Saved to localStorage: lmstudio,", model);
    } else if (value.startsWith("openrouter-")) {
      const model = value.replace("openrouter-", "");
      setModelProvider("openrouter");
      setModelId(model);
      setSelectedModel("openrouter", model);
      console.log("Saved to localStorage: openrouter,", model);
    } else if (value.startsWith("groq-")) {
      const model = value.replace("groq-", "");
      setModelProvider("groq");
      setModelId(model);
      setSelectedModel("groq", model);
      console.log("Saved to localStorage: groq,", model);
    } else if (value.startsWith("pollinations-")) {
      const model = value.replace("pollinations-", "");
      // Check if it's a text model
      const isTextModel = pollinationsTextModels.some((m) => m.id === model);
      if (isTextModel) {
        setModelProvider("pollinations");
        setModelId(model);
        setSelectedModel("pollinations", model);
        console.log("Saved to localStorage: pollinations,", model);
      } else {
        // It's an image model
        setImageModel(model as any);
        console.log("Set image model to:", model);
      }
    }
  };

  return (
    <div>
      {shouldShowLabel && (
        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
          AI Model
        </label>
      )}

      {/* Search and Free Toggle */}
      <div className="space-y-2 mb-2">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search models..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            id="free-only"
            checked={showFreeOnly}
            onCheckedChange={setShowFreeOnly}
          />
          <label htmlFor="free-only" className="text-sm text-muted-foreground">
            Free models only
          </label>
        </div>
      </div>

      <Select value={getCurrentModelValue()} onValueChange={handleModelChange}>
        <SelectTrigger className="overflow-hidden">
          <div className="flex items-center gap-2 min-w-0">
            {(() => {
              const currentOption = getCurrentModelOption();
              const Icon = currentOption.icon;
              return <Icon className="h-4 w-4 flex-shrink-0" />;
            })()}
            <span className="truncate text-sm">
              {getCurrentModelOption().label}
            </span>
          </div>
        </SelectTrigger>
        <SelectContent>
          {/* Loading indicator when fetching models */}
          {(isLoading || loadingModels) && !isInitialLoad && (
            <SelectGroup>
              <SelectLabel>Loading Models</SelectLabel>
              <SelectItem value="loading" disabled>
                <div className="flex items-center gap-3">
                  <Loader2 className="h-4 w-4 flex-shrink-0 animate-spin" />
                  <div className="flex flex-col min-w-0">
                    <span className="truncate text-sm">
                      Refreshing models...
                    </span>
                    <span className="text-xs text-muted-foreground truncate">
                      Checking for new models
                    </span>
                  </div>
                </div>
              </SelectItem>
            </SelectGroup>
          )}

          {/* OpenRouter Models */}
          {filteredOpenRouterModels.length > 0 && (
            <SelectGroup>
              <SelectLabel>Text Models (OpenRouter)</SelectLabel>
              {filteredOpenRouterModels.map((model) => (
                <SelectItem key={`openrouter-${model.id}`} value={`openrouter-${model.id}`}>
                  <div className="flex items-center gap-3">
                    <Bot className="h-4 w-4 flex-shrink-0" />
                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="truncate text-sm">{model.name}</span>
                        {model.isFree && (
                          <span className="text-xs bg-green-100 text-green-800 px-1 py-0.5 rounded">
                            Free
                          </span>
                        )}
                      </div>
                      {model.description && (
                        <span className="text-xs text-muted-foreground truncate">
                          {model.description}
                        </span>
                      )}
                    </div>
                  </div>
                </SelectItem>
              ))}
            </SelectGroup>
          )}

          {/* Groq Models */}
          {filteredGroqModels.length > 0 && (
            <SelectGroup>
              <SelectLabel>Text Models (Groq)</SelectLabel>
              {filteredGroqModels.map((model) => (
                <SelectItem key={`groq-${model.id}`} value={`groq-${model.id}`}>
                  <div className="flex items-center gap-3">
                    <Bot className="h-4 w-4 flex-shrink-0" />
                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="truncate text-sm">{model.name}</span>
                      </div>
                      {model.description && (
                        <span className="text-xs text-muted-foreground truncate">
                          {model.description}
                        </span>
                      )}
                    </div>
                  </div>
                </SelectItem>
              ))}
            </SelectGroup>
          )}

          {/* Pollinations Text Models */}
          {filteredPollinationsTextModels.length > 0 && (
            <SelectGroup>
              <SelectLabel>Text Models (Pollinations)</SelectLabel>
              {filteredPollinationsTextModels.map((model) => (
                <SelectItem key={`pollinations-${model.id}`} value={`pollinations-${model.id}`}>
                  <div className="flex items-center gap-3">
                    <Bot className="h-4 w-4 flex-shrink-0" />
                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="truncate text-sm">{model.name}</span>
                        {model.isFree && (
                          <span className="text-xs bg-green-100 text-green-800 px-1 py-0.5 rounded">
                            Free
                          </span>
                        )}
                      </div>
                      {model.description && (
                        <span className="text-xs text-muted-foreground truncate">
                          {model.description}
                        </span>
                      )}
                    </div>
                  </div>
                </SelectItem>
              ))}
            </SelectGroup>
          )}

          {/* Pollinations Image Models */}
          {filteredPollinationsModels.length > 0 && (
            <SelectGroup>
              <SelectLabel>Image Models (Pollinations)</SelectLabel>
              {filteredPollinationsModels.map((model) => (
                <SelectItem key={`pollinations-${model.id}`} value={`pollinations-${model.id}`}>
                  <div className="flex items-center gap-3">
                    <Image className="h-4 w-4 flex-shrink-0" />
                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="truncate text-sm">{model.name}</span>
                        {model.isFree && (
                          <span className="text-xs bg-green-100 text-green-800 px-1 py-0.5 rounded">
                            Free
                          </span>
                        )}
                      </div>
                      {model.description && (
                        <span className="text-xs text-muted-foreground truncate">
                          {model.description}
                        </span>
                      )}
                    </div>
                  </div>
                </SelectItem>
              ))}
            </SelectGroup>
          )}

          {/* Local Ollama Models */}
          {ollamaModels.length > 0 && (
            <SelectGroup>
              <SelectLabel>Local Ollama Models</SelectLabel>
              {ollamaModels.map((model) => {
                const option = createModelOption(model);
                const Icon = option.icon;
                return (
                  <SelectItem key={option.id} value={option.id}>
                    <div className="flex items-center gap-3">
                      <Icon className="h-4 w-4 flex-shrink-0" />
                      <div className="flex flex-col min-w-0">
                        <span className="truncate text-sm">
                          {option.displayLabel}
                        </span>
                        <span className="text-xs text-muted-foreground truncate">
                          {option.description}
                        </span>
                      </div>
                    </div>
                  </SelectItem>
                );
              })}
            </SelectGroup>
          )}

          {/* Local LM Studio Models */}
          {lmStudioModels.length > 0 && (
            <SelectGroup>
              <SelectLabel>Local LM Studio Models</SelectLabel>
              {lmStudioModels.map((model) => {
                const option = createModelOption(model);
                const Icon = option.icon;
                return (
                  <SelectItem key={option.id} value={option.id}>
                    <div className="flex items-center gap-3">
                      <Icon className="h-4 w-4 flex-shrink-0" />
                      <div className="flex flex-col min-w-0">
                        <span className="truncate text-sm">
                          {option.displayLabel}
                        </span>
                        <span className="text-xs text-muted-foreground truncate">
                          {option.description}
                        </span>
                      </div>
                    </div>
                  </SelectItem>
                );
              })}
            </SelectGroup>
          )}

          {/* Downloadable Ollama Models */}
          {showDownloadable && downloadableOllamaModels.length > 0 && (
            <SelectGroup>
              <SelectLabel>Downloadable Ollama Models</SelectLabel>
              {downloadableOllamaModels.map((model) => {
                const option = createModelOption(model, true);
                const Icon = option.icon;
                return (
                  <SelectItem key={option.id} value={option.id}>
                    <div className="flex items-center gap-3">
                      <Icon className="h-4 w-4 flex-shrink-0" />
                      <div className="flex flex-col min-w-0">
                        <span className="truncate text-sm">
                          {option.displayLabel}
                        </span>
                        <span className="text-xs text-muted-foreground truncate">
                          {option.description}
                        </span>
                      </div>
                    </div>
                  </SelectItem>
                );
              })}
            </SelectGroup>
          )}
        </SelectContent>
      </Select>
    </div>
  );
}
