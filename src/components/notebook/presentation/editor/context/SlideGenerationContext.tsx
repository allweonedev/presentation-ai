"use client";

import { usePresentationState } from "@/states/presentation-state";
import { useCompletion } from "@ai-sdk/react";
import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { SlideParser } from "../../utils/parser";

function stripXmlCodeBlock(input: string): string {
  let result = input.trim();
  if (result.startsWith("```xml")) {
    result = result.slice(6).trimStart();
  }
  if (result.endsWith("```")) {
    result = result.slice(0, -3).trimEnd();
  }
  return result;
}

interface SlideGenerationContextValue {
  isGenerating: boolean;
  generatingSlideId: string | null;
  generateSlide: (
    slideId: string,
    prompt: string,
    options?: SlideGenerationOptions,
  ) => void;
  cancelGeneration: () => void;
}

type SlideGenerationOptions = {
  slideType?: "standard" | "image";
  imageStyle?: string;
  textDensity?: string;
};

const SlideGenerationContext =
  createContext<SlideGenerationContextValue | null>(null);

export function SlideGenerationProvider({ children }: { children: ReactNode }) {
  const [generatingSlideId, setGeneratingSlideId] = useState<string | null>(
    null,
  );

  // Refs for parsing
  const parserRef = useRef<SlideParser>(new SlideParser());
  const slideIdRef = useRef<string | null>(null);
  const slideTypeRef = useRef<SlideGenerationOptions["slideType"]>("standard");

  const language = usePresentationState((s) => s.language);
  const setSlides = usePresentationState((s) => s.setSlides);
  const startRootImageGeneration = usePresentationState(
    (s) => s.startRootImageGeneration,
  );

  const { complete, isLoading, stop } = useCompletion({
    api: "/api/presentation/generate-slide",
    onFinish: (_prompt, finalCompletion) => {
      // Parse final content and update the slide only when fully complete
      const processedCompletion = stripXmlCodeBlock(finalCompletion);
      parserRef.current.reset();
      parserRef.current.parseChunk(processedCompletion);
      parserRef.current.finalize();
      const parsedSlides = parserRef.current.getAllSlides();

      if (parsedSlides.length > 0 && slideIdRef.current) {
        const generatedSlide = parsedSlides[0];
        const targetSlideId = slideIdRef.current;
        const isImageSlide = slideTypeRef.current === "image";

        // Update the target slide with generated content
        const currentSlides = usePresentationState.getState().slides;
        const updatedSlides = currentSlides.map((slide) => {
          if (slide.id === targetSlideId) {
            return {
              ...slide,
              content: generatedSlide!.content,
              layoutType: generatedSlide!.layoutType ?? slide.layoutType,
              rootImage: generatedSlide!.rootImage ?? slide.rootImage,
              isImageSlide,
            };
          }
          return slide;
        });

        setSlides(updatedSlides);

        if (generatedSlide?.rootImage?.query) {
          startRootImageGeneration(
            targetSlideId,
            generatedSlide.rootImage.query,
          );
        }
      }

      // Reset state
      setGeneratingSlideId(null);
      slideIdRef.current = null;
      slideTypeRef.current = "standard";
      parserRef.current.reset();
    },
    onError: (error) => {
      console.error("Slide generation error:", error);
      setGeneratingSlideId(null);
      slideIdRef.current = null;
      parserRef.current.reset();
    },
  });

  const generateSlide = useCallback(
    (slideId: string, prompt: string, options?: SlideGenerationOptions) => {
      if (isLoading) return;

      // Reset state
      setGeneratingSlideId(slideId);
      parserRef.current.reset();
      slideIdRef.current = slideId;
      slideTypeRef.current = options?.slideType ?? "standard";

      // Get current slide for context
      const slides = usePresentationState.getState().slides;
      const currentSlide = slides.find((s) => s.id === slideId);

      // Start generation
      void complete(prompt, {
        body: {
          prompt,
          language,
          currentSlide: currentSlide
            ? JSON.stringify(currentSlide.content)
            : undefined,
          slideType: options?.slideType,
          imageStyle: options?.imageStyle,
          textDensity: options?.textDensity,
        },
      });
    },
    [isLoading, complete, language],
  );

  const cancelGeneration = useCallback(() => {
    stop();
    setGeneratingSlideId(null);
    slideIdRef.current = null;
    slideTypeRef.current = "standard";
    parserRef.current.reset();
  }, [stop]);

  return (
    <SlideGenerationContext.Provider
      value={{
        isGenerating: isLoading,
        generatingSlideId,
        generateSlide,
        cancelGeneration,
      }}
    >
      {children}
    </SlideGenerationContext.Provider>
  );
}

export function useSlideGeneration(): SlideGenerationContextValue {
  const context = useContext(SlideGenerationContext);
  if (!context) {
    throw new Error(
      "useSlideGeneration must be used within a SlideGenerationProvider",
    );
  }
  return context;
}
