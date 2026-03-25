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
import { motion } from "motion/react";
import { ChevronRight, LayoutGrid, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { type PlateSlide } from "../../utils/parser";
import {
  TEMPLATE_CATEGORIES,
  TEMPLATE_DEFINITIONS,
  type TemplateDefinition,
} from "../../utils/templates";

interface TemplateCardProps {
  template: TemplateDefinition;
  onClick: () => void;
}

function TemplateCard({ template, onClick }: TemplateCardProps) {
  return (
    <motion.button
      onClick={onClick}
      className="group flex flex-col gap-2 text-left"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="aspect-4/3 w-full overflow-hidden rounded-lg border border-border bg-card shadow-xs transition-all group-hover:border-primary/50 group-hover:shadow-md">
        {template.preview}
      </div>
      <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground">
        {template.name}
      </span>
    </motion.button>
  );
}

interface SlideTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  slideId: string;
}

export function SlideTemplateModal({
  isOpen,
  onClose,
  slideId,
}: SlideTemplateModalProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);

  useEffect(() => {
    setIsSidebarVisible(isDesktop);
  }, [isDesktop]);

  const filteredTemplates = selectedCategory
    ? TEMPLATE_DEFINITIONS.filter((t) => t.categoryId === selectedCategory)
    : TEMPLATE_DEFINITIONS;

  const handleTemplateSelect = (template: TemplateDefinition) => {
    const { slides, setSlides } = usePresentationState.getState();
    const updatedSlides = slides.map((slide) => {
      if (slide.id !== slideId) return slide;
      return {
        ...template.template,
        id: slideId,
      } as PlateSlide;
    });
    setSlides(updatedSlides);
    onClose();
  };

  const getTemplatesByCategory = (categoryId: string) =>
    TEMPLATE_DEFINITIONS.filter((t) => t.categoryId === categoryId);

  const renderTemplateGrid = (templates: TemplateDefinition[]) => (
    <div className="grid grid-cols-2 gap-3 p-1 sm:grid-cols-3 lg:grid-cols-4 lg:gap-4">
      {templates.map((template) => (
        <TemplateCard
          key={template.id}
          template={template}
          onClick={() => handleTemplateSelect(template)}
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
        className="max-h-[92dvh] max-w-[1000px] gap-0 overflow-hidden p-0"
      >
        <CredenzaHeader className="flex flex-row items-center justify-between border-b px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
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
            <CredenzaTitle>Select a layout</CredenzaTitle>
          </div>
          <Button
            onClick={onClose}
            variant="ghost"
            size="icon"
            className="h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        </CredenzaHeader>

        {isDesktop ? (
          <div className="flex h-[70vh]">
            {/* Sidebar */}
            {isSidebarVisible && (
              <div className="w-56 border-r bg-muted/30">
                <ScrollArea className="h-full p-3">
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
                    <span>All Layouts</span>
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
                      <ChevronRight className="h-3 w-3" />
                    </button>
                  ))}
                </ScrollArea>
              </div>
            )}

            {/* Content */}
            <ScrollArea className="flex-1 p-6">
              {selectedCategory === null ? (
                <div className="space-y-8 p-1">
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
          <div className="flex max-h-[calc(92dvh-4.5rem)] flex-col">
            <ScrollArea className="border-b">
              <div className="flex gap-2 px-4 py-3">
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
            </ScrollArea>

            <ScrollArea className="flex-1 px-4 py-4">
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
          </div>
        )}
      </CredenzaContent>
    </Credenza>
  );
}
