// font-step/hooks/useFontUpload.ts
import { useUploadThing } from "@/hooks/globals/useUploadthing";
import { loadCustomFont } from "@/lib/presentation/loadCustomFont";
import { useState } from "react";
import { type Control, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { type ThemeFormValues } from "../../types";
import { type LocalFont } from "./types";

interface UseFontUploadOptions {
  setValue: (
    name: `fonts.${keyof ThemeFormValues["fonts"]}`,
    value: string | undefined,
    options?: { shouldDirty?: boolean },
  ) => void;
  control: Control<ThemeFormValues>;
}

export function useFontUpload({ setValue, control }: UseFontUploadOptions) {
  const [isUploadingHeading, setIsUploadingHeading] = useState(false);
  const [isUploadingBody, setIsUploadingBody] = useState(false);

  const { startUpload } = useUploadThing("fontUploader", {
    onClientUploadComplete: () => {},
    onUploadError: (error: Error) => {
      console.error("Font upload error:", error.message);
    },
  });

  const handleFontUpload = async (target: "heading" | "body") => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".ttf,.otf,.woff,.woff2";

    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      if (file.size > 2 * 1024 * 1024) {
        toast.error("Font file must be smaller than 2MB");
        return;
      }

      if (target === "heading") setIsUploadingHeading(true);
      else setIsUploadingBody(true);

      try {
        const result = await startUpload([file]);
        if (result?.[0]) {
          const { serverData, ufsUrl } = result[0];
          const options = { shouldDirty: true };

          if (target === "heading") {
            setValue("fonts.heading", serverData.familyName, options);
            setValue("fonts.headingUrl", ufsUrl, options);
          } else {
            setValue("fonts.body", serverData.familyName, options);
            setValue("fonts.bodyUrl", ufsUrl, options);
          }

          // Load the font immediately using FontFace API
          try {
            await loadCustomFont(serverData.familyName, ufsUrl, 400);
            toast.success("Font uploaded and loaded successfully");
          } catch (fontLoadError) {
            console.error("Font uploaded but failed to load:", fontLoadError);
            toast.success("Font uploaded successfully");
          }
        }
      } catch (error) {
        console.error("Font upload failed:", error);
        toast.error("Upload failed");
      } finally {
        if (target === "heading") setIsUploadingHeading(false);
        else setIsUploadingBody(false);
      }
    };

    input.click();
  };

  // Use useWatch to get current font values for local custom fonts
  const headingUrl = useWatch({ control, name: "fonts.headingUrl" });
  const headingFamily = useWatch({ control, name: "fonts.heading" });
  const bodyUrl = useWatch({ control, name: "fonts.bodyUrl" });
  const bodyFamily = useWatch({ control, name: "fonts.body" });

  const getLocalCustomFonts = (target: "heading" | "body"): LocalFont[] => {
    const fontUrl = target === "heading" ? headingUrl : bodyUrl;
    const fontFamily = target === "heading" ? headingFamily : bodyFamily;

    if (!fontUrl || !fontFamily) return [];

    return [
      {
        name: fontFamily,
        category: "custom",
        sane: fontFamily.toLowerCase().replace(/\s+/g, "_"),
        cased: fontFamily.toLowerCase(),
        variants: ["0,400"],
        isLocal: true,
      },
    ];
  };

  return {
    isUploadingHeading,
    isUploadingBody,
    handleFontUpload,
    getLocalCustomFonts,
  };
}
