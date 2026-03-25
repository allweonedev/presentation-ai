"use client";

import {
  deleteFontPair,
  getUserFontPairs,
} from "@/app/_actions/presentation/font-pair-actions";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Check, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface FontPair {
  id: string;
  heading: string;
  headingUrl?: string | null;
  body: string;
  bodyUrl?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

interface UserFontPairsProps {
  currentHeading?: string;
  currentBody?: string;
  onSelect: (
    heading: string,
    body: string,
    headingUrl?: string,
    bodyUrl?: string,
    headingWeight?: number,
    bodyWeight?: number,
  ) => void;
}

function FontPairSkeleton() {
  return (
    <div className="w-full space-y-1 rounded-lg border p-3">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-3 w-20" />
    </div>
  );
}

export function UserFontPairs({
  currentHeading,
  currentBody,
  onSelect,
}: UserFontPairsProps) {
  const queryClient = useQueryClient();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const { data: fontPairs = [], isLoading } = useQuery({
    queryKey: ["userFontPairs"],
    queryFn: async () => {
      const result = await getUserFontPairs();
      return result.success ? (result.fontPairs as FontPair[]) : [];
    },
  });

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (deletingId) return;

    try {
      setDeletingId(id);
      const result = await deleteFontPair(id);

      if (result.success) {
        toast.success("Font pair deleted");
        queryClient.invalidateQueries({ queryKey: ["userFontPairs"] });
      } else {
        toast.error(result.message || "Failed to delete font pair");
      }
    } catch {
      toast.error("An error occurred while deleting");
    } finally {
      setDeletingId(null);
    }
  };

  // Don't render anything if there are no font pairs and not loading
  if (!isLoading && fontPairs.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      <label className="text-xs font-semibold text-muted-foreground uppercase">
        Your Font Pairs
      </label>
      <div className="space-y-2">
        {isLoading ? (
          <>
            <FontPairSkeleton />
            <FontPairSkeleton />
            <FontPairSkeleton />
          </>
        ) : (
          fontPairs.map((pair) => {
            const isSelected =
              currentHeading === pair.heading && currentBody === pair.body;
            const isDeleting = deletingId === pair.id;

            return (
              <div
                key={pair.id}
                className={cn(
                  "group relative flex w-full items-center justify-between rounded-lg border p-3 transition-all hover:bg-accent/50",
                  isSelected
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-border/80",
                )}
              >
                <button
                  className="flex-1 text-left"
                  onClick={() =>
                    onSelect(
                      pair.heading,
                      pair.body,
                      pair.headingUrl ?? undefined,
                      pair.bodyUrl ?? undefined,
                    )
                  }
                >
                  <div className="space-y-1">
                    <div className="text-sm font-semibold text-foreground">
                      {pair.heading}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {pair.body}
                    </div>
                  </div>
                </button>

                <div className="flex items-center gap-2">
                  {isSelected && (
                    <Check className="h-4 w-4 shrink-0 text-primary" />
                  )}
                  <button
                    onClick={(e) => handleDelete(e, pair.id)}
                    disabled={isDeleting}
                    className={cn(
                      "rounded-md p-1.5 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-destructive/10 hover:text-destructive",
                      isDeleting &&
                        "animate-pulse text-destructive opacity-100",
                      "focus:opacity-100 focus:outline-hidden",
                    )}
                    title="Delete font pair"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Delete</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
