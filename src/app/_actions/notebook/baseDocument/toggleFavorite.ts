"use server";

import { auth } from "@/server/auth";
import { db } from "@/server/db";

export async function addToFavorites(documentId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  try {
    await db.favoriteDocument.upsert({
      where: {
        userId_documentId: {
          userId: session.user.id,
          documentId,
        },
      },
      update: {},
      create: {
        userId: session.user.id,
        documentId,
      },
    });
    return { success: true };
  } catch (error) {
    console.error("Failed to add favorite:", error);
    return { error: "Failed to add favorite" };
  }
}

export async function removeFromFavorites(documentId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  try {
    await db.favoriteDocument.deleteMany({
      where: {
        userId: session.user.id,
        documentId,
      },
    });
    return { success: true };
  } catch (error) {
    console.error("Failed to remove favorite:", error);
    return { error: "Failed to remove favorite" };
  }
}
