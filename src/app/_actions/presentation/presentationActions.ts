"use server";

import { type PlateSlide } from "@/components/presentation/utils/parser";
import { auth } from "@/server/auth";
import { db } from "@/server/db";
import { type InputJsonValue } from "@prisma/client/runtime/library";

export async function createPresentation({
  content,
  title,
  theme = "default",
  outline,
  imageSource,
  presentationStyle,
  language,
}: {
  content: {
    slides: PlateSlide[];
  };
  title: string;
  theme?: string;
  outline?: string[];
  imageSource?: string;
  presentationStyle?: string;
  language?: string;
}) {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }
  let userId = session.user.id;

  try {
    const presentation = await db.$transaction(async (tx) => {
      // Ensure the user record exists in the database. In some deployments
      // the session may contain a user id that doesn't yet exist in the
      // local SQLite DB (stateless JWTs or moved DBs). Create a minimal
      // user row if missing so the foreign key on BaseDocument won't fail.
      const existingUser = await tx.user.findUnique({ where: { id: userId } });
      if (!existingUser) {
        // Before creating, check if a user with this email exists (NextAuth may have created it)
        const sessionEmail = (session.user as any).email as string | undefined;
        const userByEmail = sessionEmail
          ? await tx.user.findUnique({ where: { email: sessionEmail } })
          : null;

        if (userByEmail) {
          // User exists with this email but different ID - this shouldn't happen with proper NextAuth setup
          // but log it and use the existing user's ID
          console.warn(
            `⚠️ User ID mismatch: session has ${userId}, but DB has ${userByEmail.id} for email ${sessionEmail}`,
          );
          // Use the existing user's ID for this operation
          // Update userId to match DB
          const actualUserId = userByEmail.id;
          userId = actualUserId;
        } else {
          // Safe to create new user
          await tx.user.create({
            data: {
              id: userId,
              name: session.user.name ?? undefined,
              email: sessionEmail,
              image: session.user.image ?? undefined,
              role: "USER",
              hasAccess: false,
            },
          });
        }
      }

      const baseDocument = await tx.baseDocument.create({
        data: {
          type: "PRESENTATION",
          documentType: "presentation",
          title: title ?? "Untitled Presentation",
          userId,
        },
      });

      const presentationData: {
        id: string;
        content: InputJsonValue;
        theme: string;
        outline: InputJsonValue;
        imageSource?: string;
        presentationStyle?: string;
        language?: string;
      } = {
        id: baseDocument.id,
        content: content as unknown as InputJsonValue,
        theme,
        outline: (outline ?? []) as unknown as InputJsonValue,
      };

      if (typeof imageSource === "string") {
        presentationData.imageSource = imageSource;
      }

      if (typeof presentationStyle === "string") {
        presentationData.presentationStyle = presentationStyle;
      }

      if (typeof language === "string") {
        presentationData.language = language;
      }

      await tx.presentation.create({
        data: presentationData,
      });

      const hydrated = await tx.baseDocument.findUnique({
        where: { id: baseDocument.id },
        include: {
          presentation: true,
        },
      });

      if (!hydrated) {
        throw new Error("Failed to hydrate newly created presentation");
      }

      return hydrated;
    });

    return {
      success: true,
      message: "Presentation created successfully",
      presentation,
    };
  } catch (error) {
    console.error(error);
    const code = (error as { code?: string }).code;
    // P2003 = Foreign key constraint failed (likely userId doesn't exist)
    if (code === "P2003") {
      return {
        success: false,
        message:
          "Your account isn\'t initialized for this database. Please sign out and sign back in, then try again.",
      };
    }
    return {
      success: false,
      message: "Failed to create presentation",
    };
  }
}

export async function createEmptyPresentation(
  title: string,
  theme = "default",
  language = "en-US",
) {
  const emptyContent: { slides: PlateSlide[] } = { slides: [] };

  return createPresentation({
    content: emptyContent,
    title,
    theme,
    language,
  });
}

export async function updatePresentation({
  id,
  content,
  prompt,
  title,
  theme,
  outline,
  searchResults,
  imageSource,
  presentationStyle,
  language,
  thumbnailUrl,
}: {
  id: string;
  content?: {
    slides: PlateSlide[];
    config: Record<string, unknown>;
  };
  title?: string;
  theme?: string;
  prompt?: string;
  outline?: string[];
  searchResults?: Array<{ query: string; results: unknown[] }>;
  imageSource?: string;
  presentationStyle?: string;
  language?: string;
  thumbnailUrl?: string;
}) {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  try {
    // Extract values from content if provided there
    const effectiveTheme = theme;
    const effectiveImageSource = imageSource;
    const effectivePresentationStyle = presentationStyle;
    const effectiveLanguage = language;

    // Update base document with all presentation data
    const presentation = await db.baseDocument.update({
      where: { id },
      data: {
        title: title,
        thumbnailUrl,
        presentation: {
          update: {
            prompt: prompt,
            content: content as unknown as InputJsonValue,
            theme: effectiveTheme,
            imageSource: effectiveImageSource,
            presentationStyle: effectivePresentationStyle,
            language: effectiveLanguage,
            outline,
            searchResults: searchResults as unknown as InputJsonValue,
          },
        },
      },
      include: {
        presentation: true,
      },
    });

    return {
      success: true,
      message: "Presentation updated successfully",
      presentation,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "Failed to update presentation",
    };
  }
}

export async function updatePresentationTitle(id: string, title: string) {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  try {
    const presentation = await db.baseDocument.update({
      where: { id },
      data: { title },
      include: {
        presentation: true,
      },
    });

    return {
      success: true,
      message: "Presentation title updated successfully",
      presentation,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "Failed to update presentation title",
    };
  }
}

export async function deletePresentation(id: string) {
  return deletePresentations([id]);
}

export async function deletePresentations(ids: string[]) {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  try {
    // Delete the base documents using deleteMany (this will cascade delete the presentations)
    const result = await db.baseDocument.deleteMany({
      where: {
        id: {
          in: ids,
        },
        userId: session.user.id, // Ensure only user's own presentations can be deleted
      },
    });

    const deletedCount = result.count;
    const failedCount = ids.length - deletedCount;

    if (failedCount > 0) {
      return {
        success: deletedCount > 0,
        message:
          deletedCount > 0
            ? `Deleted ${deletedCount} presentations, failed to delete ${failedCount} presentations`
            : "Failed to delete presentations",
        partialSuccess: deletedCount > 0,
      };
    }

    return {
      success: true,
      message:
        ids.length === 1
          ? "Presentation deleted successfully"
          : `${deletedCount} presentations deleted successfully`,
    };
  } catch (error) {
    console.error("Failed to delete presentations:", error);
    return {
      success: false,
      message: "Failed to delete presentations",
    };
  }
}

// Get the presentation with the presentation content
export async function getPresentation(id: string) {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  try {
    const presentation = await db.baseDocument.findUnique({
      where: { id },
      include: {
        presentation: true,
      },
    });

    return {
      success: true,
      presentation,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "Failed to fetch presentation",
    };
  }
}

export async function getPresentationContent(id: string) {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  try {
    const presentation = await db.baseDocument.findUnique({
      where: { id },
      include: {
        presentation: {
          select: {
            id: true,
            content: true,
            theme: true,
            outline: true,
          },
        },
      },
    });

    if (!presentation) {
      return {
        success: false,
        message: "Presentation not found",
      };
    }

    // Check if the user has access to this presentation
    if (presentation.userId !== session.user.id && !presentation.isPublic) {
      return {
        success: false,
        message: "Unauthorized access",
      };
    }

    return {
      success: true,
      presentation: presentation.presentation,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "Failed to fetch presentation",
    };
  }
}

export async function updatePresentationTheme(id: string, theme: string) {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  try {
    const presentation = await db.presentation.update({
      where: { id },
      data: { theme },
    });

    return {
      success: true,
      message: "Presentation theme updated successfully",
      presentation,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "Failed to update presentation theme",
    };
  }
}

export async function duplicatePresentation(id: string, newTitle?: string) {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  try {
    // Get the original presentation
    const original = await db.baseDocument.findUnique({
      where: { id },
      include: {
        presentation: true,
      },
    });

    if (!original?.presentation) {
      return {
        success: false,
        message: "Original presentation not found",
      };
    }

    const originalPresentation = original.presentation;

    // Create a new presentation with the same content
    const duplicated = await db.$transaction(async (tx) => {
      // Ensure the user row exists before creating the duplicated document
      let actualUserId = session.user.id;
      const existingUser = await tx.user.findUnique({ where: { id: actualUserId } });
      if (!existingUser) {
        // Check if user exists by email (NextAuth may have created with different ID)
        const sessionEmail = (session.user as any).email as string | undefined;
        const userByEmail = sessionEmail
          ? await tx.user.findUnique({ where: { email: sessionEmail } })
          : null;

        if (userByEmail) {
          console.warn(
            `⚠️ User ID mismatch in duplicate: session has ${actualUserId}, but DB has ${userByEmail.id}`,
          );
          actualUserId = userByEmail.id;
        } else {
          // Safe to create new user
          await tx.user.create({
            data: {
              id: actualUserId,
              name: session.user.name ?? undefined,
              email: sessionEmail,
              image: session.user.image ?? undefined,
              role: "USER",
              hasAccess: false,
            },
          });
        }
      }

      const baseDocument = await tx.baseDocument.create({
        data: {
          type: "PRESENTATION",
          documentType: "presentation",
          title: newTitle ?? `${original.title} (Copy)`,
          userId: actualUserId,
          isPublic: false,
        },
      });

      const presentationData: {
        id: string;
        content: InputJsonValue;
        theme: string;
        outline: InputJsonValue;
        imageSource?: string;
        presentationStyle?: string | null;
        language?: string | null;
        prompt?: string | null;
        searchResults?: InputJsonValue;
      } = {
        id: baseDocument.id,
        content: originalPresentation.content as unknown as InputJsonValue,
        theme: originalPresentation.theme,
        outline:
          (originalPresentation.outline ?? []) as unknown as InputJsonValue,
      };

      if (originalPresentation.imageSource) {
        presentationData.imageSource = originalPresentation.imageSource;
      }

      presentationData.presentationStyle =
        originalPresentation.presentationStyle ?? null;

      presentationData.language = originalPresentation.language ?? null;

      presentationData.prompt = originalPresentation.prompt ?? null;

      if (originalPresentation.searchResults) {
        presentationData.searchResults =
          originalPresentation.searchResults as unknown as InputJsonValue;
      }

      await tx.presentation.create({
        data: presentationData,
      });

      const hydrated = await tx.baseDocument.findUnique({
        where: { id: baseDocument.id },
        include: {
          presentation: true,
        },
      });

      if (!hydrated) {
        throw new Error("Failed to hydrate duplicated presentation");
      }

      return hydrated;
    });

    return {
      success: true,
      message: "Presentation duplicated successfully",
      presentation: duplicated,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "Failed to duplicate presentation",
    };
  }
}
