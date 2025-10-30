"use client";

import { extractContentFromUrl, processImportedContent } from "@/app/_actions/content-import/contentImportActions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { usePresentationState } from "@/states/presentation-state";
import { FileText, Globe, Link, Upload } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function SmartContentImport() {
  const [url, setUrl] = useState("");
  const [isImporting, setIsImporting] = useState(false);
  const { setPresentationInput } = usePresentationState();

  const handleUrlImport = async () => {
    if (!url.trim()) {
      toast.error("Please enter a URL");
      return;
    }

    setIsImporting(true);
    try {
      const result = await extractContentFromUrl(url);

      if (result.success) {
        const processedContent = await processImportedContent(result.content || '', result.title || 'Imported Content');
        setPresentationInput(processedContent);
        toast.success(`Content imported from "${result.title}"`);
        setUrl("");
      } else {
        toast.error(result.error || "Failed to extract content from URL");
      }
    } catch (error) {
      toast.error("Failed to process URL");
      console.error("URL import error:", error);
    } finally {
      setIsImporting(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check file type
    const allowedTypes = ['application/pdf', 'text/plain', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Please upload a PDF, Word document, or text file");
      return;
    }

    try {
      // TODO: Implement actual file content extraction
      // For now, read text files directly
      let content = '';
      if (file.type === 'text/plain') {
        content = await file.text();
      } else {
        // Placeholder for PDF/Word processing
        content = `[File content extraction for ${file.name} will be implemented]`;
      }

      const processedContent = await processImportedContent(content, file.name);
      setPresentationInput(processedContent);
      toast.success(`File "${file.name}" imported successfully!`);
    } catch (error) {
      toast.error("Failed to process file");
      console.error("File upload error:", error);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Upload className="h-4 w-4" />
        <h3 className="text-sm font-medium">Import Content</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* URL Import */}
        <div className="space-y-2">
          <Label htmlFor="url-input" className="text-xs text-muted-foreground">
            Import from URL
          </Label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Globe className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="url-input"
                type="url"
                placeholder="https://example.com/article"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="pl-9"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleUrlImport();
                  }
                }}
              />
            </div>
            <Button
              onClick={handleUrlImport}
              disabled={!url.trim() || isImporting}
              size="sm"
              variant="outline"
            >
              <Link className="h-4 w-4" />
              {isImporting && <span className="ml-2">Importing...</span>}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Supports articles, blog posts, and web content
          </p>
        </div>

        {/* File Upload */}
        <div className="space-y-2">
          <Label htmlFor="file-input" className="text-xs text-muted-foreground">
            Upload Document
          </Label>
          <div className="relative">
            <Input
              id="file-input"
              type="file"
              accept=".pdf,.doc,.docx,.txt"
              onChange={handleFileUpload}
              className="cursor-pointer file:cursor-pointer file:border-0 file:bg-transparent file:text-sm file:font-medium"
            />
            <FileText className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          </div>
          <p className="text-xs text-muted-foreground">
            PDF, Word (.docx), or text files
          </p>
        </div>
      </div>

      <div className="text-xs text-muted-foreground">
        <p className="font-medium mb-1">Coming soon:</p>
        <ul className="space-y-1">
          <li>• Google Docs integration</li>
          <li>• Notion page import</li>
          <li>• YouTube transcript extraction</li>
          <li>• Automatic content structuring</li>
        </ul>
      </div>
    </div>
  );
}