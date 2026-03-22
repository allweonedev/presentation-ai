"use client";

import { FontPicker } from "@/components/ui/font-picker";
import { Label } from "@/components/ui/label";
interface FontSelectorProps {
  value: string;
  onChange: (value: string) => void;
  label: string;
}

export function FontSelector({ value, onChange, label }: FontSelectorProps) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <FontPicker value={onChange} defaultValue={value} autoLoad={true} />
    </div>
  );
}
