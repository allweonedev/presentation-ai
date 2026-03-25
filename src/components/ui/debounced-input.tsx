import { Input } from "@/components/ui/input";
import debounce from "lodash.debounce";
import { useEffect, useMemo, useState } from "react";

export interface DebouncedInputProps extends Omit<
  React.ComponentProps<typeof Input>,
  "onChange"
> {
  value: string | number;
  onChange: (value: string | number) => void;
  debounceTimeout?: number;
}

export function DebouncedInput({
  value: initialValue,
  onChange,
  debounceTimeout = 500,
  ...props
}: DebouncedInputProps) {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const debouncedOnChange = useMemo(
    () => debounce(onChange, debounceTimeout),
    [onChange, debounceTimeout],
  );

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      debouncedOnChange.cancel();
    };
  }, [debouncedOnChange]);

  return (
    <Input
      {...props}
      value={value}
      onChange={(e) => {
        const newValue = e.target.value;
        setValue(newValue);
        debouncedOnChange(newValue);
      }}
    />
  );
}
