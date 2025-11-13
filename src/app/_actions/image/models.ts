export interface PollinationsModel {
  id: string;
  name: string;
  description?: string;
  isFree?: boolean;
  parameters?: {
    width?: number;
    height?: number;
  };
}

// Pollinations models based on their documentation
export const POLLINATIONS_MODELS: PollinationsModel[] = [
  {
    id: "flux",
    name: "FLUX",
    description: "High-quality image generation",
    isFree: true,
  },
  {
    id: "turbo",
    name: "Turbo",
    description: "Fast image generation",
    isFree: true,
  },
  {
    id: "kontext",
    name: "Kontext",
    description: "Context-aware image generation",
    isFree: true,
  },
  {
    id: "gptimage",
    name: "GPT Image",
    description: "GPT-powered image generation",
    isFree: true,
  },
];

export async function fetchPollinationsModels(): Promise<PollinationsModel[]> {
  // For now, return the static list
  // In the future, we could fetch from their API if they provide one
  return POLLINATIONS_MODELS;
}