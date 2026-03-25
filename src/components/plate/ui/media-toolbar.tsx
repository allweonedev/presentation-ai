"use client";

import * as React from "react";

import { KEYS, type WithRequiredKey } from "platejs";

import {
  FloatingMedia as FloatingMediaPrimitive,
  FloatingMediaStore,
  useFloatingMediaValue,
  useImagePreviewValue,
} from "@platejs/media/react";
import { cva } from "class-variance-authority";
import { Link, Trash2Icon, X } from "lucide-react";
import {
  useEditorRef,
  useEditorSelector,
  useElement,
  useReadOnly,
  useRemoveNodeButton,
  useSelected,
} from "platejs/react";

import { Button, buttonVariants } from "@/components/plate/ui/button";
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
} from "@/components/plate/ui/popover";
import { Separator } from "@/components/plate/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { TooltipButton } from "@/components/ui/button";
import { CaptionButton } from "./caption";
import { getAllEmbedTypes } from "./media-embeds";

const inputVariants = cva(
  "flex h-[28px] w-full rounded-md border-none bg-transparent px-1.5 py-1 text-base placeholder:text-muted-foreground focus-visible:ring-transparent focus-visible:outline-hidden md:text-sm",
);

export function MediaToolbar({
  children,
  plugin,
}: {
  children: React.ReactNode;
  plugin: WithRequiredKey;
}) {
  const editor = useEditorRef();
  const readOnly = useReadOnly();
  const selected = useSelected();

  const selectionCollapsed = useEditorSelector(
    (editor) => !editor.api.isExpanded(),
    [],
  );
  const isImagePreviewOpen = useImagePreviewValue("isOpen", editor.id);
  const isOpen =
    !readOnly && selected && selectionCollapsed && !isImagePreviewOpen;
  const isEditing = useFloatingMediaValue("isEditing");

  React.useEffect(() => {
    if (!isOpen && isEditing) {
      FloatingMediaStore.set("isEditing", false);
    }
  }, [isOpen]);

  const element = useElement();
  const { props: buttonProps } = useRemoveNodeButton({ element });

  // Check if this is a MediaEmbed element
  const isMediaEmbed = element.type === KEYS.mediaEmbed;

  // Get current provider for MediaEmbed elements
  const currentProvider = isMediaEmbed
    ? (element as { provider?: string }).provider || ""
    : "";

  // Get all available embed types
  const embedTypes = getAllEmbedTypes();

  // Handle provider change for MediaEmbed
  const handleProviderChange = (newProvider: string) => {
    if (isMediaEmbed && editor && element) {
      const path = editor.api.findPath(element);
      if (path) {
        editor.tf.setNodes(
          {
            ...element,
            provider: newProvider,
            url: "", // Clear URL when changing provider
            id: "", // Clear ID when changing provider
          },
          { at: path },
        );
      }
    }
  };

  // Handle URL removal for MediaEmbed
  const handleRemoveUrl = () => {
    if (isMediaEmbed && editor && element) {
      const path = editor.api.findPath(element);
      if (path) {
        editor.tf.setNodes(
          {
            ...element,
            url: "",
            id: "",
          },
          { at: path },
        );
      }
    }
  };

  if (readOnly) return <>{children}</>;

  return (
    <Popover open={isOpen} modal={false}>
      <PopoverAnchor>{children}</PopoverAnchor>

      <PopoverContent
        className="w-auto p-1"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        {isEditing ? (
          <div className="flex w-[330px] flex-col">
            <div className="flex items-center">
              <div className="flex items-center pr-1 pl-2 text-muted-foreground">
                <Link className="size-4" />
              </div>

              <FloatingMediaPrimitive.UrlInput
                className={inputVariants()}
                placeholder="Paste the embed link..."
                options={{ plugin }}
              />
            </div>
          </div>
        ) : (
          <div className="box-content flex items-center">
            <FloatingMediaPrimitive.EditButton
              className={buttonVariants({ size: "sm", variant: "ghost" })}
            >
              Edit link
            </FloatingMediaPrimitive.EditButton>

            <CaptionButton size="sm" variant="ghost">
              Caption
            </CaptionButton>

            {/* MediaEmbed specific options */}
            {isMediaEmbed && (
              <>
                <Separator orientation="vertical" className="mx-1 h-6" />

                {/* Change Provider Dropdown */}
                <Select
                  value={currentProvider}
                  onValueChange={handleProviderChange}
                >
                  <SelectTrigger className="flex h-8 w-auto min-w-[120px] items-center border-none bg-transparent px-2 py-1 text-sm">
                    <SelectValue placeholder="Provider" />
                  </SelectTrigger>
                  <SelectContent>
                    {embedTypes.map(({ type, config }) => (
                      <SelectItem key={type} value={type}>
                        {config.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Remove URL Button */}
                <TooltipButton
                  size="sm"
                  tooltipText="Remove URL"
                  variant="ghost"
                  onClick={handleRemoveUrl}
                >
                  <X className="h-4 w-4" />
                </TooltipButton>
              </>
            )}

            <Separator orientation="vertical" className="mx-1 h-6" />

            <Button size="sm" variant="ghost" {...buttonProps}>
              <Trash2Icon />
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
