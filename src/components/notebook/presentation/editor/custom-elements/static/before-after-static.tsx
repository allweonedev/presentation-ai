import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import { SlateElement, type SlateElementProps } from "platejs/static";

export default function BeforeAfterGroupStatic(props: SlateElementProps) {
  const { alignment = "center" } = props.element as {
    alignment?: "left" | "center" | "right";
    color?: string;
  };

  return (
    <SlateElement {...props}>
      <div
        className={cn(
          "mb-4 grid grid-cols-[1fr_auto_1fr] gap-8 md:gap-10",
          // Only apply horizontal alignment, don't break the grid layout
          alignment === "left" && "justify-start",
          alignment === "right" && "justify-end",
          alignment === "center" && "justify-center",
        )}
      >
        {props.children}
        <div
          className={cn(
            "col-start-2 row-span-full flex items-center justify-center self-center",
          )}
          aria-hidden
        >
          <div
            className={cn(
              "grid h-14 w-14 place-items-center rounded-full text-xl font-bold shadow-xl",
            )}
            style={{
              backgroundColor:
                (props.element.color as string) ||
                "var(--presentation-primary)",
              color: "var(--presentation-background)",
              boxShadow:
                "0 10px 30px rgba(108,122,224,0.3), 0 0 0 6px rgba(108,122,224,0.08)",
              pointerEvents: "none",
            }}
          >
            <ArrowRight />
          </div>
        </div>
      </div>
    </SlateElement>
  );
}


