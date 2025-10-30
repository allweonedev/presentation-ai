"use server";

export interface OpenRouterModel {
  id: string;
  name: string;
  description?: string;
  context_length?: number;
  pricing?: {
    prompt: string;
    completion: string;
  };
  isFree?: boolean;
}

export async function fetchOpenRouterModels(): Promise<OpenRouterModel[]> {
  try {
    const response = await fetch("https://openrouter.ai/api/v1/models", {
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      console.error("Failed to fetch OpenRouter models:", response.statusText);
      return getFallbackOpenRouterModels();
    }

    const data = await response.json();
    const models: OpenRouterModel[] = data.data.map((model: any) => ({
      id: model.id,
      name: model.name || model.id,
      description: model.description,
      context_length: model.context_length,
      pricing: model.pricing,
      isFree: model.pricing?.prompt === "0" && model.pricing?.completion === "0",
    }));

    return models;
  } catch (error) {
    console.error("Error fetching OpenRouter models:", error);
    return getFallbackOpenRouterModels();
  }
}

function getFallbackOpenRouterModels(): OpenRouterModel[] {
  return [
    {
      id: "openai/gpt-4o-mini",
      name: "GPT-4o Mini",
      description: "Fast and efficient model by OpenAI",
      isFree: false,
    },
    {
      id: "openai/gpt-4o",
      name: "GPT-4o",
      description: "Advanced model by OpenAI",
      isFree: false,
    },
    {
      id: "anthropic/claude-3-haiku",
      name: "Claude 3 Haiku",
      description: "Fast model by Anthropic",
      isFree: false,
    },
    {
      id: "anthropic/claude-3-sonnet",
      name: "Claude 3 Sonnet",
      description: "Advanced model by Anthropic",
      isFree: false,
    },
    {
      id: "meta-llama/llama-3.1-8b-instruct",
      name: "Llama 3.1 8B Instruct",
      description: "Open source model by Meta",
      isFree: true,
    },
    {
      id: "meta-llama/llama-3.1-70b-instruct",
      name: "Llama 3.1 70B Instruct",
      description: "Large open source model by Meta",
      isFree: false,
    },
  ];
}

export async function fetchGroqModels(): Promise<OpenRouterModel[]> {
  try {
    const response = await fetch("https://api.groq.com/openai/v1/models", {
      headers: {
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      console.error("Failed to fetch Groq models:", response.statusText);
      return [];
    }

    const data = await response.json();
    // Filter for text models only (exclude whisper, playai-tts, guard models)
    const textModels = data.data.filter((model: any) => 
      !model.id.includes('whisper') && 
      !model.id.includes('playai') && 
      !model.id.includes('guard')
    );
    
    const models: OpenRouterModel[] = textModels.map((model: any) => ({
      id: model.id,
      name: model.id,
      description: `${model.owned_by} model`,
      context_length: model.context_window,
      pricing: { prompt: "0", completion: "0" }, // Groq is fast and cheap
      isFree: false,
    }));

    return models;
  } catch (error) {
    console.error("Error fetching Groq models:", error);
    return [];
  }
}

export async function fetchPollinationsTextModels(): Promise<OpenRouterModel[]> {
  try {
    const response = await fetch("https://text.pollinations.ai/models", {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      console.error("Failed to fetch Pollinations text models:", response.statusText);
      return [];
    }

    const models: any[] = await response.json();
    const formattedModels: OpenRouterModel[] = models.map((model: any) => ({
      id: model.name,
      name: model.name,
      description: model.description,
      context_length: model.maxInputChars,
      pricing: { prompt: "0", completion: "0" }, // Pollinations is free
      isFree: true,
    }));

    return formattedModels;
  } catch (error) {
    console.error("Error fetching Pollinations text models:", error);
    return [];
  }
}