import {
  generateImageAction,
  type ImageModelList,
} from "@/app/_actions/apps/image-studio/generate";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useNotesState } from "@/states/notes-state";
import { ImagePlugin } from "@platejs/media/react";
import { useEditorRef } from "platejs/react";
import { useState } from "react";
import { toast } from "sonner";

const MODEL_OPTIONS = [
  {
    label: "Flux 2 Flash",
    value: "fal-ai/flux-2/flash",
  },
  {
    label: "Flux Dev",
    value: "fal-ai/flux/dev",
  },
  {
    label: "Flux 2 Pro",
    value: "fal-ai/flux-2-pro",
  },
];

export function GenerateImageDialogContent({
  setOpen,
  isGenerating,
  setIsGenerating,
}: {
  setOpen: (value: boolean) => void;
  isGenerating: boolean;
  setIsGenerating: (value: boolean) => void;
}) {
  const editor = useEditorRef();
  const [prompt, setPrompt] = useState("");
  const [selectedModel, setSelectedModel] = useState<ImageModelList>(
    "fal-ai/flux-2/flash",
  );

  const generateImage = async () => {
    if (!prompt.trim()) {
      toast.error("Please enter a prompt");
      return;
    }

    setIsGenerating(true);

    try {
      const result = await generateImageAction(prompt, selectedModel);

      if (!result.success) {
        throw new Error(result.error ?? "Failed to generate image");
      }

      const image = "image" in result ? result.image : undefined;

      if (!image?.url) {
        throw new Error("Failed to generate image");
      }

      editor.tf.insertNodes({
        children: [{ text: "" }],
        type: ImagePlugin.key,
        url: image.url,
        query: prompt,
      });

      setOpen(false);
      toast.success("Image generated successfully!");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to generate image",
      );
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <>
      <AlertDialogHeader>
        <AlertDialogTitle>Generate Image with AI</AlertDialogTitle>
        <AlertDialogDescription>
          Enter a detailed description of the image you want to generate
        </AlertDialogDescription>
      </AlertDialogHeader>

      <div className="space-y-4">
        <div className="relative w-full">
          <Label htmlFor="prompt">Prompt</Label>
          <Input
            id="prompt"
            className="w-full"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !isGenerating) void generateImage();
            }}
            type="text"
            autoFocus
            disabled={isGenerating}
          />
        </div>

        {isGenerating && (
          <div className="mt-4 space-y-3">
            <div className="h-64 w-full animate-pulse rounded-lg bg-gray-200 dark:bg-gray-800" />
            <div className="text-center text-sm text-gray-500">
              Generating your image...
            </div>
          </div>
        )}
      </div>

      <AlertDialogFooter>
        <Select
          value={selectedModel}
          onValueChange={(value) => setSelectedModel(value as ImageModelList)}
          disabled={isGenerating}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a model" />
          </SelectTrigger>
          <SelectContent>
            {MODEL_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="flex gap-2">
          <AlertDialogCancel disabled={isGenerating}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              void generateImage();
            }}
            disabled={isGenerating}
          >
            {isGenerating ? "Generating..." : "Generate"}
          </AlertDialogAction>
        </div>
      </AlertDialogFooter>
    </>
  );
}

export default function ImageGenerationModel() {
  const { isImageGenerationModelOpen, setIsImageGenerationModelOpen } =
    useNotesState();
  const [isGenerating, setIsGenerating] = useState(false);
  return (
    <AlertDialog
      open={isImageGenerationModelOpen}
      onOpenChange={(value) => {
        setIsImageGenerationModelOpen(value);
        setIsGenerating(false);
      }}
    >
      <AlertDialogContent className="gap-6">
        <GenerateImageDialogContent
          setOpen={setIsImageGenerationModelOpen}
          isGenerating={isGenerating}
          setIsGenerating={setIsGenerating}
        />
      </AlertDialogContent>
    </AlertDialog>
  );
}
