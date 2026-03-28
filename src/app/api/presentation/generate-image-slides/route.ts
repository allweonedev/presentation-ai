import { createUIMessageStreamResponse } from "ai";
import {
  assertModelIsConfigured,
  ensureModelIsReady,
  modelPicker,
} from "@/lib/modelPicker";
import { createLogger } from "@/lib/observability/logger";
import { toUIMessageStream } from "@ai-sdk/langchain";
import { auth } from "@/server/auth";
import { PromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";
import { NextResponse } from "next/server";

interface ImageSlidesRequest {
  title: string;
  prompt: string;
  outline: string[];
  language: string;
  modelId?: string;
  modelProvider?: "openai" | "ollama" | "lmstudio";
}

const IMAGE_SLIDES_TEMPLATE = `You are an expert visual presentation designer. Create image-based slides where each slide is a full-screen image with ALL text rendered inside the image itself (no separate text overlays).

# PRESENTATION CONTEXT

- **Title**: {TITLE}
- **Request**: {PROMPT}
- **Language**: {LANGUAGE}
- **Total Slides**: {TOTAL_SLIDES}

## Outline Reference
\`\`\`md
{OUTLINE_FORMATTED}
\`\`\`

# OUTPUT FORMAT

Generate XML with image slides. Each slide should have:
1. A highly detailed AI image generation prompt (60-120 words, descriptive, artistic)
2. No text elements outside the image (no H1/H2/H3/P etc.)

\`\`\`xml
<PRESENTATION>
<SECTION isImageSlide="true">
  <IMG query="detailed prompt for AI image generation, include style, mood, lighting, composition, AND the exact text that must be rendered in the image" />
</SECTION>
<!-- More SECTION tags... -->
</PRESENTATION>
\`\`\`

# IMAGE PROMPT GUIDELINES

Create detailed, artistic prompts that:
- Describe the visual scene, composition, and mood
- Include style references (photorealistic, illustration, cinematic, etc.)
- Mention lighting, colors, and atmosphere
- Are relevant to the slide topic from the outline
- Specify the exact on-image text using quotes
- Include typography guidance (font style, size, placement, contrast) to ensure readability
- Expand each outline item into the complete, final copy that should appear on the slide (titles, subtitles, bullets, labels, callouts, captions, legends, axes labels, and footnotes as needed)
- Do NOT use placeholders, brackets, or vague references; write every word exactly as it must appear in the image
- Do NOT leave any information implicit; the image model must not infer missing text
- Do NOT mention AI tools, models, or generation technology unless it is explicitly part of the slide content

# CRITICAL RULES

1. Generate **EXACTLY {TOTAL_SLIDES} slides** - one for each outline item
2. Each slide MUST have isImageSlide="true" attribute
3. Each slide MUST have an IMG tag with a detailed query (60-120 words)
4. The IMG query MUST include the exact on-image text in quotes
5. Do NOT include any other tags (no H1/H2/H3/P/COLUMNS/etc.)
6. Make image prompts visually descriptive and creative
7. Ensure variety in image styles and compositions across slides
8. Every slide must include all text that should appear in the image; do not output topics alone
9. If a slide needs multiple text blocks, list each block explicitly with its exact wording and placement
10. Do NOT include any example prompts in the output

Now generate the complete XML presentation with exactly {TOTAL_SLIDES} image slides.
`;

export async function POST(req: Request) {
  const requestId = crypto.randomUUID();
  const routeLogger = createLogger("api:presentation-generate-image-slides");

  try {
    routeLogger.info("Image slide generation request received", { requestId });
    const session = await auth();
    if (!session) {
      routeLogger.warn("Image slide generation request rejected: unauthorized", {
        requestId,
      });
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (!session.user.isAdmin) {
      routeLogger.warn("Image slide generation request rejected: non-admin user", {
        requestId,
      });
      return NextResponse.json(
        { error: "This feature is only available for admin users" },
        { status: 403 },
      );
    }

    const {
      title,
      prompt: userPrompt,
      outline,
      language,
      modelId,
      modelProvider = "openai",
    } = (await req.json()) as ImageSlidesRequest;

    if (!title || !outline || !Array.isArray(outline) || !language) {
      routeLogger.warn(
        "Image slide generation request rejected: missing required fields",
        {
          requestId,
          hasTitle: Boolean(title),
          hasOutline: Array.isArray(outline),
          language,
        },
      );
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const totalSlides = outline.length;

    const prompt = PromptTemplate.fromTemplate(IMAGE_SLIDES_TEMPLATE);
    routeLogger.info("Validated image slide generation request", {
      requestId,
      title,
      totalSlides,
      language,
      modelProvider,
      modelId: modelId || "gpt-4o-mini",
    });
    try {
      assertModelIsConfigured(modelProvider, modelId);
    } catch (error) {
      routeLogger.error(
        "Image slide generation request rejected: invalid model configuration",
        error,
        {
          requestId,
          modelProvider,
          modelId: modelId || "gpt-4o-mini",
        },
      );
      return NextResponse.json(
        {
          error:
            error instanceof Error
              ? error.message
              : "Invalid model configuration",
        },
        { status: 400 },
      );
    }
    try {
      await ensureModelIsReady(modelProvider, modelId);
    } catch (error) {
      routeLogger.error(
        "Image slide generation request rejected: selected model could not be prepared",
        error,
        {
          requestId,
          modelProvider,
          modelId: modelId || "gpt-4o-mini",
        },
      );
      return NextResponse.json(
        {
          error:
            error instanceof Error
              ? error.message
              : "Failed to prepare selected model",
        },
        { status: 503 },
      );
    }
    const model = modelPicker(modelProvider, modelId);
    const chain = RunnableSequence.from([prompt, model]);

    routeLogger.info("Image slide generation started", {
      requestId,
      title,
      totalSlides,
      modelProvider,
      modelId: modelId || "gpt-4o-mini",
    });
    const stream = await chain.stream({
      TITLE: title,
      PROMPT: userPrompt || "No specific prompt provided",
      LANGUAGE: language,
      OUTLINE_FORMATTED: outline.join("\n\n"),
      TOTAL_SLIDES: totalSlides,
    });

    routeLogger.info("Image slide generation stream created", {
      requestId,
      title,
      totalSlides,
    });
    return createUIMessageStreamResponse({
      stream: toUIMessageStream(stream),
    });
  } catch (error) {
    routeLogger.error("Image slide generation failed", error, { requestId });
    return NextResponse.json(
      { error: "Failed to generate image slides" },
      { status: 500 },
    );
  }
}
