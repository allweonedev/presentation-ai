"use client";

import { getPresentation } from "@/app/_actions/presentation/presentationActions";
import { getCustomThemeById } from "@/app/_actions/presentation/theme-actions";
import { ThinkingDisplay } from "@/components/presentation/dashboard/ThinkingDisplay";
import { Header } from "@/components/presentation/outline/Header";
import { OutlineList } from "@/components/presentation/outline/OutlineList";
import { PromptInput } from "@/components/presentation/outline/PromptInput";
import { ToolCallDisplay } from "@/components/presentation/outline/ToolCallDisplay";
import { ThemeBackground } from "@/components/presentation/theme/ThemeBackground";
import { ThemeSettings } from "@/components/presentation/theme/ThemeSettings";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import {
  themes,
  type ThemeProperties,
  type Themes,
} from "@/lib/presentation/themes";
import { usePresentationState } from "@/states/presentation-state";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Wand2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

export const PRESENTATION_GENERATION_COOKIE = "presentation_generation_pending";

export default function PresentationGenerateWithIdPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const {
    setCurrentPresentation,
    setPresentationInput,
    startPresentationGeneration,
    startOutlineGeneration,
    isGeneratingPresentation,
    isGeneratingOutline,
    outlineThinking,
    setOutline,
    setSearchResults,
    setShouldStartOutlineGeneration,
    setTheme,
    setImageSource,
    setPresentationStyle,
    setLanguage,
    setWebSearchEnabled,
  } = usePresentationState();

  // Track if this is a fresh navigation or a revisit
  const initialLoadComplete = useRef(false);
  const generationStarted = useRef(false);

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
      enabled: !!id,
    },
  );

  // Function to clear the cookie
  const clearPresentationCookie = () => {
    if (typeof document === "undefined") return;

    const domain =
      window.location.hostname === "localhost" ? "localhost" : ".allweone.com";

    document.cookie = `${PRESENTATION_GENERATION_COOKIE}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; ${domain !== "localhost" ? `domain=${domain}; ` : ""}`;
  };

  // Clear the cookie when the page loads
  useEffect(() => {
    clearPresentationCookie();
  }, []);

  // This effect handles the immediate startup of generation upon first mount
  // only if we're coming fresh from the dashboard (isGeneratingOutline === true)
  useEffect(() => {
    // Only run once on initial page load
    if (initialLoadComplete.current) return;
    initialLoadComplete.current = true;

    // If isGeneratingOutline is true but generation hasn't been started yet,
    // this indicates we just came from the dashboard and should start generation
    if (isGeneratingOutline && !generationStarted.current) {
      console.log("Starting outline generation after navigation");
      generationStarted.current = true;

      // Give the component time to fully mount and establish connections
      // before starting the generation process
      setTimeout(() => {
        setShouldStartOutlineGeneration(true);
      }, 100);
    }
  }, [isGeneratingOutline, setShouldStartOutlineGeneration]);

  // Update presentation state when data is fetched
  useEffect(() => {
    if (presentationData && !isLoadingPresentation && !isGeneratingOutline) {
      setCurrentPresentation(presentationData.id, presentationData.title);
      setPresentationInput(
        presentationData.presentation?.prompt ?? presentationData.title,
      );

      if (presentationData.presentation?.outline) {
        setOutline(presentationData.presentation.outline as string[]);
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
      if (presentationData?.presentation?.theme) {
        const themeId = presentationData.presentation.theme;

        // Check if this is a predefined theme
        if (themeId in themes) {
          // Use predefined theme
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
                setTheme("mystique");
              }
            })
            .catch((error) => {
              console.error("Failed to load custom theme:", error);
              // Fallback to default theme on error
              setTheme("mystique");
            });
        }
      }

      // Set presentationStyle if available
      if (presentationData?.presentation?.presentationStyle) {
        setPresentationStyle(presentationData.presentation.presentationStyle);
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

      // Auto-start outline generation when visiting this page directly (or after reload)
      // Conditions: we have an input/title, outline is empty, and nothing is currently generating
      const state = usePresentationState.getState();
      const hasInput = (state.presentationInput || "").trim().length > 0;
      const hasOutline = Array.isArray(state.outline) && state.outline.length > 0;
      if (hasInput && !hasOutline && !state.isGeneratingOutline) {
        // Kick off outline generation
        startOutlineGeneration();
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
    setLanguage,
  ]);

  const handleGenerate = () => {
    router.push(`/presentation/${id}`);
    startPresentationGeneration();
  };

  if (isLoadingPresentation) {
    return (
      <ThemeBackground>
        <div className="flex h-[calc(100vh-8rem)] flex-col items-center justify-center">
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
      <Button
        variant="ghost"
        className="absolute left-4 top-4 flex items-center gap-2 text-muted-foreground hover:text-foreground"
        onClick={() => router.back()}
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </Button>

      <div className="flex flex-row justify-center">
        {/* <GoogleAdsBanner isVertical={true} /> */}

        <div className="max-w-4xl space-y-8 p-8 pt-6">
          <div className="space-y-8">
            <Header />
            <PromptInput />
            <ThinkingDisplay
              thinking={outlineThinking}
              isGenerating={isGeneratingOutline}
              title="AI is thinking about your outline..."
            />
            <ToolCallDisplay />
            <OutlineList />

            <div className="!mb-32 space-y-4 rounded-lg border bg-muted/30 p-6">
              <h2 className="text-lg font-semibold">Customize Theme</h2>
              <ThemeSettings />
            </div>
          </div>
        </div>

        {/* <GoogleAdsBanner isVertical={true} /> */}
      </div>

      <div className="absolute bottom-0 left-0 right-0 flex justify-center border-t bg-background/80 p-4 backdrop-blur-sm">
        <Button
          size="lg"
          className="gap-2 px-8"
          onClick={handleGenerate}
          disabled={isGeneratingPresentation}
        >
          <Wand2 className="h-5 w-5" />
          {isGeneratingPresentation ? "Generating..." : "Generate Presentation"}
        </Button>
      </div>
    </ThemeBackground>
  );
}
