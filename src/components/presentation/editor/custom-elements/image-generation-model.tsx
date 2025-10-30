import {
  generateImageAction,
  type ImageModelList,
} from "@/app/_actions/image/generate";
import { fetchPollinationsModels, type PollinationsModel } from "@/app/_actions/image/models";
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
import { Switch } from "@/components/ui/switch";
import { ImagePlugin } from "@platejs/media/react";
import { useEditorRef } from "platejs/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

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
  const [selectedModel, setSelectedModel] = useState<ImageModelList>("flux");
  const [models, setModels] = useState<PollinationsModel[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFreeOnly, setShowFreeOnly] = useState(true);
  const [loadingModels, setLoadingModels] = useState(true);

  useEffect(() => {
    const loadModels = async () => {
      try {
        const fetchedModels = await fetchPollinationsModels();
        setModels(fetchedModels);
      } catch (error) {
        console.error("Failed to load models:", error);
        toast.error("Failed to load image models");
      } finally {
        setLoadingModels(false);
      }
    };
    loadModels();
  }, []);

  const filteredModels = models.filter((model) => {
    const matchesSearch = model.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         model.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFreeFilter = !showFreeOnly || model.isFree;
    return matchesSearch && matchesFreeFilter;
  });

  const generateImage = async () => {
    if (!prompt.trim()) {
      toast.error("Please enter a prompt");
      return;
    }

    setIsGenerating(true);

    try {
      const result = await generateImageAction(prompt, selectedModel);

      if (!result.success || !result.image?.url) {
        throw new Error(result.error ?? "Failed to generate image");
      }

      editor.tf.insertNodes({
        children: [{ text: "" }],
        type: ImagePlugin.key,
        url: result.image.url,
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

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label htmlFor="model-search">Model</Label>
            <div className="flex items-center space-x-2">
              <Label htmlFor="free-only" className="text-sm">Free only</Label>
              <Switch
                id="free-only"
                checked={showFreeOnly}
                onCheckedChange={setShowFreeOnly}
              />
            </div>
          </div>

          <Input
            id="model-search"
            placeholder="Search models..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            disabled={isGenerating || loadingModels}
          />

          <Select
            value={selectedModel}
            onValueChange={(value) => setSelectedModel(value as ImageModelList)}
            disabled={isGenerating || loadingModels}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={loadingModels ? "Loading models..." : "Select a model"} />
            </SelectTrigger>
            <SelectContent>
              {filteredModels.map((model) => (
                <SelectItem key={model.id} value={model.id}>
                  <div className="flex items-center justify-between w-full">
                    <span>{model.name}</span>
                    {model.isFree && (
                      <span className="ml-2 text-xs bg-green-100 text-green-800 px-1 py-0.5 rounded">
                        Free
                      </span>
                    )}
                  </div>
                  {model.description && (
                    <span className="text-xs text-gray-500 block">{model.description}</span>
                  )}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
        <div className="flex gap-2">
          <AlertDialogCancel disabled={isGenerating}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              void generateImage();
            }}
            disabled={isGenerating || loadingModels}
          >
            {isGenerating ? "Generating..." : "Generate"}
          </AlertDialogAction>
        </div>
      </AlertDialogFooter>
    </>
  );
}

export default function ImageGenerationModel() {
  const [isGenerating, setIsGenerating] = useState(false);
  return (
    <AlertDialog
      open={isGenerating}
      onOpenChange={(value) => {
        setIsGenerating(value);
        setIsGenerating(false);
      }}
    >
      <AlertDialogContent className="gap-6">
        <GenerateImageDialogContent
          setOpen={setIsGenerating}
          isGenerating={isGenerating}
          setIsGenerating={setIsGenerating}
        />
      </AlertDialogContent>
    </AlertDialog>
  );
}
