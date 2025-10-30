import { modelPicker } from "@/lib/model-picker";
import { auth } from "@/server/auth";
import { streamText } from "ai";
import { NextResponse } from "next/server";

interface OutlineRequest {
  prompt: string;
  numberOfCards: number;
  language: string;
  modelProvider?: string;
  modelId?: string;
}

const outlineTemplate = `Given the following presentation topic and requirements, generate a structured outline with {numberOfCards} main topics in markdown format.
The outline should be in {language} language and it very important.

Current Date: {currentDate}
Topic: {prompt}

First, generate an appropriate title for the presentation, then create exactly {numberOfCards} main topics that would make for an engaging and well-structured presentation.

Format the response starting with the title in XML tags, followed by markdown content with each topic as a heading and 2-3 bullet points.

Example format:
<TITLE>Your Generated Presentation Title Here</TITLE>

# First Main Topic
- Key point about this topic
- Another important aspect
- Brief conclusion or impact

# Second Main Topic
- Main insight for this section
- Supporting detail or example
- Practical application or takeaway

# Third Main Topic 
- Primary concept to understand
- Evidence or data point
- Conclusion or future direction

Make sure the topics:
1. Flow logically from one to another
2. Cover the key aspects of the main topic
3. Are clear and concise
4. Are engaging for the audience
5. ALWAYS use bullet points (not paragraphs) and format each point as "- point text"
6. Do not use bold, italic or underline
7. Keep each bullet point brief - just one sentence per point
8. Include exactly 2-3 bullet points per topic (not more, not less)`;

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

    const actualLanguage = languageMap[language] ?? language; // Fallback to the original if not found
    const currentDate = new Date().toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    console.log("📝 Outline generation starting:", {
      provider: modelProvider,
      model: modelId,
      numberOfCards,
      language: actualLanguage,
    });

    const model = modelPicker(modelProvider, modelId);

    // Format the prompt with template variables
    const formattedPrompt = outlineTemplate
      .replace(/{numberOfCards}/g, numberOfCards.toString())
      .replace(/{language}/g, actualLanguage)
      .replace(/{currentDate}/g, currentDate)
      .replace(/{prompt}/g, prompt);

    const result = streamText({
      model,
      prompt: formattedPrompt,
    });

    console.log("✅ Outline generation streaming started");
    return result.toDataStreamResponse();
  } catch (error) {
    console.error("Error in outline generation:", error);
    return NextResponse.json(
      { error: "Failed to generate outline" },
      { status: 500 },
    );
  }
}
