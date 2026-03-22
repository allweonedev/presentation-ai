"use server";

import { type PlateSlide } from "@/components/notebook/presentation/utils/parser";
import { type PresentationCustomization } from "@/lib/presentation/customization";
import { getPresentationThumbnailUrl } from "@/lib/presentation/thumbnail";
import { auth } from "@/server/auth";
import { db } from "@/server/db";
import { canEditDocument, canReadDocument } from "@/server/share/authorization";
import { normalizeShareEmail } from "@/server/share/utils";
import { type InputJsonValue } from "@prisma/client/runtime/library";
import { notFound } from "next/navigation";

export async function createPresentation({
  content,
  title,
  theme = "mystique",
  outline,
  imageSource,
  presentationStyle,
  customization,
  language,
  files,
  selectedChunks,
}: {
  content: {
    slides: PlateSlide[];
  };
  title: string;
  theme?: string;
  outline?: string[];
  imageSource?: string;
  presentationStyle?: string;
  customization?: PresentationCustomization;
  language?: string;
  files?: Array<{ url: string; name: string }>;
  selectedChunks?: Array<{
    chunkId: string;
    ragId?: string;
    slideNumber?: number | null;
    content?: string;
  }>;
}) {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  try {
    const presentation = await db.baseDocument.create({
      data: {
        type: "PRESENTATION",
        documentType: "presentation",
        title: title || "Untitled Presentation",
        userId: session.user.id,
        thumbnailUrl: getPresentationThumbnailUrl(content.slides) ?? undefined,
        presentation: {
          create: {
            content: content as unknown as InputJsonValue,
            theme,
            imageSource,
            presentationStyle,
            customization: customization as InputJsonValue | undefined,
            language,
            outline,
            files: files as InputJsonValue | undefined,
            selectedChunks: selectedChunks as InputJsonValue | undefined,
          },
        },
      },
      include: {
        presentation: true,
      },
    });

    return {
      success: true,
      message: "Presentation created successfully",
      presentation,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "Failed to create presentation",
    };
  }
}

export async function createEmptyPresentation({
  title,
  theme = "mystique",
  language = "en-US",
  files,
  selectedChunks,
}: {
  title: string;
  theme?: string;
  language?: string;
  files?: Array<{ url: string; name: string }>;
  selectedChunks?: Array<{
    chunkId: string;
    ragId?: string;
    slideNumber?: number | null;
    content?: string;
  }>;
}) {
  return createPresentation({
    content: { slides: [] },
    title,
    theme,
    language,
    files,
    selectedChunks,
  });
}

export async function createBlankPresentation(
  title: string,
  theme = "mystique",
  language = "en-US",
) {
  const blankSlide: PlateSlide = {
    content: [
      {
        type: "h1",
        children: [{ text: "" }],
      },
    ],
    id: crypto.randomUUID(),
    alignment: "center",
  };

  return createPresentation({
    content: { slides: [blankSlide] },
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
  customization,
  language,
  thumbnailUrl,
  files,
  selectedChunks,
}: {
  id: string;
  content?: {
    slides: PlateSlide[];
    config?: Record<string, unknown>;
  };
  title?: string;
  theme?: string;
  prompt?: string;
  outline?: string[];
  searchResults?: Array<{ query: string; results: unknown[] }>;
  imageSource?: string;
  presentationStyle?: string;
  customization?: PresentationCustomization;
  language?: string;
  thumbnailUrl?: string | null;
  files?: Array<{ url: string; name: string }>;
  selectedChunks?: Array<{
    chunkId: string;
    ragId?: string;
    slideNumber?: number | null;
    content?: string;
  }>;
}) {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const canEdit = await canEditDocument(id, {
    userId: session.user.id,
    userEmail: normalizeShareEmail(session.user.email),
  });
  if (!canEdit) {
    return {
      success: false,
      message: "You do not have permission to edit this presentation",
    };
  }

  try {
    const presentation = await db.baseDocument.update({
      where: { id },
      data: {
        title,
        thumbnailUrl:
          content !== undefined
            ? getPresentationThumbnailUrl(content.slides)
            : thumbnailUrl,
        presentation: {
          update: {
            prompt,
            content: content as unknown as InputJsonValue,
            theme,
            imageSource,
            presentationStyle,
            customization: customization as InputJsonValue | undefined,
            language,
            outline,
            searchResults: searchResults as unknown as InputJsonValue,
            files: files as InputJsonValue | undefined,
            selectedChunks: selectedChunks as InputJsonValue | undefined,
          },
        },
      },
      include: {
        presentation: {
          include: {
            ragFiles: {
              include: {
                rag: {
                  select: {
                    id: true,
                    fileUrl: true,
                    fileName: true,
                    processingStatus: true,
                  },
                },
              },
            },
          },
        },
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

  const canEdit = await canEditDocument(id, {
    userId: session.user.id,
    userEmail: normalizeShareEmail(session.user.email),
  });
  if (!canEdit) {
    return {
      success: false,
      message: "You do not have permission to edit this presentation",
    };
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
    const result = await db.baseDocument.deleteMany({
      where: {
        id: { in: ids },
        userId: session.user.id,
      },
    });

    return {
      success: result.count > 0,
      message:
        ids.length === 1
          ? "Presentation deleted successfully"
          : `${result.count} presentations deleted successfully`,
    };
  } catch (error) {
    console.error("Failed to delete presentations:", error);
    return {
      success: false,
      message: "Failed to delete presentations",
    };
  }
}

export async function getPresentation(id: string) {
  const session = await auth();
  const canRead = await canReadDocument(id, {
    userId: session?.user.id ?? null,
    userEmail: normalizeShareEmail(session?.user.email),
  });
  const canEdit = await canEditDocument(id, {
    userId: session?.user.id ?? null,
    userEmail: normalizeShareEmail(session?.user.email),
  });

  try {
    const presentation = await db.baseDocument.findUnique({
      where: { id },
      include: {
        presentation: {
          include: {
            ragFiles: {
              include: {
                rag: {
                  select: {
                    id: true,
                    fileUrl: true,
                    fileName: true,
                    processingStatus: true,
                  },
                },
              },
            },
          },
        },
        favorites: session?.user.id
          ? {
              where: { userId: session.user.id },
              select: { id: true },
            }
          : false,
      },
    });

    if (!presentation) {
      notFound();
    }

    if (!canRead) {
      notFound();
    }

    return {
      success: true,
      presentation,
      canEdit,
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
  const canRead = await canReadDocument(id, {
    userId: session?.user.id ?? null,
    userEmail: normalizeShareEmail(session?.user.email),
  });

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
            customization: true,
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

    if (!canRead) {
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
  return updatePresentation({ id, theme });
}

export async function duplicatePresentation(id: string, newTitle?: string) {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const canRead = await canReadDocument(id, {
    userId: session.user.id,
    userEmail: normalizeShareEmail(session.user.email),
  });
  if (!canRead) {
    return {
      success: false,
      message: "You do not have permission to view this presentation",
    };
  }

  try {
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

    const duplicated = await db.baseDocument.create({
      data: {
        type: "PRESENTATION",
        documentType: "presentation",
        title: newTitle ?? `(Copy) ${original.title}`,
        userId: session.user.id,
        thumbnailUrl: original.thumbnailUrl,
        presentation: {
          create: {
            content: original.presentation.content as unknown as InputJsonValue,
            theme: original.presentation.theme,
            customization:
              (original.presentation.customization as InputJsonValue) ??
              undefined,
            files:
              (original.presentation.files as InputJsonValue) ?? undefined,
            selectedChunks:
              (original.presentation.selectedChunks as InputJsonValue) ??
              undefined,
          },
        },
      },
      include: {
        presentation: true,
      },
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
