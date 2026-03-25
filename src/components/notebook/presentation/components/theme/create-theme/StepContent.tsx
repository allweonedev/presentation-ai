"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import {
  type Control,
  Controller,
  type UseFormSetValue,
} from "react-hook-form";
import { type ColorKey, type ThemeFormValues } from "../types";
import { ColorsStep } from "./ColorsStep";
import { type CreateThemeStep } from "./create-theme-types";
import { DesignStep } from "./DesignStep";
import { FontStep } from "./font-step";

interface StepContentProps {
  step: CreateThemeStep;
  control: Control<ThemeFormValues>;
  selectedColorTheme: string;
  onColorChange: (key: ColorKey, value: string) => void;
  onSelectColorTheme: (themeId: string) => void;
  setValue: UseFormSetValue<ThemeFormValues>;
  isCustomizing?: boolean;
}

export function StepContent({
  step,
  control,
  selectedColorTheme,
  onColorChange,
  onSelectColorTheme,
  setValue,
  isCustomizing,
}: StepContentProps) {
  if (step === "colors") {
    return (
      <ColorsStep
        control={control}
        onColorChange={onColorChange}
        onSelectColorTheme={onSelectColorTheme}
        selectedColorTheme={selectedColorTheme}
      />
    );
  }

  if (step === "fonts") {
    return <FontStep control={control} setValue={setValue} />;
  }

  if (step === "design") {
    return <DesignStep setValue={setValue} control={control} />;
  }

  if (step === "save") {
    return (
      <div className="space-y-6 p-8">
        <div className="rounded-lg border-2 border-border bg-card p-8 shadow-lg">
          <h2 className="mb-2 text-2xl font-bold text-foreground">
            Name Your Theme
          </h2>
          <p className="mb-6 text-sm text-muted-foreground">
            Give your theme a memorable name and choose its visibility
          </p>

          <div className="mb-6">
            <Label
              htmlFor="theme-name"
              className="mb-2 block text-sm font-semibold text-foreground"
            >
              Theme Name
            </Label>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <Input
                  id="theme-name"
                  {...field}
                  placeholder="Enter a name for your theme"
                  className="w-full rounded-lg border-2 border-border bg-background px-4 py-3 text-foreground transition-all outline-hidden focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
                />
              )}
            />
          </div>

          {!isCustomizing && (
            <>
              <div className="mb-6">
                <Label className="mb-3 block text-sm font-semibold text-foreground">
                  Theme Mode
                </Label>
                <Controller
                  name="mode"
                  control={control}
                  render={({ field }) => (
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        type="button"
                        onClick={() => field.onChange("light")}
                        className={cn(
                          "rounded-lg border-2 p-6 text-left transition-all duration-200",
                          field.value === "light"
                            ? "border-blue-600 bg-blue-50 dark:bg-blue-950/30"
                            : "border-border hover:border-muted-foreground",
                        )}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={cn(
                              "mt-0.5 flex h-5 w-5 items-center justify-center rounded-full border-2 transition-all",
                              field.value === "light"
                                ? "border-blue-600 bg-blue-600"
                                : "border-border",
                            )}
                          >
                            {field.value === "light" && (
                              <div className="h-2.5 w-2.5 rounded-full bg-white" />
                            )}
                          </div>
                          <div className="flex-1">
                            <h3 className="mb-1 font-semibold text-foreground">
                              Light Mode
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              Optimized for light backgrounds
                            </p>
                          </div>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => field.onChange("dark")}
                        className={cn(
                          "rounded-lg border-2 p-6 text-left transition-all duration-200",
                          field.value === "dark"
                            ? "border-blue-600 bg-blue-50 dark:bg-blue-950/30"
                            : "border-border hover:border-muted-foreground",
                        )}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={cn(
                              "mt-0.5 flex h-5 w-5 items-center justify-center rounded-full border-2 transition-all",
                              field.value === "dark"
                                ? "border-blue-600 bg-blue-600"
                                : "border-border",
                            )}
                          >
                            {field.value === "dark" && (
                              <div className="h-2.5 w-2.5 rounded-full bg-white" />
                            )}
                          </div>
                          <div className="flex-1">
                            <h3 className="mb-1 font-semibold text-foreground">
                              Dark Mode
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              Optimized for dark backgrounds
                            </p>
                          </div>
                        </div>
                      </button>
                    </div>
                  )}
                />
              </div>

              <div className="mb-6">
                <Label className="mb-3 block text-sm font-semibold text-foreground">
                  Theme Visibility
                </Label>
                <Controller
                  name="isPublic"
                  control={control}
                  render={({ field }) => (
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        type="button"
                        onClick={() => field.onChange(false)}
                        className={cn(
                          "rounded-lg border-2 p-6 text-left transition-all duration-200",
                          !field.value
                            ? "border-blue-600 bg-blue-50 dark:bg-blue-950/30"
                            : "border-border hover:border-muted-foreground",
                        )}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={cn(
                              "mt-0.5 flex h-5 w-5 items-center justify-center rounded-full border-2 transition-all",
                              !field.value
                                ? "border-blue-600 bg-blue-600"
                                : "border-border",
                            )}
                          >
                            {!field.value && (
                              <div className="h-2.5 w-2.5 rounded-full bg-white" />
                            )}
                          </div>
                          <div className="flex-1">
                            <h3 className="mb-1 font-semibold text-foreground">
                              Private
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              Only you can see and use this theme
                            </p>
                          </div>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => field.onChange(true)}
                        className={cn(
                          "rounded-lg border-2 p-6 text-left transition-all duration-200",
                          field.value
                            ? "border-blue-600 bg-blue-50 dark:bg-blue-950/30"
                            : "border-border hover:border-muted-foreground",
                        )}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={cn(
                              "mt-0.5 flex h-5 w-5 items-center justify-center rounded-full border-2 transition-all",
                              field.value
                                ? "border-blue-600 bg-blue-600"
                                : "border-border",
                            )}
                          >
                            {field.value && (
                              <div className="h-2.5 w-2.5 rounded-full bg-white" />
                            )}
                          </div>
                          <div className="flex-1">
                            <h3 className="mb-1 font-semibold text-foreground">
                              Public
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              Share with the community
                            </p>
                          </div>
                        </div>
                      </button>
                    </div>
                  )}
                />
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  return null;
}
