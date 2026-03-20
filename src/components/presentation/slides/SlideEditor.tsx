"use client";

import {
  DeleteConfirmDialog,
  MagicMenuDropdown,
  MoreOptionsDropdown,
  PaletteDropdown,
  SlideEditorProvider,
  useSlideEditorContext,
} from "./slide-editor";

interface SlideEditorProps {
  slideId: string;
  dragListeners?: React.HTMLAttributes<HTMLElement>;
  onDuplicate?: () => void;
  onDelete?: () => void;
}

export function SlideEditor({
  slideId,
  dragListeners,
  onDuplicate,
  onDelete,
}: SlideEditorProps) {
  return (
    <SlideEditorProvider
      slideId={slideId}
      dragListeners={dragListeners}
      onDuplicate={onDuplicate}
      onDelete={onDelete}
    >
      <SlideEditorContent />
    </SlideEditorProvider>
  );
}

function SlideEditorContent() {
  const { showDeleteConfirm, setShowDeleteConfirm, onDelete } =
    useSlideEditorContext();

  return (
    <div className="flex items-center gap-1">
      {/* More Options / Drag Handle Dropdown */}
      <MoreOptionsDropdown />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
        onConfirm={onDelete}
      />

      {/* Palette / Styling Dropdown */}
      <PaletteDropdown />

      {/* Magic Menu Dropdown */}
      <MagicMenuDropdown />
    </div>
  );
}
