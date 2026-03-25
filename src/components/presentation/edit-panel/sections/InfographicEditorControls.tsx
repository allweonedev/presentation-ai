"use client";

import {
  applyThemeToSyntax,
  changeInfographicTemplate,
  convertInfographicData,
  parseInfographicTemplate,
} from "@/components/notebook/presentation/editor/utils/infographic-utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { INFOGRAPHIC_CATEGORIES } from "@/constants/antv-templates";
import { cn } from "@/lib/utils";
import { usePresentationState } from "@/states/presentation-state";
import { Infographic } from "@antv/infographic";
import { Check, Loader2 } from "lucide-react";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { usePresentationTheme } from "../../providers/PresentationThemeProvider";

// Mini preview component for rendering infographic in grid
const InfographicPreview = memo(function InfographicPreview({
  templateId,
  isSelected,
  onClick,
  isDark,
  currentSyntax,
  currentTemplate,
}: {
  templateId: string;
  isSelected: boolean;
  onClick: () => void;
  isDark: boolean;
  currentSyntax: string;
  currentTemplate: string | null;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const infographicRef = useRef<Infographic | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    setIsLoading(true);
    setHasError(false);

    if (infographicRef.current) {
      infographicRef.current.destroy();
      infographicRef.current = null;
    }

    const timeoutId = setTimeout(() => {
      try {
        if (!containerRef.current) return;
        if (!currentSyntax || !currentTemplate) {
          setHasError(true);
          setIsLoading(false);
          return;
        }

        infographicRef.current = new Infographic({
          container: containerRef.current,
          width: "100%",
          height: "100%",
        });

        const converted = convertInfographicData(
          currentSyntax,
          currentTemplate,
          templateId,
        );
        const themedSyntax = applyThemeToSyntax(converted, isDark);
        infographicRef.current.render(themedSyntax);
        setIsLoading(false);
      } catch (err) {
        console.error("Failed to render preview:", err);
        setHasError(true);
        setIsLoading(false);
      }
    }, 300);

    return () => {
      clearTimeout(timeoutId);
      if (infographicRef.current) {
        infographicRef.current.destroy();
        infographicRef.current = null;
      }
    };
  }, [templateId, isDark, currentSyntax, currentTemplate]);

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group relative aspect-video w-full rounded-lg border bg-card text-card-foreground shadow-xs transition-all focus:ring-2 focus:ring-primary/50 focus:outline-hidden",
        isSelected
          ? "border-primary ring-2 ring-primary/20"
          : "border-border hover:border-primary/50 hover:shadow-md",
      )}
    >
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted/20">
          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
        </div>
      )}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted/10 p-2 text-center text-xs text-muted-foreground">
          Preview unavailable
        </div>
      )}
      <div
        ref={containerRef}
        className={cn(
          "h-full w-full p-2 transition-opacity duration-300",
          isLoading ? "opacity-0" : "opacity-100",
        )}
      />
      {isSelected && (
        <div className="absolute top-2 right-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-xs">
          <Check className="h-3 w-3" />
        </div>
      )}
    </button>
  );
});

export function InfographicEditorControls() {
  const { resolvedTheme } = usePresentationTheme();
  const isDark = resolvedTheme === "dark";

  const boundUpdateElement = usePresentationState((s) => s.boundUpdateElement);

  const [expandedKeys, setExpandedKeys] = useState<string[]>([]);
  const [isConverting, setIsConverting] = useState(false);

  // Track which template is currently applied (updates on each conversion)
  const [appliedTemplate, setAppliedTemplate] = useState<string | null>(null);

  // Committed syntax: captured once when the panel opens.
  // All previews and conversions derive from this base syntax,
  // so we never re-render previews after each conversion.
  const [committedSyntax, setCommittedSyntax] = useState<string>("");
  const committedTemplate = useMemo(
    () => parseInfographicTemplate(committedSyntax),
    [committedSyntax],
  );
  const hasCommitted = useRef(false);

  const currentSlideId = usePresentationState((s) => s.currentSlideId);
  const slides = usePresentationState((s) => s.slides);

  // Find and commit the syntax once when the panel first opens
  useEffect(() => {
    if (hasCommitted.current || !currentSlideId) return;

    const slide = slides.find((s) => s.id === currentSlideId);
    if (!slide?.content) return;

    const findInfographicSyntax = (nodes: unknown[]): string | null => {
      for (const node of nodes) {
        const n = node as Record<string, unknown>;
        if (n.type === "antv-infographic" && typeof n.syntax === "string") {
          return n.syntax;
        }
        if (Array.isArray(n.children)) {
          const found = findInfographicSyntax(n.children as unknown[]);
          if (found) return found;
        }
      }
      return null;
    };

    const syntax = findInfographicSyntax(slide.content as unknown[]);
    if (syntax) {
      setCommittedSyntax(syntax);
      const template = parseInfographicTemplate(syntax);
      setAppliedTemplate(template);
      hasCommitted.current = true;
    }
  }, [currentSlideId, slides]);

  const currentCategory = useMemo(() => {
    if (!committedTemplate) return null;
    return (
      INFOGRAPHIC_CATEGORIES.find((cat) =>
        cat.templates.includes(committedTemplate),
      ) ?? null
    );
  }, [committedTemplate]);

  // Expand current category when opening
  useEffect(() => {
    if (currentCategory) {
      setExpandedKeys((prev) => {
        if (!prev.includes(currentCategory.key)) {
          return [...prev, currentCategory.key];
        }
        return prev;
      });
    } else if (expandedKeys.length === 0 && INFOGRAPHIC_CATEGORIES.length > 0) {
      setExpandedKeys([INFOGRAPHIC_CATEGORIES[0]!.key]);
    }
  }, [currentCategory]);

  const handleTemplateChange = useCallback(
    (newTemplateId: string) => {
      if (
        !committedSyntax ||
        !boundUpdateElement ||
        newTemplateId === appliedTemplate
      )
        return;

      setIsConverting(true);

      // Always convert from the committed (original) syntax
      const newSyntax = committedTemplate
        ? convertInfographicData(
            committedSyntax,
            committedTemplate,
            newTemplateId,
          )
        : changeInfographicTemplate(committedSyntax, newTemplateId);

      boundUpdateElement({ syntax: newSyntax, data: undefined });
      setAppliedTemplate(newTemplateId);

      setTimeout(() => {
        setIsConverting(false);
      }, 500);
    },
    [committedSyntax, committedTemplate, appliedTemplate, boundUpdateElement],
  );

  if (!boundUpdateElement) {
    return (
      <div className="flex h-full flex-col items-center justify-center p-6 text-center">
        <p className="text-sm text-muted-foreground">
          Select an infographic element to edit it.
        </p>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <div className="border-b px-4 py-3">
        <div className="space-y-1">
          <p className="text-sm font-medium">Transform Infographic</p>
          <p className="text-xs text-muted-foreground">
            Click a template to convert your infographic
          </p>
        </div>
      </div>

      <ScrollArea className="flex-1">
        {isConverting && (
          <div className="flex items-center justify-center gap-2 py-4 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Converting...</span>
          </div>
        )}
        <Accordion
          type="multiple"
          value={expandedKeys}
          onValueChange={setExpandedKeys}
          className="w-full"
        >
          {INFOGRAPHIC_CATEGORIES.map((category) => (
            <AccordionItem
              value={category.key}
              key={category.key}
              className="border-b border-border/40 last:border-0"
            >
              <AccordionTrigger className="sticky top-0 z-10 bg-background px-4 py-2.5 hover:bg-muted/50 hover:no-underline data-[state=open]:bg-muted/30">
                <span className="text-xs font-medium">
                  {category.name}{" "}
                  <span className="ml-0.5 font-normal text-muted-foreground opacity-70">
                    ({category.templates.length})
                  </span>
                </span>
              </AccordionTrigger>
              <AccordionContent className="bg-muted/20 px-4 pt-1 pb-3">
                <div className="grid grid-cols-2 gap-2">
                  {category.templates.map((templateId) => (
                    <div key={templateId} className="space-y-1">
                      <InfographicPreview
                        templateId={templateId}
                        isSelected={templateId === appliedTemplate}
                        onClick={() => handleTemplateChange(templateId)}
                        isDark={isDark}
                        currentSyntax={committedSyntax}
                        currentTemplate={committedTemplate}
                      />
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </ScrollArea>
    </div>
  );
}
