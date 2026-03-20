"use server";

import { auth } from "@/server/auth";
import { db } from "@/server/db";

export async function updateBaseDocumentTitle(id: string, title: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, message: "Unauthorized" };
  }

  try {
    await db.baseDocument.update({
      where: { id, userId: session.user.id },
      data: { title },
    });
    return { success: true };
  } catch (error) {
    console.error("Failed to update document title:", error);
    return { success: false, message: "Failed to update title" };
  }
}

export async function deleteBaseDocuments(ids: string[]) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, message: "Unauthorized" };
  }

  try {
    await db.baseDocument.deleteMany({
      where: {
        id: { in: ids },
        userId: session.user.id,
      },
    });
    return { success: true };
  } catch (error) {
    console.error("Failed to delete documents:", error);
    return { success: false, message: "Failed to delete documents" };
  }
}
