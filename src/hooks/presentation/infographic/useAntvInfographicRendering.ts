"use client";

import { type TAntvInfographicElement } from "@/components/notebook/presentation/editor/plugins/antv-infographic-plugin";
import {
  applyThemeToData,
  applyThemeToSyntax,
} from "@/components/notebook/presentation/editor/utils/infographic-utils";
import { type Infographic } from "@antv/infographic";
import {
  useEffect,
  type Dispatch,
  type RefObject,
  type SetStateAction,
} from "react";

type RenderingParams = {
  infographicRef: RefObject<Infographic | null>;
  element: TAntvInfographicElement;
  elementRef: RefObject<TAntvInfographicElement>;
  themedSyntax: string;
  isDark: boolean;
  syntax: string;
  setHasError: Dispatch<SetStateAction<boolean>>;
};

export function useAntvInfographicRendering({
  infographicRef,
  element,
  elementRef,
  themedSyntax,
  isDark,
  syntax,
  setHasError,
}: RenderingParams) {
  useEffect(() => {
    const instance = infographicRef.current;
    if (!instance || element.isLoading) return;

    const payload =
      elementRef.current.data && Object.keys(elementRef.current.data).length > 0
        ? applyThemeToData(elementRef.current.data, isDark)
        : themedSyntax;

    if (!payload || (typeof payload === "string" && !payload.trim())) return;

    try {
      instance.render(payload);
      setHasError(false);
    } catch (err) {
      console.error("Failed to render infographic:", err);
      setHasError(true);
    }
  }, [
    themedSyntax,
    element.isLoading,
    elementRef,
    infographicRef,
    setHasError,
  ]);

  // This hooks is for streaming rendering
  useEffect(() => {
    const instance = infographicRef.current;
    if (!instance || element.isLoading || element.data || !syntax) return;

    try {
      instance.render(applyThemeToSyntax(syntax, isDark));
    } catch {
      // Ignore parse errors during streaming
    }
  }, [syntax, element.isLoading, element.data, isDark, infographicRef]);
}
