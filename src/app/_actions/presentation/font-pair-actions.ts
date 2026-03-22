"use server";

import { utapi } from "@/app/api/uploadthing/core";
import { auth } from "@/server/auth";
import { db } from "@/server/db";
import * as z from "zod";

// Schema for creating a font pair
const fontPairSchema = z.object({
  heading: z.string().min(1),
  headingUrl: z.string().optional(),
  headingWeight: z.number().optional(),
  body: z.string().min(1),
  bodyUrl: z.string().optional(),
  bodyWeight: z.number().optional(),
});

export type FontPairFormData = z.infer<typeof fontPairSchema>;

// Create a new font pair
export async function createFontPair(formData: FontPairFormData) {
  try {
    const session = await auth();
    if (!session?.user) {
      return {
        success: false,
        message: "You must be signed in to save a font pair",
      };
    }

    const validatedData = fontPairSchema.parse(formData);

    const newFontPair = await db.fontPair.create({
      data: {
        heading: validatedData.heading,
        headingUrl: validatedData.headingUrl,
        headingWeight: validatedData.headingWeight,
        body: validatedData.body,
        bodyUrl: validatedData.bodyUrl,
        bodyWeight: validatedData.bodyWeight,
        userId: session.user.id,
      },
    });

    return {
      success: true,
      fontPairId: newFontPair.id,
      message: "Font pair saved successfully",
    };
  } catch (error) {
    console.error("Failed to create font pair:", error);

    if (error instanceof z.ZodError) {
      return {
        success: false,
        message:
          "Invalid font pair data. Please check your inputs and try again.",
      };
    } else if (error instanceof Error && error.message.includes("Prisma")) {
      return {
        success: false,
        message: "Database error. Please try again later.",
      };
    } else {
      return {
        success: false,
        message: "Something went wrong. Please try again later.",
      };
    }
  }
}

// Get all font pairs for the current user
export async function getUserFontPairs() {
  try {
    const session = await auth();
    if (!session?.user) {
      return {
        success: false,
        message: "You must be signed in to view your font pairs",
        fontPairs: [],
      };
    }

    const fontPairs = await db.fontPair.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return {
      success: true,
      fontPairs,
    };
  } catch (error) {
    console.error("Failed to fetch font pairs:", error);
    return {
      success: false,
      message:
        "Unable to load font pairs at this time. Please try again later.",
      fontPairs: [],
    };
  }
}

// Delete a font pair
export async function deleteFontPair(fontPairId: string) {
  try {
    const session = await auth();
    if (!session?.user) {
      return {
        success: false,
        message: "You must be signed in to delete a font pair",
      };
    }

    // Verify ownership
    const existingFontPair = await db.fontPair.findUnique({
      where: { id: fontPairId },
    });

    if (!existingFontPair) {
      return { success: false, message: "Font pair not found" };
    }

    if (existingFontPair.userId !== session.user.id) {
      return {
        success: false,
        message: "Not authorized to delete this font pair",
      };
    }

    // Delete files from UploadThing if they exist
    const filesToDelete: string[] = [];

    if (existingFontPair.headingUrl) {
      const headingKey = existingFontPair.headingUrl.split("/").pop();
      if (headingKey) filesToDelete.push(headingKey);
    }

    if (existingFontPair.bodyUrl) {
      const bodyKey = existingFontPair.bodyUrl.split("/").pop();
      if (bodyKey) filesToDelete.push(bodyKey);
    }

    if (filesToDelete.length > 0) {
      try {
        await utapi.deleteFiles(filesToDelete);
      } catch (error) {
        console.error("Failed to delete font files from UploadThing:", error);
        // Continue with database deletion even if file deletion fails
      }
    }

    await db.fontPair.delete({
      where: { id: fontPairId },
    });

    return {
      success: true,
      message: "Font pair deleted successfully",
    };
  } catch (error) {
    console.error("Failed to delete font pair:", error);
    return {
      success: false,
      message:
        "Something went wrong while deleting the font pair. Please try again later.",
    };
  }
}
