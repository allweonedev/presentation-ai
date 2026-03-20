"use server";

import { getImageFromUnsplash as getSingleUnsplashImage } from "@/app/_actions/image/unsplash";
import { env } from "@/env";

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
  try {
    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&page=${page}&per_page=${perPage}`,
      {
        headers: {
          Authorization: `Client-ID ${env.UNSPLASH_ACCESS_KEY}`,
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
  try {
    await fetch(downloadLocation, {
      headers: {
        Authorization: `Client-ID ${env.UNSPLASH_ACCESS_KEY}`,
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
