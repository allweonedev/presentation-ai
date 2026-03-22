"use client";

import ColorPicker from "@/components/ui/color-picker";

export function ColorField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-md border p-2">
      <div className="text-sm">{label}</div>
      <ColorPicker value={value} onChange={onChange} />
    </div>
  );
}
