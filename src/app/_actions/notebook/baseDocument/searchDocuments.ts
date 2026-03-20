"use server";

import { type DocumentType } from "@/prisma/client";
import { auth } from "@/server/auth";
import { db } from "@/server/db";

const ITEMS_PER_PAGE = 20;

export interface SearchDocumentItem {
  id: string;
  title: string;
  updatedAt: Date;
  thumbnailUrl: string | null;
  favorites: Array<{ id: string }>;
}

export async function searchDocuments({
  query,
  favoritesOnly,
  page = 0,
  documentTypes,
}: {
  query: string;
  favoritesOnly: boolean;
  page?: number;
  documentTypes: DocumentType[];
}) {
  const session = await auth();
  if (!session?.user?.id) {
    return { items: [], hasMore: false };
  }

  const skip = page * ITEMS_PER_PAGE;
  const where = {
    userId: session.user.id,
    type: { in: documentTypes },
    ...(query.trim()
      ? {
          title: {
            contains: query.trim(),
            mode: "insensitive" as const,
          },
        }
      : {}),
    ...(favoritesOnly
      ? {
          favorites: {
            some: { userId: session.user.id },
          },
        }
      : {}),
  };

  const items = await db.baseDocument.findMany({
    where,
    orderBy: { updatedAt: "desc" },
    take: ITEMS_PER_PAGE,
    skip,
    include: {
      favorites: {
        where: { userId: session.user.id },
        select: { id: true },
      },
    },
  });

  return {
    items,
    hasMore: items.length === ITEMS_PER_PAGE,
  };
}
