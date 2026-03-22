import { type UIMessage } from "ai";
import {
  AIMessage,
  ToolMessage,
  type BaseMessage,
} from "@langchain/core/messages";

function getTextContent(message: BaseMessage) {
  if (typeof message.content === "string") {
    return message.content;
  }

  return message.contentBlocks
    .filter((part) => part.type === "text")
    .map((part) => ("text" in part ? part.text ?? "" : ""))
    .join("");
}

function createTextMessage(message: BaseMessage, role: "user" | "assistant") {
  const text = getTextContent(message);

  return {
    id: message.id ?? crypto.randomUUID(),
    role,
    parts: text
      ? [
          {
            type: "text" as const,
            text,
          },
        ]
      : [],
  } satisfies UIMessage;
}

export function toHydratedUiMessages(messages: BaseMessage[]): UIMessage[] {
  const hydratedMessages: UIMessage[] = [];
  const toolCallLocations = new Map<
    string,
    {
      messageIndex: number;
      partIndex: number;
    }
  >();

  for (const message of messages) {
    if (message.type === "system" || message.type === "developer") {
      continue;
    }

    if (message.type === "human") {
      hydratedMessages.push(createTextMessage(message, "user"));
      continue;
    }

    if (AIMessage.isInstance(message)) {
      const parts: UIMessage["parts"] = [];
      const text = getTextContent(message);

      if (text.trim().length > 0) {
        parts.push({
          type: "text",
          text,
        });
      }

      for (const toolCall of message.tool_calls ?? []) {
        const toolCallId = toolCall.id ?? crypto.randomUUID();
        const partIndex = parts.length;

        parts.push({
          type: "dynamic-tool",
          toolName: toolCall.name,
          toolCallId,
          state: "input-available",
          input: toolCall.args ?? {},
        });

        toolCallLocations.set(toolCallId, {
          messageIndex: hydratedMessages.length,
          partIndex,
        });
      }

      if (parts.length > 0) {
        hydratedMessages.push({
          id: message.id ?? crypto.randomUUID(),
          role: "assistant",
          parts,
        });
      }

      continue;
    }

    if (ToolMessage.isInstance(message)) {
      const existingLocation = toolCallLocations.get(message.tool_call_id);
      const outputText = getTextContent(message);

      if (existingLocation) {
        const existingMessage = hydratedMessages[existingLocation.messageIndex];
        const existingPart = existingMessage?.parts[existingLocation.partIndex];

        if (existingMessage && existingPart?.type === "dynamic-tool") {
          existingMessage.parts[existingLocation.partIndex] = {
            type: "dynamic-tool",
            toolName: existingPart.toolName,
            toolCallId: existingPart.toolCallId,
            state:
              message.status === "error" ? "output-error" : "output-available",
            input: "input" in existingPart ? existingPart.input : {},
            ...(message.status === "error"
              ? {
                  errorText: outputText || "Tool execution failed",
                }
              : {
                  output: outputText,
                }),
          } as UIMessage["parts"][number];
          continue;
        }
      }

      hydratedMessages.push({
        id: message.id ?? crypto.randomUUID(),
        role: "assistant",
        parts: [
          {
            type: "dynamic-tool",
            toolName: message.name ?? "tool",
            toolCallId: message.tool_call_id,
            state:
              message.status === "error" ? "output-error" : "output-available",
            input: {},
            ...(message.status === "error"
              ? {
                  errorText: outputText || "Tool execution failed",
                }
              : {
                  output: outputText,
                }),
          } as UIMessage["parts"][number],
        ],
      });
      continue;
    }

    hydratedMessages.push(createTextMessage(message, "assistant"));
  }

  return hydratedMessages;
}
