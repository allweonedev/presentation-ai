import { fontPairs } from "@/components/presentation/controls/global-settings/sections/FontsSection";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface FontCombinationsListProps {
  currentHeading: string;
  currentBody: string;
  onSelect: (heading: string, body: string) => void;
}

export function FontCombinationsList({
  currentHeading,
  currentBody,
  onSelect,
}: FontCombinationsListProps) {
  return (
    <div className="space-y-3">
      <label className="text-xs font-semibold text-muted-foreground uppercase">
        Font Combinations
      </label>
      <div className="space-y-2">
        {fontPairs.map((pair) => {
          const isSelected =
            currentHeading === pair.heading && currentBody === pair.body;

          return (
            <button
              key={`${pair.heading}-${pair.body}`}
              className={cn(
                "flex w-full items-center justify-between rounded-lg border p-3 text-left transition-all hover:bg-accent/50",
                isSelected
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-border/80",
              )}
              onClick={() => onSelect(pair.heading, pair.body)}
            >
              <div className="space-y-1">
                <div className="text-sm font-semibold text-foreground">
                  {pair.heading}
                </div>
                <div className="text-xs text-muted-foreground">{pair.body}</div>
              </div>
              {isSelected && (
                <Check className="h-4 w-4 shrink-0 text-primary" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
