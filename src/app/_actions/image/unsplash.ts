"use server";

import { type LayoutType } from "@/components/presentation/utils/parser";
import { env } from "@/env";
import { requireOptionalIntegration } from "@/lib/env/optional-integrations";
import { auth } from "@/server/auth";

export interface UnsplashImage {
  id: string;
  urls: {
    raw: string;
    full: string;
    regular: string;
    small: string;
    thumb: string;
  };
  alt_description: string | null;
  description: string | null;
  user: {
    name: string;
    username: string;
  };
  links: {
    download_location: string;
  };
}

export interface UnsplashSearchResponse {
  results: UnsplashImage[];
  total: number;
  total_pages: number;
}

export async function getImageFromUnsplash(
  query: string,
  layoutType?: LayoutType,
): Promise<{ success: boolean; imageUrl?: string; error?: string }> {
  // Get the current session
  const session = await auth();

  // Check if user is authenticated
  if (!session?.user?.id) {
    return { success: false, error: "You must be logged in to get images" };
  }

  const unsplashConfig = requireOptionalIntegration({
    integration: "Unsplash",
    envVar: "UNSPLASH_ACCESS_KEY",
    value: env.UNSPLASH_ACCESS_KEY,
    feature: "stock image search",
  });

  if (!unsplashConfig.ok) {
    return {
      success: false,
      error: unsplashConfig.error,
    };
  }

  const orientationQuery =
    layoutType === "vertical"
      ? "&orientation=landscape"
      : layoutType === "left" || layoutType === "right"
        ? "&orientation=portrait"
        : "&orientation=landscape";
  try {
    // Search for images
    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&page=1&per_page=1${orientationQuery}`,
      {
        headers: {
          Authorization: `Client-ID ${unsplashConfig.value}`,
        },
      },
    );

    if (!response.ok) {
      throw new Error(`Unsplash API error: ${response.status}`);
    }

    const data: UnsplashSearchResponse = await response.json();

    if (!data.results || data.results.length === 0) {
      return { success: false, error: "No images found for this query" };
    }

    const firstImage = data.results[0];
    if (!firstImage) {
      return { success: false, error: "No images found for this query" };
    }

    // Return the image URL directly without storing in database
    return {
      success: true,
      imageUrl: firstImage.urls.regular,
    };
  } catch (error) {
    console.error("Error getting Unsplash image:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to get image",
    };
  }
}
