"use client";

import debounce from "lodash.debounce";
import { useEffect, useMemo } from "react";

interface UseDebouncedOnChangeArgs<Value> {
  isGenerating: boolean;
  onApply: (value: Value) => void;
  onFontsRefresh?: () => void;
}

export function useDebouncedOnChange<Value>({
  isGenerating,
  onApply,
  onFontsRefresh,
}: UseDebouncedOnChangeArgs<Value>) {
  const debounced = useMemo(
    () =>
      debounce(
        (value: Value) => {
          if (isGenerating) return;
          onFontsRefresh?.();
          onApply(value);
        },
        100,
        { maxWait: 200 },
      ),
    [isGenerating, onApply, onFontsRefresh],
  );

  useEffect(() => () => debounced.cancel(), [debounced]);

  return debounced;
}
