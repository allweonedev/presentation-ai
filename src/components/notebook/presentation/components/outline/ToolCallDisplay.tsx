import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { usePresentationState } from "@/states/presentation-state";
import { Loader2, Search } from "lucide-react";
import { useEffect, useState } from "react";

export function ToolCallDisplay() {
  const {
    searchResults,
    isGeneratingOutline,
    webSearchEnabled,
    outline,
  } = usePresentationState();
  const [isExpanded, setIsExpanded] = useState(false);
  const hasOutline = outline.some((item) => item.trim().length > 0);

  // Show tool call display when any tool is active:
  // - Web search has results or is searching
  // - Outline generation is in progress (which might use tools)
  const hasActiveTools =
    searchResults.length > 0 ||
    (webSearchEnabled && isGeneratingOutline);

  const shouldAutoExpand =
    !hasOutline &&
    (searchResults.length > 0 ||
      (webSearchEnabled && isGeneratingOutline));

  useEffect(() => {
    if (shouldAutoExpand) {
      setIsExpanded(true);
      return;
    }

    if (hasOutline) {
      setIsExpanded(false);
    }
  }, [hasOutline, shouldAutoExpand]);

  if (!hasActiveTools) {
    return null;
  }

  return (
    <div className="space-y-2">
      <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
        <CollapsibleTrigger asChild>
          <button className="flex w-full items-center justify-between rounded-lg border bg-muted/30 p-3 text-left transition-colors hover:bg-muted/50">
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-medium">
                {searchResults.length > 0
                  ? `Search Results (${searchResults.length})`
                  : webSearchEnabled
                    ? `Web Search`
                    : `Tools`}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {isGeneratingOutline && (
                <span className="flex size-4 shrink-0 items-center justify-center">
                  <Loader2 className="size-4 animate-spin text-blue-500" />
                </span>
              )}
              <span className="text-xs text-muted-foreground">
                {isExpanded ? "Hide" : "Show"}
              </span>
            </div>
          </button>
        </CollapsibleTrigger>

        <CollapsibleContent className="space-y-2 px-4 pt-2">
          {searchResults.map((searchItem, index) => (
            <div key={index} className="rounded-lg border bg-background/70 p-3">
              <div className="mb-2 text-sm font-medium">{searchItem.query}</div>
              <div className="space-y-2">
                {Array.isArray(searchItem.results) &&
                searchItem.results.length > 0 ? (
                  searchItem.results.map((result: unknown, resultIndex) => {
                    const item = result as Record<string, unknown>;
                    const title =
                      typeof item.title === "string" && item.title.length > 0
                        ? item.title
                        : "Untitled result";
                    const content =
                      typeof item.content === "string" ? item.content : "";
                    const url = typeof item.url === "string" ? item.url : "";

                    return (
                      <div
                        key={`${index}-${resultIndex}`}
                        className="rounded-md border bg-muted/30 p-3"
                      >
                        <div className="text-sm font-medium">{title}</div>
                        {content ? (
                          <p className="mt-1 line-clamp-3 text-xs text-muted-foreground">
                            {content}
                          </p>
                        ) : null}
                        {url ? (
                          <a
                            href={url}
                            target="_blank"
                            rel="noreferrer"
                            className="mt-2 block truncate text-xs text-primary underline-offset-2 hover:underline"
                          >
                            {url}
                          </a>
                        ) : null}
                      </div>
                    );
                  })
                ) : (
                  <div className="text-xs text-muted-foreground">
                    No search results yet.
                  </div>
                )}
              </div>
            </div>
          ))}

          {isGeneratingOutline && searchResults.length === 0 && (
            <div className="rounded-lg border bg-muted/30 p-3">
              <div className="flex items-center gap-2">
                <span className="flex size-4 shrink-0 items-center justify-center">
                  <Loader2 className="size-4 animate-spin text-blue-500" />
                </span>
                <span className="text-sm text-muted-foreground">
                  AI is researching...
                </span>
              </div>
            </div>
          )}
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
