"use client";

import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";

export interface BlurInputProps extends Omit<
  React.ComponentProps<typeof Input>,
  "onChange" | "onBlur"
> {
  value: string | number;
  onChange: (value: string | number) => void;
}

/**
 * Input that only triggers onChange when the user blurs (leaves) the input.
 * This reduces the number of updates compared to DebouncedInput.
 */
export function BlurInput({
  value: initialValue,
  onChange,
  ...props
}: BlurInputProps) {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  return (
    <Input
      {...props}
      value={value}
      onChange={(e) => {
        setValue(e.target.value);
      }}
      onBlur={() => {
        if (value !== initialValue) {
          onChange(value);
        }
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.currentTarget.blur();
        }
      }}
    />
  );
}
