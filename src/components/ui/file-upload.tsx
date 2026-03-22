"use client";

import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import {
  AudioWaveform,
  File,
  FileImage,
  FolderArchive,
  UploadCloud,
  Video,
  X,
} from "lucide-react";
import { useCallback } from "react";
import { type FileRejection, useDropzone } from "react-dropzone";
import { Button } from "./button";
import { useToast } from "./use-toast";

enum FileTypes {
  Image = "image",
  Pdf = "pdf",
  Audio = "audio",
  Video = "video",
  Other = "other",
}

const ImageColor = {
  bgColor: "bg-purple-600",
  fillColor: "fill-purple-600",
};

const PdfColor = {
  bgColor: "bg-blue-400",
  fillColor: "fill-blue-400",
};

const AudioColor = {
  bgColor: "bg-yellow-400",
  fillColor: "fill-yellow-400",
};

const VideoColor = {
  bgColor: "bg-green-400",
  fillColor: "fill-green-400",
};

const OtherColor = {
  bgColor: "bg-gray-400",
  fillColor: "fill-gray-400",
};

export default function FileUpload({
  files,
  setFiles,
  onUpload,
  isLoading,
  multiple = false,
  maxFiles = 1,
  maxSize = 16 * 1024 * 1024,
  acceptedTypes = ["pdf", "docx", "txt"],
  info,
  showUploadButton = true,
  dropzoneMinHeightClassName = "min-h-[350px]",
  dropzoneClassName,
}: {
  files: File[];
  setFiles: (files: File[] | ((prevFiles: File[]) => File[])) => void;
  onUpload?: (files: File[]) => void;
  isLoading: boolean;
  multiple?: boolean;
  maxFiles?: number;
  maxSize?: number;
  acceptedTypes?: string[];
  info?: string;
  showUploadButton?: boolean;
  dropzoneMinHeightClassName?: string;
  dropzoneClassName?: string;
}) {
  const { toast } = useToast();
  const getFileIconAndColor = (file: File) => {
    if (file.type.includes(FileTypes.Image)) {
      return {
        icon: <FileImage size={40} className={ImageColor.fillColor} />,
        color: ImageColor.bgColor,
      };
    }

    if (file.type.includes(FileTypes.Pdf)) {
      return {
        icon: <File size={40} className={PdfColor.fillColor} />,
        color: PdfColor.bgColor,
      };
    }

    if (file.type.includes(FileTypes.Audio)) {
      return {
        icon: <AudioWaveform size={40} className={AudioColor.fillColor} />,
        color: AudioColor.bgColor,
      };
    }

    if (file.type.includes(FileTypes.Video)) {
      return {
        icon: <Video size={40} className={VideoColor.fillColor} />,
        color: VideoColor.bgColor,
      };
    }

    return {
      icon: <FolderArchive size={40} className={OtherColor.fillColor} />,
      color: OtherColor.bgColor,
    };
  };

  // feel free to mode all these functions to separate utils
  // here is just for simplicity

  const removeFile = (file: File) => {
    setFiles((prevUploadProgress) => {
      return prevUploadProgress.filter((item) => item !== file);
    });
  };

  const onDrop = useCallback(
    (acceptedFiles: File[], fileRejected: FileRejection[]) => {
      setFiles((prevUploadProgress) => {
        return [
          ...prevUploadProgress,
          ...acceptedFiles.map((file) => {
            return file;
          }),
        ];
      });
      if (fileRejected.length > 0) {
        toast({
          title: "File type not allowed",
          description: "Please upload a valid file type",
        });
      }
    },
    [],
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: acceptedTypes.reduce(
      (acc, type) => {
        switch (type) {
          case "pdf":
            acc["application/pdf"] = [".pdf"];
            break;
          case "doc":
            acc["application/msword"] = [".doc"];
            break;
          case "docx":
            acc[
              "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            ] = [".docx"];
            break;
          case "txt":
            acc["text/plain"] = [".txt"];
            break;
          case "webm":
            acc["video/webm"] = [".webm"];
            break;
          case "mp4":
            acc["video/mp4"] = [".mp4"];
            break;
          case "mov":
            acc["video/quicktime"] = [".mov"];
            break;
          // Add more cases for other file types as needed
        }
        return acc;
      },
      {} as Record<string, string[]>,
    ),
    maxFiles,
    maxSize,
    multiple,
    onDragEnter: () => {},
    onDragLeave: () => {},
    onDragOver: () => {},
  });

  return (
    <div className="min-h-full w-full max-w-full overflow-x-auto">
      <div className={cn("grid", dropzoneMinHeightClassName)}>
        <label
          {...getRootProps()}
          className={cn(
            "relative flex h-full w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-primary bg-background py-6 hover:bg-muted",
            dropzoneClassName,
          )}
        >
          <div className="text-center">
            <div className="mx-auto max-w-min rounded-md border p-2">
              <UploadCloud className="text-primary" size={20} />
            </div>

            <p className="mt-2 text-sm text-gray-600">
              <span className="font-semibold">
                Click to upload or drag and drop
              </span>
            </p>
            <p className="text-xs text-gray-500">
              {acceptedTypes.join(", ").toUpperCase()} (MAX{" "}
              {maxSize / 1024 / 1024} MB)
            </p>
            {info && (
              <p className="text-xs whitespace-pre-line text-gray-500">
                {info}
              </p>
            )}
          </div>
        </label>

        <Input
          {...getInputProps()}
          id="dropzone-file"
          accept={acceptedTypes.map((type) => `.${type}`).join(", ")}
          type="file"
          className="hidden"
        />
      </div>

      {showUploadButton && files.length > 0 && (
        <div>
          <p className="my-2 mt-6 text-sm font-medium text-muted-foreground">
            Files to upload
          </p>
          <ScrollArea className="max-h-48">
            <div className="space-y-2 pr-3">
              {files.map((file) => {
                return (
                  <div
                    key={file.lastModified}
                    className="group flex justify-between gap-2 overflow-hidden rounded-lg border border-primary pr-2 hover:pr-0"
                  >
                    <div className="flex flex-1 items-center p-2">
                      <div className="text-primary">
                        {getFileIconAndColor(file).icon}
                      </div>

                      <div className="ml-2 w-full space-y-1">
                        <div className="flex justify-between text-sm">
                          <p className="text-muted-foreground">
                            {file.name.slice(0, 25)}
                          </p>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => removeFile(file)}
                      className="hidden items-center justify-center bg-red-500 px-2 text-primary transition-all group-hover:flex"
                    >
                      <X size={20} />
                    </button>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        </div>
      )}

      {showUploadButton && files.length > 0 && (
        <div className="flex justify-end pt-4">
          <Button
            variant={isLoading ? "loading" : "default"}
            onClick={async () => onUpload?.(files)}
          >
            Upload
          </Button>
        </div>
      )}
    </div>
  );
}
