/**
 * Configuration for the local Llama 4 API
 * 
 * This file provides utilities for checking if the local Llama 4 API is available
 * and using it when possible, falling back to Together.ai when not available.
 */

import { TogetherLLM } from "together-ai/langchain";
import { ChatLlamaCpp } from "@langchain/community/chat_models/llama_cpp";

/**
 * Check if the local Llama 4 API is available
 */
export async function isLocalLlama4Available(): Promise<boolean> {
  try {
    const response = await fetch("http://localhost:8000/health", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      const data = await response.json();
      return data.status === "ok" && data.model === "llama-4-8b-instruct";
    }

    return false;
  } catch (error) {
    console.error("Error checking local Llama 4 availability:", error);
    return false;
  }
}

/**
 * Get the appropriate Llama 4 model instance
 * Uses local API if available, falls back to Together.ai
 */
export async function getLlama4Model(options: {
  temperature?: number;
  streaming?: boolean;
}) {
  const isLocalAvailable = await isLocalLlama4Available();

  if (isLocalAvailable) {
    console.log("Using local Llama 4 API");
    // Use the local Llama 4 API
    return new ChatLlamaCpp({
      modelPath: "http://localhost:8000", // This is actually the API URL, not a path
      temperature: options.temperature ?? 0.7,
      streaming: options.streaming ?? false,
      verbose: false,
    });
  } else {
    console.log("Using Together.ai Llama 4 API");
    // Fall back to Together.ai
    return new TogetherLLM({
      modelName: "meta-llama/Llama-4-8B-Instruct",
      temperature: options.temperature ?? 0.7,
      streaming: options.streaming ?? false,
      apiKey: process.env.TOGETHER_AI_API_KEY,
    });
  }
}

