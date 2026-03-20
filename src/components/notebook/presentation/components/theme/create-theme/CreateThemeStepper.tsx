"use client";

import { Check, Palette, Shapes, Type } from "lucide-react";

import { cn } from "@/lib/utils";

import { type CreateThemeStep } from "./create-theme-types";

interface CreateThemeStepperProps {
  currentStep: CreateThemeStep;
  onStepClick: (step: CreateThemeStep) => void;
}

const steps: Array<{
  id: CreateThemeStep;
  label: string;
  icon: typeof Palette;
}> = [
  { id: "colors", label: "Colors", icon: Palette },
  { id: "fonts", label: "Fonts", icon: Type },
  { id: "design", label: "Design", icon: Shapes },
  { id: "save", label: "Save", icon: Check },
];

export function CreateThemeStepper({
  currentStep,
  onStepClick,
}: CreateThemeStepperProps) {
  return (
    <div className="flex items-center gap-4">
      {steps.map((item, index) => {
        const IconComponent = item.icon;
        const isActive = currentStep === item.id;

        return (
          <div key={item.id} className="flex items-center gap-4">
            <button
              onClick={() => onStepClick(item.id)}
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-full transition-all duration-200",
                isActive
                  ? "scale-110 bg-blue-600 text-white shadow-lg"
                  : "bg-muted text-muted-foreground hover:bg-muted/70",
              )}
              title={item.label}
              type="button"
            >
              <IconComponent className="h-5 w-5" />
            </button>
            {index < steps.length - 1 && (
              <div className="h-0.5 w-12 bg-muted" />
            )}
          </div>
        );
      })}
    </div>
  );
}
