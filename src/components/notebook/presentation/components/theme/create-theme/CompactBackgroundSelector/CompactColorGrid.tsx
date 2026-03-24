import { Button } from "@/components/ui/button";
import { DEFAULT_COLORS } from "@/components/ui/color-picker";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Check, Palette } from "lucide-react";
import { useMemo } from "react";

export function CompactColorGrid({
  selected,
  onPick,
}: {
  selected?: string;
  onPick: (color: string) => void;
}) {
  const palette = useMemo(() => DEFAULT_COLORS.slice(0, 21), []);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-7 gap-2">
        {palette.map((c) => (
          <button
            key={c.value}
            type="button"
            onClick={() => onPick(c.value)}
            className={cn(
              "group relative aspect-square rounded-lg transition-all duration-200 hover:scale-105 hover:shadow-md",
              selected === c.value
                ? "z-10 scale-105 shadow-xs ring-2 ring-primary ring-offset-2 ring-offset-card"
                : "hover:ring-2 hover:ring-primary/20 hover:ring-offset-1",
            )}
            style={{ background: c.value }}
            aria-label={c.name}
            title={`${c.name} ${c.value}`}
          >
            {selected === c.value && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Check className="size-3 text-white drop-shadow-md" />
              </div>
            )}
          </button>
        ))}
      </div>
      <div className="flex items-center gap-3 border-t border-border/50 pt-2">
        <div className="relative flex-1">
          <Input
            type="text"
            value={selected ?? ""}
            onChange={(e) => onPick(e.target.value)}
            className="h-9 pl-9 font-mono text-xs uppercase"
            placeholder="#000000"
          />
          <div
            className="absolute top-1/2 left-2 size-4 -translate-y-1/2 rounded-full border border-border shadow-xs"
            style={{ background: selected ?? "#ffffff" }}
          />
        </div>
        <div className="relative">
          <input
            type="color"
            value={selected ?? "#ffffff"}
            onChange={(e) => onPick(e.target.value)}
            className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
          />
          <Button variant="outline" size="sm" className="h-9 px-3 text-xs">
            <Palette className="mr-2 size-3.5" />
            Picker
          </Button>
        </div>
      </div>
    </div>
  );
}
