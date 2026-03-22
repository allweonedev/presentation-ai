import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { usePresentationState } from "@/states/presentation-state";
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { LayoutGrid, Plus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { TEMPLATE_DEFINITIONS } from "../../utils/templates";
import { OutlineItem } from "./OutlineItem";
import { OutlineTemplateModal } from "./OutlineTemplateModal";

interface OutlineItemType {
  id: string;
  title: string;
}

function areItemTitlesEqual(
  items: OutlineItemType[],
  titles: string[],
): boolean {
  if (items.length !== titles.length) {
    return false;
  }

  return items.every((item, index) => item.title === titles[index]);
}

export function OutlineList() {
  const {
    outline: initialItems,
    setOutline,
    numSlides,
    isGeneratingOutline,
    webSearchEnabled,
    selectedSlideTemplates,
    outlineTemplateOverrides,
    setOutlineTemplateOverride,
  } = usePresentationState();

  const [items, setItems] = useState<OutlineItemType[]>(
    initialItems.map((title, index) => ({
      id: (index + 1).toString(),
      title,
    })),
  );

  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [singleModeOutlineId, setSingleModeOutlineId] = useState<string | null>(
    null,
  );

  // Get available templates for dropdown (filtered to selected ones)
  const availableTemplates = useMemo(() => {
    return TEMPLATE_DEFINITIONS.filter((t) =>
      selectedSlideTemplates.includes(t.id),
    ).map((t) => ({ id: t.id, name: t.name }));
  }, [selectedSlideTemplates]);

  useEffect(() => {
    setItems((previousItems) => {
      if (areItemTitlesEqual(previousItems, initialItems)) {
        return previousItems;
      }

      return initialItems.map((title, index) => ({
        id: previousItems[index]?.id ?? crypto.randomUUID(),
        title,
      }));
    });
  }, [initialItems]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        const newItems = arrayMove(items, oldIndex, newIndex);
        // Update the outline in the store
        setOutline(newItems.map((item) => item.title));
        return newItems;
      });
    }
  }

  const handleTitleChange = (id: string, newTitle: string) => {
    setItems((items) => {
      const newItems = items.map((item) =>
        item.id === id ? { ...item, title: newTitle } : item,
      );
      // Update the outline in the store
      setOutline(newItems.map((item) => item.title));
      return newItems;
    });
  };

  const handleAddCard = () => {
    const newId = crypto.randomUUID();
    const newItems = [...items, { id: newId, title: "New Card" }];
    setItems(newItems);
    // Update the outline in the store
    setOutline(newItems.map((item) => item.title));
  };

  const handleDeleteCard = (id: string) => {
    setItems((items) => {
      const newItems = items.filter((item) => item.id !== id);
      // Update the outline in the store
      setOutline(newItems.map((item) => item.title));
      return newItems;
    });
  };

  const content = useMemo(() => {
    const totalSlides = numSlides;
    const loadedCount = items.length;
    const remainingCount = Math.max(0, totalSlides - loadedCount);

    const showLoadingSkeletons = isGeneratingOutline && remainingCount > 0;

    return (
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={items} strategy={verticalListSortingStrategy}>
          <div className="space-y-2">
            {items.map((item, index) => (
              <OutlineItem
                key={item.id}
                id={item.id}
                index={index + 1}
                title={item.title}
                onTitleChange={handleTitleChange}
                onDelete={handleDeleteCard}
                hasTemplatesSelected={selectedSlideTemplates.length > 0}
                selectedTemplateId={outlineTemplateOverrides[item.id] ?? null}
                onTemplateChange={(templateId) =>
                  setOutlineTemplateOverride(item.id, templateId)
                }
                availableTemplates={availableTemplates}
                onOpenTemplateModal={() => {
                  setSingleModeOutlineId(item.id);
                  setIsTemplateModalOpen(true);
                }}
              />
            ))}
          </div>
        </SortableContext>
        {/* Show loading skeletons only when actually generating */}
        {showLoadingSkeletons &&
          Array.from({ length: remainingCount }).map((_, index) => (
            <Skeleton key={`loading-${index}`} className="h-16 w-full" />
          ))}
      </DndContext>
    );
  }, [
    items,
    numSlides,
    isGeneratingOutline,
    sensors,
    handleDragEnd,
    handleTitleChange,
    handleDeleteCard,
  ]);

  const hideOutline =
    webSearchEnabled && items.length === 0 && !isGeneratingOutline;
  if (hideOutline) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm text-foreground">Outline</h2>
        <div className="flex items-center gap-2">
          {isGeneratingOutline && items.length > 0 && (
            <span className="animate-pulse text-xs text-muted-foreground">
              Generating...
            </span>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSingleModeOutlineId(null);
              setIsTemplateModalOpen(true);
            }}
            className="h-7 gap-1.5 px-2 text-xs"
          >
            <LayoutGrid className="h-3.5 w-3.5" />
            Layouts
            {selectedSlideTemplates.length > 0 && (
              <Badge
                variant="secondary"
                className="ml-0.5 h-4 px-1 text-[10px]"
              >
                {selectedSlideTemplates.length}
              </Badge>
            )}
          </Button>
        </div>
      </div>

      {content}

      <button
        onClick={handleAddCard}
        disabled={isGeneratingOutline}
        className="flex w-full items-center justify-center gap-2 rounded-md bg-muted/50 py-3 text-muted-foreground transition-colors hover:bg-muted disabled:opacity-50"
      >
        <Plus size={20} />
        Add card
      </button>

      <div className="flex justify-between text-sm text-muted-foreground">
        <span>{items.length} cards total</span>
        <span>
          {items.reduce((acc, item) => acc + item.title.length, 0)}/20000
        </span>
      </div>

      <OutlineTemplateModal
        isOpen={isTemplateModalOpen}
        onClose={() => {
          setIsTemplateModalOpen(false);
          setSingleModeOutlineId(null);
        }}
        mode={singleModeOutlineId ? "single" : "global"}
        outlineId={singleModeOutlineId ?? undefined}
      />
    </div>
  );
}
