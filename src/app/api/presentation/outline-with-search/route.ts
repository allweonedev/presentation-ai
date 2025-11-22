import { modelPicker } from "@/lib/model-picker";
import { auth } from "@/server/auth";
import { streamText } from "ai";
import { NextResponse } from "next/server";
import { env } from "@/env";
import { search_tool } from "./search_tool";

interface OutlineRequest {
  prompt: string;
  numberOfCards: number;
  language: string;
  modelProvider?: string;
  modelId?: string;
}

const outlineSystemPrompt = `You are an expert presentation outline generator. Your task is to create a comprehensive and engaging presentation outline based on the user's topic.

Current Date: {currentDate}

## CRITICAL: Complete ALL web searches BEFORE generating the outline

## Your Process:
1. **Analyze the topic** - Understand what the user wants to present
2. **Research FIRST** - Use web search to find current, relevant information. DO ALL SEARCHES BEFORE WRITING ANYTHING.
3. **Wait for all search results** - Do not start writing the outline until you have all search results
4. **Generate outline** - Create a structured outline incorporating the search results

## Web Search Guidelines:
- ALWAYS do web searches FIRST before generating any outline content
- Use web search to find current statistics, recent developments, or expert insights
- Limit searches to 2-3 queries maximum
- DO NOT start writing the title or outline until ALL searches are complete
- Focus on finding information that directly relates to the presentation topic

## Outline Requirements (ONLY START AFTER ALL SEARCHES COMPLETE):
- Wait until you have ALL search results before writing anything
- Incorporate insights from the search results into your outline
- First generate an appropriate title for the presentation
- Generate exactly {numberOfCards} main topics
- Each topic should be a clear, engaging heading
- Include 2-3 bullet points per topic using information from searches
- Use {language} language
- Make topics flow logically from one to another
- Ensure topics are comprehensive and cover key aspects with current data

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

    const {
      prompt,
      numberOfCards,
      language,
      modelProvider = "openai",
      modelId,
    } = (await req.json()) as OutlineRequest;

    if (!prompt || !numberOfCards || !language) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
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

    console.log("🔎 Outline generation with search starting:", {
      provider: modelProvider,
      model: modelId,
      numberOfCards,
      language: actualLanguage,
      prompt: prompt.substring(0, 50) + "...",
    });

    // Create model based on selection
    const model = modelPicker(modelProvider, modelId);

    // Check if provider/model supports tool calling well
    // Some providers and specific models have issues with tool calling
    const incompatibleModel = modelId?.includes("minimax") || modelId?.includes("pollinations");
    const incompatibleProvider = ["pollinations"].includes(modelProvider || "");
    const supportsTools = !incompatibleProvider && !incompatibleModel;

    if (!supportsTools) {
      console.log("⚠️  Model/provider doesn't support tool calling reliably:", {
        provider: modelProvider,
        model: modelId,
        reason: incompatibleModel ? "model incompatible" : "provider incompatible"
      });
      console.log("📝 Falling back to outline without web search");
    }

    // Log environment check
    console.log("🔧 Environment check:", {
      hasTavilyKey: !!env.TAVILY_API_KEY,
      tavilyKeyPrefix: env.TAVILY_API_KEY ? env.TAVILY_API_KEY.substring(0, 10) + "..." : "none",
      supportsTools,
      modelProvider,
      modelId
    });

    const streamConfig: Parameters<typeof streamText>[0] = {
      model,
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
    };

    // Only add tools if the provider/model supports them
    if (supportsTools) {
      streamConfig.tools = {
        webSearch: search_tool,
      };
      streamConfig.maxSteps = 3; // Allow up to 3 tool calls
      streamConfig.toolChoice = "auto";
    }

    const result = streamText(streamConfig);

    console.log("✅ Outline with search streaming started");
    return result.toDataStreamResponse();
  } catch (error) {
    console.error("Error in outline generation with search:", error);
    return NextResponse.json(
      { error: "Failed to generate outline with search" },
      { status: 500 },
    );
  }
}
