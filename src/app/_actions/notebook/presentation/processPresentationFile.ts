"use server";

export interface ProcessPresentationFileInput {
  fileUrl: string;
  fileName: string;
}

export interface ProcessPresentationFileResult {
  success: boolean;
  ragId?: string;
  error?: string;
}

export async function processPresentationFile(
  _input: ProcessPresentationFileInput,
): Promise<ProcessPresentationFileResult> {
  return {
    success: false,
    error: "Document extraction is not enabled in this repo yet.",
  };
}
