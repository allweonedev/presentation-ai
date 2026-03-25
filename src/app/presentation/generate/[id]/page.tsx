"use client";

import { type ImageModelList } from "@/app/_actions/apps/image-studio/generate";
import { getPresentation } from "@/app/_actions/notebook/presentation/presentationActions";
import { getCustomThemeById } from "@/app/_actions/presentation/theme-actions";
import { Header } from "@/components/notebook/presentation/components/outline/Header";
import { OutlineList } from "@/components/notebook/presentation/components/outline/OutlineList";
import { ToolCallDisplay } from "@/components/notebook/presentation/components/outline/ToolCallDisplay";
import { PresentationCustomizer } from "@/components/notebook/presentation/components/theme/PresentationCustomizer";
import { ThemeBackground } from "@/components/notebook/presentation/components/theme/ThemeBackground";
import { ThemeSettings } from "@/components/notebook/presentation/components/theme/ThemeSettings";
import { usePresentationTheme } from "@/components/presentation/providers/PresentationThemeProvider";
import { HelpMenu } from "@/components/sidebar/help-menu";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import {
  applyPageBackgroundToConfig,
  getPresentationCustomization,
} from "@/lib/presentation/customization";
import {
  themes,
  type ThemeProperties,
  type Themes,
} from "@/lib/presentation/themes";
import { usePresentationState } from "@/states/presentation-state";
import { useQuery } from "@tanstack/react-query";
import { Wand2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import { useLayoutEffect, useRef } from "react";
import { toast } from "sonner";

// Cookie name for presentation generation

import { GenerateImageSlidesButton } from "@/components/notebook/presentation/components/outline/GenerateImageSlidesButton";

export default function PresentationGenerateWithIdPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const { data: session } = useSession();
  const { resolvedTheme } = usePresentationTheme();
  const {
    setCurrentPresentation,
    setPresentationInput,
    startOutlineGeneration,
    startPresentationGeneration,
    startImageSlideGeneration,
    isGeneratingPresentation,
    isGeneratingOutline,
    setImageModel,
    setOutline,
    setSearchResults,
    setTheme,
    setImageSource,
    setPresentationStyle,
    setPageStyle,
    setLanguage,
    setWebSearchEnabled,
    setTextContent,
    setTone,
    setAudience,
    setScenario,
    setPendingCreateRequest,
    outline,
    currentPresentationId,
  } = usePresentationState();
  const outlineSectionRef = useRef<HTMLDivElement>(null);
  const canGenerateImageSlides = session?.user?.isAdmin === true;
  const hasOutline = outline.some((item) => item.trim().length > 0);
  const isOutlineUnavailable = isGeneratingOutline || !hasOutline;
  const isGeneratePresentationDisabled =
    isGeneratingPresentation || isGeneratingOutline;
  const generatePresentationButtonLabel = isGeneratingOutline
    ? "Generating Outline..."
    : isGeneratingPresentation
      ? "Generating Presentation..."
      : hasOutline
        ? "Generate Presentation"
        : "Generate Outline";

  // Use React Query to fetch presentation data
  const { data: presentationData, isLoading: isLoadingPresentation } = useQuery(
    {
      queryKey: ["presentation", id],
      queryFn: async () => {
        const result = await getPresentation(id);
        if (!result.success) {
          throw new Error(result.message ?? "Failed to load presentation");
        }
        return result.presentation;
      },
      enabled:
        currentPresentationId !== id ||
        (!isGeneratingOutline && outline.length === 0),
    },
  );

  useLayoutEffect(() => {
    if (id) {
      setPendingCreateRequest(null);
    }
  }, [id, setPendingCreateRequest]);

  // Update presentation state when data is fetched
  useLayoutEffect(() => {
    if (presentationData && !isLoadingPresentation && !isGeneratingOutline) {
      setCurrentPresentation(presentationData.id, presentationData.title);
      setPresentationInput(
        presentationData.presentation?.prompt ?? presentationData.title,
      );

      const customization = getPresentationCustomization(
        presentationData.presentation?.customization,
      );
      const customizationThemeId = presentationData.presentation?.theme ?? null;
      const presentationContent = presentationData.presentation
        ?.content as unknown as {
        config?: Record<string, unknown>;
      };

      if (presentationData.presentation?.outline) {
        setOutline(presentationData.presentation.outline);
      }

      // Load search results if available
      if (presentationData.presentation?.searchResults) {
        try {
          const searchResults = Array.isArray(
            presentationData.presentation.searchResults,
          )
            ? presentationData.presentation.searchResults
            : JSON.parse(presentationData.presentation.searchResults as string);
          setWebSearchEnabled(true);
          setSearchResults(searchResults);
        } catch (error) {
          console.error("Failed to parse search results:", error);
          setSearchResults([]);
        }
      }

      // Set theme if available
      if (customizationThemeId) {
        const themeId = customizationThemeId;
        const customThemeData = customization?.themeData as
          | ThemeProperties
          | undefined;
        if (customThemeData) {
          setTheme(themeId, customThemeData);
        } else if (themeId in themes) {
          setTheme(themeId as Themes);
        } else {
          // If not in predefined themes, treat as custom theme
          void getCustomThemeById(themeId)
            .then((result) => {
              if (result.success && result.theme) {
                // Set the theme with the custom theme data
                const themeData = result.theme
                  .themeData as unknown as ThemeProperties;
                setTheme(themeId, themeData);
              } else {
                // Fallback to default theme if custom theme not found
                console.warn("Custom theme not found:", themeId);
                setTheme(resolvedTheme === "dark" ? "ebony" : "mystique");
              }
            })
            .catch((error) => {
              console.error("Failed to load custom theme:", error);
              // Fallback to default theme on error
              setTheme(resolvedTheme === "dark" ? "ebony" : "mystique");
            });
        }
      }

      // Set presentationStyle if available
      if (customization?.presentationStyle) {
        setPresentationStyle(customization.presentationStyle);
      } else if (presentationData?.presentation?.presentationStyle) {
        setPresentationStyle(presentationData.presentation.presentationStyle);
      }

      if (customization?.pageStyle) {
        setPageStyle(customization.pageStyle);
      }

      if (customization?.textContent) {
        setTextContent(customization.textContent);
      }
      if (customization?.tone) {
        setTone(customization.tone);
      }
      if (customization?.audience) {
        setAudience(customization.audience);
      }
      if (customization?.scenario) {
        setScenario(customization.scenario);
      }

      if (presentationData?.presentation?.imageSource) {
        setImageSource(
          presentationData.presentation.imageSource as "ai" | "stock",
        );
      }

      // Set language if available
      if (presentationData.presentation?.language) {
        setLanguage(presentationData.presentation.language);
      }

      if (customization?.pageBackground) {
        const { setPageBackground } = usePresentationState.getState();
        const next = applyPageBackgroundToConfig(
          customization.pageBackground,
          presentationContent?.config ?? {},
        );
        setPageBackground(next);
      }

    }
  }, [
    presentationData,
    isLoadingPresentation,
    setCurrentPresentation,
    setPresentationInput,
    setOutline,
    setTheme,
    setImageSource,
    setPresentationStyle,
    setPageStyle,
    setLanguage,
    setTextContent,
    setTone,
    setAudience,
    setScenario,
    resolvedTheme,
  ]);

  const handleGenerate = () => {
    if (isGeneratingOutline || isGeneratingPresentation) {
      return;
    }

    if (!hasOutline) {
      outlineSectionRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      startOutlineGeneration();
      return;
    }

    router.push(`/presentation/${id}`);
    startPresentationGeneration();
  };

  const handleGenerateImageSlides = (model: ImageModelList) => {
    if (isGeneratingOutline || isGeneratingPresentation) {
      return;
    }

    if (!hasOutline) {
      toast.error("Generate an outline before generating image slides.");
      return;
    }

    router.push(`/presentation/${id}`);
    setImageModel(model);
    startImageSlideGeneration();
  };

  if (isLoadingPresentation) {
    return (
      <ThemeBackground
        themeOverride={resolvedTheme === "dark" ? "ebony" : "mystique"}
      >
        <div className="flex h-[calc(100vh-8rem)] flex-col items-center justify-center px-4 text-center">
          <div className="relative">
            <Spinner className="h-10 w-10 text-primary" />
          </div>
          <div className="space-y-2 text-center">
            <h2 className="text-2xl font-bold">Loading Presentation Outline</h2>
            <p className="text-muted-foreground">Please wait a moment...</p>
          </div>
        </div>
      </ThemeBackground>
    );
  }

  return (
    <ThemeBackground>
      <div className="flex justify-center pb-28">
        <div className="w-full max-w-4xl space-y-6 px-4 pt-14 pb-6 sm:p-8 sm:pt-6">
          <div className="space-y-6">
            <Header />
            <ToolCallDisplay />
            <div ref={outlineSectionRef}>
              <OutlineList />
            </div>
            <PresentationCustomizer />
            <ThemeSettings />
          </div>
        </div>
      </div>

      <div className="fixed right-0 bottom-0 left-0 border-t bg-background/80 p-4 backdrop-blur-xs">
        <div className="mx-auto flex w-full max-w-4xl flex-col justify-center gap-3 sm:w-fit sm:max-w-none sm:flex-row sm:gap-4">
          {canGenerateImageSlides ? (
            <div className="w-full sm:w-fit sm:flex-none">
              <GenerateImageSlidesButton
                isGenerating={isGeneratingPresentation}
                disabled={isOutlineUnavailable}
                onGenerateImageSlides={handleGenerateImageSlides}
              />
            </div>
          ) : null}
          <div className="w-full sm:w-fit sm:flex-none">
            <Button
              size="lg"
              className="w-full gap-2 px-8 sm:h-10 sm:w-auto sm:min-w-0 sm:px-5 sm:text-sm"
              onClick={handleGenerate}
              disabled={isGeneratePresentationDisabled}
            >
              <Wand2 className="h-5 w-5 sm:h-4 sm:w-4" />
              {generatePresentationButtonLabel}
            </Button>
          </div>
        </div>
      </div>

      <div className="fixed right-4 bottom-24 z-99999 sm:right-6 sm:bottom-2">
        <HelpMenu hideKeyboardShortcutsOnMobile />
      </div>
    </ThemeBackground>
  );
}
