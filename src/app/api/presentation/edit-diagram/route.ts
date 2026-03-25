import { templates } from "@/constants/antv-templates";
import { modelPicker } from "@/lib/modelPicker";
import { auth } from "@/server/auth";
import { toUIMessageStream } from "@ai-sdk/langchain";
import { PromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";
import { createUIMessageStreamResponse } from "ai";
import { NextResponse } from "next/server";
import "server-only";

const INFOGRAPHIC_MODEL = "google/gemini-3-flash-preview";

// Organize templates by category for the prompt
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

  for (const t of templateList) {
    if (t.startsWith("chart-")) categories.charts!.push(t);
    else if (t.startsWith("compare-")) categories.compare!.push(t);
    else if (t.startsWith("hierarchy-")) categories.hierarchy!.push(t);
    else if (t.startsWith("list-")) categories.list!.push(t);
    else if (t.startsWith("quadrant-")) categories.quadrant!.push(t);
    else if (t.startsWith("relation-")) categories.relation!.push(t);
    else if (t.startsWith("sequence-")) categories.sequence!.push(t);
  }

  let result = "";
  for (const [category, items] of Object.entries(categories)) {
    if (items.length > 0) {
      result += `\n### ${category.charAt(0).toUpperCase() + category.slice(1)} Templates\n`;
      result += items.map((t) => `- ${t}`).join("\n");
      result += "\n";
    }
  }
  return result;
}

const SYSTEM_PROMPT = `You are an expert Information Designer and AntV Infographic Syntax Specialist. Your task is to edit an existing AntV Infographic DSL code based on user instructions.

## Response Format

You must output ONLY the complete modified infographic syntax code. Do not provide conversational filler, explanations, or preambles. Do NOT wrap your output in a markdown code block.

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

If the user wants to change the template, select the most appropriate template-id.
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

## Relations (for relation-* templates)

For graph templates, use relations to describe connections:

YAML-style:
\`\`\`
relations
  - from Node A
    to Node B
\`\`\`

Mermaid-style:
\`\`\`
relations
  A -> B
  B -> C
  A <-> D
\`\`\`

## Editing Guidelines

1. Preserve the structure and format of the original syntax
2. Only modify what the user explicitly requests
3. Keep all existing data unless told to change it
4. Maintain proper 2-space indentation
5. Ensure the output is valid AntV infographic syntax
6. Always keep colorBg as transparent
7. When asked to change or expand content, use the user text as inspiration only
8. Do NOT paste or quote the user text verbatim in labels or descriptions
9. Avoid using more than 3 consecutive words from the user's text
10. Rephrase and synthesize: derive core ideas, then express them freshly and concisely
11. Expand outward from the seed text: add helpful supporting nodes, contrasts, examples, or implications

---

## Current Infographic Syntax:

{currentSyntax}

---

## User's Edit Request:

{prompt}

---

Apply the user's requested changes to the infographic and output the complete modified syntax.`;

const editDiagramChain = RunnableSequence.from([
  PromptTemplate.fromTemplate(SYSTEM_PROMPT),
  modelPicker(INFOGRAPHIC_MODEL),
]);

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { currentSyntax, prompt } = (await req.json()) as {
      currentSyntax: string;
      prompt: string;
    };

    if (!currentSyntax || currentSyntax.trim().length === 0) {
      return NextResponse.json(
        { error: "No current syntax provided" },
        { status: 400 },
      );
    }

    if (!prompt || prompt.trim().length === 0) {
      return NextResponse.json(
        { error: "No edit prompt provided" },
        { status: 400 },
      );
    }

    const templateList = organizeTemplates(templates);

    const stream = await editDiagramChain.stream({
      currentSyntax,
      prompt,
      templateList,
    });

    return createUIMessageStreamResponse({
      stream: toUIMessageStream(stream),
    });
  } catch (error) {
    console.error("Edit diagram error:", error);
    return NextResponse.json(
      { error: "Failed to edit diagram" },
      { status: 500 },
    );
  }
}
