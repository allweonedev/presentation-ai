"use client";

import { parseSlideXml } from "@/components/notebook/presentation/utils/parser";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { TooltipButton } from "@/components/ui/button";
import { usePresentationState } from "@/states/presentation-state";
import { type UIMessage } from "ai";
import { Undo2 } from "lucide-react";
import * as React from "react";
import { toast } from "sonner";

function sanitizeHumanMessage(message: string) {
  return message
    .replace(/<slide-information>[\s\S]*?<\/slide-information>/gi, "")
    .trim();
}

function getTextContent(message: UIMessage): string {
  return message.parts
    .filter((part): part is Extract<typeof part, { type: "text" }> => {
      return part.type === "text";
    })
    .map((part) => part.text)
    .join("\n");
}

function getImageUrls(message: UIMessage): string[] {
  return message.parts.flatMap((part) => {
    if (
      part.type === "file" &&
      part.mediaType.startsWith("image/") &&
      typeof part.url === "string"
    ) {
      return [part.url];
    }

    return [];
  });
}

export function extractSlideContent(message: string) {
  const match = message.match(
    /<slide-information>([\s\S]*?)<\/slide-information>/,
  );

  return match ? match[1]?.trim() : null;
}

export default function HumanMessageComponent({
  message,
}: {
  message: UIMessage;
}) {
  const [open, setOpen] = React.useState(false);
  const textContent = getTextContent(message);
  const imageUrls = getImageUrls(message);

  const handleRollback = React.useCallback(() => {
    const slideContent = extractSlideContent(textContent);

    if (!slideContent) {
      toast.error("No slide information found");
      return;
    }

    const parsedSlides = parseSlideXml(slideContent);

    if (!parsedSlides.length) {
      toast.error("Unable to restore this state");
      return;
    }

    usePresentationState.getState().setSlides(parsedSlides);
    toast.success("Presentation restored to this message");
  }, [textContent]);

  return (
    <div className="grid w-full place-items-end gap-1.5">
      {imageUrls.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {imageUrls.map((url, index) => (
            <div
              key={`${url}-${index}`}
              className="relative h-16 w-20 overflow-hidden rounded-md border border-primary-foreground/20 bg-muted"
            >
              {/* biome-ignore lint/performance/noImgElement: Previewing uploaded slide images */}
              <img
                src={url}
                alt={`Attached image ${index + 1}`}
                className="h-full w-full object-cover"
              />
            </div>
          ))}
        </div>
      ) : null}

      <div className="w-full max-w-[80%] overflow-x-auto rounded-2xl bg-primary px-3 py-2 text-sm text-primary-foreground shadow-2xs">
        {sanitizeHumanMessage(textContent)}
      </div>

      <div className="mt-1 mr-1 flex gap-2">
        <AlertDialog open={open} onOpenChange={setOpen}>
          <AlertDialogTrigger asChild>
            <TooltipButton
              className="flex size-6 items-center justify-center rounded-full bg-transparent hover:bg-accent"
              aria-label="Rollback"
              tooltipText="Rollback"
              variant="ghost"
              size="xs"
              onClick={() => setOpen(true)}
            >
              <Undo2 className="size-5" />
            </TooltipButton>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Rollback Message?</AlertDialogTitle>
              <AlertDialogDescription>
                Restore the presentation state captured in this message.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setOpen(false)}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction onClick={handleRollback}>
                Confirm Rollback
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
