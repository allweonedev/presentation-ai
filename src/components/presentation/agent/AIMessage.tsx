import { cn } from "@/lib/utils";
import {
  getMessageText,
  getToolInputArgs,
  getToolName,
  getToolOutput,
  isToolPart,
} from "@/lib/ai/uiMessageParts";
import { type UIMessage } from "ai";
import { Loader2, Search } from "lucide-react";
import { type ComponentType } from "react";
import {
  PresentationChangeThemeCall,
  PresentationChangeThemeResult,
} from "./tools/ChangeTheme";
import { PresentationDeleteSlideCall } from "./tools/DeleteSlide";
import {
  PresentationEditSlidePropertiesCall,
  PresentationEditSlidePropertiesResult,
} from "./tools/EditSlideProperties";
import EditingSlide from "./tools/EditingSlide";
import {
  PresentationRegenerateSlideResult,
} from "./tools/RegenerateSlide";
import {
  PresentationReplaceImageCall,
  PresentationReplaceImageResult,
} from "./tools/ReplaceImage";

const hiddenTools = [
  "regenerate_slide",
  "delete_slide",
  "create_slide",
  "webSearch",
];

const ToolCallComponentMap = {
  edit_slide_properties: PresentationEditSlidePropertiesCall,
  replace_image: PresentationReplaceImageCall,
  change_theme: PresentationChangeThemeCall,
  regenerate_slide: EditingSlide,
  create_slide: EditingSlide,
  delete_slide: PresentationDeleteSlideCall,
} as const;

const ToolResultComponentMap = {
  edit_slide_properties: PresentationEditSlidePropertiesResult,
  replace_image: PresentationReplaceImageResult,
  change_theme: PresentationChangeThemeResult,
  regenerate_slide: PresentationRegenerateSlideResult,
} as const;

function SearchCall() {
  return (
    <div className="w-full rounded-lg border bg-card p-3 shadow-2xs">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" />
        Searching the web...
      </div>
    </div>
  );
}

function SearchResult({ message }: { message?: string }) {
  return (
    <div className="rounded-lg border bg-card px-3 py-2 shadow-2xs">
      <div className="flex items-center gap-2 text-sm">
        <Search className="h-4 w-4 text-muted-foreground" />
        <span className="line-clamp-2 text-muted-foreground">
          {message ?? "Web search completed."}
        </span>
      </div>
    </div>
  );
}

function PresentationAIToolMessage({
  message,
  isStreaming,
}: {
  message: UIMessage;
  isStreaming: boolean;
}) {
  const toolParts = message.parts.filter(isToolPart);

  return toolParts.map((part, index) => {
    const name = getToolName(part);
    const key = part.toolCallId ?? `${name}-${index}`;

    if (part.state === "output-available") {
      const output = getToolOutput(part);

      if (name === "webSearch") {
        return (
          <SearchResult
            key={key}
            message={typeof output === "string" ? output : undefined}
          />
        );
      }

      const ResultComponent = ToolResultComponentMap[
        name as keyof typeof ToolResultComponentMap
      ] as ComponentType<Record<string, unknown>> | undefined;

      if (!ResultComponent) {
        return null;
      }

      if (typeof output === "object" && output !== null) {
        return <ResultComponent key={key} {...output} />;
      }

      return (
        <ResultComponent
          key={key}
          message={typeof output === "string" ? output : undefined}
        />
      );
    }

    if (name === "webSearch") {
      return <SearchCall key={key} />;
    }

    const CallComponent = ToolCallComponentMap[
      name as keyof typeof ToolCallComponentMap
    ] as ComponentType<Record<string, unknown>> | undefined;

    if (!CallComponent) {
      return null;
    }

    return (
      <CallComponent
        key={key}
        {...getToolInputArgs(part)}
        loading={isStreaming || part.state === "input-streaming"}
      />
    );
  });
}

export default function AIMessageComponent({
  message,
  isStreaming,
  isLastMessage = true,
}: {
  message: UIMessage;
  isStreaming: boolean;
  isLastMessage?: boolean;
}) {
  const toolParts = message.parts.filter(isToolPart);
  const hasToolCalls = toolParts.length > 0;
  const text = getMessageText(message).trim();

  return (
    <div className={cn((text || hasToolCalls) && "space-y-2 py-2")}>
      {hasToolCalls &&
        (isLastMessage ||
          !hiddenTools.includes(getToolName(toolParts[0]!))) && (
          <PresentationAIToolMessage
            message={message}
            isStreaming={isStreaming}
          />
        )}
      {text ? (
        <div className="whitespace-pre-wrap rounded-2xl bg-muted px-3 py-2 text-sm text-foreground shadow-2xs">
          {text}
        </div>
      ) : null}
    </div>
  );
}
