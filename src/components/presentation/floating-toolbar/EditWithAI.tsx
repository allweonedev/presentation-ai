"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useCompletion } from "@ai-sdk/react";
import { Loader2, Send } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

interface EditWithAIProps {
  currentSyntax: string;
  onSyntaxChange: (newSyntax: string) => void;
  onClose: () => void;
}

const QUICK_SUGGESTIONS = [
  { label: "Add more items", icon: "➕" },
  { label: "Change title", icon: "✏️" },
  { label: "Make it simpler", icon: "✨" },
  { label: "Hand-drawn style", icon: "🎨" },
];

export function EditWithAI({
  currentSyntax,
  onSyntaxChange,
  onClose,
}: EditWithAIProps) {
  const [prompt, setPrompt] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const { completion, complete, isLoading, error, stop } = useCompletion({
    api: "/api/presentation/edit-diagram",
    onFinish: (_prompt, finalCompletion) => {
      if (finalCompletion.trim()) {
        onSyntaxChange(finalCompletion);
      }
      setPrompt("");
    },
    onError: (err) => {
      console.error("Edit diagram error:", err);
    },
  });

  useEffect(() => {
    if (completion?.trim()) {
      onSyntaxChange(completion);
    }
  }, [completion, onSyntaxChange]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = useCallback(() => {
    if (!prompt.trim() || isLoading) return;

    void complete(prompt, {
      body: {
        currentSyntax,
        prompt: prompt.trim(),
      },
    });
  }, [prompt, isLoading, complete, currentSyntax]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSubmit();
      }
      if (e.key === "Escape") {
        if (isLoading) {
          stop();
        } else {
          onClose();
        }
      }
    },
    [handleSubmit, isLoading, stop, onClose],
  );

  return (
    <div className="ignore-click-outside/toolbar w-[320px] overflow-hidden rounded-2xl border border-border/70 bg-popover shadow-lg">
      {/* Input Area */}
      <div className="space-y-3 p-3">
        <div className="group relative">
          {/* focus halo (no gradients) - keep your focus behavior class */}
          <div
            className={cn(
              "absolute -inset-px rounded-xl bg-primary/20 opacity-0 blur-xs transition-opacity duration-300",
              "group-focus-within:opacity-100",
            )}
          />

          <div className="relative overflow-hidden rounded-xl border border-border/60 bg-card shadow-xs">
            <textarea
              ref={inputRef}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="What would you like to change?"
              disabled={isLoading}
              className={cn(
                "max-h-[140px] min-h-[72px] w-full resize-none bg-transparent px-3 py-2.5 text-sm",
                "placeholder:text-muted-foreground/60 focus:outline-hidden",
                "disabled:cursor-not-allowed disabled:opacity-50",
              )}
              rows={3}
            />

            <div className="flex items-center justify-between border-t border-border/40 bg-muted/20 px-3 py-2">
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-muted-foreground/70">
                  Press Enter to send
                </span>
                <span className="text-[10px] text-muted-foreground/50">•</span>
                <span className="text-[10px] text-muted-foreground/70">
                  Esc {isLoading ? "cancels" : "closes"}
                </span>
              </div>

              <Button
                size="icon"
                variant={prompt.trim() && !isLoading ? "default" : "ghost"}
                className={cn(
                  "h-7 w-7 rounded-lg transition-all duration-200",
                  prompt.trim() && !isLoading
                    ? "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90"
                    : "text-muted-foreground hover:text-foreground",
                )}
                disabled={!prompt.trim() || isLoading}
                onClick={handleSubmit}
              >
                {isLoading ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Send className="h-3.5 w-3.5" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-between rounded-lg border border-border/60 bg-muted/30 px-3 py-2.5">
            <div className="flex items-center gap-2">
              <div className="relative">
                <div className="absolute inset-0 animate-ping rounded-full bg-muted/40" />
                <Loader2 className="relative h-4 w-4 animate-spin text-foreground" />
              </div>
              <span className="text-xs font-medium text-foreground">
                Editing diagram...
              </span>
            </div>
            <button
              type="button"
              onClick={stop}
              className="text-xs font-medium text-muted-foreground transition-colors hover:text-destructive"
            >
              Cancel
            </button>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="flex items-center gap-2 rounded-lg border border-destructive/20 bg-destructive/10 px-3 py-2.5 text-destructive">
            <span className="text-xs font-medium">
              Failed to edit. Please try again.
            </span>
          </div>
        )}

        {/* Quick Suggestions */}
        {!isLoading && (
          <div className="space-y-2">
            <span className="px-1 text-[10px] font-medium tracking-wider text-muted-foreground/70 uppercase">
              Quick suggestions
            </span>

            {/* chips feel better than “mini cards”, but keep your layout */}
            <div className="grid grid-cols-2 gap-1.5">
              {QUICK_SUGGESTIONS.map((suggestion) => (
                <button
                  key={suggestion.label}
                  type="button"
                  onClick={() => setPrompt(suggestion.label)}
                  className={cn(
                    "flex items-center gap-2 rounded-lg px-3 py-2 text-left transition-all duration-200",
                    "border border-transparent bg-muted/30 hover:border-border/50 hover:bg-muted",
                    "text-xs font-medium text-muted-foreground hover:text-foreground",
                    "hover:shadow-xs",
                    "active:scale-[0.99]",
                  )}
                >
                  <span className="opacity-80">{suggestion.icon}</span>
                  <span className="truncate">{suggestion.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
