"use client";

import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Copy, Save } from "lucide-react";
import { CreateThemeStepper } from "./CreateThemeStepper";
import { type CreateThemeStep } from "./create-theme-types";

interface CreateThemeFooterProps {
  currentStep: CreateThemeStep;
  isSubmitting: boolean;
  onStepClick: (step: CreateThemeStep) => void;
  onContinue: () => void;
  onSave?: () => void;
  onSaveAndCreateNew?: () => void;
  isEditing?: boolean;
  isCustomizing?: boolean;
}

export function CreateThemeFooter({
  currentStep,
  isSubmitting,
  onStepClick,
  onContinue,
  onSave,
  onSaveAndCreateNew,
  isEditing = false,
  isCustomizing = false,
}: CreateThemeFooterProps) {
  // Determine if we should show the save split button
  // Show it when customizing and NOT on the save step (save step is for creating new theme)
  const showSaveSplitButton = isCustomizing && currentStep !== "save";

  // Get the text for the continue/next button
  const getContinueButtonText = () => {
    if (currentStep === "save") {
      if (isCustomizing) {
        return "Save & Create New";
      }
      return isEditing ? "Save Edits" : "Publish Theme";
    }
    return isCustomizing ? "Next" : "Continue";
  };

  return (
    <div className="flex items-center justify-between border-t border-border p-4">
      <CreateThemeStepper currentStep={currentStep} onStepClick={onStepClick} />

      <div className="flex items-center gap-2">
        {/* Save split button when customizing (not on save step) */}
        {showSaveSplitButton && (
          <ButtonGroup>
            <Button
              type="button"
              onClick={onSave}
              disabled={isSubmitting}
              className="flex items-center gap-2 bg-blue-600 text-white hover:bg-blue-700"
            >
              <Save className="h-4 w-4" />
              Save
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  type="button"
                  disabled={isSubmitting}
                  className="bg-blue-600 px-2 text-white hover:bg-blue-700"
                  aria-label="More save options"
                >
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" sideOffset={4}>
                <DropdownMenuItem onClick={onSave} disabled={isSubmitting}>
                  <Save className="mr-2 h-4 w-4" />
                  Save
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={onSaveAndCreateNew}
                  disabled={isSubmitting}
                >
                  <Copy className="mr-2 h-4 w-4" />
                  Save & Create New
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </ButtonGroup>
        )}

        {/* Next/Continue button */}
        <Button
          type="button"
          onClick={onContinue}
          disabled={currentStep === "save" && isSubmitting}
          className="flex items-center gap-2 bg-blue-600 text-white hover:bg-blue-700"
        >
          {getContinueButtonText()}
          <ChevronDown className="h-4 w-4 -rotate-90" />
        </Button>
      </div>
    </div>
  );
}
