import {
  assertModelIsConfigured,
  ensureModelIsReady,
  modelPicker,
} from "@/lib/modelPicker";
import { createLogger } from "@/lib/observability/logger";
import { auth } from "@/server/auth";
import { toUIMessageStream } from "@ai-sdk/langchain";
import { PromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";
import { createUIMessageStreamResponse } from "ai";
import { NextResponse } from "next/server";

interface SlidesRequest {
  title: string;
  prompt: string;
  outline: string[];
  language: string;
  tone: string;
  modelId?: string;
  modelProvider?: "openai" | "ollama" | "lmstudio";
  searchResults?: Array<{ query: string; results: unknown[] }>;
  textContent?: "minimal" | "concise" | "detailed" | "extensive";
  audience?: string;
  scenario?: string;
  imageSource?: "automatic" | "ai" | "stock";
  templateContext?: string;
  outlineTemplateHints?: Record<number, string>;
  selectedTemplateCount?: number; // Number of templates selected by user
}

const DEFAULT_LAYOUTS = `
## AVAILABLE LAYOUTS
Choose ONE different layout for each slide (use these exact XML tags so our parser recognizes them):

1. COLUMNS: For comparisons
\`\`\`xml
<COLUMNS>
  <DIV><H3>First Concept</H3><P>Description</P></DIV>
  <DIV><H3>Second Concept</H3><P>Description</P></DIV>
</COLUMNS>
\`\`\`

2. BULLETS: For key points
\`\`\`xml
<BULLETS>
  <DIV><H3>Main Point 1 </H3><P>Description</P></DIV>
  <DIV><H3>Main Point 2 </H3><P>Second point with details</P></DIV>
</BULLETS>
\`\`\`

3. ICONS: For concepts with symbols
\`\`\`xml
<ICONS>
  <DIV icon="rocket"><H3>Innovation</H3><P>Description</P></DIV>
  <DIV icon="shield"><H3>Security</H3><P>Description</P></DIV>
</ICONS>
\`\`\`

4. CYCLE: For processes and workflows
\`\`\`xml
<CYCLE>
  <DIV><H3>Research</H3><P>Initial exploration phase</P></DIV>
  <DIV><H3>Design</H3><P>Solution creation phase</P></DIV>
  <DIV><H3>Implement</H3><P>Execution phase</P></DIV>
  <DIV><H3>Evaluate</H3><P>Assessment phase</P></DIV>
</CYCLE>
\`\`\`

5. ARROWS: For cause-effect or flows
\`\`\`xml
<ARROWS>
  <DIV><H3>Challenge</H3><P>Current market problem</P></DIV>
  <DIV><H3>Solution</H3><P>Our innovative approach</P></DIV>
  <DIV><H3>Result</H3><P>Measurable outcomes</P></DIV>
</ARROWS>
\`\`\`

5b. ARROW-VERTICAL: For vertical step-by-step flows
\`\`\`xml
<ARROW-VERTICAL>
  <DIV><H3>Discover</H3><P>Research & requirements.</P></DIV>
  <DIV><H3>Design</H3><P>UX & architecture.</P></DIV>
  <DIV><H3>Deliver</H3><P>Build, test, deploy.</P></DIV>
</ARROW-VERTICAL>
\`\`\`

6. TIMELINE: For chronological progression
\`\`\`xml
<TIMELINE sidedness="single|double" orientation="vertical|horizontal">
  <DIV><H3>2022</H3><P>Market research completed</P></DIV>
  <DIV><H3>2023</H3><P>Product development phase</P></DIV>
  <DIV><H3>2024</H3><P>Global market expansion</P></DIV>
</TIMELINE>
\`\`\`

7. PYRAMID: For hierarchical importance
\`\`\`xml
<PYRAMID isFunnel="true|false">
  <DIV><H3>Vision</H3><P>Our aspirational goal</P></DIV>
  <DIV><H3>Strategy</H3><P>Key approaches to achieve vision</P></DIV>
  <DIV><H3>Tactics</H3><P>Specific implementation steps</P></DIV>
</PYRAMID>
\`\`\`

8. STAIRCASE: For progressive advancement
\`\`\`xml
<STAIRCASE>
  <DIV><H3>Basic</H3><P>Foundational capabilities</P></DIV>
  <DIV><H3>Advanced</H3><P>Enhanced features and benefits</P></DIV>
  <DIV><H3>Expert</H3><P>Premium capabilities and results</P></DIV>
</STAIRCASE>
\`\`\`

9. BOXES: For simple information tiles
\`\`\`xml
<BOXES boxType="outline|icon|solid|sideline|joined|leaf">
  <DIV><H3>Speed</H3><P>Faster delivery cycles.</P></DIV>
  <DIV><H3>Quality</H3><P>Automated testing & reviews.</P></DIV>
  <DIV><H3>Security</H3><P>Shift-left security practices.</P></DIV>
</BOXES>
\`\`\`

10. COMPARE: For side-by-side comparison
\`\`\`xml
<COMPARE>
  <DIV><H3>Solution A</H3><LI>Features 1</LI><LI>Features 2</LI></DIV>
  <DIV><H3>Solution B</H3><LI>Features 3</LI><LI>Features 4</LI></DIV>
</COMPARE>
\`\`\`

11. BEFORE-AFTER: For transformation snapshots
\`\`\`xml
<BEFORE-AFTER>
  <DIV><H3>Before</H3><P>Manual processes, scattered data.</P></DIV>
  <DIV><H3>After</H3><P>Automated workflows, unified insights.</P></DIV>
</BEFORE-AFTER>
\`\`\`

12. PROS-CONS: For trade-offs
\`\`\`xml
<PROS-CONS>
  <PROS><H3>Pros</H3><LI>Pros 1</LI><LI>Pros 2</LI></PROS>
  <CONS><H3>Cons</H3><LI>Cons 1</LI><LI>Cons 2</LI></CONS>
</PROS-CONS>
\`\`\`

13. TABLE: For tabular data
\`\`\`xml
<TABLE>
  <TR><TH>Header 1</TH><TH>Header 2</TH></TR>
  <TR><TD>Data 1</TD><TD>Data 2</TD></TR>
</TABLE>
\`\`\`

14. CHARTS: For data visualization
\`\`\`xml
<CHART charttype="bar|pie|line|area|radar">
  <DATA><LABEL>Q1</LABEL><VALUE>24</VALUE></DATA>
  <DATA><LABEL>Q2</LABEL><VALUE>36</VALUE></DATA>
</CHART>

<CHART charttype="scatter">
  <DATA><X>1</X><Y>2</Y></DATA>
  <DATA><X>3</X><Y>5</Y></DATA>
</CHART>
\`\`\`

15. STATS: For metrics and KPIs
\`\`\`xml
<STATS statstype="plain|circle|circle-bold|star|bar|dot-grid|dot-line">
  <DIV stat="85"><H3>Customer Satisfaction</H3><P>Based on Q4 surveys</P></DIV>
  <DIV stat="4.5"><H3>App Rating</H3><P>Across all platforms</P></DIV>
</STATS>
\`\`\`
`;

// ============================================================================
// MAIN PROMPT TEMPLATE
// ============================================================================

const SLIDES_TEMPLATE = `You are an expert presentation designer. Create an engaging presentation in XML format.

# PRESENTATION CONTEXT

- **Title**: {TITLE}
- **Request**: {PROMPT}
- **Date**: {CURRENT_DATE}
- **Language**: {LANGUAGE}
- **Tone**: {TONE}
- **Total Slides**: {TOTAL_SLIDES}
- **Text Content Level**: {TEXT_CONTENT}
- **Target Audience**: {AUDIENCE}
- **Scenario**: {SCENARIO}

## Outline Reference
\`\`\`md
{OUTLINE_FORMATTED}
\`\`\`

## Research Context

\`\`\`md
{SEARCH_RESULTS}
\`\`\`

---

{SELECTED_CHUNKS_CONTEXT}

# OUTPUT FORMAT

\`\`\`xml
<PRESENTATION>

<!--Every slide must follow this structure (layout determines where the image appears) -->
<SECTION layout="left|right|vertical">
  <!-- Required: include ONE layout component per slide -->
  <!-- Required: include at least one detailed image query -->
  </SECTION>
  <!-- More SECTION tags... -->
</PRESENTATION>
\`\`\`

**SECTION Layout Attribute:**
- \`layout="left"\` - Image on left side
- \`layout="right"\` - Image on right side  
- \`layout="vertical"\` - Image at top

Vary layouts throughout for visual interest.

---

{AVAILABLE_LAYOUTS}

---

# IMAGE QUERIES

{IMAGE_QUERY_STYLE}

---

{PER_SLIDE_REQUIREMENTS}

# CONTENT GUIDELINES

**Text Content Levels:**
- minimal: 1-2 short sentences per point
- concise: 2-3 sentences per point
- detailed: 3-4 sentences per point
- extensive: 4-5+ sentences per point

**Content Expansion:** For each outline point, add supporting data, real-world examples, and industry context. Do NOT copy outline verbatim.
---

# CRITICAL RULES

{CRITICAL_RULES}

---

Now generate the complete XML presentation with exactly {TOTAL_SLIDES} slides.
`;

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function formatSearchResults(
  searchResults?: Array<{ query: string; results: unknown[] }>,
): string {
  if (!searchResults || searchResults.length === 0) {
    return "No research data available.";
  }

  const searchData = searchResults
    .map((searchItem, index: number) => {
      const query = searchItem.query || `Search ${index + 1}`;
      const results = Array.isArray(searchItem.results)
        ? searchItem.results
        : [];

      if (results.length === 0) return "";

      const formattedResults = results
        .map((result: unknown) => {
          const resultObj = result as Record<string, unknown>;
          return `- ${resultObj.title || "No title"}\n  ${resultObj.content || "No content"}\n  ${resultObj.url || "No URL"}`;
        })
        .join("\n");

      return `**Query ${index + 1}:** ${query}\n${formattedResults}`;
    })
    .filter(Boolean)
    .join("\n\n");

  return searchData || "No research data available.";
}

function getImageQueryStyle(imageSource?: string): string {
  const isStockImage =
    imageSource === "stock" || imageSource === "automatic" || !imageSource;

  if (isStockImage) {
    return `**STOCK IMAGE SEARCH**: Use SHORT keyword queries (1-4 words).
Important: Every \`<IMG query="...">\` value for stock image search MUST be written in English for Unsplash compatibility, even if the presentation language is not English. Keep the slide text/content in the requested presentation language; only the image search query must stay in English.
\`\`\`xml
<IMG query="smart city skyline" />
<IMG query="team collaboration" />
\`\`\``;
  }

  return `**AI IMAGE GENERATION**: Use DETAILED descriptive prompts (60-120 words).

Create detailed, artistic prompts that:
- Describe the visual scene, composition, and mood
- Include style references (photorealistic, illustration, cinematic, etc.)
- Mention lighting, colors, and atmosphere
- Are relevant to the slide topic
- Do NOT include on-image text unless explicitly required by the slide content
- Do NOT use placeholders, brackets, or vague references
- Do NOT mention AI tools, models, or generation technology

\`\`\`xml
<IMG query="cinematic wide-angle view of a futuristic smart city powered by renewable energy, gleaming solar arrays and vertical gardens, morning haze, warm sunlight cutting through glass towers, clean aerial composition with leading lines, crisp details, high contrast, optimistic mood" />
<IMG query="photorealistic scene of a diverse product team collaborating in a modern glass office, warm ambient lighting, soft shadows, laptops and whiteboards with sketched diagrams, shallow depth of field, candid expressions, balanced composition, professional yet inviting atmosphere" />
\`\`\``;
}

function buildAvailableLayouts(
  templateContext: string | undefined,
  selectedTemplateCount: number,
  totalSlides: number,
): string {
  // No templates selected - use all default layouts
  if (!templateContext) {
    return DEFAULT_LAYOUTS;
  }

  // Fewer templates selected than slides - show both selected templates AND default layouts
  if (selectedTemplateCount < totalSlides) {
    return `## AVAILABLE LAYOUTS

### 🔒 SELECTED TEMPLATES (Priority - You MUST include all of these)
The user selected the following ${selectedTemplateCount} template(s). You MUST use each of these at least once in your presentation.

${templateContext}

---

### 📋 ADDITIONAL LAYOUTS (For remaining ${totalSlides - selectedTemplateCount} slides)
For the slides not covered by selected templates above, you may use ANY of these standard layouts:

${DEFAULT_LAYOUTS}

> **NOTE**: You have ${totalSlides} slides total but only ${selectedTemplateCount} selected template(s). 
> Use all selected templates first, then fill remaining slides with layouts from the additional options above.`;
  }

  // Templates >= slides - strict mode, only selected templates allowed
  return `## AVAILABLE LAYOUTS

> **⚠️ TEMPLATE CONSTRAINT MODE ACTIVE**
> 
> You are **STRICTLY LIMITED** to ONLY the layout templates listed below.
> Using ANY other layout tag will cause **IMMEDIATE PARSING FAILURE**.
> 
> **DO NOT** use: BULLETS, ICONS, CYCLE, ARROWS, TIMELINE, PYRAMID, STAIRCASE, BOXES, COMPARE, BEFORE-AFTER, PROS-CONS, TABLE, CHART, STATS, COLUMNS, or any tag NOT shown below.

**Rules:**
1. Use ONLY the exact XML structures shown below
2. Copy the layout tag structure exactly as shown
3. You may add \`<IMG query="..." />\` for images - this is the ONLY allowed modification
4. Each slide MUST use one of these templates - no exceptions

**YOUR ALLOWED LAYOUTS:**

${templateContext}`;
}

function buildPerSlideRequirements(
  templateContext?: string,
  outlineTemplateHints?: Record<number, string>,
): string {
  if (
    !templateContext ||
    !outlineTemplateHints ||
    Object.keys(outlineTemplateHints).length === 0
  ) {
    return "";
  }

  const hints = Object.entries(outlineTemplateHints)
    .map(
      ([index, templateName]) =>
        `- **Slide ${parseInt(index, 10) + 1}**: Use "${templateName}" layout (MANDATORY)`,
    )
    .join("\n");

  return `# PER-SLIDE TEMPLATE ASSIGNMENTS

> **⚠️ MANDATORY ASSIGNMENTS**
> These are **absolute requirements**. Use the EXACT template specified.

${hints}

For unlisted slides: Choose any layout from AVAILABLE LAYOUTS above.
---
`;
}

function buildCriticalRules(
  templateContext: string | undefined,
  selectedTemplateCount: number,
  totalSlides: number,
): string {
  // No templates - default rules
  if (!templateContext) {
    return `1. Generate **EXACTLY {TOTAL_SLIDES} slides** - no more, no less
2. Use DIFFERENT layouts for consecutive slides - never repeat
3. Expand outline content - do NOT copy verbatim
4. Include detailed image queries on most slides
5. Vary SECTION layout attribute (left/right/vertical) throughout
6. Use ONLY layout tags from AVAILABLE LAYOUTS - unlisted tags cause parsing errors`;
  }

  // Partial template selection
  if (selectedTemplateCount < totalSlides) {
    return `1. Generate **EXACTLY {TOTAL_SLIDES} slides** - no more, no less
2. **MUST USE ALL SELECTED TEMPLATES**: You have ${selectedTemplateCount} selected template(s) - each MUST appear at least once
3. **REMAINING SLIDES**: Fill the other ${totalSlides - selectedTemplateCount} slides using layouts from ADDITIONAL LAYOUTS
4. Expand outline content - do NOT copy verbatim
5. You may add \`<IMG query="..." />\` tags for images
6. Vary SECTION layout attribute (left/right/vertical) throughout
7. For per-slide assignments: use the EXACT template specified`;
  }

  // Full template constraint
  return `1. Generate **EXACTLY {TOTAL_SLIDES} slides** - no more, no less
2. **TEMPLATE CONSTRAINT**: Use ONLY layouts from AVAILABLE LAYOUTS. Any other tag = parsing failure
3. Expand outline content - do NOT copy verbatim
4. You may add \`<IMG query="..." />\` tags - this is the ONLY modification allowed
5. Vary SECTION layout attribute (left/right/vertical) throughout
6. For per-slide assignments: use the EXACT template specified with NO structural changes`;
}

export async function POST(req: Request) {
  const requestId = crypto.randomUUID();
  const routeLogger = createLogger("api:presentation-generate");

  try {
    routeLogger.info("Presentation generation request received", { requestId });
    const session = await auth();
    if (!session) {
      routeLogger.warn("Presentation generation request rejected: unauthorized", {
        requestId,
      });
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const {
      title,
      prompt: userPrompt,
      outline,
      language,
      tone,
      modelId,
      modelProvider = "openai",
      searchResults,
      textContent,
      audience,
      scenario,
      imageSource,
      templateContext,
      outlineTemplateHints,
      selectedTemplateCount,
    } = (await req.json()) as SlidesRequest;

    if (!title || !outline || !Array.isArray(outline) || !language) {
      routeLogger.warn(
        "Presentation generation request rejected: missing required fields",
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
    const templateCount = selectedTemplateCount ?? 0;

    const currentDate = new Date().toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const prompt = PromptTemplate.fromTemplate(SLIDES_TEMPLATE);
    routeLogger.info("Validated presentation generation request", {
      requestId,
      title,
      totalSlides,
      language,
      tone,
      modelProvider,
      modelId: modelId || "gpt-4o-mini",
      imageSource: imageSource || "automatic",
      templateCount,
    });
    try {
      assertModelIsConfigured(modelProvider, modelId);
    } catch (error) {
      routeLogger.error(
        "Presentation generation request rejected: invalid model configuration",
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
        "Presentation generation request rejected: selected model could not be prepared",
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

    routeLogger.info("Presentation generation started", {
      requestId,
      title,
      totalSlides,
      modelProvider,
      modelId: modelId || "gpt-4o-mini",
    });
    const stream = await chain.stream({
      TITLE: title,
      PROMPT: userPrompt || "No specific prompt provided",
      CURRENT_DATE: currentDate,
      LANGUAGE: language,
      TONE: tone,
      OUTLINE_FORMATTED: outline.join("\n\n"),
      TOTAL_SLIDES: totalSlides,
      SEARCH_RESULTS: formatSearchResults(searchResults),
      SELECTED_CHUNKS_CONTEXT: "",
      TEXT_CONTENT: textContent || "concise",
      AUDIENCE: audience || "auto",
      SCENARIO: scenario || "auto",
      IMAGE_QUERY_STYLE: getImageQueryStyle(imageSource),
      AVAILABLE_LAYOUTS: buildAvailableLayouts(
        templateContext,
        templateCount,
        totalSlides,
      ),
      PER_SLIDE_REQUIREMENTS: buildPerSlideRequirements(
        templateContext,
        outlineTemplateHints,
      ),
      CRITICAL_RULES: buildCriticalRules(
        templateContext,
        templateCount,
        totalSlides,
      ),
    });

    routeLogger.info("Presentation generation stream created", {
      requestId,
      title,
      totalSlides,
    });
    return createUIMessageStreamResponse({ stream: toUIMessageStream(stream) });
  } catch (error) {
    routeLogger.error("Presentation generation failed", error, { requestId });
    return NextResponse.json(
      { error: "Failed to generate presentation slides" },
      { status: 500 },
    );
  }
}
