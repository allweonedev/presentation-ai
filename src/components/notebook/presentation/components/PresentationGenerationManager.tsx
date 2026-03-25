"use client";

import { generateImageAction } from "@/app/_actions/apps/image-studio/generate";
import { getImageFromPixabay } from "@/app/_actions/apps/image-studio/pixabay";
import { getImageFromUnsplash } from "@/app/_actions/apps/image-studio/unsplash";
import { updatePresentation } from "@/app/_actions/notebook/presentation/presentationActions";
import { generateSlideImageAction } from "@/app/_actions/presentation/generate-slide-image";
import {
  getMessageText,
  getToolInputArgs,
  getToolName,
  getToolOutput,
  getToolState,
  isToolPart,
} from "@/lib/ai/uiMessageParts";
import { isWebSearchToolName } from "@/lib/ai/tool-names";
import { useDebouncedSave } from "@/hooks/presentation/useDebouncedSave";
import { usePresentationState } from "@/states/presentation-state";
import { useChat, useCompletion } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { useTheme } from "next-themes";
import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { SlideParser } from "../utils/parser";
import {
  serializeTemplateHintsForPrompt,
  serializeTemplatesForPrompt,
} from "../utils/template-serializer";

interface PresentationOutlineMessageMetadata {
  numberOfCards: number;
  language: string;
  webSearch: boolean;
  presentationId: string | null;
  textContent: "minimal" | "concise" | "detailed" | "extensive";
  tone:
    | "auto"
    | "general"
    | "persuasive"
    | "inspiring"
    | "instructive"
    | "engaging";
  audience:
    | "auto"
    | "general"
    | "business"
    | "investor"
    | "teacher"
    | "student";
  scenario:
    | "auto"
    | "general"
    | "analysis-report"
    | "teaching-training"
    | "promotional-materials"
    | "public-speeches";
}

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

function hasGeneratedOutline(outline: string[]): boolean {
  return outline.some((item) => item.trim().length > 0);
}

function parseOutlineItems(content: string): string[] {
  if (!/^#\s+/m.test(content)) {
    return [];
  }

  const sections = content.split(/^# /gm).filter(Boolean);
  return sections.length > 0
    ? sections.map((section) => `# ${section}`.trim())
    : [];
}

function usesStockSearchForPresentation(
  imageSource: "automatic" | "ai" | "stock",
): boolean {
  return imageSource === "automatic" || imageSource === "stock";
}

export function PresentationGenerationManager() {
  const { resolvedTheme } = useTheme();
  const {
    numSlides,
    language,
    presentationInput,
    shouldStartOutlineGeneration,
    shouldStartPresentationGeneration,
    shouldStartImageSlideGeneration,
    webSearchEnabled,
    setIsGeneratingOutline,
    setShouldStartOutlineGeneration,
    setShouldStartPresentationGeneration,
    setShouldStartImageSlideGeneration,
    resetGeneration,
    setOutline,
    setSearchResults,
    setSlides,
    setIsGeneratingPresentation,
    setCurrentPresentation,
    currentPresentationId,
    imageModel,
    imageSource,
    rootImageGeneration,
    startRootImageGeneration,
    completeRootImageGeneration,
    failRootImageGeneration,
    isGeneratingPresentation,
    isGeneratingOutline,
    slides,
    textContent,
    tone,
    audience,
    scenario,
    theme,
  } = usePresentationState();

  // Persist slide updates during generation using debounced saves to limit frequency
  const { save } = useDebouncedSave();

  // Create a ref for the streaming parser to persist between renders
  const streamingParserRef = useRef<SlideParser>(new SlideParser());
  // Add refs to track the animation frame IDs
  const slidesRafIdRef = useRef<number | null>(null);
  const outlineRafIdRef = useRef<number | null>(null);
  const outlineTransportRef = useRef<DefaultChatTransport<UIMessage> | null>(
    null,
  );
  const outlineBufferRef = useRef<string[] | null>(null);
  const searchResultsBufferRef = useRef<Array<{
    query: string;
    results: unknown[];
  }> | null>(null);
  // Track the last processed messages length to avoid unnecessary updates
  const lastProcessedMessagesLength = useRef<number>(0);
  // Track if title has already been extracted to avoid unnecessary processing
  const titleExtractedRef = useRef<boolean>(false);

  // Function to update slides using requestAnimationFrame
  const updateSlidesWithRAF = (): void => {
    const processedPresentationCompletion = stripXmlCodeBlock(
      presentationCompletion,
    );
    streamingParserRef.current.reset();
    streamingParserRef.current.parseChunk(processedPresentationCompletion);
    streamingParserRef.current.finalize();
    const allSlides = streamingParserRef.current.getAllSlides();
    // Merge any completed root image URLs from state into streamed slides
    const mergedSlides = allSlides.map((slide) => {
      const gen = rootImageGeneration[slide.id];
      if (gen?.status === "success" && slide.rootImage?.query) {
        return {
          ...slide,
          rootImage: {
            ...slide.rootImage,
            url: gen.url,
            imageSource: (imageSource === "stock" ? "search" : "generate") as
              | "search"
              | "generate",
          },
        };
      }
      return slide;
    });
    // For any slide that has a rootImage query but no url, ensure generation is tracked/started
    for (const slide of allSlides) {
      const slideId = slide.id;
      const rootImage = slide.rootImage;
      if (rootImage?.query && !rootImage.url) {
        const already = rootImageGeneration[slideId];
        if (!already || already.status === "error") {
          startRootImageGeneration(slideId, rootImage.query);
        }
      }
    }
    setSlides(mergedSlides);
    // Debounced save during generation to avoid excessive writes
    save();
    slidesRafIdRef.current = null;
  };

  // Function to extract title from content
  const extractTitle = (
    content: string,
  ): { title: string | null; cleanContent: string } => {
    const titleMatch = content.match(/<TITLE>(.*?)<\/TITLE>/i);
    if (titleMatch?.[1]) {
      const title = titleMatch[1].trim();
      const cleanContent = content.replace(/<TITLE>.*?<\/TITLE>/i, "").trim();
      return { title, cleanContent };
    }
    return { title: null, cleanContent: content };
  };

  const processMessages = (messages: typeof outlineMessages): void => {
    if (messages.length <= 1) return;
    const searchResults: Array<{ query: string; results: unknown[] }> = [];
    let latestTitle: string | null = null;
    let latestOutlineItems: string[] = [];

    for (const message of messages) {
      for (const part of message.parts) {
        if (!isToolPart(part)) {
          continue;
        }

        const invocation = {
          toolName: getToolName(part),
          state: getToolState(part),
          args: getToolInputArgs(part),
          result: getToolOutput(part),
        };

        if (
          isWebSearchToolName(invocation.toolName) &&
          invocation.state === "result" &&
          invocation.result
        ) {
          const argsRecord =
            typeof invocation.args === "object" && invocation.args !== null
              ? (invocation.args as Record<string, unknown>)
              : {};
          const query =
            typeof argsRecord.query === "string"
              ? argsRecord.query
              : "Unknown query";

          let parsedResult: unknown;
          try {
            parsedResult =
              typeof invocation.result === "string"
                ? JSON.parse(invocation.result)
                : invocation.result;
          } catch {
            parsedResult = invocation.result;
          }

          searchResults.push({
            query,
            results:
              parsedResult &&
              typeof parsedResult === "object" &&
              "results" in parsedResult &&
              Array.isArray(parsedResult.results)
                ? parsedResult.results
                : [],
          });
        }
      }

      if (message.role !== "assistant") {
        continue;
      }

      const assistantText = getMessageText(message);
      if (!assistantText) {
        continue;
      }

      const { title, cleanContent } = extractTitle(assistantText);
      if (title) {
        latestTitle = title;
      }

      const outlineItems = parseOutlineItems(cleanContent);
      if (outlineItems.length > 0) {
        latestOutlineItems = outlineItems;
      }
    }

    if (!titleExtractedRef.current && latestTitle) {
      setCurrentPresentation(currentPresentationId, latestTitle);
      titleExtractedRef.current = true;
    }

    if (searchResults.length > 0) {
      searchResultsBufferRef.current = searchResults;
    }

    if (latestOutlineItems.length > 0) {
      outlineBufferRef.current = latestOutlineItems;
    }
  };

  // Function to update outline and search results using requestAnimationFrame
  const updateOutlineWithRAF = (): void => {
    // Batch all updates in a single RAF callback for better performance

    // Update search results if available
    if (searchResultsBufferRef.current !== null) {
      setSearchResults(searchResultsBufferRef.current);
      searchResultsBufferRef.current = null;
    }

    // Update outline if available
    if (outlineBufferRef.current !== null) {
      setOutline(outlineBufferRef.current);
      outlineBufferRef.current = null;
    }

    // Clear the current frame ID
    outlineRafIdRef.current = null;
  };

  // Outline generation with or without web search
  if (outlineTransportRef.current === null) {
    outlineTransportRef.current = new DefaultChatTransport({
      api: "/api/presentation/outline",
    });
  }

  const {
    messages: outlineMessages,
    sendMessage: appendOutlineMessage,
    setMessages: setOutlineMessages,
  } = useChat({
    transport: outlineTransportRef.current,

    onFinish: () => {
      const {
        currentPresentationId,
        outline,
        searchResults,
        currentPresentationTitle,
        imageSource,
      } = usePresentationState.getState();

      setIsGeneratingOutline(false);
      setShouldStartOutlineGeneration(false);
      setShouldStartPresentationGeneration(false);

      if (!hasGeneratedOutline(outline)) {
        toast.error(
          "Outline generation finished without producing an outline. Please try again.",
        );
        return;
      }

      if (currentPresentationId) {
        void updatePresentation({
          id: currentPresentationId,
          outline,
          searchResults,
          prompt: presentationInput,
          title: currentPresentationTitle ?? "",
          imageSource,
        });
      }

      // Cancel any pending outline animation frame
      if (outlineRafIdRef.current !== null) {
        cancelAnimationFrame(outlineRafIdRef.current);
        outlineRafIdRef.current = null;
      }
    },
    onError: (error) => {
      setIsGeneratingOutline(false);
      setShouldStartOutlineGeneration(false);
      setShouldStartPresentationGeneration(false);
      toast.error("Failed to generate outline: " + error.message);
      resetGeneration();

      if (outlineRafIdRef.current !== null) {
        cancelAnimationFrame(outlineRafIdRef.current);
        outlineRafIdRef.current = null;
      }
    },
  });

  // Lightweight useEffect that only schedules RAF updates
  useEffect(() => {
    if (outlineMessages.length > 1) {
      lastProcessedMessagesLength.current = outlineMessages.length;
      processMessages(outlineMessages);
      if (outlineRafIdRef.current === null) {
        outlineRafIdRef.current = requestAnimationFrame(updateOutlineWithRAF);
      }
    }
  }, [outlineMessages, webSearchEnabled]);

  // Watch for outline generation start
  useEffect(() => {
    const startOutlineGeneration = async (): Promise<void> => {
      if (shouldStartOutlineGeneration) {
        try {
          titleExtractedRef.current = false;
          setOutlineMessages([]);
          outlineBufferRef.current = null;
          searchResultsBufferRef.current = null;
          lastProcessedMessagesLength.current = 0;

          const { presentationInput } = usePresentationState.getState();
          if (outlineRafIdRef.current === null) {
            outlineRafIdRef.current =
              requestAnimationFrame(updateOutlineWithRAF);
          }

          await appendOutlineMessage({
            role: "user",
            metadata: {
              numberOfCards: numSlides,
              language,
              webSearch: webSearchEnabled,
              presentationId: currentPresentationId,
              textContent,
              tone,
              audience,
              scenario,
            } satisfies PresentationOutlineMessageMetadata,
            parts: [{ type: "text", text: presentationInput }],
          });
        } catch (error) {
          console.error(error);
        }
      }
    };

    void startOutlineGeneration();
  }, [shouldStartOutlineGeneration]);

  const { completion: presentationCompletion, complete: generatePresentation } =
    useCompletion({
      api: "/api/presentation/generate",
      onFinish: (_prompt, _completion) => {
        setIsGeneratingPresentation(false);
        setShouldStartPresentationGeneration(false);
        const { theme } = usePresentationState.getState();
        if (currentPresentationId) {
          updatePresentation({
            id: currentPresentationId,
            theme:
              theme ??
              (resolvedTheme === "dark" ? "ebony" : "mystique"),
          });
        }
      },
      onError: (error) => {
        toast.error("Failed to generate presentation: " + error.message);
        resetGeneration();
        streamingParserRef.current.reset();

        // Cancel any pending animation frame
        if (slidesRafIdRef.current !== null) {
          cancelAnimationFrame(slidesRafIdRef.current);
          slidesRafIdRef.current = null;
        }
      },
    });

  // Image slides generation
  const { completion: imageSlidesCompletion, complete: generateImageSlides } =
    useCompletion({
      api: "/api/presentation/generate-image-slides",
      onFinish: (_prompt, _completion) => {
        setIsGeneratingPresentation(false);
        setShouldStartImageSlideGeneration(false);
        const { theme } = usePresentationState.getState();
        if (currentPresentationId) {
          updatePresentation({
            id: currentPresentationId,
            theme:
              theme ??
              (resolvedTheme === "dark" ? "ebony" : "mystique"),
          });
        }
      },
      onError: (error) => {
        toast.error("Failed to generate image slides: " + error.message);
        resetGeneration();
        streamingParserRef.current.reset();

        // Cancel any pending animation frame
        if (slidesRafIdRef.current !== null) {
          cancelAnimationFrame(slidesRafIdRef.current);
          slidesRafIdRef.current = null;
        }
      },
    });

  useEffect(() => {
    if (presentationCompletion) {
      try {
        // Only schedule a new frame if one isn't already pending
        if (slidesRafIdRef.current === null) {
          slidesRafIdRef.current = requestAnimationFrame(updateSlidesWithRAF);
        }
      } catch (error) {
        console.error("Error processing presentation XML:", error);
        toast.error("Error processing presentation content");
      }
    }
  }, [presentationCompletion]);

  // Handle image slides completion streaming
  useEffect(() => {
    if (imageSlidesCompletion) {
      try {
        const processedCompletion = stripXmlCodeBlock(imageSlidesCompletion);
        streamingParserRef.current.reset();
        streamingParserRef.current.parseChunk(processedCompletion);
        streamingParserRef.current.finalize();
        const allSlides = streamingParserRef.current.getAllSlides();

        // Mark all slides as image slides and start image generation
        const imageSlidesData = allSlides.map((slide) => {
          const gen = rootImageGeneration[slide.id];
          if (gen?.status === "success" && slide.rootImage?.query) {
            return {
              ...slide,
              isImageSlide: true,
              rootImage: {
                ...slide.rootImage,
                url: gen.url,
                imageSource: "generate" as const,
              },
            };
          }
          return { ...slide, isImageSlide: true };
        });

        // Start image generation for slides that need it
        for (const slide of allSlides) {
          const slideId = slide.id;
          const rootImage = slide.rootImage;
          if (rootImage?.query && !rootImage.url) {
            const already = rootImageGeneration[slideId];
            if (!already || already.status === "error") {
              startRootImageGeneration(slideId, rootImage.query);
            }
          }
        }

        setSlides(imageSlidesData);
        save();
      } catch (error) {
        console.error("Error processing image slides XML:", error);
        toast.error("Error processing image slides content");
      }
    }
  }, [imageSlidesCompletion]);

  useEffect(() => {
    if (shouldStartPresentationGeneration) {
      const {
        outline,
        presentationInput,
        language,
        tone,
        currentPresentationTitle,
        searchResults: stateSearchResults,
        setThumbnailUrl,
        textContent,
        audience,
        scenario,
        imageSource,
        selectedSlideTemplates,
        outlineTemplateOverrides,
      } = usePresentationState.getState();

      if (!hasGeneratedOutline(outline)) {
        setShouldStartPresentationGeneration(false);
        setIsGeneratingPresentation(false);
        toast.error("Generate an outline before generating the presentation.");
        return;
      }

      // Serialize templates for AI if any are selected
      const templateContext =
        selectedSlideTemplates.length > 0
          ? serializeTemplatesForPrompt(selectedSlideTemplates)
          : undefined;
      const outlineTemplateHints =
        selectedSlideTemplates.length > 0 &&
        Object.keys(outlineTemplateOverrides).length > 0
          ? serializeTemplateHintsForPrompt(
              outlineTemplateOverrides,
              selectedSlideTemplates,
            )
          : undefined;

      // Reset the parser before starting a new generation
      streamingParserRef.current.reset();
      setIsGeneratingPresentation(true);
      setThumbnailUrl(undefined);
      void generatePresentation(presentationInput ?? "", {
        body: {
          title: currentPresentationTitle ?? presentationInput ?? "",
          prompt: presentationInput ?? "",
          outline,
          searchResults: stateSearchResults,
          language,
          tone: tone,
          textContent,
          audience,
          scenario,
          imageSource,
          templateContext,
          outlineTemplateHints,
          selectedTemplateCount: selectedSlideTemplates.length,
        },
      });
    }
  }, [shouldStartPresentationGeneration]);

  // Watch for image slide generation start
  useEffect(() => {
    if (shouldStartImageSlideGeneration) {
      const {
        outline,
        presentationInput,
        language,
        currentPresentationTitle,
        setThumbnailUrl,
      } = usePresentationState.getState();

      if (!hasGeneratedOutline(outline)) {
        setShouldStartImageSlideGeneration(false);
        setIsGeneratingPresentation(false);
        toast.error("Generate an outline before generating image slides.");
        return;
      }

      // Reset the parser before starting a new generation
      streamingParserRef.current.reset();
      setIsGeneratingPresentation(true);
      setThumbnailUrl(undefined);

      void generateImageSlides(presentationInput ?? "", {
        body: {
          title: currentPresentationTitle ?? presentationInput ?? "",
          prompt: presentationInput ?? "",
          outline,
          language,
        },
      });
    }
  }, [shouldStartImageSlideGeneration]);

  // Listen for manual root image generation changes (when user manually triggers image generation)
  useEffect(() => {
    for (const [slideId, gen] of Object.entries(rootImageGeneration)) {
      if (gen.status === "queued") {
        // Next, set status to "pending"
        usePresentationState.getState().rootImageGeneration &&
          usePresentationState.setState((state) => ({
            rootImageGeneration: {
              ...state.rootImageGeneration,
              [slideId]: {
                ...(state.rootImageGeneration[slideId] ?? { query: gen.query }),
                status: "generating",
              },
            },
          }));

        const slide = slides.find((s) => s.id === slideId);
        if (slide?.rootImage?.query) {
          void (async () => {
            try {
              let result;

              const usesStockSearch =
                usesStockSearchForPresentation(imageSource) &&
                !slide?.isImageSlide;

              if (usesStockSearch) {
                const { stockImageProvider } = usePresentationState.getState();
                if (
                  imageSource === "stock" &&
                  stockImageProvider === "pixabay"
                ) {
                  const pixabayResult = await getImageFromPixabay(
                    slide.rootImage!.query,
                    slide.rootImage!.layoutType,
                  );
                  if (pixabayResult.success && pixabayResult.imageUrl) {
                    result = {
                      success: true,
                      image: { url: pixabayResult.imageUrl },
                    };
                  }
                } else {
                  const unsplashResult = await getImageFromUnsplash(
                    slide.rootImage!.query,
                    slide.rootImage!.layoutType,
                  );
                  if (unsplashResult.success && unsplashResult.imageUrl) {
                    result = {
                      success: true,
                      image: { url: unsplashResult.imageUrl },
                    };
                  }
                }
              } else {
                if (slide?.isImageSlide) {
                  result = await generateSlideImageAction(
                    slide.rootImage!.query,
                    imageModel,
                  );
                } else {
                  result = await generateImageAction(
                    slide.rootImage!.query,
                    imageModel,
                  );
                }
              }

              if (result?.success && result.image?.url) {
                completeRootImageGeneration(slideId, result.image.url);
                usePresentationState.getState().setSlides(
                  usePresentationState.getState().slides.map((s) =>
                    s.id === slideId
                      ? {
                          ...s,
                        rootImage: {
                          ...s.rootImage!,
                          url: result.image.url,
                          imageSource: usesStockSearch
                            ? "search"
                            : "generate",
                        },
                      }
                      : s,
                  ),
                );
                save();
              } else {
                failRootImageGeneration(
                  slideId,
                  result?.error ?? "No image url returned",
                );
              }
            } catch (err) {
              const message =
                err instanceof Error ? err.message : "Image generation failed";
              failRootImageGeneration(slideId, message);
            }
          })();
        }
      }
    }
  }, [
    rootImageGeneration,
    isGeneratingPresentation,
    isGeneratingOutline,
    slides,
    imageSource,
    imageModel,
    completeRootImageGeneration,
    failRootImageGeneration,
    setSlides,
  ]);

  // Clean up RAF on unmount
  useEffect(() => {
    return () => {
      if (slidesRafIdRef.current !== null) {
        cancelAnimationFrame(slidesRafIdRef.current);
        slidesRafIdRef.current = null;
      }

      if (outlineRafIdRef.current !== null) {
        cancelAnimationFrame(outlineRafIdRef.current);
        outlineRafIdRef.current = null;
      }
    };
  }, []);

  return null;
}
