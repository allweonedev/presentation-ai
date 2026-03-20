import { cn } from "@/lib/utils";
import { SlateElement, type SlateElementProps } from "platejs/static";

export function TableCellStatic(props: SlateElementProps) {
  return (
    <div
      className={cn("rounded border bg-card p-3 text-sm")}
      style={{
        backgroundColor: "var(--presentation-background)",
        color: "var(--presentation-text)",
        borderColor: "hsl(var(--border))",
      }}
    >
      <SlateElement {...props}>{props.children}</SlateElement>
    </div>
  );
}


