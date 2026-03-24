"use client";

import { Button } from "@/components/ui/button";
import ColorPicker from "@/components/ui/color-picker";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  executeToolAction,
  getSlidesToUpdate,
} from "@/hooks/presentation/agentTools";
import { Loader2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

type Scope = "all" | undefined;

export function PresentationEditSlidePropertiesCall({
  scope,
  slideIds,
  bgColor,
  alignment,
  layoutType,
  width,
  loading,
}: {
  scope?: Scope;
  slideIds?: string[];
  bgColor?: string;
  alignment?: "start" | "center" | "end";
  layoutType?: "left" | "right" | "vertical" | "background";
  width?: "S" | "M" | "L";
  loading?: boolean;
}) {
  const [form, setForm] = useState({
    bgColor: bgColor ?? "",
    alignment: alignment ?? undefined,
    layoutType: layoutType ?? undefined,
    width: width ?? undefined,
  } as {
    bgColor: string;
    alignment?: "start" | "center" | "end";
    layoutType?: "left" | "right" | "vertical" | "background";
    width?: "S" | "M" | "L";
  });

  useEffect(() => {
    if (!bgColor && !alignment && !layoutType && !width) {
      return;
    }

    setForm({
      bgColor: bgColor ?? "",
      alignment: alignment ?? undefined,
      layoutType: layoutType ?? undefined,
      width: width ?? undefined,
    });
  }, [bgColor, alignment, layoutType, width]);

  const targetSlides = useMemo(
    () => getSlidesToUpdate(scope, slideIds),
    [scope, slideIds],
  );

  const [isEditing, setIsEditing] = useState(false);

  const apply = () => {
    executeToolAction({
      action: "edit_slide_properties",
      scope,
      slideIds: scope === "all" ? undefined : targetSlides,
      ...(form.bgColor ? { bgColor: form.bgColor } : {}),
      ...(form.alignment ? { alignment: form.alignment } : {}),
      ...(form.layoutType ? { layoutType: form.layoutType } : {}),
      ...(form.width ? { width: form.width } : {}),
    });
    setIsEditing(false);
  };

  const slideCount =
    scope === "all" || (!scope && (!targetSlides || targetSlides.length === 0))
      ? "all"
      : (targetSlides?.length ?? 0);

  const summaryText = useMemo(() => {
    const parts: string[] = [];

    if (form.bgColor) {
      parts.push(`background to ${form.bgColor}`);
    }
    if (form.layoutType) {
      parts.push(`layout to ${form.layoutType}`);
    }
    if (form.width) {
      const widthWord =
        form.width === "S" ? "small" : form.width === "M" ? "medium" : "large";
      parts.push(`width to ${widthWord}`);
    }
    if (form.alignment) {
      const alignmentWord =
        form.alignment === "center"
          ? "aligned content to centered"
          : form.alignment === "start"
            ? "aligned content to left"
            : "aligned content to right";
      parts.push(alignmentWord);
    }

    if (parts.length === 0) {
      return "No changes selected";
    }

    if (parts.length === 1) {
      const onlyPart = parts[0] ?? "";
      return onlyPart.charAt(0).toUpperCase() + onlyPart.slice(1);
    }

    const lastPart = parts[parts.length - 1] ?? "";
    const body = `Updated ${parts.slice(0, -1).join(", ")} and ${lastPart}`;
    return body.charAt(0).toUpperCase() + body.slice(1);
  }, [form]);

  if (
    !bgColor &&
    !alignment &&
    !layoutType &&
    !width &&
    !form.bgColor &&
    !form.alignment &&
    !form.layoutType &&
    !form.width
  ) {
    return (
      <div className="w-full rounded-lg border bg-card p-3">
        <div className="flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            Updating presentation...
          </span>
        </div>
      </div>
    );
  }

  if (isEditing) {
    return (
      <div className="space-y-3 rounded-lg border bg-card p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium">Edit Slide Properties</h3>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setIsEditing(false)}
            className="h-7 text-xs"
          >
            Cancel
          </Button>
        </div>

        <div className="grid gap-3">
          <div className="space-y-1.5">
            <Label className="text-xs">Background</Label>
            <ColorPicker
              value={form.bgColor || "#ffffff"}
              onChange={(value) =>
                setForm((current) => ({ ...current, bgColor: value || "" }))
              }
            >
              <Button
                variant="outline"
                className="h-9 w-full justify-start gap-2 bg-transparent font-mono text-xs"
              >
                <div
                  className="h-4 w-4 rounded border"
                  style={{ backgroundColor: form.bgColor || "#ffffff" }}
                />
                {form.bgColor || "Select color"}
              </Button>
            </ColorPicker>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Layout</Label>
              <Select
                value={form.layoutType}
                onValueChange={(value) =>
                  setForm((current) => ({
                    ...current,
                    layoutType: value as typeof current.layoutType,
                  }))
                }
              >
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="left">Left</SelectItem>
                  <SelectItem value="right">Right</SelectItem>
                  <SelectItem value="vertical">Vertical</SelectItem>
                  <SelectItem value="background">Background</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs">Width</Label>
              <Select
                value={form.width}
                onValueChange={(value) =>
                  setForm((current) => ({
                    ...current,
                    width: value as typeof current.width,
                  }))
                }
              >
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="S">S</SelectItem>
                  <SelectItem value="M">M</SelectItem>
                  <SelectItem value="L">L</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">Alignment</Label>
            <Select
              value={form.alignment}
              onValueChange={(value) =>
                setForm((current) => ({
                  ...current,
                  alignment: value as typeof current.alignment,
                }))
              }
            >
              <SelectTrigger className="h-9">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="start">Start</SelectItem>
                <SelectItem value="center">Center</SelectItem>
                <SelectItem value="end">End</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button size="sm" onClick={apply} disabled={loading} className="mt-1">
            Apply to {slideCount} {slideCount === 1 ? "slide" : "slides"}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={() => setIsEditing(true)}
      disabled={loading}
      className="w-full rounded-lg border bg-card p-3 text-left transition-colors hover:bg-accent/50 disabled:opacity-60"
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          {form.bgColor ? (
            <div
              className="h-4 w-4 rounded border shadow-2xs"
              style={{ backgroundColor: form.bgColor }}
            />
          ) : null}
          <span className="truncate text-sm">{summaryText}</span>
          <span className="shrink-0 text-xs text-muted-foreground">
            ({slideCount} {slideCount === 1 ? "slide" : "slides"})
          </span>
        </div>
      </div>
    </button>
  );
}

export function PresentationEditSlidePropertiesResult({
  message,
}: {
  message?: string;
}) {
  return (
    <div className="rounded-lg border border-green-200 bg-green-50 px-3 py-2 dark:border-green-900 dark:bg-green-950/20">
      <span className="text-sm text-green-900 dark:text-green-100">
        {message ?? "Slide properties updated"}
      </span>
    </div>
  );
}
