"use server";

import { utapi } from "@/app/api/uploadthing/core";
import { auth } from "@/server/auth";
import { db } from "@/server/db";
import { UTFile } from "uploadthing/server";
import { POLLINATIONS_MODELS, type PollinationsModel } from "./models";

export type ImageModelList = PollinationsModel["id"];

export async function generateImageAction(
  prompt: string,
  model: ImageModelList = "flux",
) {
  // Get the current session
  const session = await auth();

  // Check if user is authenticated
  if (!session?.user?.id) {
    throw new Error("You must be logged in to generate images");
  }

  try {
    console.log(`Generating image with Pollinations AI using model: ${model}`);

    // Encode the prompt for URL
    const encodedPrompt = encodeURIComponent(prompt);
    const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1024&height=768&model=${model}`;

    console.log(`Generated image URL: ${imageUrl}`);

    // Download the image from Pollinations AI URL with simple retries
    const maxAttempts = 3;
    let imageResponse: Response | null = null;
    let lastError: unknown;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);

      try {
        const response = await fetch(imageUrl, {
          signal: controller.signal,
        });
        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`Pollinations responded with status ${response.status}`);
        }

        imageResponse = response;
        break;
      } catch (fetchError) {
        clearTimeout(timeoutId);
        lastError = fetchError;
        console.warn(
          `Pollinations download attempt ${attempt} failed`,
          fetchError,
        );

        if (attempt < maxAttempts) {
          await new Promise((resolve) =>
            setTimeout(resolve, 500 * attempt),
          );
        }
      }
    }

    if (!imageResponse) {
      throw new Error(
        lastError instanceof Error
          ? lastError.message
          : "Failed to download image from Pollinations AI",
      );
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
        url: permanentUrl, // Store the UploadThing URL
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
