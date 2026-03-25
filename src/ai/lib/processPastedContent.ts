import { HumanMessage, type BaseMessage } from "@langchain/core/messages";
import { createMiddleware } from "langchain";

interface PastedContentItem {
  id: string;
  content: string;
  startIndex: number;
}

function buildEnhancedContent(
  originalContent: string,
  pastedContent: PastedContentItem[],
): string {
  const sorted = [...pastedContent].sort((a, b) => b.startIndex - a.startIndex);

  let result = originalContent;

  for (const item of sorted) {
    const insertPosition = Math.min(item.startIndex, result.length);
    const pastedTag = `\n${item.content}\n`;

    result =
      result.slice(0, insertPosition) +
      pastedTag +
      result.slice(insertPosition);
  }

  return result;
}

export const pastedContentMiddleware = createMiddleware({
  name: "ProcessPastedContent",
  wrapModelCall: async (request, handler) => {
    const processedMessages = request.messages.map((message) => {
      if (message.type !== "human") {
        return message;
      }

      const pastedContent = message.additional_kwargs?.pastedContent as
        | PastedContentItem[]
        | undefined;

      if (!pastedContent || pastedContent.length === 0) {
        return message;
      }

      const originalContent =
        typeof message.content === "string"
          ? message.content
          : Array.isArray(message.content)
            ? message.content
                .filter((part) => typeof part === "object" && part.type === "text")
                .map((part) => ("text" in part ? part.text ?? "" : ""))
                .join("\n")
            : "";

      return new HumanMessage({
        content: buildEnhancedContent(originalContent, pastedContent),
        id: message.id,
        response_metadata: message.response_metadata,
        additional_kwargs: {
          ...message.additional_kwargs,
          pastedContentProcessed: true,
        },
      });
    });

    return handler({
      ...request,
      messages: processedMessages,
    });
  },
});

export function processPastedContent(messages: BaseMessage[]): BaseMessage[] {
  return messages.map((message) => {
    if (message.type !== "human") {
      return message;
    }

    const pastedContent = message.additional_kwargs?.pastedContent as
      | PastedContentItem[]
      | undefined;

    if (!pastedContent || pastedContent.length === 0) {
      return message;
    }

    const originalContent =
      typeof message.content === "string"
        ? message.content
        : Array.isArray(message.content)
          ? message.content
              .filter((part) => typeof part === "object" && part.type === "text")
              .map((part) => ("text" in part ? part.text ?? "" : ""))
              .join("\n")
          : "";

    return new HumanMessage({
      content: buildEnhancedContent(originalContent, pastedContent),
      id: message.id,
      response_metadata: message.response_metadata,
      additional_kwargs: {
        ...message.additional_kwargs,
        pastedContentProcessed: true,
      },
    });
  });
}
