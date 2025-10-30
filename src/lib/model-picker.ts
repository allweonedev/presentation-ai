import { createOpenAI } from "@ai-sdk/openai";
import { type LanguageModelV1 } from "ai";
import { createOllama } from "ollama-ai-provider";

/**
 * Centralized model picker function for all presentation generation routes
 * Supports OpenAI, Ollama, and LM Studio models
 */
export function modelPicker(
  modelProvider: string,
  modelId?: string,
): LanguageModelV1 {
  if (modelProvider === "ollama" && modelId) {
    // Use Ollama AI provider
    const ollama = createOllama();
    return ollama(modelId) as unknown as LanguageModelV1;
  }

  if (modelProvider === "lmstudio" && modelId) {
    // Use LM Studio with OpenAI compatible provider
    const lmstudio = createOpenAI({
      name: "lmstudio",
      baseURL: "http://localhost:1234/v1",
      apiKey: "lmstudio",
    });
    return lmstudio(modelId) as unknown as LanguageModelV1;
  }

  if (modelProvider === "openrouter" && modelId) {
    // Use OpenRouter
    const openrouter = createOpenAI({
      baseURL: "https://openrouter.ai/api/v1",
      apiKey: process.env.OPENROUTER_API_KEY || "",
    });
    return openrouter(modelId) as unknown as LanguageModelV1;
  }

  if (modelProvider === "groq" && modelId) {
    // Use Groq
    const groq = createOpenAI({
      baseURL: "https://api.groq.com/openai/v1",
      apiKey: process.env.GROQ_API_KEY || "",
    });
    return groq(modelId) as unknown as LanguageModelV1;
  }

  if (modelProvider === "pollinations" && modelId) {
    // Use Pollinations
    const pollinations = createOpenAI({
      baseURL: "https://text.pollinations.ai/openai",
      apiKey: "pollinations", // Pollinations doesn't require auth
    });
    return pollinations(modelId) as unknown as LanguageModelV1;
  }

  // Default to OpenRouter
  const openrouter = createOpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: process.env.OPENROUTER_API_KEY || "",
  });
  return openrouter("openai/gpt-4o-mini") as unknown as LanguageModelV1;
}
