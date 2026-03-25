import { search_tool } from "@/ai/tools/search";
import {
  getLatestUserMessage,
  getMessageText,
} from "@/lib/ai/uiMessageParts";
import { modelPicker } from "@/lib/modelPicker";
import { logger } from "@/lib/observability/server/logger";
import { auth } from "@/server/auth";
import { toBaseMessages, toUIMessageStream } from "@ai-sdk/langchain";
import {
  createUIMessageStreamResponse,
  type UIMessage,
} from "ai";
import { createAgent } from "langchain";
import { NextResponse } from "next/server";

interface OutlineRequest {
  messages?: UIMessage[];
}

interface OutlineMessageMetadata {
  numberOfCards?: number;
  language?: string;
  webSearch?: boolean;
  textContent?: "minimal" | "concise" | "detailed" | "extensive";
  tone?: string;
  audience?: string;
  scenario?: string;
  presentationId?: string;
}

const outlineSystemPrompt = `You are an expert presentation outline generator. Your task is to create a comprehensive and engaging presentation outline based on the user's topic.

Current Date: {currentDate}

## Presentation Customization:
- Text Content Level: {textContent}
- Tone: {tone}
- Target Audience: {audience}
- Scenario: {scenario}

## Your Process:
1. Analyze the topic
2. {researchStep}
3. Generate the outline

## Web Search Guidelines:
{webSearchGuidelines}

## Outline Requirements:
- First generate an appropriate title for the presentation
- Generate exactly {numberOfCards} main topics
- Each topic should be a clear, engaging heading
- Include 2-3 bullet points per topic
- Use {language} language
- Adapt content depth based on the text content level
- Tailor language for the requested tone, audience, and scenario
- ALWAYS use bullet points formatted as "- point text"
- Do not use bold, italic, or underline

## Output Format:
Start with the title in XML tags, then generate markdown with each topic as a heading followed by bullet points.

Example:
<TITLE>Your Generated Presentation Title Here</TITLE>

# First Main Topic
- Key point
- Another point

# Second Main Topic
- Key point
- Another point

Remember: {finalInstruction}`;

function buildOutlineSystemPrompt({
  actualLanguage,
  numberOfCards,
  currentDate,
  textContent,
  tone,
  audience,
  scenario,
  webSearch,
}: {
  actualLanguage: string;
  numberOfCards: number;
  currentDate: string;
  textContent: NonNullable<OutlineMessageMetadata["textContent"]>;
  tone: string;
  audience: string;
  scenario: string;
  webSearch: boolean;
}) {
  return outlineSystemPrompt
    .replace("{currentDate}", currentDate)
    .replace("{numberOfCards}", numberOfCards.toString())
    .replace("{language}", actualLanguage)
    .replaceAll("{textContent}", textContent)
    .replaceAll("{tone}", tone)
    .replaceAll("{audience}", audience)
    .replaceAll("{scenario}", scenario)
    .replace(
      "{researchStep}",
      webSearch
        ? "Research first using web search before writing the outline"
        : "Use existing knowledge only and skip tool usage",
    )
    .replace(
      "{webSearchGuidelines}",
      webSearch
        ? [
            "- Use web search for current facts, recent developments, and useful statistics",
            "- Limit yourself to a few focused searches",
            "- Only search when it materially improves the outline",
          ].join("\n")
        : "- Web search is disabled for this request.",
    )
    .replace(
      "{finalInstruction}",
      webSearch
        ? "Perform at least one web search before generating the outline."
        : "Generate the outline directly without web search.",
    );
}

export async function POST(req: Request) {
  const actionName = "presentation.outline.post";
  const span = logger.startSpan(`allweone.api.${actionName}`, {
    attributes: {
      "allweone.scope": "api",
      "allweone.action.type": "api_route",
      "allweone.action.name": actionName,
      "http.method": "POST",
      "http.route": "/api/presentation/outline",
    },
  });

  try {
    const session = await auth();
    if (!session) {
      span.event("allweone.api.request_rejected", {
        "allweone.validation.error": "unauthorized",
      });
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const request = (await req.json()) as OutlineRequest;
    const { messages = [] } = request;
    const latestUserMessage = getLatestUserMessage(messages);
    const prompt = latestUserMessage ? getMessageText(latestUserMessage).trim() : "";
    const metadata =
      (latestUserMessage?.metadata as OutlineMessageMetadata | undefined) ?? {};
    const numberOfCards = metadata.numberOfCards ?? 0;
    const language = metadata.language ?? "";
    const webSearch = Boolean(metadata.webSearch);

    span.annotate({
      "allweone.presentation.cards.count": numberOfCards,
      "allweone.presentation.prompt.length": prompt.length,
      "allweone.presentation.language": language,
      "allweone.presentation.web_search": webSearch,
    });

    if (!prompt || !numberOfCards || !language || messages.length === 0) {
      span.event("allweone.api.request_rejected", {
        "allweone.validation.error": "missing_required_fields",
      });
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

    const agent = createAgent({
      model: modelPicker("gpt-4o-mini"),
      tools: webSearch ? [search_tool] : [],
      systemPrompt:
        buildOutlineSystemPrompt({
          actualLanguage,
          numberOfCards,
          currentDate,
          textContent: metadata.textContent ?? "concise",
          tone: metadata.tone ?? "auto",
          audience: metadata.audience ?? "auto",
          scenario: metadata.scenario ?? "auto",
          webSearch,
        }),
    });

    const stream = await agent.stream(
      {
        messages: await toBaseMessages(messages),
      },
      {
        streamMode: ["values", "messages"],
      },
    );

    span.event("allweone.api.response_stream_created");
    return createUIMessageStreamResponse({
      stream: toUIMessageStream(stream),
    });
  } catch (error) {
    span.error(error);
    console.error("Error in outline generation:", error);
    return NextResponse.json(
      { error: "Failed to generate outline" },
      { status: 500 },
    );
  } finally {
    span.end();
  }
}
