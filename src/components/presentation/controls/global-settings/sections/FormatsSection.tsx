"use client";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Globe2 as GlobeIcon, Monitor, Smartphone } from "lucide-react";
import { useMemo } from "react";
import { VscLayers } from "react-icons/vsc";
import { useCommonValues } from "../hooks/useCommonValues";
import { useUpdateAllSlides } from "../hooks/useUpdateAllSlides";

export function FormatsSection() {
  const { currentFormatCategory, currentAspectRatio } = useCommonValues();
  const updateAllSlides = useUpdateAllSlides();

  // aspect options per top-level format
  const aspectOptions = useMemo(() => {
    if (currentFormatCategory === "presentation") {
      return [
        { value: "fluid", label: "Default", sub: "Fluid", icon: "monitor" },
        { value: "16:9", label: "Traditional", sub: "16:9", icon: "monitor" },
        { value: "tall", label: "Tall", sub: "85vh", icon: "smartphone" },
      ];
    }
    if (currentFormatCategory === "webpage") {
      return [
        {
          value: "fluid",
          label: "Fluid",
          sub: "Responsive width",
          icon: "globe",
        },
        {
          value: "16:9",
          label: "16:9 (wide section)",
          sub: "16:9",
          icon: "monitor",
        },
        { value: "A4", label: "A4", sub: "210×297mm", icon: "monitor" },
      ];
    }
    if (currentFormatCategory === "social") {
      return [
        { value: "1:1", label: "Square", sub: "1:1", icon: "monitor" },
        { value: "4:5", label: "Portrait", sub: "4:5", icon: "smartphone" },
        { value: "9:16", label: "Story", sub: "9:16", icon: "smartphone" },
      ];
    }
    // document
    return [
      { value: "A4", label: "A4", sub: "210×297mm", icon: "monitor" },
      { value: "Letter", label: "Letter", sub: "8.5×11in", icon: "monitor" },
    ];
  }, [currentFormatCategory]);

  const currentAspectValue = useMemo(() => {
    // Figure out the actual aspect value based on currentAspectRatio
    if (!currentAspectRatio) {
      // Defaults: presentation/fluid, social/1:1, document/A4, webpage/fluid
      if (
        currentFormatCategory === "presentation" ||
        currentFormatCategory === "webpage"
      )
        return "fluid";
      if (currentFormatCategory === "social") return "1:1";
      return "A4";
    }
    if (currentAspectRatio.type === "fluid") return "fluid";
    if (currentAspectRatio.type === "tall") return "tall";
    if (currentAspectRatio.type === "preset")
      return currentAspectRatio.value ?? "A4";
    if (currentAspectRatio.type === "ratio")
      return currentAspectRatio.value ?? "16:9";
    return "fluid";
  }, [currentAspectRatio, currentFormatCategory]);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <VscLayers className="h-4 w-4 text-muted-foreground" />
          Format
        </label>
        <Select
          value={currentFormatCategory}
          onValueChange={(val) => {
            // Types now allow for 'webpage'
            const category = val as
              | "presentation"
              | "social"
              | "document"
              | "webpage";
            // Enforce aspect ratio defaults for each category
            if (category === "presentation") {
              updateAllSlides({
                formatCategory: category,
                aspectRatio: { type: "fluid" },
              });
            } else if (category === "webpage") {
              updateAllSlides({
                formatCategory: category,
                aspectRatio: { type: "fluid" },
              });
            } else if (category === "social") {
              updateAllSlides({
                formatCategory: category,
                aspectRatio: { type: "ratio", value: "1:1" },
              });
            } else {
              // document
              updateAllSlides({
                formatCategory: category,
                aspectRatio: { type: "preset", value: "A4" },
              });
            }
          }}
        >
          <SelectTrigger className="rounded-full">
            <SelectValue placeholder="Choose format" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Format</SelectLabel>
              <SelectItem value="presentation">Presentation</SelectItem>
              {/* <SelectItem value="webpage">Webpage</SelectItem> */}
              <SelectItem value="document">Document</SelectItem>
              <SelectItem value="social">Social</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {aspectOptions.map((o) => {
            const active = currentAspectValue === o.value;
            let Icon;
            if (o.icon === "globe") {
              Icon = GlobeIcon;
            } else if (o.icon === "smartphone") {
              Icon = Smartphone;
            } else {
              Icon = Monitor;
            }

            const onSelect = () => {
              // "fluid" and "tall" aspect ratio
              if (o.value === "fluid") {
                updateAllSlides({ aspectRatio: { type: "fluid" } });
              } else if (o.value === "tall") {
                updateAllSlides({ aspectRatio: { type: "tall" } });
              } else if (o.value === "A4" || o.value === "Letter") {
                updateAllSlides({
                  aspectRatio: { type: "preset", value: o.value },
                });
              } else {
                updateAllSlides({
                  aspectRatio: { type: "ratio", value: o.value },
                });
              }
            };
            return (
              <button
                key={o.value}
                type="button"
                onClick={onSelect}
                className={cn(
                  "w-full rounded-xl border p-4 text-left transition-colors",
                  active
                    ? "border-primary bg-muted/30 ring-1 ring-primary"
                    : "border-border hover:bg-muted/20",
                )}
              >
                <div className="flex h-full flex-col items-start gap-2">
                  <Icon
                    className={cn(
                      "h-5 w-5",
                      active ? "text-primary" : "text-muted-foreground",
                    )}
                  />
                  <div className="text-base font-semibold">{o.label}</div>
                  <div className="text-sm text-muted-foreground">{o.sub}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
