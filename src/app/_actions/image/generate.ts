"use server";

import { utapi } from "@/app/api/uploadthing/core";
import { env } from "@/env";
import { requireOptionalIntegration } from "@/lib/env/optional-integrations";
import { auth } from "@/server/auth";
import { db } from "@/server/db";
import Together from "together-ai";
import { UTFile } from "uploadthing/server";

export type ImageModelList =
  | "black-forest-labs/FLUX1.1-pro"
  | "black-forest-labs/FLUX.1-schnell"
  | "black-forest-labs/FLUX.1-schnell-Free"
  | "black-forest-labs/FLUX.1-pro"
  | "black-forest-labs/FLUX.1-dev";

export async function generateImageAction(
  prompt: string,
  model: ImageModelList = "black-forest-labs/FLUX.1-schnell-Free",
) {
  // Get the current session
  const session = await auth();

  // Check if user is authenticated
  if (!session?.user?.id) {
    throw new Error("You must be logged in to generate images");
  }

  try {
    const togetherConfig = requireOptionalIntegration({
      integration: "Together AI",
      envVar: "TOGETHER_AI_API_KEY",
      value: env.TOGETHER_AI_API_KEY,
      feature: "AI image generation",
    });

    if (!togetherConfig.ok) {
      return {
        success: false,
        error: togetherConfig.error,
      };
    }

    const together = new Together({ apiKey: togetherConfig.value });

    console.log(`Generating image with model: ${model}`);

    // Generate the image using Together AI
    const response = (await together.images.create({
      model: model,
      prompt: prompt,
      width: 1024,
      height: 768,
      steps: model.includes("schnell") ? 4 : 28, // Fewer steps for schnell models
      n: 1,
    })) as unknown as {
      id: string;
      model: string;
      object: string;
      data: {
        url: string;
      }[];
    };

    const imageUrl = response.data[0]?.url;

    if (!imageUrl) {
      throw new Error("Failed to generate image");
    }

    console.log(`Generated image URL: ${imageUrl}`);

    // Download the image from Together AI URL
    const imageResponse = await fetch(imageUrl);
    if (!imageResponse.ok) {
      throw new Error("Failed to download image from Together AI");
    }

    const imageBlob = await imageResponse.blob();
    const imageBuffer = await imageBlob.arrayBuffer();

    // Generate a filename based on the prompt
    const filename = `${prompt.substring(0, 20).replace(/[^a-z0-9]/gi, "_")}_${Date.now()}.png`;

    // Create a UTFile from the downloaded image
    const utFile = new UTFile([new Uint8Array(imageBuffer)], filename);

    // Upload to UploadThing
    const uploadResult = await utapi.uploadFiles([utFile]);

    if (!uploadResult[0]?.data?.ufsUrl) {
      console.error("Upload error:", uploadResult[0]?.error);
      throw new Error("Failed to upload image to UploadThing");
    }

    console.log(uploadResult);
    const permanentUrl = uploadResult[0].data.ufsUrl;
    console.log(`Uploaded to UploadThing URL: ${permanentUrl}`);

    // Store in database with the permanent URL
    const generatedImage = await db.generatedImage.create({
      data: {
        url: permanentUrl, // Store the UploadThing URL instead of the Together AI URL
        prompt: prompt,
        userId: session.user.id,
      },
    });

    return {
      success: true,
      image: generatedImage,
    };
  } catch (error) {
    console.error("Error generating image:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to generate image",
    };
  }
}
