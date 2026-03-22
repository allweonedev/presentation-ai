"use client";

import { getUserImages } from "@/app/_actions/apps/image-studio/fetch";
import { useUploadFile } from "@/components/plate/hooks/use-upload-file";
import { SharedGenerateControls } from "@/components/presentation/shared/SharedGenerateControls";
import { SharedGifSearchControls } from "@/components/presentation/shared/SharedGifSearchControls";
import { SharedImageSearchControls } from "@/components/presentation/shared/SharedImageSearchControls";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  type ImageEditorMode,
  usePresentationState,
} from "@/states/presentation-state";
import { useInfiniteQuery } from "@tanstack/react-query";
import {
  Clapperboard,
  ImageIcon,
  Images,
  Loader2,
  Search,
  Upload,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useInView } from "react-intersection-observer";
import { toast } from "sonner";

// Define tab options with icons (excluding embed since this is for presentation images)
const TAB_OPTIONS: {
  value: ImageEditorMode;
  label: string;
  icon: React.ReactNode;
}[] = [
  {
    value: "generate",
    label: "AI Generate",
    icon: <ImageIcon className="h-4 w-4" />,
  },
  {
    value: "your-images",
    label: "Your Images",
    icon: <Images className="h-4 w-4" />,
  },
  { value: "search", label: "Search", icon: <Search className="h-4 w-4" /> },
  { value: "gif", label: "GIFs", icon: <Clapperboard className="h-4 w-4" /> },
];

export function PresentationImageEditorPanel() {
  const presentationImageEditorInitialMode = usePresentationState(
    (s) => s.presentationImageEditorInitialMode,
  );
  const closePresentationImageEditor = usePresentationState(
    (s) => s.closePresentationImageEditor,
  );
  const boundUpdateElement = usePresentationState((s) => s.boundUpdateElement);
  const initialMode = presentationImageEditorInitialMode ?? "generate";

  const [currentMode, setCurrentMode] = useState<ImageEditorMode>(initialMode);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Upload file hook
  const { uploadFile, isUploading, progress } = useUploadFile({
    onUploadComplete: (file) => {
      if (boundUpdateElement) {
        boundUpdateElement({
          url: file.ufsUrl,
          query: "",
        });
      }
    },
    onUploadError: (error) => {
      toast.error("Failed to upload image");
      console.error(error);
    },
  });

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      void uploadFile(file);
    }
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Sync mode when initial mode changes
  useEffect(() => {
    if (presentationImageEditorInitialMode) {
      setCurrentMode(presentationImageEditorInitialMode);
    }
  }, [presentationImageEditorInitialMode]);

  const handleImageSelect = (
    url: string,
    prompt?: string,
    imageSource?: "generate" | "search" | "gif",
  ) => {
    console.log("[PresentationImageEditorPanel] handleImageSelect:", {
      url,
      prompt,
      imageSource,
    });
    if (boundUpdateElement) {
      boundUpdateElement({
        url,
        query: prompt ?? "",
        imageSource,
      });
    }
  };

  const handleModeChange = (value: string) => {
    setCurrentMode(value as ImageEditorMode);
  };

  // Get current tab info
  const currentTab = TAB_OPTIONS.find((t) => t.value === currentMode);

  if (!presentationImageEditorInitialMode) {
    return null;
  }

  // Render content based on current mode
  const renderContent = () => {
    switch (currentMode) {
      case "generate":
        return (
          <div className="flex h-full flex-col">
            <div className="flex-none space-y-1 px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="leading-none font-medium">Generate Image</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Create unique images using AI.
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleUploadClick}
                  disabled={isUploading}
                  className="gap-2"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      {progress}%
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4" />
                      Upload
                    </>
                  )}
                </Button>
              </div>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto px-6 pb-6">
              <SharedGenerateControls
                onImageSelect={(url, prompt) =>
                  handleImageSelect(url, prompt, "generate")
                }
                initialPrompt={""}
              />
            </div>
          </div>
        );
      case "your-images":
        return (
          <div className="flex h-full flex-col">
            <div className="flex-none space-y-1 px-6 py-4">
              <h3 className="leading-none font-medium">Your Images</h3>
              <p className="text-sm text-muted-foreground">
                Select from your generated images.
              </p>
            </div>
            <div className="flex min-h-0 flex-1 flex-col overflow-hidden px-6 pb-6">
              <YourImagesGrid
                onImageSelect={(url, prompt) =>
                  handleImageSelect(url, prompt, "generate")
                }
              />
            </div>
          </div>
        );
      case "search":
        return (
          <div className="flex h-full flex-col">
            <div className="flex-none space-y-1 px-6 py-4">
              <h3 className="leading-none font-medium">Search Images</h3>
              <p className="text-sm text-muted-foreground">
                Find images from Unsplash or Pixabay.
              </p>
            </div>
            <div className="flex min-h-0 flex-1 flex-col overflow-hidden px-6 pb-6">
              <SharedImageSearchControls
                onImageSelect={(url) =>
                  handleImageSelect(url, undefined, "search")
                }
                className="h-full"
              />
            </div>
          </div>
        );
      case "gif":
        return (
          <div className="flex h-full flex-col">
            <div className="flex-none space-y-1 px-6 py-4">
              <h3 className="leading-none font-medium">Search GIFs</h3>
              <p className="text-sm text-muted-foreground">
                Find animated GIFs from Giphy.
              </p>
            </div>
            <div className="flex min-h-0 flex-1 flex-col overflow-hidden px-6 pb-6">
              <SharedGifSearchControls
                onGifSelect={(url) => handleImageSelect(url, undefined, "gif")}
                className="h-full"
              />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex h-full w-full flex-col border-l bg-background">
      {/* Header */}
      <div className="flex items-center justify-between border-b px-4 py-2">
        <h2 className="text-sm font-semibold">Image Editor</h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={closePresentationImageEditor}
          className="size-8 rounded-full p-0"
        >
          <X className="size-5" />
        </Button>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Mode Selector Dropdown */}
      <div className="px-6 py-3">
        <Select value={currentMode} onValueChange={handleModeChange}>
          <SelectTrigger className="h-11 w-full rounded-xl">
            <SelectValue>
              {currentTab && (
                <div className="flex items-center gap-2">
                  {currentTab.icon}
                  <span>{currentTab.label}</span>
                </div>
              )}
            </SelectValue>
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            {TAB_OPTIONS.map((tab) => (
              <SelectItem
                key={tab.value}
                value={tab.value}
                className="cursor-pointer rounded-lg"
              >
                <div className="flex items-center gap-2">
                  {tab.icon}
                  <span>{tab.label}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Separator />

      {/* Content Area */}
      <div className="min-h-0 flex-1 overflow-hidden">{renderContent()}</div>
    </div>
  );
}

// Inline YourImages grid component
function YourImagesGrid({
  onImageSelect,
}: {
  onImageSelect: (url: string, prompt: string) => void;
}) {
  const { ref, inView } = useInView();

  const {
    data: userImagesData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isLoadingUserImages,
  } = useInfiniteQuery({
    queryKey: ["user-generated-images"],
    queryFn: async ({ pageParam = 1 }) => {
      const images = await getUserImages({ page: pageParam, limit: 20 });
      return images;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length === 20 ? allPages.length + 1 : undefined;
    },
  });

  useEffect(() => {
    if (inView && hasNextPage) {
      void fetchNextPage();
    }
  }, [inView, fetchNextPage, hasNextPage]);

  return (
    <ScrollArea className="-mx-2 flex-1 px-2">
      <div className="grid grid-cols-3 gap-2 pb-4">
        {userImagesData?.pages.map((page) =>
          page.map((img) => (
            <div
              key={img.id}
              onClick={() => onImageSelect(img.url, img.prompt)}
              className="group relative aspect-square cursor-pointer overflow-hidden rounded-lg border border-border bg-muted/30"
            >
              {/* biome-ignore lint/performance/noImgElement: Cannot use image links with next Image component */}
              <img
                src={img.url}
                alt={img.prompt}
                className="h-full w-full object-cover transition-transform group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/40 p-2 opacity-0 transition-opacity group-hover:opacity-100">
                <Button
                  size="sm"
                  variant="secondary"
                  className="h-8 w-full text-xs"
                  onClick={() => onImageSelect(img.url, img.prompt)}
                >
                  Use Image
                </Button>
              </div>
            </div>
          )),
        )}

        {/* Loading skeletons */}
        {(isLoadingUserImages || isFetchingNextPage) &&
          Array(6)
            .fill(0)
            .map((_, i) => (
              <Skeleton key={i} className="aspect-square rounded-lg" />
            ))}

        {/* Infinite scroll trigger */}
        <div ref={ref} className="col-span-3 h-4" />

        {!isLoadingUserImages && userImagesData?.pages[0]?.length === 0 && (
          <div className="col-span-3 flex flex-col items-center justify-center py-12 text-muted-foreground">
            <p>No generated images found.</p>
          </div>
        )}
      </div>
    </ScrollArea>
  );
}
