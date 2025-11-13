"use client";

import {
  getPresentation,
  updatePresentation,
  updatePresentationTheme,
} from "@/app/_actions/presentation/presentationActions";
import { getCustomThemeById } from "@/app/_actions/presentation/theme-actions";
import { type PlateSlide } from "@/components/presentation/utils/parser";
import {
  setThemeVariables,
  type ThemeProperties,
  type Themes,
  themes,
} from "@/lib/presentation/themes";
import { usePresentationState } from "@/states/presentation-state";
import { useQuery } from "@tanstack/react-query";
import debounce from "lodash.debounce";
import { useTheme } from "next-themes";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { LoadingState } from "./Loading";
import { PresentationLayout } from "./PresentationLayout";
import { PresentationSlidesView } from "./PresentationSlidesView";

export default function PresentationPage() {
  const params = useParams();
  const id = params.id as string;
  const { resolvedTheme } = useTheme();
  const [shouldFetchData, setSetShouldFetchData] = useState(true);
  const setCurrentPresentation = usePresentationState(
    (s) => s.setCurrentPresentation,
  );
  const setPresentationInput = usePresentationState(
    (s) => s.setPresentationInput,
  );
  const setOutline = usePresentationState((s) => s.setOutline);
  const setSlides = usePresentationState((s) => s.setSlides);
  const setThumbnailUrl = usePresentationState((s) => s.setThumbnailUrl);
  const isGeneratingPresentation = usePresentationState(
    (s) => s.isGeneratingPresentation,
  );
  const setTheme = usePresentationState((s) => s.setTheme);
  const setImageModel = usePresentationState((s) => s.setImageModel);
  const setImageSource = usePresentationState((s) => s.setImageSource);
  const setPresentationStyle = usePresentationState(
    (s) => s.setPresentationStyle,
  );
  const currentSlideIndex = usePresentationState((s) => s.currentSlideIndex);
  const setLanguage = usePresentationState((s) => s.setLanguage);
  const theme = usePresentationState((s) => s.theme);
  // Track the theme value as it exists in the database to avoid redundant saves on hydration
  const dbThemeRef = useRef<string | null>(null);

  useEffect(() => {
    if (isGeneratingPresentation) {
      setSetShouldFetchData(false);
    }
  }, [isGeneratingPresentation]);

  useEffect(() => {
    console.log("Current Slide Index", currentSlideIndex);
  }, [currentSlideIndex]);

  // Use React Query to fetch presentation data
  const { data: presentationData, isLoading } = useQuery({
    queryKey: ["presentation", id],
    queryFn: async () => {
      const result = await getPresentation(id);
      if (!result.success) {
        throw new Error(result.message ?? "Failed to load presentation");
      }
      return result.presentation;
    },
    enabled: !!id && !isGeneratingPresentation && shouldFetchData,
  });

  // Create a debounced function to update the theme in the database
  const debouncedThemeUpdate = useCallback(
    debounce((presentationId: string, newTheme: string) => {
      updatePresentationTheme(presentationId, newTheme)
        .then((result) => {
          if (result.success) {
            console.log("Theme updated in database");
          } else {
            console.error("Failed to update theme:", result.message);
          }
        })
        .catch((error) => {
          console.error("Error updating theme:", error);
        });
    }, 600),
    [],
  );

  // Update presentation state when data is fetched
  useEffect(() => {
    // Skip if we're coming from the generation page
    if (isGeneratingPresentation || !shouldFetchData) {
      return;
    }

    if (presentationData) {
      // Record the theme as it exists in the DB so initial hydration doesn't trigger a save
      dbThemeRef.current = presentationData.presentation?.theme ?? null;
      setCurrentPresentation(presentationData.id, presentationData.title);
      setPresentationInput(
        presentationData.presentation?.prompt ?? presentationData.title,
      );

      // Load all content from the database
      const presentationContent = presentationData.presentation
        ?.content as unknown as {
        slides: PlateSlide[];
        config: Record<string, unknown>;
      };

      // Set slides
      setSlides(presentationContent?.slides ?? []);

      // If there's no thumbnail yet, derive from first available rootImage or first img element
      const currentThumb = presentationData.thumbnailUrl;
      if (!currentThumb) {
        const slides = presentationContent?.slides ?? [];
        const deriveFromSlides = (): string | null => {
          if (!Array.isArray(slides) || slides.length === 0) return null;
          const firstRoot = slides[0]?.rootImage?.url;
          if (typeof firstRoot === "string" && firstRoot) return firstRoot;
          for (const s of slides) {
            const u = s?.rootImage?.url;
            if (typeof u === "string" && u) return u;
          }
          const findFirstImgUrl = (nodes: unknown[]): string | null => {
            for (const n of nodes) {
              if (!n || typeof n !== "object") continue;
              const anyNode = n as Record<string, unknown>;
              if (anyNode.type === "img" && typeof anyNode.url === "string") {
                return anyNode.url as string;
              }
              const children = anyNode.children as unknown[] | undefined;
              if (Array.isArray(children)) {
                const found = findFirstImgUrl(children);
                if (found) return found;
              }
            }
            return null;
          };
          for (const s of slides) {
            const nodes = (s as unknown as { content?: unknown[] }).content;
            if (Array.isArray(nodes)) {
              const found = findFirstImgUrl(nodes);
              if (found) return found;
            }
          }
          return null;
        };
        const derived = deriveFromSlides();
        if (derived) {
          setThumbnailUrl(derived);
          void updatePresentation({
            id: presentationData.id,
            thumbnailUrl: derived,
          });
        }
      }

      // Background override (optional persisted field)
      if (presentationContent?.config?.backgroundOverride !== undefined) {
        const { setConfig } = usePresentationState.getState();
        setConfig(presentationContent.config as Record<string, unknown>);
      }

      // Set outline
      if (presentationData.presentation?.outline) {
        setOutline(presentationData.presentation.outline as string[]);
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
                const themeData = result.theme.themeData;
                setTheme(themeId, themeData as unknown as ThemeProperties);
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

      if (presentationData?.presentation?.imageSource) {
        setImageSource(
          presentationData.presentation.imageSource as "ai" | "stock",
        );
      }

      // Set presentationStyle if available
      if (presentationData?.presentation?.presentationStyle) {
        setPresentationStyle(presentationData.presentation.presentationStyle);
      }

      // Set language if available
      if (presentationData.presentation?.language) {
        setLanguage(presentationData.presentation.language);
      }
    }
  }, [
    presentationData,
    isGeneratingPresentation,
    shouldFetchData,
    setCurrentPresentation,
    setPresentationInput,
    setOutline,
    setSlides,
    setTheme,
    setImageModel,
    setPresentationStyle,
    setLanguage,
  ]);

  // Update theme when it changes (but not on initial hydration)
  useEffect(() => {
    if (!id || isLoading || !theme) return;
    // If we don't yet know the DB theme, skip until hydration sets it
    if (dbThemeRef.current === null) return;
    // Skip if the current theme matches the DB state (hydration)
    if (theme === dbThemeRef.current) return;

    // Persist the new theme and update our DB baseline to prevent repeat writes
    dbThemeRef.current = theme as string;
    debouncedThemeUpdate(id, theme as string);
  }, [theme, id, debouncedThemeUpdate, isLoading]);

  // Set theme variables when theme changes
  useEffect(() => {
    if (theme && resolvedTheme) {
      const state = usePresentationState.getState();
      // Check if we have custom theme data
      if (state.customThemeData) {
        setThemeVariables(state.customThemeData, resolvedTheme === "dark");
      }
      // Otherwise try to use a predefined theme
      else if (typeof theme === "string" && theme in themes) {
        const currentTheme = themes[theme as keyof typeof themes];
        if (currentTheme) {
          setThemeVariables(currentTheme, resolvedTheme === "dark");
        }
      }
    }
  }, [theme, resolvedTheme]);

  // Get the current theme data
  const currentThemeData = (() => {
    const state = usePresentationState.getState();
    if (state.customThemeData) {
      return state.customThemeData;
    }
    if (typeof theme === "string" && theme in themes) {
      return themes[theme as keyof typeof themes];
    }
    return null;
  })();

  if (isLoading) {
    return <LoadingState />;
  }

  return (
    <PresentationLayout
      isLoading={isLoading}
      themeData={currentThemeData ?? undefined}
    >
      <div className="mx-auto max-w-[90%] space-y-8 pt-16">
        <div className="space-y-8">
          <PresentationSlidesView
            isGeneratingPresentation={isGeneratingPresentation}
          />
        </div>
      </div>
    </PresentationLayout>
  );
}
