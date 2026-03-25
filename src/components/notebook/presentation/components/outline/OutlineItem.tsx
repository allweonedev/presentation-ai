import ProseMirrorEditor from "@/components/prose-mirror/ProseMirrorEditor";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Check, ChevronDown, GripVertical, Plus, X } from "lucide-react";
import { memo, useEffect, useState } from "react";
import { TEMPLATE_DEFINITIONS } from "../../utils/templates";

interface OutlineItemProps {
  id: string;
  index: number;
  title: string;
  onTitleChange: (id: string, newTitle: string) => void;
  onDelete: (id: string) => void;
  // Template selection props
  hasTemplatesSelected?: boolean;
  selectedTemplateId?: string | null;
  onTemplateChange?: (templateId: string | null) => void;
  availableTemplates?: Array<{ id: string; name: string }>;
  onOpenTemplateModal?: () => void;
}

// Wrap the component with memo to prevent unnecessary re-renders
export const OutlineItem = memo(function OutlineItem({
  id,
  index,
  title,
  onTitleChange,
  onDelete,
  hasTemplatesSelected = false,
  selectedTemplateId = null,
  onTemplateChange,
  availableTemplates = [],
  onOpenTemplateModal,
}: OutlineItemProps) {
  // Always editable, no need for isEditing state
  const [editedTitle, setEditedTitle] = useState(title);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  // Update editedTitle when title prop changes
  useEffect(() => {
    setTimeout(() => {
      setEditedTitle(title);
    }, 0);
  }, [title]);

  const handleProseMirrorChange = (newContent: string) => {
    setEditedTitle(newContent);
  };

  const handleProseMirrorBlur = () => {
    if (editedTitle.trim() !== title) {
      onTitleChange(id, editedTitle);
    }
  };

  const handleTemplateSelect = (templateId: string | null) => {
    onTemplateChange?.(templateId);
    setIsDropdownOpen(false);
  };

  const handleMoreClick = () => {
    setIsDropdownOpen(false);
    onOpenTemplateModal?.();
  };

  // Get display name for selected template
  const selectedTemplateName = selectedTemplateId
    ? (availableTemplates.find((t) => t.id === selectedTemplateId)?.name ??
      "Custom")
    : "Auto";

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "group flex items-center gap-4 rounded-md bg-muted p-4",
        isDragging && "opacity-50",
      )}
    >
      <div
        {...attributes}
        {...listeners}
        className="cursor-move text-muted-foreground hover:text-foreground"
      >
        <GripVertical size={20} />
      </div>
      <span className="min-w-6 text-indigo-400">{index}</span>
      <div className="flex-1">
        <ProseMirrorEditor
          content={editedTitle}
          onChange={handleProseMirrorChange}
          isEditing={true}
          onBlur={handleProseMirrorBlur}
          className="prose-headings:m-0 prose-headings:text-lg prose-headings:font-semibold prose-p:m-0 prose-ol:m-0 prose-ul:m-0 prose-li:m-0"
          showFloatingToolbar={false}
        />
      </div>
      {hasTemplatesSelected && (
        <Popover open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
          <PopoverTrigger asChild>
            <button
              type="button"
              className={cn(
                "flex h-8 items-center gap-1.5 rounded-md border border-border/50 bg-background/50 px-3 text-xs font-medium text-primary transition-colors",
                "hover:border-border hover:bg-background/80 hover:text-foreground",
                isDropdownOpen && "border-border bg-background/80 text-primary",
              )}
            >
              <span className="max-w-20 truncate">{selectedTemplateName}</span>
              <ChevronDown className="size-3.5 opacity-70" />
            </button>
          </PopoverTrigger>
          <PopoverContent
            align="end"
            sideOffset={4}
            className="w-80 overflow-hidden p-1.5"
          >
            <div className="scrollbar-thin max-h-96 space-y-0.5 overflow-y-auto overscroll-contain pr-1 scrollbar-thumb-muted scrollbar-track-transparent">
              {/* Auto option */}
              <button
                type="button"
                onClick={() => handleTemplateSelect(null)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-md px-2 py-1.5 text-left transition-colors hover:bg-accent",
                  !selectedTemplateId && "bg-accent",
                )}
              >
                <div className="flex h-24 w-28 shrink-0 items-center justify-center overflow-hidden rounded border border-border bg-card">
                  <span className="text-[10px] text-muted-foreground">
                    Auto
                  </span>
                </div>
                <span className="flex-1 text-sm">Auto (AI)</span>
                {!selectedTemplateId && (
                  <Check className="size-4 shrink-0 text-primary" />
                )}
              </button>

              {/* Template options with previews */}
              {availableTemplates.map((template) => {
                const templateDef = TEMPLATE_DEFINITIONS.find(
                  (t) => t.id === template.id,
                );
                const isSelected = selectedTemplateId === template.id;
                return (
                  <button
                    key={template.id}
                    type="button"
                    onClick={() => handleTemplateSelect(template.id)}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-md px-2 py-1.5 text-left transition-colors hover:bg-accent",
                      isSelected && "bg-accent",
                    )}
                  >
                    <div className="h-24 w-28 shrink-0 overflow-hidden rounded border border-border bg-card">
                      {templateDef?.preview}
                    </div>
                    <span className="flex-1 truncate text-sm">
                      {template.name}
                    </span>
                    {isSelected && (
                      <Check className="size-4 shrink-0 text-primary" />
                    )}
                  </button>
                );
              })}

              {/* More option */}
              <button
                type="button"
                onClick={handleMoreClick}
                className="flex w-full items-center gap-3 rounded-md px-2 py-1.5 text-left text-primary transition-colors hover:bg-accent"
              >
                <div className="flex h-24 w-28 shrink-0 items-center justify-center overflow-hidden rounded border border-dashed border-primary/50 bg-primary/5">
                  <Plus className="size-4 text-primary" />
                </div>
                <span className="flex-1 text-sm">More Templates</span>
              </button>
            </div>
          </PopoverContent>
        </Popover>
      )}
      <button
        type="button"
        onClick={() => onDelete(id)}
        className="text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 hover:text-red-400"
      >
        <X size={20} />
      </button>
    </div>
  );
});

// Add a display name for debugging purposes
OutlineItem.displayName = "OutlineItem";
