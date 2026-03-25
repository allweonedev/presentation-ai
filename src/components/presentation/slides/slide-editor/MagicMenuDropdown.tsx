"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ArrowDown,
  ArrowRight,
  Check,
  Globe,
  ImageIcon,
  PenTool,
  Plus,
  Sparkles,
} from "lucide-react";
import { useSlideEditorContext } from "./SlideEditorContext";

export function MagicMenuDropdown() {
  const {
    aiInput,
    setAiInput,
    handleAiSubmit,
    handleAiKeyDown,
    handleImageEdit,
  } = useSlideEditorContext();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="size-8! gap-1 rounded-full border border-white/20 bg-background/50 shadow-xs backdrop-blur-md transition-all hover:bg-background/80"
        >
          <Sparkles className="h-4 w-4 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-80 p-4">
        {/* Edit this card header */}
        <div className="mb-4">
          <h3 className="mb-3 text-base font-semibold">Edit this card</h3>

          {/* Edit input */}
          <div className="flex items-center gap-2 rounded-lg border-2 border-primary bg-primary/5 p-3">
            <input
              type="text"
              value={aiInput}
              onChange={(e) => setAiInput(e.target.value)}
              onKeyDown={handleAiKeyDown}
              placeholder="How would you like to edit this card?"
              className="flex-1 bg-transparent text-sm text-foreground placeholder-muted-foreground outline-hidden"
            />
            <button
              onClick={() => handleAiSubmit()}
              disabled={!aiInput.trim()}
              className="rounded-full p-1.5 hover:bg-accent disabled:cursor-not-allowed disabled:opacity-50"
            >
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>
        </div>

        {/* Try new layout */}
        <button className="mb-4 flex w-full items-center gap-2 rounded-lg px-3 py-2 hover:bg-accent">
          <Sparkles className="h-4 w-4" />
          <span className="text-sm font-medium">Try new layout</span>
        </button>

        <DropdownMenuSeparator />

        {/* Writing section */}
        <div className="mt-3 mb-4">
          <h4 className="mb-2 text-xs font-semibold text-muted-foreground uppercase">
            Writing
          </h4>
          <div className="mb-2 grid grid-cols-2 gap-2">
            <button className="flex items-center gap-2 rounded-lg bg-secondary px-3 py-2 text-sm hover:bg-accent">
              <PenTool className="h-4 w-4" />
              Improve writing
            </button>
            <button className="flex items-center gap-2 rounded-lg bg-secondary px-3 py-2 text-sm hover:bg-accent">
              <Check className="h-4 w-4" />
              Fix spelling
            </button>
            <button className="flex items-center gap-2 rounded-lg bg-secondary px-3 py-2 text-sm hover:bg-accent">
              <Globe className="h-4 w-4" />
              Translate
            </button>
            <button className="flex items-center gap-2 rounded-lg bg-secondary px-3 py-2 text-sm hover:bg-accent">
              <ArrowDown className="h-4 w-4" />
              Simplify
            </button>
          </div>
        </div>

        {/* Image section */}
        <div>
          <h4 className="mb-2 text-xs font-semibold text-muted-foreground uppercase">
            Image
          </h4>
          <div className="grid grid-cols-2 gap-2">
            <button className="flex items-center gap-2 rounded-lg bg-secondary px-3 py-2 text-sm hover:bg-accent">
              <ImageIcon className="h-4 w-4" />
              Make visual
            </button>
            <button
              className="flex items-center gap-2 rounded-lg bg-secondary px-3 py-2 text-sm hover:bg-accent"
              onClick={handleImageEdit}
            >
              <Plus className="h-4 w-4" />
              Add image
            </button>
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
