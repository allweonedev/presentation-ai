"use client";

import { cn } from "@/lib/utils";
import { usePresentationState } from "@/states/presentation-state";
import { motion } from "motion/react";
import { ImageIcon, LayoutTemplate, Sparkles } from "lucide-react";
import { nanoid } from "nanoid";
import { type PlateElementProps, useEditorSelector } from "platejs/react";
import { useState } from "react";
import { type PlateSlide } from "../../utils/parser";
import { useSlideGeneration } from "../context/SlideGenerationContext";
import { GenerateSlideUI } from "./GenerateSlideUI";
import { SlideTemplateModal } from "./SlideTemplateModal";

const templates: Record<string, Omit<PlateSlide, "id">> = {
  leftImage: {
    layoutType: "left",
    rootImage: {
      query: "abstract background",
    },
    content: [
      {
        type: "h2",
        id: nanoid(),
        children: [{ text: "Your Title Here" }],
      },
      {
        type: "p",
        id: nanoid(),
        children: [{ text: "Add your content description here..." }],
      },
    ],
  },

  rightImage: {
    layoutType: "right",
    rootImage: {
      query: "abstract background",
    },
    content: [
      {
        type: "h2",
        id: nanoid(),
        children: [{ text: "Your Title Here" }],
      },
      {
        type: "p",
        id: nanoid(),
        children: [{ text: "Add your content description here..." }],
      },
    ],
  },

  threeColumns: {
    content: [
      {
        type: "bullets",
        id: nanoid(),
        columnSize: "md",
        bulletType: "basic",
        children: [
          {
            type: "bullet",
            id: nanoid(),
            children: [
              {
                type: "h3",
                id: nanoid(),
                children: [{ text: "Point 1" }],
              },
              {
                type: "p",
                id: nanoid(),
                children: [{ text: "Description for the first point" }],
              },
            ],
          },
          {
            type: "bullet",
            id: nanoid(),
            children: [
              {
                type: "h3",
                id: nanoid(),
                children: [{ text: "Point 2" }],
              },
              {
                type: "p",
                id: nanoid(),
                children: [{ text: "Description for the second point" }],
              },
            ],
          },
          {
            type: "bullet",
            id: nanoid(),
            children: [
              {
                type: "h3",
                id: nanoid(),
                children: [{ text: "Point 3" }],
              },
              {
                type: "p",
                id: nanoid(),
                children: [{ text: "Description for the third point" }],
              },
            ],
          },
        ],
      },
    ],
  },
  bullets: {
    content: [
      {
        type: "bullets",
        id: nanoid(),
        columnSize: "lg",
        bulletType: "numbered",
        children: [
          {
            type: "bullet",
            id: nanoid(),
            children: [
              {
                type: "p",
                id: nanoid(),
                children: [{ text: "First key point to discuss" }],
              },
            ],
          },
          {
            type: "bullet",
            id: nanoid(),
            children: [
              {
                type: "p",
                id: nanoid(),
                children: [{ text: "Second key point to discuss" }],
              },
            ],
          },
          {
            type: "bullet",
            id: nanoid(),
            children: [
              {
                type: "p",
                id: nanoid(),
                children: [{ text: "Third key point to discuss" }],
              },
            ],
          },
          {
            type: "bullet",
            id: nanoid(),
            children: [
              {
                type: "p",
                id: nanoid(),
                children: [{ text: "Fourth key point to discuss" }],
              },
            ],
          },
        ],
      },
    ],
  },
} as const;

// Template button component
function TemplateButton({
  icon,
  label,
  onClick,
  preview,
}: {
  icon?: React.ReactNode;
  label?: string;
  onClick: () => void;
  preview?: React.ReactNode;
}) {
  return (
    <motion.button
      onClick={onClick}
      className="group relative flex h-24 w-28 flex-col items-center justify-center gap-2 rounded-xl border border-border bg-card/50 backdrop-blur-xs transition-all hover:border-sidebar-accent-foreground/20 hover:bg-sidebar-accent"
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
    >
      {preview ? (
        <div className="flex h-12 w-20 items-center justify-center">
          {preview}
        </div>
      ) : (
        <div className="flex h-8 w-8 items-center justify-center text-muted-foreground group-hover:text-foreground">
          {icon}
        </div>
      )}
      {label && (
        <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground">
          {label}
        </span>
      )}
    </motion.button>
  );
}

// Preview components for template buttons
function ImageLeftPreview() {
  return (
    <div className="flex h-10 w-16 gap-1 rounded border border-border bg-muted/20 p-1">
      <div className="flex h-full w-1/2 items-center justify-center rounded bg-muted/40">
        <ImageIcon className="h-3 w-3 text-muted-foreground/60" />
      </div>
      <div className="flex h-full w-1/2 flex-col gap-0.5 py-0.5">
        <div className="h-1 w-full rounded-sm bg-muted-foreground/30" />
        <div className="h-0.5 w-3/4 rounded-sm bg-muted-foreground/20" />
        <div className="h-0.5 w-1/2 rounded-sm bg-muted-foreground/20" />
      </div>
    </div>
  );
}

function ImageRightPreview() {
  return (
    <div className="flex h-10 w-16 gap-1 rounded border border-border bg-muted/20 p-1">
      <div className="flex h-full w-1/2 flex-col gap-0.5 py-0.5">
        <div className="h-1 w-full rounded-sm bg-muted-foreground/30" />
        <div className="h-0.5 w-3/4 rounded-sm bg-muted-foreground/20" />
        <div className="h-0.5 w-1/2 rounded-sm bg-muted-foreground/20" />
      </div>
      <div className="flex h-full w-1/2 items-center justify-center rounded bg-muted/40">
        <ImageIcon className="h-3 w-3 text-muted-foreground/60" />
      </div>
    </div>
  );
}

function ThreeColumnPreview() {
  return (
    <div className="flex h-10 w-16 gap-0.5 rounded border border-border bg-muted/20 p-1">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="flex h-full flex-1 flex-col items-center gap-0.5 rounded bg-primary/10 p-0.5"
        >
          <div className="h-2 w-2 rounded-sm bg-primary/60" />
          <div className="h-0.5 w-full rounded-sm bg-muted-foreground/20" />
          <div className="h-0.5 w-3/4 rounded-sm bg-muted-foreground/15" />
        </div>
      ))}
    </div>
  );
}

function ContentListPreview() {
  return (
    <div className="flex h-10 w-16 flex-col gap-0.5 rounded border border-border bg-muted/20 p-1">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="flex items-center gap-1">
          <div className="h-1 w-1 rounded-full bg-primary/60" />
          <div
            className="h-0.5 rounded-sm bg-muted-foreground/30"
            style={{ width: `${70 - i * 10}%` }}
          />
        </div>
      ))}
    </div>
  );
}

export default function PlaceHolderCard(props: PlateElementProps) {
  const { editor, element } = props;
  // Use useEditorSelector to properly subscribe to content changes
  // This ensures the component re-renders when content changes
  const isEmpty = useEditorSelector((editor) => editor.api.isEmpty(), []);
  const setSlides = usePresentationState((s) => s.setSlides);
  const { isGenerating, generatingSlideId } = useSlideGeneration();
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [showGenerateUI, setShowGenerateUI] = useState(false);

  // Check if this slide is currently being generated
  const isGeneratingThisSlide = isGenerating && generatingSlideId === editor.id;

  // Show generate UI if explicitly opened OR if this slide is being generated
  const shouldShowGenerateUI = showGenerateUI || isGeneratingThisSlide;

  // Only show template options when the entire editor is empty and not generating
  const showTemplateOptions = isEmpty && !shouldShowGenerateUI;

  const handleOpenTemplates = () => {
    setShowTemplateModal(true);
  };

  const handleGenerate = () => {
    setShowGenerateUI(true);
  };

  const handleCloseGenerateUI = () => {
    setShowGenerateUI(false);
  };

  const applyTemplate = (template: keyof typeof templates) => {
    const slides = usePresentationState.getState().slides;

    console.log(templates[template]);
    const newSlides = slides.map((slide) => {
      if (slide.id !== editor.id) {
        return slide;
      }
      return {
        ...templates[template]!,
        id: editor.id,
      };
    });

    setSlides(newSlides);
  };

  // When generating, replace children with GenerateSlideUI
  if (shouldShowGenerateUI) {
    return (
      <GenerateSlideUI slideId={editor.id} onClose={handleCloseGenerateUI} />
    );
  }

  return (
    <div className="relative" data-slate-void="true">
      {isEmpty && (
        <div
          contentEditable={false}
          className={cn(
            "pointer-events-none absolute inset-x-16 opacity-50 select-none",
            // Paragraph styles
            element.type === "p" &&
              "px-0 py-1 [font-family:var(--presentation-body-font)] [font-size:var(--presentation-p-size)] leading-[1.6] text-(--presentation-text)",
            // Heading styles
            (element.type as string).startsWith("h") &&
              "[font-family:var(--presentation-heading-font)] font-bold text-(--presentation-heading)",
            element.type === "h1" &&
              "pb-1 [font-size:var(--presentation-h1-size)]",
            element.type === "h2" &&
              "pb-px [font-size:var(--presentation-h2-size)]",
            element.type === "h3" &&
              "pb-px [font-size:var(--presentation-h3-size)]",
            element.type === "h4" && "[font-size:var(--presentation-h4-size)]",
            element.type === "h5" && "[font-size:var(--presentation-h5-size)]",
            element.type === "h6" && "[font-size:var(--presentation-h6-size)]",
          )}
        >
          {element.type === "p" ? "Type Something..." : "Untitled Card"}
        </div>
      )}

      {props.children}
      <SlideTemplateModal
        isOpen={showTemplateModal}
        onClose={() => setShowTemplateModal(false)}
        slideId={editor.id}
      />
      {/* Template options overlay - only shown when editor is empty */}
      {showTemplateOptions && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="pointer-events-auto mt-6 px-16"
        >
          {/* Label */}
          <motion.p
            contentEditable={false}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="mb-4 text-sm font-medium text-muted-foreground"
          >
            Or start with a template
          </motion.p>

          {/* Template buttons grid */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
            className="flex flex-wrap gap-3"
          >
            <TemplateButton
              onClick={() => applyTemplate("leftImage")}
              preview={<ImageLeftPreview />}
            />
            <TemplateButton
              onClick={() => applyTemplate("rightImage")}
              preview={<ImageRightPreview />}
            />
            <TemplateButton
              onClick={() => applyTemplate("threeColumns")}
              preview={<ThreeColumnPreview />}
            />
            <TemplateButton
              onClick={() => applyTemplate("bullets")}
              preview={<ContentListPreview />}
            />
            <TemplateButton
              icon={<LayoutTemplate className="h-5 w-5" />}
              label="Templates"
              onClick={handleOpenTemplates}
            />
            <TemplateButton
              icon={<Sparkles className="h-5 w-5" />}
              label="Generate"
              onClick={handleGenerate}
            />
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
