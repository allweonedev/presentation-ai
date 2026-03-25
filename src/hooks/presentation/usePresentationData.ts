import {
  getPresentation,
  updatePresentation,
} from "@/app/_actions/notebook/presentation/presentationActions";
import { updatePresentationThumbnailUrl } from "@/app/_actions/presentation/presentation-thumbnail-actions";
import { type PlateSlide } from "@/components/notebook/presentation/utils/parser";
import { usePresentationTheme } from "@/components/presentation/providers/PresentationThemeProvider";
import {
  applyPageBackgroundToConfig,
  buildPresentationCustomization,
  getPresentationCustomization,
} from "@/lib/presentation/customization";
import { loadCustomFonts } from "@/lib/presentation/loadCustomFont";
import { getPresentationThumbnailUrl } from "@/lib/presentation/thumbnail";
import {
  setThemeVariables,
  type ThemeProperties,
  type Themes,
  themes,
} from "@/lib/presentation/themes";
import { usePresentationHistoryState } from "@/states/presentation-history-state";
import { usePresentationState } from "@/states/presentation-state";
import { useQuery } from "@tanstack/react-query";
import debounce from "lodash.debounce";
import { nanoid } from "nanoid";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useLayoutEffect, useRef } from "react";
import { toast } from "sonner";

export function usePresentationData(id: string, forcedReadOnly = false) {
  const { resolvedTheme } = usePresentationTheme();
  const setCurrentPresentation = usePresentationState(
    (s) => s.setCurrentPresentation,
  );
  const setPresentationInput = usePresentationState(
    (s) => s.setPresentationInput,
  );
  const currentPresentationId = usePresentationState(
    (s) => s.currentPresentationId,
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
  const setPageStyle = usePresentationState((s) => s.setPageStyle);
  const setLanguage = usePresentationState((s) => s.setLanguage);
  const setTextContent = usePresentationState((s) => s.setTextContent);
  const setTone = usePresentationState((s) => s.setTone);
  const setAudience = usePresentationState((s) => s.setAudience);
  const setScenario = usePresentationState((s) => s.setScenario);
  const slides = usePresentationState((s) => s.slides);
  const theme = usePresentationState((s) => s.theme);
  const setCurrentSlideId = usePresentationState((s) => s.setCurrentSlideId);
  const setIsReadOnly = usePresentationState((s) => s.setIsReadOnly);
  const clearHistory = usePresentationHistoryState((s) => s.clearHistory);
  // Track the theme value as it exists in the database to avoid redundant saves on hydration
  const dbThemeRef = useRef<string | null>(null);
  const canPersistThumbnailRef = useRef(false);

  // Create a debounced function to update the theme in the database
  const debouncedThemeUpdate = useCallback(
    debounce((presentationId: string, newTheme: string) => {
      const state = usePresentationState.getState();
      updatePresentation({
        id: presentationId,
        theme: newTheme,
        customization: buildPresentationCustomization({
          customThemeData: state.customThemeData,
          pageStyle: state.pageStyle,
          presentationStyle: state.presentationStyle,
          textContent: state.textContent,
          tone: state.tone,
          audience: state.audience,
          scenario: state.scenario,
          pageBackground: state.pageBackground,
        }),
      })
        .then((result) => {
          if (result.success) {
            // Theme updated in database
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
  const router = useRouter();

  // Use React Query to fetch presentation data
  const { data: presentationData, isLoading } = useQuery({
    queryKey: ["presentation", id],
    queryFn: async () => {
      const result = await getPresentation(id);
      if (!result.success) {
        toast.error(result.message ?? "Failed to load presentation");
        router.push("/404");
        return null;
      }
      const canEdit = Boolean(result.canEdit);
      canPersistThumbnailRef.current = !forcedReadOnly && canEdit;
      setIsReadOnly(forcedReadOnly || !canEdit);
      return result.presentation;
    },
    // Only fetch if not generating and we don't already have slides
    enabled:
      currentPresentationId !== id ||
      (!isGeneratingPresentation && slides.length === 0),
  });

  // Update presentation state when data is fetched
  useLayoutEffect(() => {
    if (isGeneratingPresentation) {
      return;
    }
    // Don't set data if we already have slides
    if (slides.length > 0 && currentPresentationId === id) {
      return;
    }

    if (presentationData) {
      const customization = getPresentationCustomization(
        presentationData.presentation?.customization,
      );
      const customizationThemeId = presentationData.presentation?.theme ?? null;
      // Record the theme as it exists in the DB so initial hydration doesn't trigger a save
      dbThemeRef.current = customizationThemeId;
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

      // Fix duplicate slide IDs (migration for existing presentations with the bug)
      const rawSlides = presentationContent?.slides ?? [];
      const seenIds = new Set<string>();
      let hasDuplicates = false;
      const fixedSlides = rawSlides.map((slide) => {
        if (seenIds.has(slide.id)) {
          // Duplicate ID found, generate a new unique ID
          hasDuplicates = true;
          return { ...slide, id: nanoid() };
        }
        seenIds.add(slide.id);
        return slide;
      });

      // Set slides with fixed IDs
      setSlides(fixedSlides);

      // Persist the fixed slides to database if we had duplicates
      if (hasDuplicates) {
        void updatePresentation({
          id: presentationData.id,
          content: {
            slides: fixedSlides,
            config: presentationContent?.config ?? {},
          },
        });
      }

      setCurrentSlideId(fixedSlides[0]?.id ?? null);
      const currentThumb = presentationData.thumbnailUrl;
      const derivedThumbnailUrl = getPresentationThumbnailUrl(fixedSlides);
      setThumbnailUrl(currentThumb ?? derivedThumbnailUrl ?? undefined);
      if (
        !currentThumb &&
        derivedThumbnailUrl &&
        canPersistThumbnailRef.current
      ) {
        void (async () => {
          await updatePresentationThumbnailUrl({
            id: presentationData.id,
            slides: fixedSlides,
            onlyIfMissing: true,
          });
        })();
      }

      const { setPageBackground } = usePresentationState.getState();
      // Priority: customization.pageBackground > content.config (backward compatibility)
      if (customization?.pageBackground) {
        const merged = applyPageBackgroundToConfig(
          customization.pageBackground,
          (presentationContent?.config as Record<string, unknown>) ?? {},
        );
        setPageBackground(merged);
      } else if (
        presentationContent?.config?.backgroundOverride !== undefined
      ) {
        // Backward compatibility: read from old content.config location
        setPageBackground(
          presentationContent.config as Record<string, unknown>,
        );
      }

      // Set outline
      if (presentationData.presentation?.outline) {
        setOutline(presentationData.presentation.outline);
      }

      // Set theme if available, or use default based on user's system theme
      if (customizationThemeId) {
        const themeId = customizationThemeId;
        const customThemeData =
          customization?.themeData as ThemeProperties | undefined;

        if (customThemeData) {
          setTheme(themeId, customThemeData);
        } else if (themeId in themes) {
          setTheme(themeId as Themes);
        } else {
          const fallback = resolvedTheme === "dark" ? "ebony" : "mystique";
          setTheme(fallback);
        }
      } else {
        // No theme set in database, use default based on user's system theme
        const defaultTheme = resolvedTheme === "dark" ? "ebony" : "mystique";
        setTheme(defaultTheme);
      }

      if (presentationData?.presentation?.imageSource) {
        setImageSource(
          presentationData.presentation.imageSource as "ai" | "stock",
        );
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

      // Set language if available
      if (presentationData.presentation?.language) {
        setLanguage(presentationData.presentation.language);
      }

      clearHistory();
    }
  }, [
    presentationData,
    isGeneratingPresentation,
    slides.length, // Add slides.length to dependencies to check if we already have slides
    setCurrentPresentation,
    setPresentationInput,
    setOutline,
    setSlides,
    setTheme,
    setImageModel,
    setPresentationStyle,
    setPageStyle,
    setLanguage,
    currentPresentationId,
    id,
    setImageSource,
    setThumbnailUrl,
    setTextContent,
    setTone,
    setAudience,
    setScenario,
    setIsReadOnly,
    clearHistory,
    forcedReadOnly,
    resolvedTheme,
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
        setThemeVariables(state.customThemeData);
      }
      // Otherwise try to use a predefined theme
      else if (typeof theme === "string" && theme in themes) {
        const currentTheme = themes[theme as keyof typeof themes];
        if (currentTheme) {
          setThemeVariables(currentTheme);
        }
      }
    }
  }, [theme, resolvedTheme]);

  // Load custom fonts when theme changes
  useEffect(() => {
    const state = usePresentationState.getState();
    const themeData = state.customThemeData;

    console.log(themeData);
    if (themeData?.fonts) {
      const { heading, body, headingUrl, bodyUrl, headingWeight, bodyWeight } =
        themeData.fonts;

      // Only load if we have custom font URLs
      if (headingUrl || bodyUrl) {
        loadCustomFonts({
          headingFont: heading,
          headingUrl,
          headingWeight,
          bodyFont: body,
          bodyUrl,
          bodyWeight,
        }).catch((error) => {
          console.error("Failed to load custom fonts:", error);
        });
      }
    }
  }, [theme]);

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

  return {
    presentationData,
    isLoading,
    currentThemeData,
  };
}
