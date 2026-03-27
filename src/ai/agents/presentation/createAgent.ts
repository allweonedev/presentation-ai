import { checkpointer } from "@/ai/lib/postgres";
import { pastedContentMiddleware } from "@/ai/lib/processPastedContent";
import { presentationTools } from "@/ai/tools/presentation/tools";
import { modelPicker } from "@/lib/modelPicker";
import { AIMessage } from "@langchain/core/messages";
import { createAgent, createMiddleware, trimMessages } from "langchain";

interface CreatePresentationGraphOptions {
  modelProvider?: "openai" | "ollama" | "lmstudio";
  modelId?: string;
}

const presentationToolNames = new Set<string>(
  presentationTools.map((tool) => tool.name),
);

function getAiMessageText(message: AIMessage) {
  if (typeof message.content === "string") {
    return message.content;
  }

  return message.content
    .filter((part) => part.type === "text")
    .map((part) => ("text" in part ? part.text ?? "" : ""))
    .join("");
}

function parseJsonToolCall(rawText: string) {
  const trimmed = rawText.trim();

  if (!trimmed) {
    return null;
  }

  const candidates = [trimmed];
  const fencedMatch = trimmed.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i);
  if (fencedMatch?.[1]) {
    candidates.push(fencedMatch[1].trim());
  }

  const firstBraceIndex = trimmed.indexOf("{");
  const lastBraceIndex = trimmed.lastIndexOf("}");
  if (firstBraceIndex >= 0 && lastBraceIndex > firstBraceIndex) {
    candidates.push(trimmed.slice(firstBraceIndex, lastBraceIndex + 1));
  }

  for (const candidate of candidates) {
    try {
      const parsed = JSON.parse(candidate) as {
        name?: unknown;
        parameters?: unknown;
        arguments?: unknown;
        args?: unknown;
      };

      if (typeof parsed.name !== "string") {
        continue;
      }

      if (!presentationToolNames.has(parsed.name)) {
        continue;
      }

      const args =
        parsed.parameters ?? parsed.arguments ?? parsed.args ?? {};

      if (args !== null && typeof args !== "object") {
        continue;
      }

      return {
        name: parsed.name,
        args: (args as Record<string, unknown>) ?? {},
      };
    } catch {
      continue;
    }
  }

  return null;
}

function normalizeJsonToolCallResponse(response: AIMessage) {
  if ((response.tool_calls?.length ?? 0) > 0) {
    return response;
  }

  const parsedToolCall = parseJsonToolCall(getAiMessageText(response));
  if (!parsedToolCall) {
    return null;
  }

  return new AIMessage({
    id: response.id,
    name: response.name,
    content: "",
    tool_calls: [
      {
        id: crypto.randomUUID(),
        type: "tool_call",
        name: parsedToolCall.name,
        args: parsedToolCall.args,
      },
    ],
    additional_kwargs: response.additional_kwargs,
    response_metadata: response.response_metadata,
    usage_metadata: response.usage_metadata,
  });
}

export function createPresentationGraph({
  modelProvider = "openai",
  modelId,
}: CreatePresentationGraphOptions = {}) {
  const trimMessageHistory = createMiddleware({
    name: "TrimMessages",
    wrapModelCall: async (request, handler) => {
      const trimmed = await trimMessages(request.messages, {
        maxTokens: 4,
        strategy: "last",
        startOn: "human",
        endOn: ["human", "tool"],
        tokenCounter: (messages) => messages.length,
      });

      return handler({
        ...request,
        messages: trimmed,
      });
    },
  });

  const enforceStructuredToolCallsForLocalModels = createMiddleware({
    name: "EnforceStructuredToolCallsForLocalModels",
    wrapModelCall: async (request, handler) => {
      if (modelProvider === "openai") {
        return handler(request);
      }

      const lastMessage = request.messages.at(-1);
      const shouldRequireTool = lastMessage?.type === "human";
      const validToolNames = [...presentationToolNames].join(", ");
      const localToolCallingPrompt = `LOCAL TOOL CALLING RULES
- Use the available tools whenever you need to edit slides or answer via a tool.
- If you call a tool, emit a native tool call instead of printing JSON or pseudo-code.
- Never invent tool names. The only valid tools are: ${validToolNames}.
- Do not describe a tool call, simulate a tool result, or claim an edit/search already happened unless you actually called the tool.
- If the user asks to change slide text/content while preserving layout, use regenerate_slide and return the updated XML in the tool arguments.
- If you need clarification or want to reply without editing slides, call respond_to_user with the exact message for the user.
- After a tool result is available, you may briefly summarize it in plain text or call another tool if more work is needed.`;

      const baseRequest = {
        ...request,
        systemPrompt: request.systemPrompt
          ? `${request.systemPrompt}\n\n${localToolCallingPrompt}`
          : localToolCallingPrompt,
      };
      const response = await handler(baseRequest);

      if (
        !shouldRequireTool ||
        !AIMessage.isInstance(response) ||
        (response.tool_calls?.length ?? 0) > 0
      ) {
        return response;
      }

      const normalizedResponse = normalizeJsonToolCallResponse(response);
      if (normalizedResponse) {
        return normalizedResponse;
      }

      const previousText = getAiMessageText(response).trim();
      const retryPrompt = `${baseRequest.systemPrompt}\n\nRETRY REQUIRED
- Your previous response did not contain a valid native tool call, so it cannot be executed.
- Do not answer in plain text.
- Do not wrap the tool call in markdown.
- Do not invent tools like replace_text.
- Retry now with exactly one valid native tool call.
${
  previousText
    ? `- Invalid previous response: ${JSON.stringify(previousText)}`
    : ""
}`;

      const retriedResponse = await handler({
        ...baseRequest,
        systemPrompt: retryPrompt,
      });

      if (!AIMessage.isInstance(retriedResponse)) {
        return retriedResponse;
      }

      return normalizeJsonToolCallResponse(retriedResponse) ?? retriedResponse;
    },
  });

  return createAgent({
    model: modelPicker(
      modelProvider,
      modelProvider === "openai" ? (modelId || "gpt-4o-mini") : modelId,
    ).withConfig({
      parallel_tool_calls: false,
    }),
    tools: [...presentationTools],
    name: "presentation_agent",
    middleware: [
      pastedContentMiddleware,
      trimMessageHistory,
      enforceStructuredToolCallsForLocalModels,
    ],
    systemPrompt: `You are an expert presentation editing agent specialized in modifying and enhancing presentation slides. You work with XML-formatted presentations and have access to powerful tools to make precise edits.

## PRESENTATION FORMAT
You work with presentations in XML format that contain:
- <SECTION> tags for each slide with layout attributes (left, right, vertical, background)
- Various layout components like COLUMNS, BULLETS, ICONS, CYCLE, ARROWS, TIMELINE, PYRAMID, STAIRCASE, BOXES, COMPARE, BEFORE-AFTER, PROS-CONS, TABLE, CHARTS
- <IMG> tags with detailed image queries
- <H1>, <H2>, <H3> for headings and <P> for paragraphs

## WORKFLOW PRINCIPLES
### 1. UNDERSTANDING REQUESTS
- Listen carefully to user requests
- Ask clarifying questions when needed
- Identify which slides need changes (specific slides or all slides)
- Consider the visual impact and design consistency

### 2. TOOL SELECTION
- Choose the most appropriate tool for each request
- Use scope parameters wisely:
  - "all" for all slides
  - Specific slide ids for targeted slides
- Combine multiple tools when needed for complex requests.

### 3. DESIGN CONSIDERATIONS
- Maintain visual consistency across slides
- Consider color contrast and readability
- Ensure layout changes don't break content flow
- Preserve the presentation's overall theme and style

### 4. RESPONSE STYLE
- Be helpful and professional
- After a tool is complete, give only a brief summary.

## COMMON REQUEST PATTERNS
### Visual Changes
- "Change the background to blue" -> Use edit_slide_properties
- "Use a different theme" -> Use change_theme

### Layout Changes
- "Move the image to the left" -> Use edit_slide_properties with "left"
- "Center the content" -> Use edit_slide_properties with alignment "center"
- "Make the image a background" -> Use edit_slide_properties with "background"

### Content Changes
- "Replace the image with [URL]" -> Use replace_image

### Multi-slide Changes
- "Apply this to all slides" -> Use scope: "all"
- "Change slides 1, 3, and 5" -> Use the specific slide ids present in the XML.

## ERROR HANDLING
- If a tool fails, explain what went wrong and suggest an alternative.
- If a request is ambiguous, ask for clarification.
- If a change might break the design, warn the user briefly.

Remember: think like a design partner, not just a command executor.`,
    checkpointer,
  });
}
