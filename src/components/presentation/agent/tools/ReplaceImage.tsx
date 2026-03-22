"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  executeToolAction,
  getSlidesToUpdate,
} from "@/hooks/presentation/agentTools";
import { ImageIcon, Loader2, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

type Scope = "all" | undefined;

export function PresentationReplaceImageCall({
  imageUrl,
  imagePrompt,
  scope,
  slideIds,
  loading,
}: {
  imageUrl?: string;
  imagePrompt?: string;
  scope?: Scope;
  slideIds?: string[];
  loading?: boolean;
}) {
  const [url, setUrl] = useState(imageUrl ?? "");
  const [prompt, setPrompt] = useState(imagePrompt ?? "");
  const [isEditing, setIsEditing] = useState(false);

  const targetSlides = useMemo(
    () => getSlidesToUpdate(scope, slideIds),
    [scope, slideIds],
  );

  const isImageUrl = useMemo(() => {
    if (!url) {
      return false;
    }

    return /\.(jpg|jpeg|png|gif|webp)$/i.test(url);
  }, [url]);

  useEffect(() => {
    if (!imageUrl && !imagePrompt) {
      return;
    }

    setUrl(imageUrl ?? "");
    setPrompt(imagePrompt ?? "");
  }, [imageUrl, imagePrompt]);

  const apply = () => {
    if (!url && !prompt) {
      return;
    }

    try {
      executeToolAction({
        action: "replace_image",
        scope,
        slideIds: scope === "all" ? undefined : targetSlides,
        ...(url ? { imageUrl: url } : {}),
        ...(prompt ? { imagePrompt: prompt } : {}),
      });
    } catch (error) {
      console.error("Error replacing image:", error);
    } finally {
      setIsEditing(false);
    }
  };

  const slideCount = targetSlides?.length ?? 0;

  if (!imageUrl && !imagePrompt && !url && !prompt) {
    return (
      <div className="w-full rounded-lg border bg-card p-3">
        <div className="flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            Updating image...
          </span>
        </div>
      </div>
    );
  }

  if (isEditing) {
    return (
      <div className="space-y-4 rounded-lg border bg-card p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ImageIcon className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Edit Image</span>
            <span className="text-xs text-muted-foreground">
              ({slideCount} slide{slideCount !== 1 ? "s" : ""})
            </span>
          </div>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setIsEditing(false)}
            className="h-7 w-7 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label className="text-xs">Image URL</Label>
            <Input
              value={url}
              onChange={(event) => setUrl(event.target.value || "")}
              placeholder="https://example.com/image.jpg"
              className="h-9"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">Or Generate with Prompt</Label>
            <Textarea
              value={prompt}
              onChange={(event) => setPrompt(event.target.value || "")}
              placeholder="A modern abstract background..."
              className="min-h-[60px] resize-none"
            />
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            size="sm"
            onClick={apply}
            disabled={loading || (!url && !prompt)}
            className="flex-1"
          >
            Apply
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setIsEditing(false)}
            className="flex-1"
          >
            Cancel
          </Button>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={() => setIsEditing(true)}
      disabled={loading}
      className="w-full rounded-lg border bg-card p-4 text-left transition-colors hover:bg-accent/50 disabled:opacity-60"
    >
      <div className="flex items-center justify-between">
        <div className="flex min-w-0 items-center gap-3">
          <ImageIcon className="h-4 w-4 shrink-0 text-muted-foreground" />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Image</span>
              <span className="text-xs text-muted-foreground">
                {slideCount} slide{slideCount !== 1 ? "s" : ""}
              </span>
            </div>
            {url ? (
              <div className="mt-1 flex items-center gap-2">
                {isImageUrl ? (
                  // biome-ignore lint/performance/noImgElement: Dynamic preview in tool message
                  <img
                    src={url}
                    alt="Preview"
                    className="h-8 w-8 rounded object-cover"
                  />
                ) : null}
                <span className="line-clamp-1 text-xs text-muted-foreground">
                  {url}
                </span>
              </div>
            ) : prompt ? (
              <p className="mt-1 line-clamp-1 max-w-full text-xs text-muted-foreground">
                Generated: {prompt}
              </p>
            ) : (
              <p className="mt-1 text-xs text-muted-foreground">No image set</p>
            )}
          </div>
        </div>
      </div>
    </button>
  );
}

export function PresentationReplaceImageResult({
  message,
}: {
  message?: string;
}) {
  return (
    <div className="rounded-lg border border-green-200 bg-green-50 px-3 py-2 dark:border-green-900 dark:bg-green-950/20">
      <span className="text-sm text-green-900 dark:text-green-100">
        {message ?? "Image updated"}
      </span>
    </div>
  );
}
