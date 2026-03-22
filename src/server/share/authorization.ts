import { auth } from "@/server/auth";
import { db } from "@/server/db";

interface SessionIdentity {
  userId: string | null;
  userEmail: string | null;
}

export async function getSessionIdentity(): Promise<SessionIdentity> {
  const session = await auth();
  return {
    userId: session?.user.id ?? null,
    userEmail: session?.user.email ?? null,
  };
}

export async function canReadDocument(
  documentId: string,
  identity: SessionIdentity,
) {
  const document = await db.baseDocument.findUnique({
    where: { id: documentId },
    select: { userId: true, isPublic: true },
  });

  if (!document) {
    return false;
  }

  return document.isPublic || document.userId === identity.userId;
}

export async function canEditDocument(
  documentId: string,
  identity: SessionIdentity,
) {
  const document = await db.baseDocument.findUnique({
    where: { id: documentId },
    select: { userId: true },
  });

  if (!document) {
    return false;
  }

  return document.userId === identity.userId;
}

export async function getDocumentAccessForUser(
  documentId: string,
  userId: string | null,
  userEmail: string | null,
) {
  const identity = { userId, userEmail };
  const [canRead, canEdit] = await Promise.all([
    canReadDocument(documentId, identity),
    canEditDocument(documentId, identity),
  ]);

  return { canRead, canEdit };
}
