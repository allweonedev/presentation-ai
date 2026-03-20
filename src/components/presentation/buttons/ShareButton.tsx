"use client";

import { togglePresentationPublicStatus } from "@/app/_actions/presentation/sharedPresentationActions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { usePresentationState } from "@/states/presentation-state";
import { useMutation } from "@tanstack/react-query";
import { Check, Copy, Share } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function ShareButton() {
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [isPublic, setIsPublic] = useState(false);
  const [shareLink, setShareLink] = useState("");
  const [copied, setCopied] = useState(false);
  const currentPresentationId = usePresentationState(
    (s) => s.currentPresentationId,
  );

  const { mutate: togglePublicStatus, isPending } = useMutation({
    mutationFn: async (makePublic: boolean) => {
      if (!currentPresentationId) {
        throw new Error("No presentation selected");
      }

      const result = await togglePresentationPublicStatus(
        currentPresentationId,
        makePublic,
      );

      if (!result.success) {
        throw new Error(result.message ?? "Failed to update sharing status");
      }

      return result;
    },
    onSuccess: (_data, variables) => {
      setIsPublic(variables);
      if (variables) {
        setShareLink(
          `${window.location.origin}/share/presentation/${currentPresentationId}`,
        );
        toast.success("Presentation is now shared publicly");
        return;
      }

      setShareLink("");
      toast.success("Presentation is now private");
    },
    onError: (error) => {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to update sharing status",
      );
    },
  });

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareLink);
      setCopied(true);
      toast.success("Link copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy link");
    }
  };

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        className="gap-2"
        onClick={() => setIsShareDialogOpen(true)}
      >
        <Share className="h-4 w-4" />
        <span className="hidden sm:inline">Share</span>
      </Button>

      <Dialog open={isShareDialogOpen} onOpenChange={setIsShareDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Share presentation</DialogTitle>
            <DialogDescription>
              Make your presentation public to share it with others.
            </DialogDescription>
          </DialogHeader>

          <div className="flex items-center space-x-2 py-4">
            <Switch
              id="public-mode"
              checked={isPublic}
              onCheckedChange={(checked) => togglePublicStatus(checked)}
              disabled={isPending}
            />
            <Label htmlFor="public-mode">
              {isPublic
                ? "Public - Anyone with the link can view"
                : "Private - Only you can access"}
            </Label>
          </div>

          {isPublic && shareLink ? (
            <div className="flex items-center space-x-2">
              <div className="grid flex-1 gap-2">
                <Label htmlFor="share-link" className="sr-only">
                  Link
                </Label>
                <Input id="share-link" readOnly value={shareLink} className="h-9" />
              </div>
              <Button size="sm" className="px-3" onClick={copyToClipboard}>
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          ) : null}

          <DialogFooter className="sm:justify-start">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsShareDialogOpen(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
