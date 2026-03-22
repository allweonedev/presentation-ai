"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ImageIcon, Trash2, Upload } from "lucide-react";
import Image from "next/image";

interface LogoUploaderProps {
  logoPreview: string | null;
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove: () => void;
}

export function LogoUploader({
  logoPreview,
  onFileChange,
  onRemove,
}: LogoUploaderProps) {
  return (
    <div className="space-y-4">
      <Label>Theme Logo</Label>
      <div className="flex items-center gap-4">
        <div className="relative">
          <Input
            type="file"
            accept="image/*"
            onChange={onFileChange}
            className="hidden"
            id="logo-upload"
          />
          <Label
            htmlFor="logo-upload"
            className="flex cursor-pointer items-center gap-2 rounded-md border border-input bg-background px-4 py-2 hover:bg-accent"
          >
            <Upload className="h-4 w-4" />
            Upload Logo
          </Label>
        </div>
        {logoPreview && (
          <Button
            variant="destructive"
            size="sm"
            onClick={onRemove}
            className="flex items-center gap-2"
          >
            <Trash2 className="h-4 w-4" />
            Remove
          </Button>
        )}
      </div>
      {logoPreview ? (
        <div className="relative h-32 w-full overflow-hidden rounded-md border">
          <Image
            src={logoPreview}
            alt="Logo Preview"
            fill
            className="object-contain"
          />
        </div>
      ) : (
        <div className="flex h-32 items-center justify-center rounded-md border border-dashed">
          <div className="flex flex-col items-center">
            <div className="mb-2 rounded-full bg-muted p-2">
              <ImageIcon className="h-4 w-4 text-muted-foreground" />
            </div>
            <span className="text-sm text-muted-foreground">Upload Logo</span>
          </div>
        </div>
      )}
    </div>
  );
}
