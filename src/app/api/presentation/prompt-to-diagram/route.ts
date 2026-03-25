import { createUIMessageStreamResponse } from "ai";
import { templates } from "@/constants/antv-templates";
import { modelPicker } from "@/lib/modelPicker";
import { auth } from "@/server/auth";
import { toUIMessageStream } from "@ai-sdk/langchain";
import { PromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";
import { NextResponse } from "next/server";
import "server-only";

const INFOGRAPHIC_MODEL = "google/gemini-3-flash-preview";

function organizeTemplates(templateList: string[]): string {
  const categories: Record<string, string[]> = {
    charts: [],
    compare: [],
    hierarchy: [],
    list: [],
    quadrant: [],
    relation: [],
    sequence: [],
  };

  for (const templateName of templateList) {
    if (templateName.startsWith("chart-"))
      categories.charts!.push(templateName);
    else if (templateName.startsWith("compare-")) {
      categories.compare!.push(templateName);
    } else if (templateName.startsWith("hierarchy-")) {
      categories.hierarchy!.push(templateName);
    } else if (templateName.startsWith("list-")) {
      categories.list!.push(templateName);
    } else if (templateName.startsWith("quadrant-")) {
      categories.quadrant!.push(templateName);
    } else if (templateName.startsWith("relation-")) {
      categories.relation!.push(templateName);
    } else if (templateName.startsWith("sequence-")) {
      categories.sequence!.push(templateName);
    }
  }

  return Object.entries(categories)
    .filter(([, items]) => items.length > 0)
    .map(([category, items]) => {
      const title = `${category.charAt(0).toUpperCase()}${category.slice(1)}`;
      return `\n### ${title} Templates\n${items.map((item) => `- ${item}`).join("\n")}`;
    })
    .join("\n");
}

const SYSTEM_PROMPT = `You are an expert Information Designer and AntV Infographic Syntax Specialist. Your sole purpose is to transform a user prompt into valid AntV Infographic DSL code.

## Response Format

You must output ONLY the infographic syntax code. Do not provide conversational filler, explanations, or preambles. Do NOT wrap your output in a markdown code block.

## The AntV Infographic Syntax

The syntax is strict, case-sensitive, and indentation-based (2 spaces). It follows this structure:

\`\`\`
infographic <template-id>
theme 
  colorBg transparent
data
  title <Main Title>
  desc <Subtitle or Description>
  items
    - label <Item Title>
      desc <Item Description>
      value <Optional Numeric Value>
      icon <Icon ID>
\`\`\`

**IMPORTANT**: The theme block MUST come immediately after the infographic line, BEFORE the data block. Make sure \`colorBg\` is always set to \`transparent\`.

## Template Library

Select the most appropriate template-id based on the structure inferred from the prompt.
{templateList}

## Icon Selection Rules

You must assign an icon to every item in the items list. Use one of these methods:

**Option A: Material Design Icons (Recommended)**
Use mdi/ prefix. Examples: mdi/rocket-launch, mdi/account-group, mdi/chart-line, mdi/lightbulb

**Option B: Font Awesome**
Use fa/ prefix. Examples: fa/check-circle, fa/users, fa/cog

**Option C: Semantic Search (Auto-Select)**
If unsure of the exact icon ID, use: ref:search:svg:<keyword>
Example: ref:search:svg:artificial intelligence

## Styling & Theme Options

Add a stylize property inside the theme block for special effects:

- **Hand-Drawn/Sketchy**: stylize rough (adds pencil sketch effect)
- **Gradient**: stylize linear-gradient or stylize radial-gradient
- **Pattern**: stylize pattern (fills with geometric textures)

## Syntax Rules

1. Entry starts with: infographic <template-name>
2. Key-value pairs use spaces for separation
3. Indentation uses 2 spaces
4. Object arrays use - on new lines (e.g., items)
5. Simple arrays stay inline (e.g., palette #ff5a5f #1fb6ff #13ce66)

## Data Field Mapping (choose ONE main field)

- chart-* => items
- compare-* => compares
- hierarchy-* => root
- list-* => items
- quadrant-* => items
- relation-* => items
- sequence-* => items

## Binary / Hierarchy Constraints

- compare-binary-* and compare-hierarchy-left-right-* require exactly two root nodes; all compare items must live under those two roots.
- hierarchy-* uses a single root; do not repeat root.

## Relation Guidance

- For relation-* templates, model relationships explicitly.
- Prefer relations with arrows (A -> B) when the template supports it.
- If only items are allowed, express connections via concise item labels and descriptions.

## Prompt to Visual Mapping

- Generate all text in the same language as the user's prompt
- Use the prompt only as guidance; do not copy it verbatim in long phrases
- Avoid using more than 3 consecutive words from the user's prompt
- Rephrase and synthesize ideas into concise infographic-friendly content
- Infer and add supporting nodes where helpful

---

## User Prompt

{prompt}

---

Convert the prompt into one complete AntV infographic syntax output.`;

const promptToDiagramChain = RunnableSequence.from([
  PromptTemplate.fromTemplate(SYSTEM_PROMPT),
  modelPicker(INFOGRAPHIC_MODEL),
]);

export async function POST(req: Request) {
  console.log("Diagram generation called ");
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { prompt } = (await req.json()) as { prompt: string };

    if (!prompt || prompt.trim().length === 0) {
      return NextResponse.json(
        { error: "No prompt provided for diagram generation" },
        { status: 400 },
      );
    }

    const templateList = organizeTemplates(templates);

    const stream = await promptToDiagramChain.stream({
      prompt,
      templateList,
    });

    return createUIMessageStreamResponse({
      stream: toUIMessageStream(stream),
    });
  } catch (error) {
    console.error("Prompt to diagram generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate diagram" },
      { status: 500 },
    );
  }
}
