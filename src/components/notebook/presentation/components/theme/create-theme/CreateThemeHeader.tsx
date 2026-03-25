"use client";

import { ArrowLeft, Palette, X } from "lucide-react";
import { type CreateThemeStep } from "./create-theme-types";

interface CreateThemeHeaderProps {
  currentStep: CreateThemeStep;
  onBack: () => void;
  onClose: () => void;
}

export function CreateThemeHeader({
  currentStep,
  onBack,
  onClose,
}: CreateThemeHeaderProps) {
  const getStepTitle = (): string => {
    const titles: Record<CreateThemeStep, string> = {
      colors: "Colors",
      fonts: "Fonts",
      design: "Design",
      save: "Save & Publish",
    };
    return titles[currentStep];
  };

  return (
    <div className="flex items-center justify-between border-b border-border p-4">
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="rounded-lg p-1 transition-colors hover:bg-muted"
          type="button"
        >
          <ArrowLeft className="h-5 w-5 text-foreground" />
        </button>
        <Palette className="h-5 w-5 text-foreground" />
        <h2 className="text-lg font-semibold text-foreground">
          {getStepTitle()}
        </h2>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={onClose}
          className="rounded-lg p-1 transition-colors hover:bg-muted"
          type="button"
        >
          <X className="h-5 w-5 text-foreground" />
        </button>
      </div>
    </div>
  );
}
