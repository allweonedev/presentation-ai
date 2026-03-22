"use server";

import { type PlateSlide } from "@/components/notebook/presentation/utils/parser";
import {
  getPresentationSlidesFromContent,
  getPresentationThumbnailUrl,
} from "@/lib/presentation/thumbnail";
import { logger } from "@/lib/observability/server/logger";
import { auth } from "@/server/auth";
import { db } from "@/server/db";
import { canEditDocument } from "@/server/share/authorization";
import { normalizeShareEmail } from "@/server/share/utils";

type UpdatePresentationThumbnailUrlParams = {
  id: string;
  slides?: PlateSlide[];
  onlyIfMissing?: boolean;
};

export async function updatePresentationThumbnailUrl({
  id,
  slides,
  onlyIfMissing = false,
}: UpdatePresentationThumbnailUrlParams) {
  const actionName =
    "presentation.presentationThumbnailActions.updatePresentationThumbnailUrl";
  const span = logger.startSpan(`presentation.server_action.${actionName}`, {
    attributes: {
      "allweone.scope": "presentation",
      "allweone.action.type": "server_action",
      "allweone.action.name": actionName,
    },
  });

  try {
    const session = await auth();

    if (!session?.user) {
      throw new Error("Unauthorized");
    }

    const canEdit = await canEditDocument(id, {
      userId: session.user.id,
      userEmail: session.user.email
        ? normalizeShareEmail(session.user.email)
        : null,
    });

    if (!canEdit) {
      return {
        success: false,
        message: "You do not have permission to edit this presentation",
      };
    }

    try {
      const resolvedSlides =
        slides ??
        getPresentationSlidesFromContent(
          (
            await db.presentation.findUnique({
              where: { id },
              select: { content: true },
            })
          )?.content,
        );

      const thumbnailUrl = getPresentationThumbnailUrl(resolvedSlides);

      const updateResult = onlyIfMissing
        ? await db.baseDocument.updateMany({
            where: {
              id,
              thumbnailUrl: null,
            },
            data: {
              thumbnailUrl,
            },
          })
        : await db.baseDocument.update({
            where: { id },
            data: {
              thumbnailUrl,
            },
          });

      return {
        success: true,
        message: "Presentation thumbnail updated successfully",
        thumbnailUrl,
        updated:
          "count" in updateResult ? updateResult.count > 0 : true,
      };
    } catch (error) {
      console.error(error);
      return {
        success: false,
        message: "Failed to update presentation thumbnail",
      };
    }
  } catch (error) {
    span.error(error);
    throw error;
  } finally {
    span.end();
  }
}
