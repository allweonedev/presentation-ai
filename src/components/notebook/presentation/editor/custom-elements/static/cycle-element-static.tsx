import { cn } from "@/lib/utils";
import { SlateElement, type SlateElementProps } from "platejs/static";
import { DynamicWheelSVG } from "../cycle-element";

export function CycleElementStatic(props: SlateElementProps) {
  const { alignment = "center" } = props.element as {
    alignment?: "left" | "center" | "right";
    children?: unknown[];
  };
  const totalChildren =
    (props.element as { children?: unknown[] }).children?.length ?? 0;
  const hasOddItems = totalChildren % 2 !== 0;
  const maxRows = Math.ceil(totalChildren / 2);

  return (
    <SlateElement {...props} className={cn("relative my-8", props.className)}>
      <div
        className={cn(
          "flex w-full",
          alignment === "left" && "justify-start",
          alignment === "right" && "justify-end",
          alignment === "center" && "justify-center",
        )}
      >
        <div
          className={cn(
            "mx-auto grid h-full w-full grid-cols-1 items-end gap-4 @max-4xl:grid-rows-none! @min-4xl:grid-cols-3",
          )}
          style={{
            gridTemplateRows: `repeat(${maxRows}, minmax(0, min-content))`,
          }}
        >
          <div
            className={cn(
              "relative size-64 place-self-center @min-4xl:col-start-2",
              !hasOddItems
                ? "@min-4xl:row-start-1 @min-4xl:-row-end-1"
                : "@min-4xl:row-start-2",
              totalChildren >= 5 && "@min-4xl:-row-end-1",
            )}
          >
            {(() => {
              const totalSegments = totalChildren;
              const segments = totalSegments > 0 ? totalSegments : 6;
              return <DynamicWheelSVG segments={segments} />;
            })()}
          </div>

          {props.children}
        </div>
      </div>
    </SlateElement>
  );
}


