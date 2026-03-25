"use client";

import { Button } from "@/components/ui/button";
import {
  Credenza,
  CredenzaContent,
  CredenzaFooter,
  CredenzaHeader,
  CredenzaTitle,
} from "@/components/ui/credenza";
import { usePresentationRecordingState } from "@/states/presentation-recording-state";
import { useMemo, useRef } from "react";

export function RecordingPreviewDialog() {
  const { blobUrl, setBlobUrl, reset } = usePresentationRecordingState();
  const open = Boolean(blobUrl);
  const url = blobUrl ?? undefined;
  const aRef = useRef<HTMLAnchorElement | null>(null);

  const fileName = useMemo(() => {
    const d = new Date();
    const pad = (n: number) => String(n).padStart(2, "0");
    return `presentation-${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}-${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}.webm`;
  }, []);

  return (
    <Credenza open={open} onOpenChange={(v) => !v && setBlobUrl(null)}>
      <CredenzaContent className="z-9999 max-w-2xl">
        <CredenzaHeader>
          <CredenzaTitle>Recording preview</CredenzaTitle>
        </CredenzaHeader>
        <div className="aspect-video w-full overflow-hidden rounded-lg border border-border">
          {url && <video src={url} controls className="h-full w-full" />}
        </div>
        <CredenzaFooter>
          <Button
            variant="secondary"
            onClick={() => {
              setBlobUrl(null);
              reset();
            }}
          >
            Discard
          </Button>
          <a ref={aRef} href={url} download={fileName}>
            <Button>Download</Button>
          </a>
        </CredenzaFooter>
      </CredenzaContent>
    </Credenza>
  );
}

export default RecordingPreviewDialog;
