import { NodeApi, PathApi } from "platejs";
import { type SlateElementProps, SlateElement } from "platejs/static";

import { cn } from "@/lib/utils";

export function CycleItemStatic(props: SlateElementProps) {
  const path = props.editor.api.findPath(props.element) ?? [-1];
  const parentPath = PathApi.parent(path);
  const parent = NodeApi.get(props.editor, parentPath) as {
    children?: unknown[];
  } | null;
  const totalChildren =
    (parent?.children as unknown[] | undefined)?.length ?? 0;
  const hasOddItems = totalChildren % 2 !== 0;
  const index = (path?.at(-1) as number) ?? 0;

  const getItemColor = () => {
    const colors = [
      "bg-blue-500",
      "bg-purple-500",
      "bg-indigo-500",
      "bg-pink-500",
    ];
    return colors[index % colors.length];
  };

  let columnStart: string;
  if (hasOddItems && index === 0) {
    columnStart = "@min-4xl:col-start-2";
  } else {
    const adjustedIndex = hasOddItems ? index - 1 : index;
    columnStart =
      adjustedIndex % 2 === 0 ? "@min-4xl:col-start-1" : "@min-4xl:col-start-3";
  }
  const gridClass = cn("col-span-1 shrink-0", columnStart);

  return (
    <div className={cn(gridClass)}>
      <div className={cn("group/cycle-item relative mb-6")}>
        <div
          className="rounded-md bg-(--presentation-card-background) p-4"
          data-bg-export="true"
        >
          <div className="mb-2 flex items-center">
            <div
              className={cn(
                "mr-3 flex h-8 w-8 items-center justify-center rounded-full text-(--presentation-body)",
                getItemColor(),
              )}
            >
              {index + 1}
            </div>
          </div>
          <SlateElement className="mt-2" {...props}>
            {props.children}
          </SlateElement>
        </div>
      </div>
    </div>
  );
}


