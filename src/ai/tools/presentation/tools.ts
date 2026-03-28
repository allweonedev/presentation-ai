import { tool } from "@langchain/core/tools";
import * as z from "zod";
import { search_tool } from "../search";

// Schema for scope specification
const ScopeSchema = z
  .enum(["all"])
  .optional()
  .describe(
    "Scope of the action: 'all' for all slides. Defaults to 'all' if not specified. This property and slideIds property are mutually exclusive. If you provide both, the slideIds property will be ignored.",
  );

const slideIdsSchema = z
  .array(z.string())
  .optional()
  .describe(
    "Specific slide ids to apply the action to. If provided, overrides scope. This property and scope property are mutually exclusive. If you provide both, this property will be ignored. So be very careful.",
  );

const edit_slide_properties = tool(
  async (props) => {
    const { slideIds: _slideIds, scope: _scope, ...rest } = props;
    return `Updated ${Object.keys(rest).join(", ")} successfully to ${Object.values(rest).join(", ")}`;
  },
  {
    name: "edit_slide_properties",
    description: "You can use this tool to edit the properties of a slide",
    schema: z.object({
      scope: ScopeSchema,
      slideIds: slideIdsSchema,
      bgColor: z
        .string()
        .describe(
          "The background color of the slide, use 'reset' to reset the background color",
        )
        .optional(),
      alignment: z
        .enum(["start", "center", "end", "reset"])
        .describe("The content alignment of the slide")
        .optional(),
      layoutType: z
        .enum(["left", "right", "vertical", "background", "reset"])
        .describe(
          "Determines where the accent / root image appears in the slide, left means the image is on the left, right means the image is on the right, vertical means the image is on the top, background means the image is the background of the slide",
        )
        .optional(),
      width: z
        .enum(["S", "M", "L", "reset"])
        .describe("The width of the slide")
        .optional(),
    }),
  },
);

const replace_image = tool(
  async (props) => {
    const { slideIds: _slideIds, scope: _scope, ...rest } = props;
    if (rest.imageUrl) {
      return `Image url replaced successfully`;
    } else if (rest.imagePrompt) {
      return `Image successfully generated from the given prompt`;
    }
    return `No image url or image prompt provided`;
  },
  {
    name: "replace_image",
    description: "You can use this tool to replace the image of a slide",
    schema: z.object({
      slideIds: slideIdsSchema,
      scope: ScopeSchema,
      imageUrl: z
        .string()
        .describe("The URL of the image to replace")
        .optional(),
      imagePrompt: z
        .string()
        .describe(
          "The prompt to generate the image / look of the image in stock image search",
        )
        .optional(),
    }),
  },
);

const change_theme = tool(
  async (props) => {
    const { theme } = props;
    return `Theme changed successfully to ${theme}`;
  },
  {
    name: "change_theme",
    description: "You can use this tool to change the theme of a slide",
    schema: z.object({
      theme: z
        .enum([
          "daktilo",
          "cornflower",
          "orbit",
          "piano",
          "mystique",
          "allweoneDark",
          "crimson",
          "sunset",
          "forest",
        ])
        .describe("The theme to change to"),
    }),
  },
);

const regenerate_slide = tool(
  async (props) => {
    const { slideIds: _slideIds } = props;
    return `Slides regenerated successfully`;
  },
  {
    name: "regenerate_slide",
    description: `Regenerate one or more slides. You MUST return exactly two arrays: \`slideIds\` and \`slides\`, with the SAME length and in the SAME order so that \`slides[i]\` corresponds to \`slideIds[i]\`. For each element in \`slides\`, generate exactly ONE XML <SECTION>...</SECTION> block (do NOT include <PRESENTATION>).

STRICT FORMAT
- Return only valid XML strings in \`slides\` and the matching ids in \`slideIds\`.
- Each slide must be a single <SECTION layout="left|right|vertical"> ... </SECTION>.
- Do not invent tags or attributes. Use ONLY the supported tags.

SUPPORTED TAGS
Top-level per slide:
- <SECTION layout="left|right|vertical"> ... </SECTION>

Layout components (choose EXACTLY ONE per slide):
- <COLUMNS> <DIV> <H3/> <P/> </DIV> ... </COLUMNS>
- <BULLETS> <DIV> <H3/> <P/> </DIV> ... </BULLETS>
- <ICONS> <DIV icon="..."> <H3/> <P/> </DIV> ... </ICONS>
- <CYCLE> <DIV> <H3/> <P/> </DIV> ... </CYCLE>
- <ARROWS> <DIV> <H3/> <P/> </DIV> ... </ARROWS>
- <ARROW-VERTICAL> <DIV> <H3/> <P/> </DIV> ... </ARROW-VERTICAL>
- <TIMELINE> <DIV> <H3/> <P/> </DIV> ... </TIMELINE>
- <PYRAMID> <DIV> <H3/> <P/> </DIV> ... </PYRAMID>
- <STAIRCASE> <DIV> <H3/> <P/> </DIV> ... </STAIRCASE>
- <BOXES> <DIV> <H3/> <P/> </DIV> ... </BOXES>
- <COMPARE> <DIV> <H3/> <LI/> <LI/> ... </DIV> <DIV> ... </DIV> </COMPARE>
- <BEFORE-AFTER> <DIV> <H3/> <P/> </DIV> <DIV> <H3/> <P/> </DIV> </BEFORE-AFTER>
- <PROS-CONS> <PROS> <H3/> <LI/> ... </PROS> <CONS> <H3/> <LI/> ... </CONS> </PROS-CONS>
- <TABLE> <TR><TH/>...</TR> <TR><TD/>...</TR> ... </TABLE>
- <CHART charttype="bar|pie|line|area|radar|scatter"> <DATA>...</DATA> ... </CHART>

Supporting elements you may use inside components:
- <IMG query="detailed image description..." />
- <DIV> ... </DIV>  <H3> ... </H3>  <P> ... </P>  <LI> ... </LI>
- For <CHART>: <DATA> with <LABEL>/<VALUE> (for bar/pie/line/area/radar) or <X>/<Y> (for scatter).

Regenerate the slides based on the user request. 

If the user request includes changing out the text content of the slides (like translating), don't change the format/layout of the slides keep the format/layout as is.

Important:
- If you provide a image tag, then make sure you use the same url that is there in the slide already. If you don't provide a url the image will be regenerated using the query attribute. We don't want to regenerate the image unless the user asks for it. 
- Make sure the image tag is a self closing tag. If you don't do that , it will break.
`,
    schema: z
      .object({
        slideIds: z
          .array(z.string())
          .min(1)
          .describe(
            "Array of slide ids to regenerate. Order must match the `slides` array.",
          ),
        slides: z
          .array(z.string())
          .min(1)
          .describe(
            "Array of XML <SECTION> strings. Each item is a single slide's content.",
          ),
      })
      .superRefine((data, ctx) => {
        if (data.slideIds.length !== data.slides.length) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message:
              "`slideIds` and `slides` must have the same length and matching order.",
            path: ["slides"],
          });
        }
      }),
  },
);

// Create new slides and insert them after a given slide id (if provided), else append
const create_slide = tool(
  async (props) => {
    const { afterSlideId: _afterSlideId, slides: _slides } = props as {
      afterSlideId?: string;
      slides: string[];
    };
    return `Slides created successfully`;
  },
  {
    name: "create_slide",
    description:
      "Create one or more slides. Return an array of XML <SECTION> strings and optionally the slide id to insert after.",
    schema: z.object({
      slides: z
        .array(z.string())
        .min(1)
        .describe(
          "Array of XML <SECTION> strings. Each item is a single slide's content. For the root image only provide the query and not url",
        ),
      afterSlideId: z
        .string()
        .optional()
        .describe(
          "Insert new slides immediately after this slide id. If omitted or not found, append to the end.",
        ),
    }),
  },
);

// Delete slides by ids
const delete_slide = tool(
  async (props) => {
    const { slideIds: _slideIds } = props as { slideIds: string[] };
    return `Slides deleted successfully`;
  },
  {
    name: "delete_slide",
    description: "Delete one or more slides by id.",
    schema: z.object({
      slideIds: z
        .array(z.string())
        .min(1)
        .describe("Array of slide ids to delete."),
    }),
  },
);

const respond_to_user = tool(
  async (props) => {
    const { message } = props as { message: string };
    return message;
  },
  {
    name: "respond_to_user",
    description:
      "Use this tool when you need to ask a clarification question or send a direct response without editing slides. Never use this tool to pretend a presentation edit or search already happened.",
    schema: z.object({
      message: z
        .string()
        .min(1)
        .describe(
          "The exact clarification question or direct response to send back to the user.",
        ),
    }),
  },
);
// Export all tools as an array
export const presentationTools = [
  edit_slide_properties,
  replace_image,
  change_theme,
  regenerate_slide,
  create_slide,
  delete_slide,
  search_tool,
  respond_to_user,
] as const;

export type PresentationTool =
  | "edit_slide_properties"
  | "replace_image"
  | "change_theme"
  | "regenerate_slide"
  | "create_slide"
  | "delete_slide"
  | "webSearch"
  | "respond_to_user";
