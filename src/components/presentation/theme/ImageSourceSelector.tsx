"use client";

import { type ImageModelList } from "@/app/_actions/image/generate";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Image, Wand2 } from "lucide-react";

export const IMAGE_MODELS: { value: ImageModelList; label: string }[] = [
  { value: "flux", label: "FLUX" },
  { value: "turbo", label: "Turbo" },
  { value: "kontext", label: "Kontext" },
  { value: "gptimage", label: "GPT Image" },
];

interface ImageSourceSelectorProps {
  imageSource: "ai" | "stock";
  imageModel: ImageModelList;
  stockImageProvider: "unsplash";
  onImageSourceChange: (source: "ai" | "stock") => void;
  onImageModelChange: (model: ImageModelList) => void;
  onStockImageProviderChange: (provider: "unsplash") => void;
  className?: string;
  showLabel?: boolean;
}

export function ImageSourceSelector({
  imageSource,
  imageModel,
  stockImageProvider,
  onImageSourceChange,
  onImageModelChange,
  onStockImageProviderChange,
  className,
  showLabel = true,
}: ImageSourceSelectorProps) {
  return (
    <div className={className}>
      {showLabel && (
        <Label className="text-sm font-medium mb-2 block">Image Source</Label>
      )}
      <Select
        value={
          imageSource === "ai"
            ? imageModel || "flux"
            : `stock-${stockImageProvider}`
        }
        onValueChange={(value) => {
          if (value.startsWith("stock-")) {
            // Handle stock image selection
            const provider = value.replace("stock-", "") as "unsplash";
            onImageSourceChange("stock");
            onStockImageProviderChange(provider);
          } else {
            // Handle AI model selection
            onImageSourceChange("ai");
            onImageModelChange(value as ImageModelList);
          }
        }}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select image generation method" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel className="text-primary/80 flex items-center gap-1">
              <Wand2 size={10} />
              AI Generation
            </SelectLabel>
            {IMAGE_MODELS.map((model) => (
              <SelectItem key={model.value} value={model.value}>
                {model.label}
              </SelectItem>
            ))}
          </SelectGroup>
          <SelectGroup>
            <SelectLabel className="text-primary/80 flex items-center gap-1">
              <Image size={10} />
              Stock Images
            </SelectLabel>
            <SelectItem value="stock-unsplash">Unsplash</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
