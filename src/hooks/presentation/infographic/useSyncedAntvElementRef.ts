"use client";

import { type TAntvInfographicElement } from "@/components/notebook/presentation/editor/plugins/antv-infographic-plugin";
import { useEffect, useRef } from "react";

export function useSyncedAntvElementRef(element: TAntvInfographicElement) {
  const elementRef = useRef(element);

  useEffect(() => {
    elementRef.current = element;
  }, [element]);

  return elementRef;
}
