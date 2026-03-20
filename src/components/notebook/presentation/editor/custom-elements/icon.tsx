"use client";

import { IconPicker } from "@/components/ui/icon-picker";
import { cn } from "@/lib/utils";
import {
  PlateElement,
  type PlateElementProps,
  useEditorRef,
} from "platejs/react";
import { type TIconElement } from "../plugins/icon-plugin";

// Icon component that uses IconPicker
export const Icon = ({
  element,
  className,
  ref,
  ...props
}: PlateElementProps<TIconElement>) => {
  const { query, name } = element;
  const editor = useEditorRef();

  // Handle icon selection
  const handleIconSelect = (iconName: string) => {
    const path = editor.api.findPath(element);
    if (!path) return;
    editor.tf.setNodes({ name: iconName } as Partial<TIconElement>, { at: path });
  };

  return (
    <PlateElement
      ref={ref}
      element={element}
      className={cn("inline-flex justify-center", className)}
      {...props}
    >
      <div className="mb-2 p-2">
        {name ? (
          <IconPicker
            defaultIcon={name}
            onIconSelect={(iconName) => handleIconSelect(iconName)}
            className="bg-transparent!"
          />
        ) : (
          <IconPicker
            searchTerm={query}
            onIconSelect={(iconName) => handleIconSelect(iconName)}
            className="bg-transparent!"
          />
        )}
      </div>
    </PlateElement>
  );
};
