import { type PlateSlide } from "./parser";
import { serializeSlideToXml } from "./slide-serializer";
import { TEMPLATE_DEFINITIONS } from "./templates";

/**
 * Serialize selected templates to a format suitable for inclusion in the AI prompt.
 * This function takes template IDs and returns formatted XML examples for the LLM.
 * Templates are numbered and include their category for AI guidance.
 *
 * @param templateIds Array of template IDs from TEMPLATE_DEFINITIONS
 * @returns Formatted string with XML examples for each template
 */
export function serializeTemplatesForPrompt(templateIds: string[]): string {
  const templates = TEMPLATE_DEFINITIONS.filter((t) =>
    templateIds.includes(t.id),
  );

  if (templates.length === 0) {
    return "";
  }

  const serialized = templates.map((template, index) => {
    // Create a minimal slide with the template content
    const slide: PlateSlide = {
      id: "example",
      ...template.template,
      content: template.template.content ?? [],
    };

    const xml = serializeSlideToXml(slide);

    // Include usage hint based on category
    const usageHint = getCategoryUsageHint(template.categoryId);

    return `### ${index + 1}. ${template.name}
**Use for**: ${usageHint}
\`\`\`xml
${xml}
\`\`\``;
  });

  return serialized.join("\n\n");
}

/**
 * Get usage hint for a template category
 */
function getCategoryUsageHint(categoryId: string): string {
  const hints: Record<string, string> = {
    basic: "Simple text layouts and general purpose content",
    boxes: "Grouped information tiles, feature highlights",
    bullets: "Key points, list-based content",
    "card-layouts": "Accent layouts with prominent visuals",
    charts: "Data visualization, metrics, statistics",
    circles: "Cyclic processes, interconnected workflows",
    images: "Image-heavy slides, galleries, team photos",
    numbers: "KPIs, metrics, ratings, progress indicators",
    pyramids: "Hierarchies, funnels, importance levels",
    sequence: "Timelines, arrows, step-by-step flows",
    steps: "Progressive advancement, staircases",
  };
  return hints[categoryId] || "General purpose layouts";
}

/**
 * Serialize template hints for per-outline overrides.
 * Maps outline indices to template names for AI guidance.
 *
 * @param overrides Record of outline ID to template ID mappings
 * @param templateIds Array of selected template IDs (to look up names)
 * @returns Object mapping outline indices to template names
 */
export function serializeTemplateHintsForPrompt(
  overrides: Record<string, string | null>,
  templateIds: string[],
): Record<number, string> {
  const templates = TEMPLATE_DEFINITIONS.filter((t) =>
    templateIds.includes(t.id),
  );

  const hints: Record<number, string> = {};
  let index = 0;

  for (const [_outlineId, templateId] of Object.entries(overrides)) {
    if (templateId) {
      const template = templates.find((t) => t.id === templateId);
      if (template) {
        hints[index] = template.name;
      }
    }
    index++;
  }

  return hints;
}
