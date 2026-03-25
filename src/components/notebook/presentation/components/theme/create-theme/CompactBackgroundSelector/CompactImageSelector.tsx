import { SharedGenerateControls } from "@/components/presentation/shared/SharedGenerateControls";
import { SharedImageSearchControls } from "@/components/presentation/shared/SharedImageSearchControls";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUploadFile } from "@/hooks/canvas/useUploadFile";
import { type ThemeBackground } from "@/lib/presentation/themes";
import { Image as ImageLucide, Sparkles, Upload } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { CompactUploadZone } from "./CompactUploadZone";
import { type ImageMode } from "./types";

interface CompactImageSelectorProps {
  value?: ThemeBackground | null;
  onChange?: (value: ThemeBackground | undefined) => void;
}

export function CompactImageSelector({
  value,
  onChange,
}: CompactImageSelectorProps) {
  const [imageMode, setImageMode] = useState<ImageMode>("upload-url");
  const [imageUrl, setImageUrl] = useState("");
  const { uploadFile, uploadedFile, isUploading, progress } = useUploadFile();

  useEffect(() => {
    if (value?.imageUrl) {
      setImageUrl(value.imageUrl);
    } else if (!value) {
      setImageUrl("");
    }
  }, [value]);

  useEffect(() => {
    if (uploadedFile?.url) {
      setImageUrl(uploadedFile.url);
    }
  }, [uploadedFile]);

  const handleApplyImageUrl = useCallback(() => {
    const url = uploadedFile?.url || imageUrl;
    if (!url) return;

    const background = `url(${url}) center/cover no-repeat`;
    onChange?.({
      type: "image",
      override: background,
      imageUrl: url,
    });
  }, [imageUrl, uploadedFile, onChange]);

  const handleAIImageSelect = useCallback(
    (url: string, _prompt: string) => {
      const background = `url(${url}) center/cover no-repeat`;
      onChange?.({
        type: "image",
        override: background,
        imageUrl: url,
      });
    },
    [onChange],
  );

  const handleImageSelect = useCallback(
    (url: string) => {
      const background = `url(${url}) center/cover no-repeat`;
      onChange?.({
        type: "image",
        override: background,
        imageUrl: url,
      });
    },
    [onChange],
  );

  return (
    <Tabs
      value={imageMode}
      onValueChange={(v) => setImageMode(v as ImageMode)}
      className="w-full"
    >
      <TabsList className="mb-4 grid h-9 w-full grid-cols-3 bg-muted/50 p-1">
        <TabsTrigger
          value="upload-url"
          className="text-xs data-[state=active]:bg-background data-[state=active]:shadow-xs"
        >
          <Upload className="mr-1.5 size-3" />
          Upload
        </TabsTrigger>
        <TabsTrigger
          value="ai"
          className="text-xs data-[state=active]:bg-background data-[state=active]:shadow-xs"
        >
          <Sparkles className="mr-1.5 size-3" />
          AI Gen
        </TabsTrigger>
        <TabsTrigger
          value="search"
          className="text-xs data-[state=active]:bg-background data-[state=active]:shadow-xs"
        >
          <ImageLucide className="mr-1.5 size-3" />
          Search
        </TabsTrigger>
      </TabsList>

      <div className="min-h-[200px] rounded-xl border border-border bg-card p-4 shadow-xs">
        <TabsContent value="upload-url" className="mt-0 space-y-4">
          <div className="space-y-3">
            <div className="space-y-2">
              <Label className="text-xs font-medium text-muted-foreground">
                Image URL
              </Label>
              <Input
                placeholder="https://example.com/image.jpg"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="h-9 bg-background/50 text-sm"
              />
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border/50" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">Or</span>
              </div>
            </div>

            <CompactUploadZone
              isUploading={isUploading}
              progress={progress}
              onPick={(file) => void uploadFile(file)}
            />

            {(imageUrl || uploadedFile?.url) && (
              <Button
                size="sm"
                className="h-9 w-full text-xs font-medium"
                onClick={handleApplyImageUrl}
              >
                Apply Image
              </Button>
            )}
          </div>
        </TabsContent>

        <TabsContent value="ai" className="mt-0">
          <SharedGenerateControls
            onImageSelect={handleAIImageSelect}
            className="min-h-0 flex-1"
          />
        </TabsContent>

        <TabsContent value="search" className="mt-0">
          <SharedImageSearchControls
            onImageSelect={handleImageSelect}
            className="min-h-0 flex-1"
          />
        </TabsContent>
      </div>
    </Tabs>
  );
}
