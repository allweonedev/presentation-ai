"use client";

import { motion } from "motion/react";
import { Loader2, Sparkles, X } from "lucide-react";
import { useCallback, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSlideGeneration } from "../context/SlideGenerationContext";

interface GenerateSlideUIProps {
  slideId: string;
  onClose: () => void;
}

type ContentType = "Slide" | "Infograph";
type ImageStyle = "3D" | "Sketch" | "Flat";
type TextDensity = "Minimal" | "Balanced" | "Detailed";

const IMAGE_STYLES: ImageStyle[] = ["3D", "Sketch", "Flat"];

const TEXT_DENSITIES: TextDensity[] = ["Minimal", "Balanced", "Detailed"];

export function GenerateSlideUI({ slideId, onClose }: GenerateSlideUIProps) {
  const [prompt, setPrompt] = useState("");
  const [contentType, setContentType] = useState<ContentType>("Slide");
  const [imageStyle, setImageStyle] = useState<ImageStyle>("3D");
  const [textDensity, setTextDensity] = useState<TextDensity>("Balanced");
  const { isGenerating, generatingSlideId, generateSlide, cancelGeneration } =
    useSlideGeneration();

  // Check if we're generating for THIS slide
  const isGeneratingThisSlide = isGenerating && generatingSlideId === slideId;

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!prompt.trim() || isGeneratingThisSlide) return;

      generateSlide(slideId, prompt.trim(), {
        slideType: contentType === "Infograph" ? "image" : "standard",
        imageStyle,
        textDensity,
      });
    },
    [
      prompt,
      isGeneratingThisSlide,
      generateSlide,
      slideId,
      contentType,
      imageStyle,
      textDensity,
    ],
  );

  const handleCancel = useCallback(() => {
    if (isGeneratingThisSlide) {
      cancelGeneration();
    }
    onClose();
  }, [isGeneratingThisSlide, cancelGeneration, onClose]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSubmit(e);
      }
    },
    [handleSubmit],
  );

  return (
    <div
      data-slate-void="true"
      contentEditable={false}
      className="pointer-events-auto select-none"
    >
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="mt-6 px-6 sm:px-10 lg:px-16"
      >
        {/* Prompt input state */}
        {!isGeneratingThisSlide && (
          <>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="mb-4 text-sm font-medium text-slate-500 dark:text-white/50"
            >
              Generate with AI
            </motion.p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="rounded-2xl border border-slate-200/80 bg-white/90 p-4 shadow-xs backdrop-blur-sm dark:border-white/10 dark:bg-white/5 sm:p-5">
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-slate-500 dark:text-white/60">
                      Content
                    </span>
                    <Select
                      value={contentType}
                      onValueChange={(value) =>
                        setContentType(value as ContentType)
                      }
                    >
                      <SelectTrigger className="h-9 w-[150px] rounded-xl border-slate-200 bg-slate-50 text-xs font-semibold text-slate-900 shadow-none dark:border-white/10 dark:bg-white/5 dark:text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="Slide">Slide</SelectItem>
                        <SelectItem value="Infograph">Infograph</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {contentType === "Infograph" && (
                    <>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-slate-500 dark:text-white/60">
                          Style
                        </span>
                        <Select
                          value={imageStyle}
                          onValueChange={(value) =>
                            setImageStyle(value as ImageStyle)
                          }
                        >
                          <SelectTrigger className="h-9 w-[140px] rounded-xl border-slate-200 bg-slate-50 text-xs font-semibold text-slate-900 shadow-none dark:border-white/10 dark:bg-white/5 dark:text-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="rounded-xl">
                            {IMAGE_STYLES.map((style) => (
                              <SelectItem key={style} value={style}>
                                {style}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-slate-500 dark:text-white/60">
                          Text density
                        </span>
                        <Select
                          value={textDensity}
                          onValueChange={(value) =>
                            setTextDensity(value as TextDensity)
                          }
                        >
                          <SelectTrigger className="h-9 w-[160px] rounded-xl border-slate-200 bg-slate-50 text-xs font-semibold text-slate-900 shadow-none dark:border-white/10 dark:bg-white/5 dark:text-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="rounded-xl">
                            {TEXT_DENSITIES.map((density) => (
                              <SelectItem key={density} value={density}>
                                {density}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </>
                  )}
                </div>

                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Describe what you want on this slide..."
                  rows={3}
                  className="mt-4 w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 shadow-xs focus:border-slate-300 focus:outline-hidden focus:ring-0 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-white/40 dark:focus:border-white/30"
                />
              </div>

              <div className="flex items-center gap-3">
                <motion.button
                  type="submit"
                  disabled={!prompt.trim()}
                  className="flex items-center gap-2 rounded-xl border border-slate-900 bg-slate-900 px-4 py-2.5 text-sm font-medium text-white shadow-xs transition-all hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40 dark:border-white/10 dark:bg-white/10 dark:text-white dark:hover:bg-white/20"
                  whileHover={{ scale: 1.02, y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                >
                  <Sparkles className="h-4 w-4" />
                  Generate
                </motion.button>

                <motion.button
                  type="button"
                  onClick={handleCancel}
                  className="flex items-center gap-2 rounded-xl border border-slate-200 bg-transparent px-4 py-2.5 text-sm font-medium text-slate-600 transition-all hover:border-slate-300 hover:text-slate-900 dark:border-white/10 dark:text-white/60 dark:hover:border-white/20 dark:hover:text-white/80"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                >
                  <X className="h-4 w-4" />
                  Cancel
                </motion.button>
              </div>
            </form>
          </>
        )}

        {/* Loading state - shown until generation is fully complete */}
        {isGeneratingThisSlide && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-3"
          >
            <Loader2 className="h-5 w-5 animate-spin text-slate-500 dark:text-white/50" />
            <span className="text-sm text-slate-500 dark:text-white/50">
              Generating slide...
            </span>
            <motion.button
              type="button"
              onClick={handleCancel}
              className="ml-2 text-sm text-slate-400 hover:text-slate-600 dark:text-white/40 dark:hover:text-white/60"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Cancel
            </motion.button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
