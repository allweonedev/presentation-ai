"use server";

type PixabayImage = {
  url: string;
  thumb?: string;
  title?: string;
  author?: string;
  link?: string;
};

export async function searchPixabayImages(
  _query: string,
): Promise<{ success: boolean; images?: PixabayImage[]; error?: string }> {
  return { success: true, images: [] };
}

export async function getImageFromPixabay(
  query: string,
  _layoutType?: string,
): Promise<{ success: boolean; imageUrl?: string; error?: string }> {
  const result = await searchPixabayImages(query);
  const firstImage = result.images?.[0];

  if (!result.success || !firstImage?.url) {
    return {
      success: false,
      error: result.error ?? "No Pixabay images found",
    };
  }

  return {
    success: true,
    imageUrl: firstImage.url,
  };
}
