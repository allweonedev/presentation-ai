"use server";

import { utapi } from "@/app/api/uploadthing/core";
import { env } from "@/env";
import { auth } from "@/server/auth";
import { db } from "@/server/db";
import { fal } from "@fal-ai/client";
import { UTFile } from "uploadthing/server";

// Configure fal client with API key
fal.config({
  credentials: env.FAL_API_KEY,
});

// Nano Banana Pro model for presentation slide images
// const SLIDE_IMAGE_MODEL = "fal-ai/nano-banana-pro";
const DEFAULT_SLIDE_IMAGE_MODEL = "fal-ai/flux-2/flash";

export async function generateSlideImageAction(
  prompt: string,
  imageModel: string = DEFAULT_SLIDE_IMAGE_MODEL,
) {
  const session = await auth();

  if (!session?.user?.id) {
    return {
      success: false,
      error: "You must be logged in to generate images",
    };
  }

  // Admin only feature
  if (!session.user.isAdmin) {
    return {
      success: false,
      error: "This feature is only available for admin users",
    };
  }

  try {
    console.log(`Generating slide image with model: ${imageModel}`);

    const result = await fal.subscribe(imageModel, {
      input: {
        prompt: prompt,
        num_images: 1,
        aspect_ratio: "16:9",
      },
    });

    const imageUrl = result.data?.images?.[0]?.url;

    if (!imageUrl) {
      console.log("Failed to generate slide image", result);
      throw new Error("Failed to generate slide image");
    }

    console.log(`Generated slide image URL: ${imageUrl}`);

    // Download the image from fal.ai URL
    const imageResponse = await fetch(imageUrl);
    if (!imageResponse.ok) {
      throw new Error("Failed to download image from fal.ai");
    }

    const imageBlob = await imageResponse.blob();
    const imageBuffer = await imageBlob.arrayBuffer();

    // Generate a filename
    const filename = `slide_${Date.now()}.png`;

    // Create a UTFile from the downloaded image
    const utFile = new UTFile([new Uint8Array(imageBuffer)], filename);

    // Upload to UploadThing
    const uploadResult = await utapi.uploadFiles([utFile]);

    if (!uploadResult[0]?.data?.ufsUrl) {
      console.error("Upload error:", uploadResult[0]?.error);
      throw new Error("Failed to upload image to UploadThing");
    }

    const permanentUrl = uploadResult[0].data.ufsUrl;
    console.log(`Uploaded slide image to: ${permanentUrl}`);

    // Store in database
    const generatedImage = await db.generatedImage.create({
      data: {
        url: permanentUrl,
        prompt: prompt,
        userId: session.user.id,
      },
    });

    return {
      success: true,
      image: generatedImage,
    };
  } catch (error) {
    console.error("Error generating slide image:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to generate slide image",
    };
  }
}
