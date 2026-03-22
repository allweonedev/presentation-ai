// font-step/types.ts
import { type Control, type UseFormSetValue } from "react-hook-form";
import { type ThemeFormValues } from "../../types";

export interface FontStepProps {
  control: Control<ThemeFormValues>;
  setValue: UseFormSetValue<ThemeFormValues>;
}

export interface FontPickerFieldProps {
  label: string;
  target: "heading" | "body";
  control: Control<ThemeFormValues>;
  setValue: UseFormSetValue<ThemeFormValues>;
  isUploading: boolean;
  onUpload: () => void;
  getLocalCustomFonts: () => LocalFont[];
}

export interface LocalFont {
  name: string;
  category: string;
  sane: string;
  cased: string;
  variants: string[];
  isLocal: boolean;
}

export interface FontPairSelection {
  heading: string;
  body: string;
  headingUrl?: string;
  bodyUrl?: string;
}
