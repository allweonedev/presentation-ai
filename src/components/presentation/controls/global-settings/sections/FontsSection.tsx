"use client";

import { createFontPair } from "@/app/_actions/presentation/font-pair-actions";
import { CustomFontCreator } from "@/components/notebook/presentation/components/theme/create-theme/font-step/CustomFontCreator";
import { useFontUpload } from "@/components/notebook/presentation/components/theme/create-theme/font-step/useFontUpload";
import { UserFontPairs } from "@/components/notebook/presentation/components/theme/create-theme/font-step/UserFontPairs";
import { type ThemeFormValues } from "@/components/notebook/presentation/components/theme/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/plate/ui/dialog";
import { FontLoader } from "@/components/plate/utils/font-loader";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";
import { Check, Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useCommonValues } from "../hooks/useCommonValues";
import { useUpdateAllSlides } from "../hooks/useUpdateAllSlides";

export const fontPairs = [
  { heading: "Inter", body: "Inter" },
  { heading: "Space Grotesk", body: "Work Sans" },
  { heading: "IBM Plex Serif", body: "IBM Plex Serif" },
  { heading: "Lato", body: "Lato" },
  { heading: "Lexend", body: "Inter" },
  { heading: "Playfair Display", body: "DM Sans" },
  { heading: "Big Shoulders Display", body: "Inter" },
  { heading: "Merriweather", body: "Open Sans" },
  { heading: "Merriweather", body: "Lexend" },
  { heading: "Manrope", body: "Manrope" },
  { heading: "Montserrat", body: "Manrope" },
];

interface CreateFontPairFormProps {
  onClose: () => void;
  onApply: (fonts: string[]) => void;
}

function CreateFontPairForm({ onClose, onApply }: CreateFontPairFormProps) {
  const updateAllSlides = useUpdateAllSlides();
  const queryClient = useQueryClient();
  const [isSaving, setIsSaving] = useState(false);

  const form = useForm<ThemeFormValues>({
    defaultValues: {
      isPublic: false,
      themeBase: "blank",
      fonts: {
        heading: "Inter",
        body: "Inter",
        headingWeight: 700,
        bodyWeight: 400,
      },
    },
  });

  const { control, setValue, watch } = form;

  const {
    isUploadingHeading,
    isUploadingBody,
    handleFontUpload,
    getLocalCustomFonts,
  } = useFontUpload({ setValue, control });

  const currentHeadingFont = watch("fonts.heading");
  const currentBodyFont = watch("fonts.body");
  const currentHeadingUrl = watch("fonts.headingUrl");
  const currentBodyUrl = watch("fonts.bodyUrl");

  const handleSave = async () => {
    if (!currentHeadingFont || !currentBodyFont) return;

    setIsSaving(true);
    try {
      const result = await createFontPair({
        heading: currentHeadingFont,
        body: currentBodyFont,
        headingUrl: currentHeadingUrl,
        bodyUrl: currentBodyUrl,
      });

      if (result.success) {
        await queryClient.invalidateQueries({ queryKey: ["userFontPairs"] });
        updateAllSlides({
          fontFamily: {
            heading: currentHeadingFont,
            body: currentBodyFont,
            headingUrl: currentHeadingUrl,
            bodyUrl: currentBodyUrl,
            headingWeight: watch("fonts.headingWeight"),
            bodyWeight: watch("fonts.bodyWeight"),
          },
        });
        onApply([currentHeadingFont, currentBodyFont]);
        onClose();
      }
    } catch (error) {
      console.error("Error saving font pair:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <CustomFontCreator
      control={control}
      setValue={setValue}
      isUploadingHeading={isUploadingHeading}
      isUploadingBody={isUploadingBody}
      isSaving={isSaving}
      onUploadHeading={() => handleFontUpload("heading")}
      onUploadBody={() => handleFontUpload("body")}
      onSave={handleSave}
      onCancel={onClose}
      getLocalCustomFonts={getLocalCustomFonts}
      currentHeadingFont={currentHeadingFont}
      currentBodyFont={currentBodyFont}
    />
  );
}

export function FontsSection() {
  const updateAllSlides = useUpdateAllSlides();
  const [fontsToLoad, setFontsToLoad] = useState<string[]>([]);
  const { getMostCommonValue } = useCommonValues();
  const currentFontFamily = getMostCommonValue<{
    heading?: string;
    body?: string;
  }>("fontFamily", { heading: undefined, body: undefined });
  const [open, setOpen] = useState(false);

  const filteredPairs = useMemo(() => {
    const curHeading = currentFontFamily?.heading ?? "";
    const curBody = currentFontFamily?.body ?? "";
    return fontPairs.filter(
      (p) => !(p.heading === curHeading && p.body === curBody),
    );
  }, [fontPairs, currentFontFamily]);

  return (
    <div className="h-max space-y-4">
      <div className="space-y-3">
        <label className="text-xs font-semibold text-muted-foreground uppercase">
          Current Font
        </label>
        <div className="flex items-center justify-between rounded-lg border p-3">
          <div className="space-y-1">
            <div className="text-sm font-semibold text-foreground">
              {currentFontFamily?.heading || "—"}
            </div>
            <div className="text-xs text-muted-foreground">
              {currentFontFamily?.body || "—"}
            </div>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="mr-2 h-4 w-4" /> Create New Pair
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create new font pair</DialogTitle>
              </DialogHeader>
              <CreateFontPairForm
                onClose={() => setOpen(false)}
                onApply={(fonts) => setFontsToLoad(fonts.filter(Boolean))}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <UserFontPairs
        currentHeading={currentFontFamily?.heading}
        currentBody={currentFontFamily?.body}
        onSelect={(
          heading,
          body,
          headingUrl,
          bodyUrl,
          headingWeight,
          bodyWeight,
        ) => {
          updateAllSlides({
            fontFamily: {
              heading,
              body,
              headingUrl,
              bodyUrl,
              headingWeight,
              bodyWeight,
            },
          });
          setFontsToLoad([heading, body].filter(Boolean));
        }}
      />

      <div className="space-y-3">
        <label className="text-xs font-semibold text-muted-foreground uppercase">
          Font Combinations
        </label>
        <div className="space-y-2">
          {filteredPairs.map((combo) => {
            const isSelected =
              (currentFontFamily?.heading ?? "") === combo.heading &&
              (currentFontFamily?.body ?? "") === combo.body;

            return (
              <button
                key={`${combo.heading}-${combo.body}`}
                className={cn(
                  "flex w-full items-center justify-between rounded-lg border p-3 text-left transition-all hover:bg-accent/50",
                  isSelected
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-border/80",
                )}
                onClick={() => {
                  updateAllSlides({
                    fontFamily: {
                      heading: combo.heading,
                      body: combo.body,
                    },
                  });
                  setFontsToLoad([combo.heading, combo.body]);
                }}
              >
                <div className="space-y-1">
                  <div className="text-sm font-semibold text-foreground">
                    {combo.heading}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {combo.body}
                  </div>
                </div>
                {isSelected && (
                  <Check className="h-4 w-4 shrink-0 text-primary" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div style={{ display: "none" }}>
        <FontLoader fontsToLoad={fontsToLoad} />
      </div>
    </div>
  );
}
