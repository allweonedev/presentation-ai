// font-step/components/CustomFontCreator.tsx
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { FontPickerField } from "./FontPickerField";
import { type FontStepProps, type LocalFont } from "./types";

interface CustomFontCreatorProps extends FontStepProps {
  isUploadingHeading: boolean;
  isUploadingBody: boolean;
  isSaving: boolean;
  onUploadHeading: () => void;
  onUploadBody: () => void;
  onSave: () => void;
  onCancel: () => void;
  getLocalCustomFonts: (target: "heading" | "body") => LocalFont[];
  currentHeadingFont: string;
  currentBodyFont: string;
}

export function CustomFontCreator({
  control,
  setValue,
  isUploadingHeading,
  isUploadingBody,
  isSaving,
  onUploadHeading,
  onUploadBody,
  onSave,
  onCancel,
  getLocalCustomFonts,
  currentHeadingFont,
  currentBodyFont,
}: CustomFontCreatorProps) {
  return (
    <>
      <div className="space-y-4 rounded-lg border bg-muted/30 p-4">
        <FontPickerField
          label="Heading Font"
          target="heading"
          control={control}
          setValue={setValue}
          isUploading={isUploadingHeading}
          onUpload={onUploadHeading}
          getLocalCustomFonts={() => getLocalCustomFonts("heading")}
        />

        <FontPickerField
          label="Body Font"
          target="body"
          control={control}
          setValue={setValue}
          isUploading={isUploadingBody}
          onUpload={onUploadBody}
          getLocalCustomFonts={() => getLocalCustomFonts("body")}
        />
      </div>

      <div className="flex justify-between">
        <Button
          onClick={onCancel}
          className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
        >
          Cancel
        </Button>

        <Button
          onClick={onSave}
          disabled={isSaving || !currentHeadingFont || !currentBodyFont}
          className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
        >
          <Save className="h-4 w-4" />
          {isSaving ? "Saving..." : "Save Font Pair"}
        </Button>
      </div>
    </>
  );
}
