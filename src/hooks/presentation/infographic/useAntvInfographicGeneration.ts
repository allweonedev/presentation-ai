"use client";

import { type TAntvInfographicElement } from "@/components/notebook/presentation/editor/plugins/antv-infographic-plugin";
import { findInfographicEntryById } from "@/hooks/presentation/infographic/findInfographicNode";
import { useInfographicStreamingState } from "@/states/infographic-streaming-state";
import { useCompletion } from "@ai-sdk/react";
import { type PlateEditor } from "platejs/react";
import {
  type Dispatch,
  type SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

type GenerationParams = {
  editor: PlateEditor;
  element: TAntvInfographicElement;
  setHasError: Dispatch<SetStateAction<boolean>>;
  canResumeLoadingGeneration?: boolean;
};

type GenerationTarget = {
  mode: "prompt" | "text";
  value: string;
};

type ActiveGenerationRequest = {
  elementId: string;
  mode: GenerationTarget["mode"];
};

const DEFAULT_GENERATION_PROMPT = "Generate an infographic";

function resolveGenerationTarget(
  element: TAntvInfographicElement,
): GenerationTarget {
  const sourceText = element.sourceText?.trim();

  if (sourceText) {
    return { mode: "text", value: sourceText };
  }

  const generationPrompt = element.generationPrompt?.trim();

  if (generationPrompt) {
    return { mode: "prompt", value: generationPrompt };
  }

  return { mode: "prompt", value: DEFAULT_GENERATION_PROMPT };
}

export function useAntvInfographicGeneration({
  editor,
  element,
  setHasError,
  canResumeLoadingGeneration = false,
}: GenerationParams) {
  const [syntax, setSyntax] = useState<string>("");
  const isMountedRef = useRef(false);
  const activeRequestRef = useRef<ActiveGenerationRequest | null>(null);
  const elementId = typeof element.id === "string" ? element.id : "";
  const generationTarget = useMemo(
    () => resolveGenerationTarget(element),
    [element.generationPrompt, element.sourceText],
  );
  const isInfographicComplete = useInfographicStreamingState((state) =>
    elementId ? state.completedInfographicIds[elementId] === true : false,
  );
  const isReadyToGenerate =
    generationTarget.mode === "text"
      || isInfographicComplete
      || canResumeLoadingGeneration;
  const hasStartedRequest = useInfographicStreamingState((state) =>
    elementId ? state.startedGenerationRequests[elementId] === true : false,
  );

  useEffect(() => {
    isMountedRef.current = true;

    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const updateInfographicNode = useCallback(
    (
      targetElementIds: string[],
      update: Partial<TAntvInfographicElement>,
    ): boolean => {
      const candidateIds = [...new Set(targetElementIds.filter(Boolean))];

      if (candidateIds.length === 0) {
        return false;
      }

      for (const candidateId of candidateIds) {
        const entry = findInfographicEntryById(editor, candidateId);
        const path = entry?.[1];

        if (!path) {
          continue;
        }

        editor.tf.setNodes(update, { at: path });
        return true;
      }

      return false;
    },
    [editor],
  );

  const handleGenerationFinish = useCallback(
    (completion: string) => {
      const activeRequest = activeRequestRef.current;

      if (!activeRequest) {
        return;
      }

      if (isMountedRef.current) {
        setSyntax(completion);
        setHasError(false);
      }

      updateInfographicNode([activeRequest.elementId, elementId], {
        syntax: completion,
        isLoading: false,
      });
    },
    [elementId, setHasError, updateInfographicNode],
  );

  const handleGenerationError = useCallback(() => {
    const activeRequest = activeRequestRef.current;

    if (!activeRequest) {
      return;
    }

    updateInfographicNode([activeRequest.elementId, elementId], {
      isLoading: false,
    });

    if (isMountedRef.current) {
      setHasError(true);
    }
  }, [elementId, setHasError, updateInfographicNode]);

  const {
    completion: syntaxFromPrompt,
    complete: startForPrompt,
    isLoading: isGeneratingFromPrompt,
  } = useCompletion({
    api: "/api/presentation/prompt-to-diagram",
    id: elementId ? `${elementId}:prompt-to-diagram` : undefined,
    onFinish(_prompt, completion) {
      handleGenerationFinish(completion);
    },
    onError() {
      handleGenerationError();
    },
  });

  const {
    completion: syntaxFromText,
    complete: startForText,
    isLoading: isGeneratingFromText,
  } = useCompletion({
    api: "/api/presentation/text-to-diagram",
    id: elementId ? `${elementId}:text-to-diagram` : undefined,
    onFinish(_prompt, completion) {
      handleGenerationFinish(completion);
    },
    onError() {
      handleGenerationError();
    },
  });

  const isGenerating = isGeneratingFromPrompt || isGeneratingFromText;

  useEffect(() => {
    if (element.isLoading) {
      setHasError(false);
      return;
    }

    if (elementId) {
      useInfographicStreamingState
        .getState()
        .clearGenerationRequestStarted(elementId);
    }
    activeRequestRef.current = null;
  }, [element.isLoading, elementId, setHasError]);

  useEffect(() => {
    if (!elementId) {
      return;
    }

    if (
      !isMountedRef.current ||
      !element.isLoading ||
      !isReadyToGenerate ||
      isGenerating ||
      hasStartedRequest
    ) {
      return;
    }

    const didStartRequest = useInfographicStreamingState
      .getState()
      .tryStartGenerationRequest(elementId);

    if (!didStartRequest) {
      return;
    }

    activeRequestRef.current = {
      elementId,
      mode: generationTarget.mode,
    };
    setSyntax("");
    setHasError(false);

    if (generationTarget.mode === "text") {
      void startForText(generationTarget.value);
      return;
    }

    void startForPrompt(generationTarget.value);
  }, [
    element.isLoading,
    elementId,
    generationTarget.mode,
    generationTarget.value,
    isGenerating,
    isReadyToGenerate,
    hasStartedRequest,
    setHasError,
    startForPrompt,
    startForText,
  ]);

  useEffect(() => {
    if (!isMountedRef.current) {
      return;
    }

    if (activeRequestRef.current?.mode === "text") {
      if (syntaxFromText) {
        setSyntax(syntaxFromText);
      }

      return;
    }

    if (syntaxFromPrompt) {
      setSyntax(syntaxFromPrompt);
    }
  }, [syntaxFromPrompt, syntaxFromText]);

  return { syntax };
}
