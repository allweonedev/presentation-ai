import {
  parseSlideXml,
  type PlateSlide,
} from "@/components/notebook/presentation/utils/parser";
import {
  getMessageText,
  getToolInputArgs,
  getToolName,
  getToolState,
  isToolPart,
} from "@/lib/ai/uiMessageParts";
import { type UIMessage } from "ai";
import Compare from "./Compare";
import { extractSlideContent } from "./HumanMessage";
import { PresentationReplaceImageCompare } from "./tools/ReplaceImageCompare";

export default function ToolMessageComponent({
  message,
  messages,
}: {
  message: UIMessage;
  messages: UIMessage[];
}) {
  const toolParts = message.parts.filter(isToolPart);

  for (const part of toolParts) {
    const toolName = getToolName(part);

    if (
      toolName !== "regenerate_slide" &&
      toolName !== "create_slide" &&
      toolName !== "delete_slide" &&
      toolName !== "replace_image"
    ) {
      continue;
    }

    if (getToolState(part) !== "result") {
      continue;
    }

    try {
      const messageIndex = messages.findIndex((candidate) => candidate.id === message.id);

      if (messageIndex === -1) {
        return null;
      }

      const priorMessages = messages.slice(0, messageIndex);
      const lastHumanMessage = [...priorMessages]
        .reverse()
        .find((candidate) => candidate.role === "user");

      const slidesString = extractSlideContent(
        lastHumanMessage ? getMessageText(lastHumanMessage) : "",
      );
      const originalSlides = Array.isArray(slidesString)
        ? []
        : (parseSlideXml(slidesString ?? "") ?? []);
      const args = getToolInputArgs(part) as
        | { slideIds?: string[]; slides?: string[] }
        | { slides?: string[]; afterSlideId?: string }
        | { slideIds?: string[] }
        | {
            slideIds?: string[];
            scope?: "all";
            imageUrl?: string;
            imagePrompt?: string;
          };

      if (
        toolName === "regenerate_slide" &&
        Array.isArray((args as { slideIds?: string[] }).slideIds) &&
        Array.isArray((args as { slides?: string[] }).slides)
      ) {
        const { slideIds = [], slides = [] } = args as {
          slideIds: string[];
          slides: string[];
        };
        const modifiedSlides: PlateSlide[] = [];
        const filteredOriginalSlides: PlateSlide[] = [];

        for (let index = 0; index < Math.min(slideIds.length, slides.length); index++) {
          const slideId = slideIds[index];
          const slideContent = slides[index];

          if (!slideId || !slideContent) {
            continue;
          }

          try {
            const parsedSlide = parseSlideXml(slideContent) ?? [];

            if (parsedSlide[0]) {
              modifiedSlides.push({ ...parsedSlide[0], id: slideId });
            }
          } catch (error) {
            console.error("Error parsing regenerated slide:", error);
          }

          const originalSlide = originalSlides.find((slide) => slide?.id === slideId);

          if (originalSlide) {
            filteredOriginalSlides.push(originalSlide);
          }
        }

        return (
          <div className="max-w-full">
            <Compare left={filteredOriginalSlides} right={modifiedSlides} />
          </div>
        );
      }

      if (
        toolName === "create_slide" &&
        Array.isArray((args as { slides?: string[] }).slides)
      ) {
        const { slides = [], afterSlideId } = args as {
          slides?: string[];
          afterSlideId?: string;
        };
        const newSlides: PlateSlide[] = [];

        for (const slideContent of slides) {
          try {
            const parsedSlide = parseSlideXml(slideContent) ?? [];

            if (parsedSlide[0]) {
              newSlides.push(parsedSlide[0]);
            }
          } catch (error) {
            console.error("Error parsing created slide:", error);
          }
        }

        const rightSlides = [...originalSlides];

        if (afterSlideId) {
          const insertionIndex = rightSlides.findIndex(
            (slide) => slide?.id === afterSlideId,
          );

          if (insertionIndex >= 0) {
            rightSlides.splice(insertionIndex + 1, 0, ...newSlides);
          } else {
            rightSlides.push(...newSlides);
          }
        } else {
          rightSlides.push(...newSlides);
        }

        return (
          <div className="max-w-full">
            <Compare
              left={originalSlides}
              right={rightSlides}
              shouldReplaceTheSlides={true}
            />
          </div>
        );
      }

      if (
        toolName === "delete_slide" &&
        Array.isArray((args as { slideIds?: string[] }).slideIds)
      ) {
        const { slideIds = [] } = args as { slideIds?: string[] };
        const toDelete = new Set(slideIds);
        const rightSlides = originalSlides.filter(
          (slide) => !toDelete.has(slide?.id),
        );

        return (
          <div className="max-w-full">
            <Compare
              left={originalSlides}
              right={rightSlides}
              shouldReplaceTheSlides={true}
            />
          </div>
        );
      }

      if (toolName === "replace_image") {
        const {
          slideIds,
          scope,
          imageUrl,
          imagePrompt,
        } = args as {
          slideIds?: string[];
          scope?: "all";
          imageUrl?: string;
          imagePrompt?: string;
        };

        return (
          <PresentationReplaceImageCompare
            originalSlides={originalSlides}
            slideIds={slideIds}
            scope={scope}
            imageUrl={imageUrl}
            imagePrompt={imagePrompt}
          />
        );
      }
    } catch (error) {
      console.error("Error processing tool message:", error);
      return null;
    }
  }

  return null;
}
