"use server";

import {
  generateImageAction as generateTogetherImageAction,
  type ImageModelList as TogetherImageModelList,
} from "@/app/_actions/image/generate";
import { utapi } from "@/app/api/uploadthing/core";
import { env } from "@/env";
import { auth } from "@/server/auth";
import { db } from "@/server/db";
import { fal } from "@fal-ai/client";
import { UTFile } from "uploadthing/server";

export type FalImageModelList =
  | "fal-ai/flux-2/flash"
  | "fal-ai/flux-2/turbo"
  | "fal-ai/flux/dev"
  | "fal-ai/flux-2-pro"
  | "fal-ai/nano-banana-pro";

export type ImageModelList = TogetherImageModelList | FalImageModelList;

if (env.FAL_API_KEY) {
  fal.config({
    credentials: env.FAL_API_KEY,
  });
}

async function persistGeneratedImage(
  imageUrl: string,
  prompt: string,
  userId: string,
  filePrefix: string,
) {
  const imageResponse = await fetch(imageUrl);
  if (!imageResponse.ok) {
    throw new Error("Failed to download generated image");
  }

  const imageBlob = await imageResponse.blob();
  const imageBuffer = await imageBlob.arrayBuffer();
  const filename = `${filePrefix}_${Date.now()}.png`;
  const utFile = new UTFile([new Uint8Array(imageBuffer)], filename);
  const uploadResult = await utapi.uploadFiles([utFile]);

  if (!uploadResult[0]?.data?.ufsUrl) {
    throw new Error("Failed to upload generated image");
  }

  return db.generatedImage.create({
    data: {
      url: uploadResult[0].data.ufsUrl,
      prompt,
      userId,
    },
  });
}

async function generateFalImage(
  prompt: string,
  model: FalImageModelList,
  userId: string,
) {
  if (!env.FAL_API_KEY) {
    return {
      success: false,
      error: "FAL_API_KEY is not configured",
    };
  }

  const result = await fal.subscribe(model, {
    input: {
      prompt,
      num_images: 1,
      aspect_ratio: "1:1",
    },
  });

  const imageUrl = result.data?.images?.[0]?.url;
  if (!imageUrl) {
    throw new Error("Failed to generate image");
  }

  const image = await persistGeneratedImage(imageUrl, prompt, userId, "image");

  return {
    success: true,
    image,
  };
}

export async function generateImageAction(
  prompt: string,
  model: ImageModelList = "fal-ai/flux-2/flash",
) {
  const session = await auth();

  if (!session?.user?.id) {
    return {
      success: false,
      error: "You must be logged in to generate images",
    };
  }

  try {
    if (model.startsWith("fal-ai/")) {
      return await generateFalImage(
        prompt,
        model as FalImageModelList,
        session.user.id,
      );
    }

    return await generateTogetherImageAction(
      prompt,
      model as TogetherImageModelList,
    );
  } catch (error) {
    console.error("Error generating image:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to generate image",
    };
  }
}
