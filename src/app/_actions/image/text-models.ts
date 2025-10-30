tion export interface PollinationsTextModel {
  id: string;
  name: string;
  description?: string;
  isFree?: boolean;
}

// Pollinations text models based on testing
export const POLLINATIONS_TEXT_MODELS: PollinationsTextModel[] = [
  {
    id: "openai",
    name: "OpenAI",
    description: "OpenAI-compatible text generation",
    isFree: true,
  },
  {
    id: "claude",
    name: "Claude",
    description: "Anthropic Claude text generation",
    isFree: true,
  },
  {
    id: "gemini",
    name: "Gemini",
    description: "Google Gemini text generation",
    isFree: true,
  },
  {
    id: "llama",
    name: "Llama",
    description: "Meta Llama text generation",
    isFree: true,
  },
  {
    id: "mistral",
    name: "Mistral",
    description: "Mistral AI text generation",
    isFree: true,
  },
];

export async function fetchPollinationsTextModels(): Promise<PollinationsTextModel[]> {
  // For now, return the static list
  // These models are tested and working based on the test results
  return POLLINATIONS_TEXT_MODELS;
}
