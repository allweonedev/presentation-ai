import { search_tool } from "@/ai/tools/search";
import { auth } from "@/server/auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { query } = (await req.json()) as {
      query?: string;
    };

    if (!query?.trim()) {
      return NextResponse.json({ error: "Missing query" }, { status: 400 });
    }

    const result = await search_tool.invoke({
      query,
    });

    return NextResponse.json({ result });
  } catch (error) {
    console.error("Presentation search tool error:", error);
    return NextResponse.json(
      { error: "Failed to execute search tool" },
      { status: 500 },
    );
  }
}
