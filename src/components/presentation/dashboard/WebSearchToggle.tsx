import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { usePresentationState } from "@/states/presentation-state";
import { AlertCircle, Globe } from "lucide-react";
import { useEffect } from "react";

export function WebSearchToggle() {
  const { webSearchEnabled, setWebSearchEnabled, isGeneratingOutline, modelId } =
    usePresentationState();

  // Some models don't work well with tool calling (web search)
  const isIncompatibleModel = modelId?.includes("minimax") || modelId?.includes("pollinations");

  useEffect(() => {
    if (isIncompatibleModel && webSearchEnabled) {
      setWebSearchEnabled(false);
    }
  }, [isIncompatibleModel, webSearchEnabled, setWebSearchEnabled]);

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="inline-flex items-center gap-2.5 rounded-full bg-background/95 backdrop-blur-sm px-3.5 py-2 shadow-sm border border-border transition-all hover:shadow-md">
            <div className="flex items-center gap-2">
              <Globe
                className={`h-3.5 w-3.5 transition-colors ${webSearchEnabled ? "text-primary" : "text-muted-foreground"}`}
              />
              <Label
                htmlFor="web-search-toggle"
                className="text-xs font-medium leading-none cursor-pointer select-none text-foreground"
              >
                Web Search
              </Label>
              {isIncompatibleModel && webSearchEnabled && (
                <AlertCircle className="h-3 w-3 text-amber-500" />
              )}
            </div>
            <Switch
              id="web-search-toggle"
              checked={webSearchEnabled}
              onCheckedChange={setWebSearchEnabled}
              disabled={isGeneratingOutline}
            />
          </div>
        </TooltipTrigger>
        <TooltipContent className="max-w-xs">
          <p className="text-xs">
            {isIncompatibleModel && webSearchEnabled ? (
              <span className="text-amber-500">
                ⚠️ Web search may not work well with this model. Try GPT-4o-mini, Claude, or Groq models for best results.
              </span>
            ) : (
              "Enable to search the web for current information and statistics. Works best with GPT-4, Claude, and Groq models."
            )}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
