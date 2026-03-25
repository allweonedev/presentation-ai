import { type UIMessage } from "ai";

export type UIToolPart = Extract<
  UIMessage["parts"][number],
  { type: "dynamic-tool" | `tool-${string}` }
>;

export function getMessageText(message: UIMessage) {
  return message.parts
    .filter((part): part is Extract<typeof part, { type: "text" }> => {
      return part.type === "text";
    })
    .map((part) => part.text)
    .join("");
}

export function getLatestUserMessage(messages: UIMessage[]) {
  return [...messages].reverse().find((message) => message.role === "user");
}

export function isToolPart(part: UIMessage["parts"][number]): part is UIToolPart {
  return part.type === "dynamic-tool" || part.type.startsWith("tool-");
}

export function getToolName(part: UIToolPart) {
  return part.type === "dynamic-tool" ? part.toolName : part.type.slice(5);
}

export function getToolState(part: UIToolPart): "call" | "partial-call" | "result" {
  if (part.state === "output-available") return "result";
  if (part.state === "input-streaming") return "partial-call";
  return "call";
}

export function getToolInputArgs(part: UIToolPart): Record<string, unknown> {
  if ("input" in part && typeof part.input === "object" && part.input !== null) {
    return part.input as Record<string, unknown>;
  }

  return {};
}

export function getToolOutput(part: UIToolPart) {
  return "output" in part ? part.output : undefined;
}
