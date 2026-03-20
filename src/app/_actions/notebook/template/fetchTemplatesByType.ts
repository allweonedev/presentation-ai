"use server";

import { type DocumentType } from "@/prisma/client";

export async function fetchTemplatesByType(
  _type: DocumentType,
  _page = 0,
) {
  return { items: [], hasMore: false };
}
