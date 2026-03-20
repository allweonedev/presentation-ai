"use client";

import * as React from "react";

import { type TSuggestionData, type TSuggestionText } from "platejs";
import { type PlateLeafProps, type RenderNodeWrapper } from "platejs/react";

import { BaseSuggestionPlugin } from "@platejs/suggestion";
import { cva } from "class-variance-authority";
import { CornerDownLeftIcon } from "lucide-react";
import {
  PlateLeaf,
  type PlatePlugin,
  useEditorPlugin,
  usePluginOption,
} from "platejs/react";

import { type SuggestionConfig } from "@/components/plate/plugins/suggestion-kit";
import { cn } from "@/lib/utils";

// Use BaseSuggestionPlugin cast to SuggestionConfig to avoid circular dependency
// with suggestion-kit.tsx. Plugins are resolved by key at runtime, so this is safe.
const suggestionPlugin =
  BaseSuggestionPlugin as unknown as PlatePlugin<SuggestionConfig>;

const suggestionVariants = cva(
  cn(
    "bg-emerald-100 text-emerald-700 no-underline transition-colors duration-200",
  ),
  {
    defaultVariants: {
      insertActive: false,
      remove: false,
      removeActive: false,
    },
    variants: {
      insertActive: {
        false: "",
        true: "bg-emerald-200/80",
      },
      remove: {
        false: "",
        true: "bg-red-100 text-red-700",
      },
      removeActive: {
        false: "",
        true: "bg-red-200/80 no-underline",
      },
    },
  },
);

export function SuggestionLeaf(props: PlateLeafProps<TSuggestionText>) {
  const { api, setOption } = useEditorPlugin(suggestionPlugin);
  const leaf = props.leaf;

  const leafId: string = api.suggestion.nodeId(leaf) ?? "";
  const activeSuggestionId = usePluginOption(suggestionPlugin, "activeId");
  const hoverSuggestionId = usePluginOption(suggestionPlugin, "hoverId");
  const dataList = api.suggestion.dataList(leaf);

  const hasRemove = dataList.some((data) => data.type === "remove");
  const hasActive = dataList.some((data) => data.id === activeSuggestionId);
  const hasHover = dataList.some((data) => data.id === hoverSuggestionId);

  const diffOperation = { type: hasRemove ? "delete" : "insert" } as const;

  const Component = ({ delete: "del", insert: "ins", update: "span" } as const)[
    diffOperation.type
  ];

  return (
    <PlateLeaf
      {...props}
      as={Component}
      className={cn(
        suggestionVariants({
          insertActive: hasActive || hasHover,
          remove: hasRemove,
          removeActive: (hasActive || hasHover) && hasRemove,
        }),
      )}
      attributes={{
        ...props.attributes,
        onMouseEnter: () => setOption("hoverId", leafId),
        onMouseLeave: () => setOption("hoverId", null),
      }}
    >
      {props.children}
    </PlateLeaf>
  );
}
export const SuggestionLineBreak: RenderNodeWrapper<SuggestionConfig> = ({
  api,
  element,
}) => {
  if (!api.suggestion.isBlockSuggestion(element)) return;

  const suggestionData = element.suggestion;

  return function Component({ children }) {
    return (
      <SuggestionLineBreakContent suggestionData={suggestionData}>
        {children}
      </SuggestionLineBreakContent>
    );
  };
};

function SuggestionLineBreakContent({
  children,
  suggestionData,
}: {
  children: React.ReactNode;
  suggestionData: TSuggestionData;
}) {
  const { isLineBreak, type } = suggestionData;
  const isRemove = type === "remove";
  const isInsert = type === "insert";

  const activeSuggestionId = usePluginOption(suggestionPlugin, "activeId");
  const hoverSuggestionId = usePluginOption(suggestionPlugin, "hoverId");

  const isActive = activeSuggestionId === suggestionData.id;
  const isHover = hoverSuggestionId === suggestionData.id;

  const spanRef = React.useRef<HTMLSpanElement>(null);
  const { setOption } = useEditorPlugin(suggestionPlugin);

  return (
    <>
      {isLineBreak ? (
        <>
          {children}
          <span
            ref={spanRef}
            className={cn(
              "absolute text-justify",
              suggestionVariants({
                insertActive: isInsert && (isActive || isHover),
                remove: isRemove,
                removeActive: (isActive || isHover) && isRemove,
              }),
            )}
            style={{
              bottom: 3.5,
              height: 21,
            }}
            contentEditable={false}
          >
            <CornerDownLeftIcon className="mt-0.5 size-4" />
          </span>
        </>
      ) : (
        <div
          className={cn(
            suggestionVariants({
              insertActive: isInsert && (isActive || isHover),
              remove: isRemove,
              removeActive: (isActive || isHover) && isRemove,
            }),
          )}
          onMouseEnter={() => setOption("hoverId", suggestionData.id)}
          onMouseLeave={() => setOption("hoverId", null)}
          data-block-suggestion="true"
        >
          {children}
        </div>
      )}
    </>
  );
}
