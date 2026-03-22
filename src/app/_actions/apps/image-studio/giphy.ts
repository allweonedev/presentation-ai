"use server";

type GifResult = {
  id: string;
  url: string;
  thumb?: string;
  title?: string;
};

export async function getTrendingGiphyGifs(): Promise<{
  success: boolean;
  gifs?: GifResult[];
  error?: string;
}> {
  return { success: true, gifs: [] };
}

export async function searchGiphyGifs(
  _query: string,
): Promise<{ success: boolean; gifs?: GifResult[]; error?: string }> {
  return { success: true, gifs: [] };
}
