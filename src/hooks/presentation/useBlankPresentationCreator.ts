import { createBlankPresentation } from "@/app/_actions/notebook/presentation/presentationActions";
import { usePresentationState } from "@/states/presentation-state";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { toast } from "sonner";

export function useBlankPresentationCreator() {
  const router = useRouter();
  const { resolvedTheme } = useTheme();
  const [isCreating, setIsCreating] = useState(false);
  const { language, setCurrentPresentation, setTheme } = usePresentationState();

  const createBlank = useCallback(async () => {
    if (isCreating) return;

    setIsCreating(true);
    try {
      const theme = resolvedTheme === "dark" ? "ebony" : "mystique";

      const result = await createBlankPresentation(
        "Untitled Presentation",
        theme,
        language,
      );

      if (result.success && result.presentation) {
        setTheme(theme);
        setCurrentPresentation(
          result.presentation.id,
          result.presentation.title,
        );
        router.push(`/presentation/${result.presentation.id}`);
      } else {
        toast.error(result.message || "Failed to create presentation");
      }
    } catch (error) {
      console.error("Error creating blank presentation:", error);
      toast.error("Failed to create presentation");
    } finally {
      setIsCreating(false);
    }
  }, [
    isCreating,
    language,
    resolvedTheme,
    router,
    setCurrentPresentation,
    setTheme,
  ]);

  return {
    createBlank,
    isCreating,
  };
}
