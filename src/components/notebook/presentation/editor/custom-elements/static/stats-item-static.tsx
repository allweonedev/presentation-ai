import { cn } from "@/lib/utils";
import { Star } from "lucide-react";
import { NodeApi, PathApi } from "platejs";
import { SlateElement, type SlateElementProps } from "platejs/static";
import {
  type TStatsGroupElement,
  type TStatsItemElement,
} from "../../plugins/stats-plugin";
import { getAlignmentClasses } from "../../utils";

export function StatsItemStatic(props: SlateElementProps<TStatsItemElement>) {
  const path = props.editor.api.findPath(props.element) ?? [-1];
  const parentPath = PathApi.parent(path);
  const parentElement = NodeApi.get(
    props.editor,
    parentPath,
  ) as TStatsGroupElement;

  const statsType = parentElement?.statsType ?? "plain";
  const { stat = "0" } = props.element;

  // Get alignment - use item alignment if set, otherwise inherit from parent
  const itemAlignment = props.element.alignment;
  const parentAlignment = parentElement?.alignment;
  const alignment = itemAlignment ?? parentAlignment ?? "left";

  const renderStatVisual = () => {
    const statValue = parseFloat(stat) || 0;
    const percentage = Math.min(Math.max(statValue, 0), 100);

    switch (statsType) {
      case "plain":
        return (
          <div
            className="text-6xl font-bold text-primary"
            style={{
              color: parentElement?.color || "var(--presentation-primary)",
            }}
          >
            {stat}
          </div>
        );

      case "circle":
        return (
          <div className="relative h-32 w-32">
            <svg className="h-full w-full" viewBox="0 0 100 100">
              {/* Base circle - primary color */}
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                className="text-primary"
                style={{
                  color: parentElement?.color || "var(--presentation-primary)",
                }}
              />
              {/* Progress circle - secondary color */}
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="var(--presentation-secondary)"
                strokeWidth="8"
                strokeDasharray={`${2 * Math.PI * 45}`}
                strokeDashoffset={`${2 * Math.PI * 45 * (1 - percentage / 100)}`}
                transform="rotate(-90 50 50)"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span
                className="text-2xl font-bold"
                style={{
                  color: parentElement?.color || "var(--presentation-primary)",
                }}
              >
                {stat}
              </span>
            </div>
          </div>
        );

      case "circle-bold":
        return (
          <div className="relative h-35 w-35">
            <svg className="h-full w-full" viewBox="0 0 100 100">
              {/* Outer bold circle - primary color */}
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="currentColor"
                strokeWidth="12"
                className="text-primary"
                style={{
                  color: parentElement?.color || "var(--presentation-primary)",
                }}
              />
              {/* Progress circle - secondary color */}
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="var(--presentation-secondary)"
                strokeWidth="12"
                strokeDasharray={`${2 * Math.PI * 40}`}
                strokeDashoffset={`${2 * Math.PI * 40 * (1 - percentage / 100)}`}
                transform="rotate(-90 50 50)"
              />
              {/* Inner decorative circle */}
              <circle
                cx="50"
                cy="50"
                r="30"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
                className="text-primary opacity-40"
                style={{
                  color: parentElement?.color || "var(--presentation-primary)",
                }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span
                className="text-2xl font-bold"
                style={{
                  color: parentElement?.color || "var(--presentation-primary)",
                }}
              >
                {stat}
              </span>
            </div>
          </div>
        );

      case "star":
        const filledStars = statValue % 5 || 5;
        return (
          <div className="flex items-center gap-1">
            <div className="flex gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    "h-8 w-8",
                    i < filledStars
                      ? "fill-current text-primary"
                      : "text-gray-300",
                  )}
                  style={{
                    color:
                      i < filledStars
                        ? parentElement?.color || "var(--presentation-primary)"
                        : "var(--presentation-primary)",
                  }}
                />
              ))}
            </div>
            <span
              className="text-2xl font-bold"
              style={{
                color: parentElement?.color || "var(--presentation-primary)",
              }}
            >
              {stat}
            </span>
          </div>
        );

      case "bar":
        return (
          <div className="flex w-full items-center gap-1">
            <div className="h-8 w-full flex-1 border border-(--presentation-primary) bg-(--presentation-background)">
              <div
                className="h-8 transition-all duration-300"
                style={{
                  width: `${percentage}%`,
                  backgroundColor:
                    parentElement?.color || "var(--presentation-secondary)",
                }}
              />
            </div>
            <span
              className="w-20 text-center text-2xl font-bold"
              style={{
                color: parentElement?.color || "var(--presentation-primary)",
              }}
            >
              {stat}
            </span>
          </div>
        );

      case "dot-grid":
        const filledDots = Math.round((percentage / 100) * 100);
        return (
          <div className="flex flex-col gap-2">
            <div className="grid h-32 w-32 grid-cols-10 gap-1">
              {Array.from({ length: 100 }).map((_, i) => (
                <div
                  key={i}
                  className="h-2 w-2 rounded-full"
                  style={{
                    backgroundColor:
                      i < filledDots
                        ? "var(--presentation-secondary)"
                        : parentElement?.color || "var(--presentation-primary)",
                  }}
                />
              ))}
            </div>
            <span
              className="w-full text-2xl font-bold"
              style={{
                color: parentElement?.color || "var(--presentation-primary)",
              }}
            >
              {stat}
            </span>
          </div>
        );

      case "dot-line":
        const filledLineDots = Math.round((percentage / 100) * 20);
        return (
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="size-4 rounded-full"
                  style={{
                    backgroundColor:
                      i < filledLineDots
                        ? "var(--presentation-secondary)"
                        : parentElement?.color || "var(--presentation-primary)",
                  }}
                />
              ))}
            </div>
            <span
              className="w-full text-2xl font-bold"
              style={{
                color: parentElement?.color || "var(--presentation-primary)",
              }}
            >
              {stat}
            </span>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={cn("grid grid-flow-row grid-cols-1 gap-4 p-6")}>
      <div
        className="flex h-max w-full"
        contentEditable={false}
        data-slate-void="true"
      >
        {renderStatVisual()}
      </div>

      <SlateElement {...props} className={cn(getAlignmentClasses(alignment))}>
        <div>{props.children}</div>
      </SlateElement>
    </div>
  );
}


