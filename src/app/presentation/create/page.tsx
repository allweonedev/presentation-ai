"use client";
import { createEmptyPresentation } from "@/app/_actions/notebook/presentation/presentationActions";
import { ThemeBackground } from "@/components/notebook/presentation/components/theme/ThemeBackground";
import { Spinner } from "@/components/ui/spinner";
import { usePresentationState } from "@/states/presentation-state";
import { useTheme } from "next-themes";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { toast } from "sonner";

function getSlideCount(value: string | null): number {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) {
    return 5;
  }

  return Math.max(1, Math.floor(parsed));
}

export default function Page() {
  const router = useRouter();
  const { resolvedTheme } = useTheme();
  const params = useSearchParams();
  const handledRequestRef = useRef<string | null>(null);
  const themeMode = resolvedTheme === "dark" ? "dark" : "light";
  const createTheme = resolvedTheme === "dark" ? "ebony" : "mystique";
  const prompt = params.get("prompt")?.trim() ?? "";
  const language = params.get("language") ?? "en-US";
  const noOfSlides = getSlideCount(params.get("noOfSlides"));
  const webSearchEnabled = params.get("webSearch") === "true";
  const {
    setPresentationInput,
    setLanguage: setPresentationLanguage,
    setNumSlides,
    setCurrentPresentation,
    setIsGeneratingOutline,
    startOutlineGeneration,
    setWebSearchEnabled,
    setTheme: setPresentationTheme,
  } = usePresentationState();

  // Direct generation function
  const handleDirectGeneration = async (promptText: string, lang: string) => {
    try {
      setIsGeneratingOutline(true);
      setPresentationTheme(createTheme);

      // Create empty presentation
      const result = await createEmptyPresentation({
        title: promptText.substring(0, 50) || "Untitled Presentation",
        theme: createTheme,
        language: lang,
      });

      if (result.success && result.presentation) {
        // Set the current presentation
        setCurrentPresentation(
          result.presentation.id,
          result.presentation.title,
        );

        // Navigate to the generate page
        startOutlineGeneration();
        router.replace(`/presentation/generate/${result.presentation.id}`);
      } else {
        setIsGeneratingOutline(false);
        toast.error(result.message || "Failed to create presentation");
        router.push("/presentations");
      }
    } catch (error) {
      setIsGeneratingOutline(false);
      console.error("Error creating presentation:", error);
      toast.error("Failed to create presentation");
      router.push("/presentations");
    }
  };

  // Check for generation data and handle accordingly
  useEffect(() => {
    const presentationState = usePresentationState.getState();
    const queryRequest = {
      language,
      modelId: presentationState.modelId,
      modelProvider: presentationState.modelProvider,
      numSlides: noOfSlides,
      prompt,
      webSearchEnabled,
    };
    const pendingCreateRequest = presentationState.pendingCreateRequest;
    const request =
      queryRequest.prompt.length > 0 ? queryRequest : pendingCreateRequest;

    if (!request || !request.prompt) {
      presentationState.setPendingCreateRequest(null);
      router.replace("/presentations");
      return;
    }

    const requestKey = `${request.language}:${request.modelProvider}:${request.modelId}:${request.numSlides}:${request.webSearchEnabled}:${request.prompt}`;
    if (handledRequestRef.current === requestKey) {
      return;
    }

    handledRequestRef.current = requestKey;

    setPresentationInput(request.prompt);
    setPresentationLanguage(request.language);
    setNumSlides(request.numSlides);
    setWebSearchEnabled(request.webSearchEnabled);
    presentationState.setModelProvider(request.modelProvider);
    presentationState.setModelId(request.modelId);

    void handleDirectGeneration(request.prompt, request.language);
  }, [
    language,
    noOfSlides,
    prompt,
    setIsGeneratingOutline,
    setNumSlides,
    setPresentationInput,
    setPresentationLanguage,
    setWebSearchEnabled,
    webSearchEnabled,
  ]);

  if (handledRequestRef.current || prompt) {
    return (
      <ThemeBackground
        themeOverride={createTheme}
        themeModeOverride={themeMode}
      >
        <div className="flex h-[calc(100vh-8rem)] flex-col items-center justify-center">
          <div className="relative">
            <Spinner className="h-10 w-10 text-primary" />
          </div>
          <div className="space-y-2 text-center">
            <h2 className="text-2xl font-bold">Loading Presentation Outline</h2>
            <p className="text-muted-foreground">Please wait a moment...</p>
          </div>
        </div>
      </ThemeBackground>
    );
  }

  return (
    <div className="grid h-full w-full place-items-center bg-background">
      <div className="flex flex-col items-center justify-center space-y-4">
        <Spinner size={32} />
      </div>
    </div>
  );
}
