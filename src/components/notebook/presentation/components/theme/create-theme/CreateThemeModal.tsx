"use client";

import { updatePresentation } from "@/app/_actions/notebook/presentation/presentationActions";
import {
  createCustomTheme,
  updateCustomTheme,
} from "@/app/_actions/presentation/theme-actions";
import { useThemePanelState } from "@/components/presentation/edit-panel/sections/theme/theme-panel-state";
import { Credenza, CredenzaContent } from "@/components/ui/credenza";
import { VisuallyHidden } from "@/components/ui/visually-hidden";
import { buildPresentationCustomization } from "@/lib/presentation/customization";
import { type ThemeColorsKeys, themes } from "@/lib/presentation/themes";
import { usePresentationState } from "@/states/presentation-state";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { type ThemeFormValues } from "../types";
import { colorThemes, type PreviewTab } from "./create-theme-types";
import { CreateThemeFooter } from "./CreateThemeFooter";
import { CreateThemeHeader } from "./CreateThemeHeader";
import { PreviewSection } from "./PreviewSection";
import { StepContent } from "./StepContent";
import { usePreviewData } from "./usePreviewData";
import { useStepNavigation } from "./useStepNavigation";
import { useThemeCreationLogic } from "./useThemeCreationLogic";

export const DEFAULT_THEME_VALUES: ThemeFormValues = {
  isPublic: false,
  themeBase: "blank",
  ...themes.mystique,
  background: undefined,
  description: "",
  name: "",
};

export function CreateThemeModal() {
  const {
    setOpenCreateThemeModal,
    openCreateThemeModal,
    editingTheme,
    setEditingTheme,
    isCustomizing,
    setIsCustomizing,
    importedThemeData,
    setImportedThemeData,
  } = useThemePanelState();

  const [previewTab, setPreviewTab] = useState<PreviewTab>("current");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const currentPresentationId = usePresentationState(
    (s) => s.currentPresentationId,
  );

  // Prepare default values based on imported theme, editing theme, or default
  const defaultValues = useMemo(() => {
    // Imported theme data from PPTX file
    if (importedThemeData) {
      return {
        isPublic: false,
        themeBase: "blank" as const,
        ...importedThemeData,
        description: importedThemeData.description || "",
      };
    }

    if (editingTheme) {
      // Get the base name, falling back to themeData name or "Custom Theme"
      const baseName =
        editingTheme.name || editingTheme.themeData?.name || "Custom Theme";

      if (isCustomizing) {
        // When customizing, use the theme data and prefill name with "Copy of {theme name}"
        // Only prepend "Copy of" if it's not already there
        const name = baseName.startsWith("Copy of ")
          ? baseName
          : `Copy of ${baseName}`;

        return {
          isPublic: false,
          themeBase: "blank" as const,
          ...editingTheme.themeData,
          description: "",
          name,
        };
      }
      // Normal editing
      return {
        isPublic: editingTheme.isPublic,
        themeBase: "blank" as const,
        ...editingTheme.themeData,
        description: editingTheme.description || "",
        name: baseName,
      };
    }
    return DEFAULT_THEME_VALUES;
  }, [editingTheme, isCustomizing, importedThemeData]);

  // Form
  const form = useForm<ThemeFormValues>({
    defaultValues,
    values: defaultValues, // Ensure form updates when editingTheme changes
  });
  const { control, handleSubmit, setValue, reset } = form;
  const {
    selectedColorTheme,
    applyThemePreset,
    linkedColorChange,
    setSelectedColorTheme,
    setShowAdvancedColors,
  } = useThemeCreationLogic({
    setValue,
    initialTheme: editingTheme?.themeData,
  });

  const handleClose = () => {
    setOpenCreateThemeModal(false);
    setEditingTheme(null);
    setIsCustomizing(false);
    setImportedThemeData(null);
  };

  const queryClient = useQueryClient();

  // Submit handler for creating new themes (used when navigating to save step and submitting)
  const onSubmit = async (data: ThemeFormValues) => {
    try {
      setIsSubmitting(true);
      const { name, description, isPublic, ...themeStyleData } = data;

      // Validate custom font URLs
      const fonts = themeStyleData.fonts as ThemeFormValues["fonts"];

      if (fonts.headingUrl && !fonts.headingUrl.match(/^https?:\/\/.+/)) {
        toast.error("Heading font URL is invalid", {
          description: "Please check the font URL or remove it.",
        });
        setIsSubmitting(false);
        return;
      }

      if (fonts.bodyUrl && !fonts.bodyUrl.match(/^https?:\/\/.+/)) {
        toast.error("Body font URL is invalid", {
          description: "Please check the font URL or remove it.",
        });
        setIsSubmitting(false);
        return;
      }

      let result;
      // When editing (and NOT customizing), update the existing theme
      if (editingTheme && !isCustomizing) {
        result = await updateCustomTheme(editingTheme.id, {
          name,
          description,
          isPublic,
          themeData: themeStyleData,
        });
      } else {
        if (isCustomizing) {
          if (!currentPresentationId) {
            toast.error("No presentation selected");
            setIsSubmitting(false);
            return;
          }

          // Get original theme name (from built-in themes)
          const currentThemeId = usePresentationState.getState().theme;
          const builtInTheme = themes[currentThemeId as keyof typeof themes];
          const originalThemeName =
            builtInTheme?.name ||
            editingTheme?.themeData?.name ||
            String(currentThemeId) ||
            "Custom Theme";

          // Use the user's input if provided, otherwise use "Copy of {original}"
          const themeName = name || `Copy of ${originalThemeName}`;

          // Creating new theme from customization
          const createResult = await createCustomTheme({
            name: themeName,
            description: description || "",
            isPublic: false,
            themeData: themeStyleData,
          });

          if (createResult.success && createResult.themeId) {
            // Apply the new theme to the presentation
            usePresentationState
              .getState()
              .setTheme(createResult.themeId, null);

            // Update the presentation to use the new theme
            result = await updatePresentation({
              id: currentPresentationId,
              theme: createResult.themeId,
            });
          } else {
            result = createResult;
          }
        } else {
          // Creating new theme (from scratch)
          result = await createCustomTheme({
            name,
            description,
            isPublic: isPublic,
            themeData: themeStyleData,
          });
        }
      }

      if (result.success) {
        toast.success(
          editingTheme && !isCustomizing
            ? "Theme updated successfully!"
            : isCustomizing
              ? "Customization saved successfully!"
              : "Theme created successfully!",
        );

        // Invalidate queries to refresh the list
        queryClient.invalidateQueries({
          queryKey: ["presentation", "themes", "user"],
        });
        queryClient.invalidateQueries({
          queryKey: ["presentation", "themes", "public"],
        });
        queryClient.invalidateQueries({
          queryKey: ["presentation", "themes", "favorites"],
        });

        handleClose();
      } else {
        toast.error(result.message || "Failed to save theme");
      }
    } catch {
      toast.error("An unexpected error occurred while saving the theme");
    } finally {
      setIsSubmitting(false);
    }
  };

  const { currentStep, handleContinue, handleBack, setCurrentStep } =
    useStepNavigation({
      onClose: handleClose,
      handleSubmit,
      onSubmit,
    });

  // Handler for "Save" - save customization directly to the current presentation
  const handleSaveCustomization = useCallback(async () => {
    if (!currentPresentationId) {
      toast.error("No presentation selected to customize");
      return;
    }

    try {
      setIsSubmitting(true);
      const data = form.getValues();
      const { description, ...themeStyleData } = data;

      // Validate custom font URLs
      const fonts = themeStyleData.fonts as ThemeFormValues["fonts"];

      if (fonts.headingUrl && !fonts.headingUrl.match(/^https?:\/\/.+/)) {
        toast.error("Heading font URL is invalid", {
          description: "Please check the font URL or remove it.",
        });
        setIsSubmitting(false);
        return;
      }

      if (fonts.bodyUrl && !fonts.bodyUrl.match(/^https?:\/\/.+/)) {
        toast.error("Body font URL is invalid", {
          description: "Please check the font URL or remove it.",
        });
        setIsSubmitting(false);
        return;
      }

      // Get original theme name (from built-in themes, not the "Copy of..." form value)
      const currentThemeId = usePresentationState.getState().theme;
      const builtInTheme = themes[currentThemeId as keyof typeof themes];
      const originalThemeName =
        builtInTheme?.name || editingTheme?.themeData?.name || "Custom Theme";

      const customThemeData = {
        ...themeStyleData,
        name: originalThemeName,
        description: description ?? "",
      };

      // Update the presentation state with new theme data
      usePresentationState
        .getState()
        .setTheme(
          usePresentationState.getState().theme as string,
          customThemeData,
        );

      // Build customization object
      const state = usePresentationState.getState();
      const customization = buildPresentationCustomization({
        customThemeData,
        pageStyle: state.pageStyle,
        presentationStyle: state.presentationStyle,
        textContent: state.textContent,
        tone: state.tone,
        audience: state.audience,
        scenario: state.scenario,
        pageBackground: state.pageBackground,
      });

      // Save to the presentation
      const result = await updatePresentation({
        id: currentPresentationId,
        theme: state.theme as string,
        customization,
      });

      if (result.success) {
        toast.success("Customization saved successfully!");
        handleClose();
      } else {
        toast.error(result.message || "Failed to save customization");
      }
    } catch {
      toast.error("An unexpected error occurred while saving");
    } finally {
      setIsSubmitting(false);
    }
  }, [currentPresentationId, form, handleClose]);

  // Handler for "Save & Create New" - create a new theme copy and apply it
  const handleSaveAndCreateNew = useCallback(async () => {
    if (!currentPresentationId) {
      toast.error("No presentation selected");
      return;
    }

    try {
      setIsSubmitting(true);
      const data = form.getValues();
      const { description, ...themeStyleData } = data;

      // Validate custom font URLs
      const fonts = themeStyleData.fonts as ThemeFormValues["fonts"];

      if (fonts.headingUrl && !fonts.headingUrl.match(/^https?:\/\/.+/)) {
        toast.error("Heading font URL is invalid", {
          description: "Please check the font URL or remove it.",
        });
        setIsSubmitting(false);
        return;
      }

      if (fonts.bodyUrl && !fonts.bodyUrl.match(/^https?:\/\/.+/)) {
        toast.error("Body font URL is invalid", {
          description: "Please check the font URL or remove it.",
        });
        setIsSubmitting(false);
        return;
      }

      // Get original theme name (from built-in themes)
      const currentThemeId = usePresentationState.getState().theme;
      const builtInTheme = themes[currentThemeId as keyof typeof themes];
      const originalThemeName =
        builtInTheme?.name ||
        editingTheme?.themeData?.name ||
        String(currentThemeId) ||
        "Custom Theme";

      // Use the user's input if provided, otherwise use "Copy of {original}"
      const themeName = data.name || `Copy of ${originalThemeName}`;

      // Create the new theme
      const createResult = await createCustomTheme({
        name: themeName,
        description: description || "",
        isPublic: false, // Always private for customization copies
        themeData: themeStyleData,
      });

      if (createResult.success && createResult.themeId) {
        // Apply the new theme to the presentation
        usePresentationState.getState().setTheme(createResult.themeId, null);

        // Update the presentation to use the new theme
        const result = await updatePresentation({
          id: currentPresentationId,
          theme: createResult.themeId,
        });

        if (result.success) {
          toast.success("New theme created and applied!");

          // Invalidate queries to refresh the theme list
          queryClient.invalidateQueries({
            queryKey: ["presentation", "themes", "user"],
          });
          queryClient.invalidateQueries({
            queryKey: ["presentation", "themes", "public"],
          });
          queryClient.invalidateQueries({
            queryKey: ["presentation", "themes", "favorites"],
          });

          handleClose();
        } else {
          toast.error(result.message || "Failed to apply new theme");
        }
      } else {
        toast.error(createResult.message || "Failed to create new theme");
      }
    } catch {
      toast.error("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  }, [
    currentPresentationId,
    editingTheme?.name,
    form,
    handleClose,
    queryClient,
  ]);

  // Reset form when modal opens/closes or editingTheme/isCustomizing/importedThemeData changes
  useEffect(() => {
    if (openCreateThemeModal) {
      reset(defaultValues);
      setPreviewTab("current");
      setCurrentStep("colors");
      setSelectedColorTheme(
        editingTheme || importedThemeData
          ? "custom-theme"
          : (colorThemes[0]?.id ?? "custom-theme"),
      );
      setShowAdvancedColors(false);
    }
  }, [
    openCreateThemeModal,
    editingTheme,
    isCustomizing,
    importedThemeData,
    reset,
    defaultValues,
    setCurrentStep,
    setSelectedColorTheme,
    setShowAdvancedColors,
  ]);

  const currentSlides = usePresentationState((s) => s.slides);
  const { previewThemeData, slidesToDisplay } = usePreviewData({
    control,
    previewTab,
    currentSlides,
  });

  // Handlers for StepContent
  const handleColorChange = (key: ThemeColorsKeys, value: string) => {
    linkedColorChange(key, value);
  };

  const handleThemeSelect = (themeId: string) => {
    applyThemePreset(themeId);
  };

  return (
    <Credenza
      open={openCreateThemeModal}
      onOpenChange={setOpenCreateThemeModal}
    >
      <CredenzaContent
        shouldHaveClose={false}
        className="h-dvh max-h-none w-dvw max-w-none border-none p-0"
      >
        <VisuallyHidden>
          <h2>Create Theme</h2>
        </VisuallyHidden>
        <div className="flex h-full flex-col lg:flex-row">
          {/* Left Panel - Editor */}
          <div className="flex w-full flex-col border-b border-border lg:w-1/2 lg:border-r lg:border-b-0">
            <CreateThemeHeader
              currentStep={currentStep}
              onBack={handleBack}
              onClose={handleClose}
            />
            <div className="h-[calc(100vh-2*70px)] overflow-y-auto">
              <StepContent
                step={currentStep}
                control={control}
                selectedColorTheme={selectedColorTheme}
                onColorChange={handleColorChange}
                onSelectColorTheme={handleThemeSelect}
                setValue={setValue}
                isCustomizing={isCustomizing}
              />
            </div>
            <CreateThemeFooter
              currentStep={currentStep}
              isSubmitting={isSubmitting}
              onStepClick={setCurrentStep}
              onContinue={handleContinue}
              onSave={handleSaveCustomization}
              onSaveAndCreateNew={handleSaveAndCreateNew}
              isEditing={!!editingTheme}
              isCustomizing={isCustomizing}
            />
          </div>

          {/* Right Panel - Preview */}
          <PreviewSection
            containerRef={containerRef}
            previewTab={previewTab}
            previewThemeData={previewThemeData}
            slidesToDisplay={slidesToDisplay}
            onTabChange={setPreviewTab}
          />
        </div>
      </CredenzaContent>
    </Credenza>
  );
}
