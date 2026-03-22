"use client";

import { type TAntvInfographicElement } from "@/components/notebook/presentation/editor/plugins/antv-infographic-plugin";
import { syncInfographicSyntaxWithData } from "@/components/notebook/presentation/editor/utils/infographic-utils";
import { findInfographicEntryById } from "@/hooks/presentation/infographic/findInfographicNode";
import {
  type Infographic,
  type InfographicOptions,
  type ParsedInfographicOptions,
} from "@antv/infographic";
import debounce from "lodash.debounce";
import { type PlateEditor } from "platejs/react";
import { useEffect, useMemo, type RefObject } from "react";

type MutationSyncParams = {
  infographicRef: RefObject<Infographic | null>;
  editor: PlateEditor;
  elementRef: RefObject<TAntvInfographicElement>;
  syntax: string;
};

const pickSerializableOptions = (
  options: Partial<InfographicOptions>,
): Partial<InfographicOptions> => {
  const {
    container: _container,
    plugins: _plugins,
    interactions: _interactions,
    elements: _elements,
    ...rest
  } = options;
  return rest;
};

const toSerializableOptionsFromParsed = (
  parsed: Partial<ParsedInfographicOptions>,
): Partial<InfographicOptions> => {
  return {
    template: parsed.template,
    data: parsed.data,
    theme: parsed.theme,
    themeConfig: parsed.themeConfig,
    width: parsed.width,
    height: parsed.height,
    padding: parsed.padding,
    svg: parsed.svg,
  };
};

export function useAntvInfographicMutationSync({
  infographicRef,
  editor,
  elementRef,
  syntax,
}: MutationSyncParams) {
  const debouncedSave = useMemo(
    () =>
      debounce((options: Partial<InfographicOptions>) => {
        const stableData = structuredClone(options);
        const elementId =
          typeof elementRef.current.id === "string" ? elementRef.current.id : "";
        const entry = findInfographicEntryById(editor, elementId);
        const currentElement = entry?.[0];
        const path = entry?.[1];

        if (!path || !currentElement) {
          return;
        }

        const syncedSyntax = syncInfographicSyntaxWithData(
          currentElement.syntax ?? "",
          stableData,
        );
        const update: Partial<TAntvInfographicElement> = { data: stableData };

        if (syncedSyntax && syncedSyntax !== currentElement.syntax) {
          update.syntax = syncedSyntax;
        }

        editor.tf.setNodes(update, { at: path });
      }, 1000),
    [editor, elementRef],
  );

  // Cancel any pending debounced save when syntax changes externally
  // (e.g., template conversion). This prevents stale data from reverting the change.
  useEffect(() => {
    debouncedSave.cancel();
  }, [syntax, debouncedSave]);

  useEffect(() => {
    return () => debouncedSave.cancel();
  }, [debouncedSave]);

  useEffect(() => {
    const instance = infographicRef.current;
    if (!instance) return;

    const handleOptionsChange = () => {
      const internalEditor = (instance as unknown as { editor?: unknown })
        .editor as
        | {
            state?: { getOptions?: () => Partial<ParsedInfographicOptions> };
          }
        | undefined;
      const parsedOptions = internalEditor?.state?.getOptions?.();
      const options = parsedOptions
        ? toSerializableOptionsFromParsed(parsedOptions)
        : pickSerializableOptions(instance.getOptions());
      debouncedSave(options);
    };

    instance.on("options:change", handleOptionsChange);

    return () => {
      instance.off("options:change", handleOptionsChange);
    };
  }, [infographicRef, debouncedSave]);
}
