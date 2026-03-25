import { usePresentationState } from "@/states/presentation-state";
import { RefreshCw } from "lucide-react";
import { toast } from "sonner";

export function PromptInput() {
  const {
    presentationInput,
    setPresentationInput,
    startOutlineGeneration,
    isGeneratingOutline,
  } = usePresentationState();

  const handleGenerateOutline = () => {
    if (!presentationInput.trim()) {
      toast.error("Please enter a presentation topic");
      return;
    }

    startOutlineGeneration();
  };

  return (
    <div className="rounded-2xl border border-border/60 bg-background/80 p-3 shadow-xs sm:p-4">
      <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <h3 className="text-sm font-semibold text-foreground">
            Presentation prompt
          </h3>
          <p className="text-sm text-muted-foreground">
            Refine the topic or regenerate the outline after edits.
          </p>
        </div>
        <button
          className={`inline-flex h-10 shrink-0 items-center justify-center rounded-xl border border-border bg-muted/40 px-3 transition-colors ${
            isGeneratingOutline
              ? "text-indigo-400"
              : "text-indigo-400 hover:bg-muted hover:text-indigo-500"
          }`}
          onClick={handleGenerateOutline}
          disabled={isGeneratingOutline || !presentationInput.trim()}
          aria-label="Regenerate outline"
        >
          <RefreshCw size={18} />
        </button>
      </div>

      <input
        type="text"
        value={presentationInput}
        onChange={(e) => setPresentationInput(e.target.value)}
        className="w-full rounded-xl border border-border/60 bg-muted/30 px-4 py-3 text-sm text-foreground outline-hidden transition-colors placeholder:text-muted-foreground focus:ring-2 focus:ring-indigo-400 sm:text-base"
        placeholder="Enter your presentation topic..."
        disabled={isGeneratingOutline}
      />
    </div>
  );
}
