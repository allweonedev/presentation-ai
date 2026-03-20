import { cn } from "@/lib/utils";
import { SlateElement, type SlateElementProps } from "platejs/static";

export default function FlexBoxStatic(props: SlateElementProps) {
  const {
    align = "center",
    justify = "center",
    gap = "md",
  } = props.element as {
    align?: "start" | "center" | "end" | "stretch" | "baseline";
    justify?: "start" | "center" | "end" | "between" | "around" | "evenly";
    gap?: "sm" | "md" | "lg" | "xl" | "none";
  };

  const gapMap = {
    sm: "gap-2",
    md: "gap-4",
    lg: "gap-8",
    xl: "gap-12",
    none: "gap-0",
  };

  const justifyMap = {
    start: "justify-start",
    center: "justify-center",
    end: "justify-end",
    between: "justify-between",
    around: "justify-around",
    evenly: "justify-evenly",
  };

  const alignMap = {
    start: "items-start",
    center: "items-center",
    end: "items-end",
    stretch: "items-stretch",
    baseline: "items-baseline",
  };

  return (
    <SlateElement {...props} className="mb-4">
      <div
        className={cn(
          "flex w-full flex-wrap",
          gapMap[gap] || "gap-4",
          justifyMap[justify] || "justify-center",
          alignMap[align] || "items-center",
        )}
      >
        {props.children}
      </div>
    </SlateElement>
  );
}


