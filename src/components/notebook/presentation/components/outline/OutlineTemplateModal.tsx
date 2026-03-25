"use client";

import { Button } from "@/components/ui/button";
import {
  Credenza,
  CredenzaContent,
  CredenzaHeader,
  CredenzaTitle,
} from "@/components/ui/credenza";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useMediaQuery } from "@/hooks/globals/useMediaQuery";
import { cn } from "@/lib/utils";
import { usePresentationState } from "@/states/presentation-state";
import { Check, ChevronRight, LayoutGrid, Menu, X } from "lucide-react";
import { motion } from "motion/react";
import { useCallback, useEffect, useState } from "react";
import {
  TEMPLATE_CATEGORIES,
  TEMPLATE_DEFINITIONS,
  type TemplateDefinition,
} from "../../utils/templates";

interface SelectableTemplateCardProps {
  template: TemplateDefinition;
  isSelected: boolean;
  onToggle: () => void;
  disabled?: boolean;
}

function SelectableTemplateCard({
  template,
  isSelected,
  onToggle,
  disabled,
}: SelectableTemplateCardProps) {
  return (
    <motion.button
      onClick={onToggle}
      disabled={disabled}
      className={cn(
        "group relative flex flex-col gap-2 text-left",
        disabled && !isSelected && "cursor-not-allowed opacity-50",
      )}
      whileHover={!disabled ? { scale: 1.02 } : undefined}
      whileTap={!disabled ? { scale: 0.98 } : undefined}
    >
      <div
        className={cn(
          "aspect-4/3 w-full overflow-hidden rounded-lg border bg-card shadow-xs transition-all",
          isSelected
            ? "border-primary ring-2 ring-primary/20"
            : "border-border group-hover:border-primary/50 group-hover:shadow-md",
        )}
      >
        {template.preview}
        {/* Selection indicator */}
        {isSelected && (
          <div className="absolute top-2 right-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <Check className="h-3 w-3" />
          </div>
        )}
      </div>
      <div className="flex items-center gap-2">
        <span
          className={cn(
            "text-xs font-medium",
            isSelected
              ? "text-foreground"
              : "text-muted-foreground group-hover:text-foreground",
          )}
        >
          {template.name}
        </span>
      </div>
    </motion.button>
  );
}

interface OutlineTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "global" | "single";
  outlineId?: string; // Only for "single" mode
}

export function OutlineTemplateModal({
  isOpen,
  onClose,
  mode,
  outlineId,
}: OutlineTemplateModalProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);

  useEffect(() => {
    setIsSidebarVisible(isDesktop);
  }, [isDesktop]);

  useEffect(() => {
    if (isOpen && mode === "single") {
      setLocalSelection([]);
    }
  }, [isOpen, mode, outlineId]);

  const {
    selectedSlideTemplates,
    setSelectedSlideTemplates,
    numSlides,
    setOutlineTemplateOverride,
  } = usePresentationState();

  // For single mode, we track local selection until apply
  const [localSelection, setLocalSelection] = useState<string[]>(
    mode === "single" ? [] : selectedSlideTemplates,
  );

  // Sync local selection with global when modal opens
  const effectiveSelection =
    mode === "global" ? selectedSlideTemplates : localSelection;

  const filteredTemplates = selectedCategory
    ? TEMPLATE_DEFINITIONS.filter((t) => t.categoryId === selectedCategory)
    : TEMPLATE_DEFINITIONS;

  const handleTemplateToggle = useCallback(
    (templateId: string) => {
      if (mode === "global") {
        const isSelected = selectedSlideTemplates.includes(templateId);
        if (isSelected) {
          setSelectedSlideTemplates(
            selectedSlideTemplates.filter((id) => id !== templateId),
          );
        } else if (selectedSlideTemplates.length < numSlides) {
          setSelectedSlideTemplates([...selectedSlideTemplates, templateId]);
        }
      } else {
        // Single mode - local state
        const isSelected = localSelection.includes(templateId);
        if (isSelected) {
          setLocalSelection(localSelection.filter((id) => id !== templateId));
        } else if (localSelection.length < numSlides) {
          setLocalSelection([...localSelection, templateId]);
        }
      }
    },
    [
      mode,
      selectedSlideTemplates,
      setSelectedSlideTemplates,
      numSlides,
      localSelection,
    ],
  );

  const handleClearAll = () => {
    if (mode === "global") {
      setSelectedSlideTemplates([]);
    } else {
      setLocalSelection([]);
    }
  };

  const handleApply = () => {
    if (mode === "single" && outlineId && localSelection.length > 0) {
      // For single mode, add to global templates if not already there and set override
      const newTemplateId = localSelection[0];
      if (newTemplateId && !selectedSlideTemplates.includes(newTemplateId)) {
        setSelectedSlideTemplates([...selectedSlideTemplates, newTemplateId]);
      }
      setOutlineTemplateOverride(outlineId, newTemplateId ?? null);
    }
    onClose();
  };

  const getTemplatesByCategory = (categoryId: string) =>
    TEMPLATE_DEFINITIONS.filter((t) => t.categoryId === categoryId);

  const isAtLimit = effectiveSelection.length >= numSlides;

  const renderTemplateGrid = (templates: TemplateDefinition[]) => (
    <div className="grid grid-cols-2 gap-3 p-1 sm:grid-cols-3 lg:grid-cols-4 lg:gap-4">
      {templates.map((template) => (
        <SelectableTemplateCard
          key={template.id}
          template={template}
          isSelected={effectiveSelection.includes(template.id)}
          onToggle={() => handleTemplateToggle(template.id)}
          disabled={isAtLimit && !effectiveSelection.includes(template.id)}
        />
      ))}
    </div>
  );

  return (
    <Credenza
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          onClose();
        }
      }}
    >
      <CredenzaContent
        shouldHaveClose={false}
        className="h-[92dvh] max-h-[92dvh] max-w-[1000px] gap-0 overflow-hidden p-0 md:h-auto"
      >
        <CredenzaHeader className="border-b px-4 py-4 sm:px-6">
          <div className="flex items-start justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              {isDesktop && (
                <Button
                  onClick={() => setIsSidebarVisible(!isSidebarVisible)}
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                >
                  <Menu className="h-4 w-4" />
                </Button>
              )}
              <div className="min-w-0">
                <CredenzaTitle>
                  {mode === "global" ? "Select Layouts" : "Select Layout"}
                </CredenzaTitle>
                <p className="mt-1 text-sm text-muted-foreground">
                  {effectiveSelection.length}/{numSlides} selected
                </p>
              </div>
            </div>
            {isDesktop && (
              <div className="flex items-center gap-2">
                {effectiveSelection.length > 0 && (
                  <Button
                    onClick={handleClearAll}
                    variant="outline"
                    size="sm"
                    className="h-8"
                  >
                    Clear All
                  </Button>
                )}
                <Button onClick={handleApply} size="sm" className="h-8">
                  {mode === "global" ? "Done" : "Apply"}
                </Button>
                <Button
                  onClick={onClose}
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
            {!isDesktop && (
              <Button
                onClick={onClose}
                variant="ghost"
                size="icon"
                className="h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CredenzaHeader>

        {isDesktop ? (
          <div className="flex h-[70vh]">
            {/* Sidebar */}
            {isSidebarVisible && (
              <div className="w-60 border-r bg-muted/30">
                <ScrollArea className="h-full space-y-2 p-3">
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className={cn(
                      "mb-1 flex w-full items-center gap-2 rounded-lg p-4 text-sm transition-colors",
                      selectedCategory === null
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-muted",
                    )}
                  >
                    <LayoutGrid className="h-4 w-4" />
                    <span>All Templates</span>
                  </button>
                  {TEMPLATE_CATEGORIES.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={cn(
                        "flex w-full items-center justify-between rounded-lg p-4 text-sm transition-colors",
                        selectedCategory === category.id
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-muted",
                      )}
                    >
                      <div className="flex items-center gap-2">
                        {category.icon}
                        <span>{category.name}</span>
                      </div>
                      <ChevronRight className="size-4" />
                    </button>
                  ))}
                </ScrollArea>
              </div>
            )}

            {/* Content */}
            <ScrollArea className="flex-1 overflow-x-visible p-5">
              {selectedCategory === null ? (
                <div className="space-y-8 px-1">
                  {TEMPLATE_CATEGORIES.map((category) => {
                    const categoryTemplates = getTemplatesByCategory(category.id);
                    if (categoryTemplates.length === 0) return null;
                    return (
                      <section key={category.id}>
                        <div className="mb-3 flex items-center gap-2">
                          {category.icon}
                          <h3 className="text-sm font-medium">{category.name}</h3>
                        </div>
                        {renderTemplateGrid(categoryTemplates)}
                      </section>
                    );
                  })}
                </div>
              ) : (
                renderTemplateGrid(filteredTemplates)
              )}
            </ScrollArea>
          </div>
        ) : (
          <div className="flex min-h-0 flex-1 flex-col">
            <div className="overflow-x-auto border-b">
              <div className="flex w-max gap-2 px-4 py-3">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={cn(
                    "flex shrink-0 items-center gap-2 rounded-full border px-3 py-2 text-sm transition-colors",
                    selectedCategory === null
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-background hover:bg-muted",
                  )}
                >
                  <LayoutGrid className="h-4 w-4" />
                  <span>All Layouts</span>
                </button>
                {TEMPLATE_CATEGORIES.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={cn(
                      "flex shrink-0 items-center gap-2 rounded-full border px-3 py-2 text-sm transition-colors",
                      selectedCategory === category.id
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-background hover:bg-muted",
                    )}
                  >
                    {category.icon}
                    <span>{category.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <ScrollArea className="min-h-0 flex-1 px-4 py-4">
              {selectedCategory === null ? (
                <div className="space-y-6">
                  {TEMPLATE_CATEGORIES.map((category) => {
                    const categoryTemplates = getTemplatesByCategory(category.id);
                    if (categoryTemplates.length === 0) return null;
                    return (
                      <section key={category.id}>
                        <div className="mb-3 flex items-center gap-2">
                          {category.icon}
                          <h3 className="text-sm font-medium">{category.name}</h3>
                        </div>
                        {renderTemplateGrid(categoryTemplates)}
                      </section>
                    );
                  })}
                </div>
              ) : (
                renderTemplateGrid(filteredTemplates)
              )}
            </ScrollArea>

            <div className="flex flex-col gap-2 border-t px-4 py-3">
              {effectiveSelection.length > 0 && (
                <Button onClick={handleClearAll} variant="outline">
                  Clear All
                </Button>
              )}
              <Button onClick={handleApply}>
                {mode === "global" ? "Done" : "Apply"}
              </Button>
            </div>
          </div>
        )}
      </CredenzaContent>
    </Credenza>
  );
}
