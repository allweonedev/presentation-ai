import React from "react";
import { type LinearPreset } from "./types";
import { loadGradients, toLinearFromJson } from "./utils";

export function CompactGradientGrid({
  onPick,
}: {
  onPick: (preset: LinearPreset) => void;
}) {
  const [items, setItems] = React.useState<LinearPreset[] | null>(null);

  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      const json = await loadGradients();
      if (cancelled) return;
      const presets = json
        .slice(0, 12)
        .map((g, idx) =>
          toLinearFromJson(g.colors ?? [], 135 + (idx % 4) * 15),
        );
      setItems(presets);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (!items) {
    return (
      <div className="grid grid-cols-3 gap-3">
        {Array.from({ length: 9 }).map((_, i) => (
          <div
            key={i}
            className="aspect-video w-full animate-pulse rounded-lg bg-muted/50"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-3">
      {items.map((p, i) => (
        <button
          key={i}
          type="button"
          onClick={() => onPick(p)}
          className="group relative aspect-video w-full rounded-lg border border-border/50 transition-all duration-200 hover:scale-[1.02] hover:border-primary hover:shadow-md"
          style={{ background: p.css }}
          aria-label={`Gradient preset ${i + 1}`}
          title={p.css}
        >
          <div className="absolute inset-0 rounded-lg ring-1 ring-black/5 ring-inset" />
        </button>
      ))}
    </div>
  );
}
