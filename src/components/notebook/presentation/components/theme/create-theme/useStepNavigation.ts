"use client";

import { type CreateThemeStep } from "@/components/notebook/presentation/components/theme/create-theme/create-theme-types";
import { type ThemeFormValues } from "@/components/notebook/presentation/components/theme/types";
import { useCallback, useState } from "react";
import { type UseFormHandleSubmit } from "react-hook-form";

export const STEP_ORDER: CreateThemeStep[] = [
  "colors",
  "fonts",
  "design",
  "save",
];

interface UseStepNavigationProps {
  onClose: () => void;
  handleSubmit: UseFormHandleSubmit<ThemeFormValues>;
  onSubmit: (data: ThemeFormValues) => Promise<void>;
}

export function useStepNavigation({
  onClose,
  handleSubmit,
  onSubmit,
}: UseStepNavigationProps) {
  const [currentStep, setCurrentStep] = useState<CreateThemeStep>("colors");

  const handleContinue = useCallback(() => {
    const index = STEP_ORDER.indexOf(currentStep);
    const nextStep = STEP_ORDER[index + 1];
    if (nextStep) {
      setCurrentStep(nextStep);
    } else {
      // Use handleSubmit for form validation
      void handleSubmit(onSubmit)();
    }
  }, [currentStep, handleSubmit, onSubmit]);

  const handleBack = useCallback(() => {
    const index = STEP_ORDER.indexOf(currentStep);
    const previousStep = STEP_ORDER[index - 1];
    if (!previousStep) {
      onClose();
    } else {
      setCurrentStep(previousStep);
    }
  }, [currentStep, onClose]);

  return {
    currentStep,
    setCurrentStep,
    handleContinue,
    handleBack,
  };
}
