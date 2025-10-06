import { env } from "@/env";
import { auth } from "@/server/auth";
import { createOpenAI } from "@ai-sdk/openai";
import { streamText } from "ai";
import { NextResponse } from "next/server";
import z from "zod";
import { search_tool } from "./search_tool";

interface OutlineRequest {
  prompt: string;
  numberOfCards: number;
  language: string;
}

const outlineSystemPrompt = `You are an expert presentation outline generator. Your task is to create a comprehensive and engaging presentation outline based on the user's topic.

Current Date: {currentDate}

## Your Process:
1. **Analyze the topic** - Understand what the user wants to present
2. **Research if needed** - Use web search to find current, relevant information that can enhance the outline
3. **Generate outline** - Create a structured outline with the requested number of topics

## Web Search Guidelines:
- Use web search to find current statistics, recent developments, or expert insights
- Search for information that will make the presentation more credible and engaging
- Limit searches to 2-5 queries maximum (you decide how many are needed)
- Focus on finding information that directly relates to the presentation topic

## Outline Requirements:
- First generate an appropriate title for the presentation
- Generate exactly {numberOfCards} main topics
- Each topic should be a clear, engaging heading
- Include 2-3 bullet points per topic
- Use {language} language
- Make topics flow logically from one to another
- Ensure topics are comprehensive and cover key aspects

## Output Format:
Start with the title in XML tags, then generate the outline in markdown format with each topic as a heading followed by bullet points.

Example:
<TITLE>Your Generated Presentation Title Here</TITLE>

# First Main Topic
- Key point about this topic
- Another important aspect
- Brief conclusion or impact

# Second Main Topic
- Main insight for this section
- Supporting detail or example
- Practical application or takeaway

Remember: Use web search strategically to enhance the outline with current, relevant information.`;

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { prompt, numberOfCards, language } =
      (await req.json()) as OutlineRequest;

    if (!prompt || !numberOfCards || !language) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const languageMap: Record<string, string> = {
      "en-US": "English (US)",
      pt: "Portuguese",
      es: "Spanish",
      fr: "French",
      de: "German",
      it: "Italian",
      ja: "Japanese",
      ko: "Korean",
      zh: "Chinese",
      ru: "Russian",
      hi: "Hindi",
      ar: "Arabic",
    };

    const actualLanguage = languageMap[language] ?? language;
    const currentDate = new Date().toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const openai = createOpenAI({ apiKey: env.OPENAI_API_KEY });

    const result = streamText({
      model: openai("gpt-4o-mini"),
      system: outlineSystemPrompt
        .replace("{numberOfCards}", numberOfCards.toString())
        .replace("{language}", actualLanguage)
        .replace("{currentDate}", currentDate),
      messages: [
        {
          role: "user",
          content: `Create a presentation outline for: ${prompt}`,
        },
      ],
      tools: {
        webSearch: {
          execute: async ({ query }) => {
            const result = await search_tool.invoke({ query });
            return result;
          },
          description:
            "Use this tool to search the web for information, you can call this tool multiple times to get more information",
          parameters: z.object({
            query: z.string(),
          }),
        },
      },
      maxSteps: 5, // Allow up to 5 tool calls
      toolChoice: "auto", // Let the model decide when to use tools
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error("Error in outline generation with search:", error);
    return NextResponse.json(
      { error: "Failed to generate outline with search" },
      { status: 500 }
    );
  }
}
