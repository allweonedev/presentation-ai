import { createFontPair } from "@/app/_actions/presentation/font-pair-actions";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

interface FontPairData {
  heading: string;
  body: string;
  headingUrl?: string;
  bodyUrl?: string;
}

export function useSaveFontPair(onSuccess?: () => void) {
  const [isSaving, setIsSaving] = useState(false);
  const queryClient = useQueryClient();

  const saveFontPair = async (data: FontPairData) => {
    const { heading, body, headingUrl, bodyUrl } = data;

    if (!heading || !body) {
      toast.error("Please select both heading and body fonts");
      return false;
    }

    setIsSaving(true);
    try {
      const result = await createFontPair({
        heading,
        headingUrl,
        body,
        bodyUrl,
      });

      if (result.success) {
        toast.success("Font pair saved successfully");
        await queryClient.invalidateQueries({ queryKey: ["userFontPairs"] });
        onSuccess?.();
        return true;
      } else {
        toast.error(result.message || "Failed to save font pair");
        return false;
      }
    } catch (error) {
      console.error("Error saving font pair:", error);
      toast.error("Failed to save font pair");
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  return { isSaving, saveFontPair };
}
