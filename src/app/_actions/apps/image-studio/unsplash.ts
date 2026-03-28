"use server";

import { getImageFromUnsplash as getSingleUnsplashImage } from "@/app/_actions/image/unsplash";
import { env } from "@/env";
import { requireOptionalIntegration } from "@/lib/env/optional-integrations";

type UnsplashImageResult = {
  url: string;
  thumb?: string;
  author?: string;
  username?: string;
  downloadLocation?: string;
  link?: string;
};

interface UnsplashImage {
  urls: {
    regular: string;
    thumb: string;
  };
  user: {
    name: string;
    username: string;
  };
  links: {
    download_location: string;
    html: string;
  };
}

interface UnsplashResponse {
  results: UnsplashImage[];
}

export async function searchUnsplashImages(
  query: string,
  perPage = 30,
  page = 1,
): Promise<{ success: boolean; images?: UnsplashImageResult[]; error?: string }> {
  const unsplashConfig = requireOptionalIntegration({
    integration: "Unsplash",
    envVar: "UNSPLASH_ACCESS_KEY",
    value: env.UNSPLASH_ACCESS_KEY,
    feature: "Unsplash image search",
  });

  if (!unsplashConfig.ok) {
    return {
      success: false,
      error: unsplashConfig.error,
    };
  }

  try {
    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&page=${page}&per_page=${perPage}`,
      {
        headers: {
          Authorization: `Client-ID ${unsplashConfig.value}`,
        },
      },
    );

    if (!response.ok) {
      throw new Error(`Unsplash API error: ${response.status}`);
    }

    const data = (await response.json()) as UnsplashResponse;

    return {
      success: true,
      images: data.results.map((image) => ({
        url: image.urls.regular,
        thumb: image.urls.thumb,
        author: image.user.name,
        username: image.user.username,
        downloadLocation: image.links.download_location,
        link: image.links.html,
      })),
    };
  } catch (error) {
    console.error("Unsplash search failed:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to search Unsplash",
    };
  }
}

export async function triggerUnsplashDownload(downloadLocation: string) {
  const unsplashConfig = requireOptionalIntegration({
    integration: "Unsplash",
    envVar: "UNSPLASH_ACCESS_KEY",
    value: env.UNSPLASH_ACCESS_KEY,
    feature: "Unsplash download tracking",
  });

  if (!unsplashConfig.ok) {
    return { success: false };
  }

  try {
    await fetch(downloadLocation, {
      headers: {
        Authorization: `Client-ID ${unsplashConfig.value}`,
      },
    });
    return { success: true };
  } catch (error) {
    console.error("Unsplash download trigger failed:", error);
    return { success: false };
  }
}

export async function getImageFromUnsplash(
  query: string,
  layoutType?: string,
) {
  return getSingleUnsplashImage(query, layoutType as never);
}
