import FontPicker from "@/components/ui/font-picker/components/FontPicker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FileText, Upload, X } from "lucide-react";
import { Controller, useWatch } from "react-hook-form";
import { type FontPickerFieldProps } from "./types";

const FONT_WEIGHTS = [
  { value: 300, label: "Light (300)" },
  { value: 400, label: "Regular (400)" },
  { value: 500, label: "Medium (500)" },
  { value: 600, label: "Semi Bold (600)" },
  { value: 700, label: "Bold (700)" },
  { value: 800, label: "Extra Bold (800)" },
  { value: 900, label: "Black (900)" },
] as const;

export function FontPickerField({
  label,
  target,
  control,
  setValue,
  isUploading,
  onUpload,
  getLocalCustomFonts,
}: FontPickerFieldProps) {
  const fontKey = `fonts.${target}` as const;
  const urlKey = `fonts.${target}Url` as const;
  const weightKey = `fonts.${target}Weight` as const;

  // Use useWatch to properly subscribe to form changes
  const currentUrl = useWatch({ control, name: urlKey });
  const currentFamily = useWatch({ control, name: fontKey });

  const handleRemoveCustomFont = () => {
    const options = { shouldDirty: true };
    setValue(urlKey, undefined, options);
    setValue(fontKey, "", options);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-muted-foreground uppercase">
          {label}
        </label>
        <button
          type="button"
          onClick={onUpload}
          disabled={isUploading}
          className="flex items-center gap-1 rounded-md bg-primary px-2 py-1 text-xs text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
        >
          <Upload className="h-3 w-3" />
          {isUploading ? "Uploading..." : "Upload"}
        </button>
      </div>

      {currentUrl ? (
        // Show custom uploaded font display
        <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/50 p-3">
          <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />
          <div className="min-w-0 flex-1">
            <p
              className="truncate text-sm font-medium"
              style={{ fontFamily: currentFamily }}
            >
              {currentFamily}
            </p>
            <p className="text-xs text-muted-foreground">
              Custom uploaded font
            </p>
          </div>
          <button
            type="button"
            onClick={handleRemoveCustomFont}
            className="rounded p-1 transition-colors hover:bg-muted"
            title="Remove custom font"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        // Show normal font picker
        <Controller
          name={fontKey}
          control={control}
          render={({ field }) => {
            const localFonts = getLocalCustomFonts();

            return (
              <FontPicker
                defaultValue={field.value}
                mode="combo"
                selectClassName="h-10 w-full"
                autoLoad={true}
                value={(fontName: string) => {
                  field.onChange(fontName);
                }}
                localFonts={localFonts}
              />
            );
          }}
        />
      )}

      <Controller
        name={weightKey}
        control={control}
        render={({ field }) => (
          <Select
            value={String(field.value || 400)}
            onValueChange={(val) => field.onChange(Number(val))}
          >
            <SelectTrigger className="w-full appearance-none rounded-lg border border-border bg-background px-3 py-2 text-sm transition-colors hover:bg-muted">
              <SelectValue placeholder="Font Weight" />
            </SelectTrigger>
            <SelectContent>
              {FONT_WEIGHTS.map(({ value, label }) => (
                <SelectItem key={value} value={String(value)}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />
    </div>
  );
}
