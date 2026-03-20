"use client";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDebouncedSave } from "@/hooks/presentation/useDebouncedSave";
import { usePresentationState } from "@/states/presentation-state";
import { Globe, ImageIcon, Images, Search, X } from "lucide-react";
import { type TElement } from "platejs";
import { useEditorRef } from "platejs/react";
import { useEffect, useState } from "react";
import { type RootImage as RootImageType } from "../../utils/parser";
import { type ImageCropSettings } from "../../utils/types";
import { ErrorDisplay, GenerateControls } from "./image-editor";
import { CropModal } from "./image-editor/CropModal";
import { EmbedControls } from "./image-editor/EmbedControls";
import { ImageSearchControls } from "./image-editor/ImageSearchControls";
import { useImageDimensions } from "./image-editor/useImageDimensions";
import { YourImagesControls } from "./image-editor/YourImagesControls";

export interface PresentationImageEditorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  element: TElement & RootImageType;
  layoutType: string;
  slideId?: string;
  isRootImage?: boolean;
  initialMode?: EditorMode;
}

export type EditorMode = "generate" | "your-images" | "embed" | "search";

export const PresentationImageEditor = ({
  open,
  onOpenChange,
  element,
  layoutType,
  slideId,
  isRootImage = false,
  initialMode,
}: PresentationImageEditorProps) => {
  const editor = useEditorRef();
  const { saveImmediately } = useDebouncedSave();
  // Initialize mode based on element state
  const [currentMode, setCurrentMode] = useState<EditorMode>(
    initialMode ?? (element.embedType ? "embed" : "generate"),
  );

  // Keep mode in sync when opening with an explicit initialMode
  useEffect(() => {
    if (open && initialMode) {
      setCurrentMode(initialMode);
    }
  }, [open, initialMode]);

  const setSlides = usePresentationState((s) => s.setSlides);
  const slides = usePresentationState((s) => s.slides);

  const [isCropModalOpen, setIsCropModalOpen] = useState(false);

  // Use the custom hook for dimension calculations
  const imageDimensions = useImageDimensions({
    element,
    slideId,
    layoutType,
  });

  const handleEmbedChange = (embedType: string, url: string) => {
    if (isRootImage) {
      setSlides(
        slides.map((slide) =>
          slide.id === slideId
            ? {
                ...slide,
                rootImage: {
                  ...slide.rootImage!,
                  embedType,
                  url,
                },
              }
            : slide,
        ),
      );
      void saveImmediately();
    } else {
      editor.tf.setNodes({
        ...element,
        embedType,
        url,
      });
      void saveImmediately();
    }
  };

  const handleClearEmbed = () => {
    if (isRootImage) {
      setSlides(
        slides.map((slide) =>
          slide.id === slideId
            ? {
                ...slide,
                rootImage: {
                  ...slide.rootImage!,
                  embedType: undefined,
                  url: undefined,
                },
              }
            : slide,
        ),
      );
      void saveImmediately();
    } else {
      editor.tf.setNodes({
        ...element,
        embedType: undefined,
        url: undefined,
      });
      void saveImmediately();
    }
    setCurrentMode("generate");
  };

  const handleCropSave = (settings: ImageCropSettings) => {
    if (isRootImage) {
      setSlides(
        slides.map((slide) =>
          slide.id === slideId
            ? {
                ...slide,
                rootImage: {
                  ...slide.rootImage!,
                  cropSettings: settings,
                },
              }
            : slide,
        ),
      );
      void saveImmediately();
    } else {
      editor.tf.setNodes({
        ...element,
        cropSettings: settings,
      });
      void saveImmediately();
    }
    setIsCropModalOpen(false);
  };

  const handleTabChange = (value: string) => {
    const newMode = value as EditorMode;
    setCurrentMode(newMode);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange} modal={false}>
      <SheetContent
        onInteractOutside={(e) => e.preventDefault()}
        overlay={false}
        className="max-w-auto! static! top-0 bottom-0 grid max-h-full w-96! max-w-md grid-rows-[auto_1fr] gap-0 overflow-hidden p-0 px-0 pb-4"
        container={
          typeof window === "undefined"
            ? undefined
            : typeof document !== "undefined"
              ? (document.querySelector<HTMLElement>(
                  ".presentation-sheets-portal",
                ) ?? undefined)
              : undefined
        }
      >
        {/* Header */}
        <SheetHeader className="flex flex-row items-center justify-between space-y-0 border-b px-4 py-2">
          <SheetTitle>Image Studio</SheetTitle>

          <SheetClose asChild>
            <Button variant="ghost" className="size-8! rounded-full p-0">
              <X className="size-5!" />
            </Button>
          </SheetClose>
        </SheetHeader>

        {/* Main Content */}
        <Tabs
          value={currentMode}
          onValueChange={handleTabChange}
          className="grid min-h-0 grid-rows-[auto_auto_1fr] bg-background"
        >
          <div className="px-6 py-2">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="generate" className="text-xs">
                <ImageIcon className="mr-2 h-3.5 w-3.5" />
                Gen
              </TabsTrigger>
              <TabsTrigger value="your-images" className="text-xs">
                <Images className="mr-2 h-3.5 w-3.5" />
                Yours
              </TabsTrigger>
              <TabsTrigger value="search" className="text-xs">
                <Search className="mr-2 h-3.5 w-3.5" />
                Search
              </TabsTrigger>
              <TabsTrigger value="embed" className="text-xs">
                <Globe className="mr-2 h-3.5 w-3.5" />
                Embed
              </TabsTrigger>
            </TabsList>
          </div>

          <Separator />

          <div className="min-h-0 overflow-hidden">
            <ErrorDisplay error={undefined} localError={null} />

            <TabsContent
              value="generate"
              className="mt-0 flex h-full flex-col data-[state=inactive]:hidden"
            >
              <div className="flex-none space-y-1 px-6 py-4">
                <h3 className="leading-none font-medium">Generate Image</h3>
                <p className="text-sm text-muted-foreground">
                  Create unique images using AI.
                </p>
              </div>
              <div className="min-h-0 flex-1 overflow-y-auto px-6 pb-6">
                <GenerateControls
                  element={element}
                  slideId={slideId}
                  isRootImage={isRootImage}
                  onOpenCrop={() => setIsCropModalOpen(true)}
                  imageDimensions={imageDimensions}
                />
              </div>
            </TabsContent>

            <TabsContent
              value="your-images"
              className="mt-0 flex h-full flex-col data-[state=inactive]:hidden"
            >
              <div className="flex-none space-y-1 px-6 py-4">
                <h3 className="leading-none font-medium">Your Images</h3>
                <p className="text-sm text-muted-foreground">
                  Select from your generated images.
                </p>
              </div>
              <div className="flex min-h-0 flex-1 flex-col overflow-hidden px-6 pb-6">
                <YourImagesControls
                  element={element}
                  slideId={slideId}
                  isRootImage={isRootImage}
                />
              </div>
            </TabsContent>

            <TabsContent
              value="search"
              className="mt-0 flex h-full flex-col data-[state=inactive]:hidden"
            >
              <div className="flex-none space-y-1 px-6 py-4">
                <h3 className="leading-none font-medium">Search Images</h3>
                <p className="text-sm text-muted-foreground">
                  Find images from Unsplash or Pixabay.
                </p>
              </div>
              <div className="flex min-h-0 flex-1 flex-col overflow-hidden px-6 pb-6">
                <ImageSearchControls
                  element={element}
                  slideId={slideId}
                  isRootImage={isRootImage}
                />
              </div>
            </TabsContent>

            <TabsContent
              value="embed"
              className="mt-0 h-full data-[state=inactive]:hidden"
            >
              <ScrollArea className="h-full">
                <div className="space-y-6 p-6">
                  <div className="space-y-1">
                    <h3 className="leading-none font-medium">Embed Content</h3>
                    <p className="text-sm text-muted-foreground">
                      Embed videos, tweets, or other content.
                    </p>
                  </div>
                  <EmbedControls
                    embedType={element.embedType}
                    embedUrl={element.url}
                    onEmbedChange={handleEmbedChange}
                    onClearEmbed={handleClearEmbed}
                    imageDimensions={imageDimensions}
                  />
                </div>
              </ScrollArea>
            </TabsContent>
          </div>
        </Tabs>

        {element.url && (
          <CropModal
            open={isCropModalOpen}
            onOpenChange={setIsCropModalOpen}
            imageUrl={element.url}
            initialCropSettings={{
              objectFit: element.cropSettings?.objectFit ?? "cover",
              objectPosition: {
                x: element.cropSettings?.objectPosition.x ?? 50,
                y: element.cropSettings?.objectPosition.y ?? 50,
              },
              zoom: element.cropSettings?.zoom ?? 1,
            }}
            onSave={handleCropSave}
            imageDimensions={imageDimensions}
          />
        )}
      </SheetContent>
    </Sheet>
  );
};
