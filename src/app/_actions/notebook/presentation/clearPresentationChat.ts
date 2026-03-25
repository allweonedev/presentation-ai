"use server";

import { ensureCheckpointerSetup } from "@/ai/lib/postgres";
import { auth } from "@/server/auth";
import { db } from "@/server/db";

export async function clearPresentationChat(presentationId: string) {
  const session = await auth();

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const presentation = await db.baseDocument.findFirst({
    where: {
      id: presentationId,
      userId: session.user.id,
      type: "PRESENTATION",
    },
  });

  if (!presentation) {
    throw new Error("Presentation not found");
  }

  await ensureCheckpointerSetup();

  await db.$transaction([
    db.$executeRaw`DELETE FROM checkpoint_blobs WHERE thread_id = ${presentationId}`,
    db.$executeRaw`DELETE FROM checkpoint_writes WHERE thread_id = ${presentationId}`,
    db.$executeRaw`DELETE FROM checkpoints WHERE thread_id = ${presentationId}`,
  ]);

  return { success: true };
}
