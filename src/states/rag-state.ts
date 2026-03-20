import { create } from "zustand";

// Bounding box types for PDF highlighting
export interface BoundingBox {
  left: number;
  top: number;
  right: number;
  bottom: number;
}

export interface ChunkBoundingBox {
  chunkId: string;
  page: number;
  boundingBox: BoundingBox;
}

export type PdfFitMode = "width" | "page";

export interface RAGState {
  files: File[];
  setFiles: (files: File[] | ((prevFiles: File[]) => File[])) => void;
  // RAG files for current chat
  ragFiles: Array<{
    id: string;
    fileUrl: string;
    fileName: string | null;
    processingStatus: string;
  }>;
  setRagFiles: (files: RAGState["ragFiles"]) => void;
  isModelOpen: boolean;
  setIsModelOpen: (isModelOpen: boolean) => void;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  currentChunkIds: string[];
  setCurrentChunkIds: (chunkIds: string[]) => void;
  currentRagId: string;
  setCurrentRagId: (ragId: string) => void;

  currentBaseDocumentId: string;
  setCurrentBaseDocumentId: (baseDocumentId: string) => void;
  // Whether current user owns this chat
  isOwner: boolean;
  setIsOwner: (isOwner: boolean) => void;
  // Whether chat should be cloned when user sends a message (for shared viewers)
  shouldCloneOnSend: boolean;
  setShouldCloneOnSend: (shouldClone: boolean) => void;
  // Highlighted chunks with bounding boxes
  highlightedChunks: ChunkBoundingBox[];
  setHighlightedChunks: (chunks: ChunkBoundingBox[]) => void;
  // Target page to scroll to
  targetPage: number | null;
  setTargetPage: (page: number | null) => void;

  // PDF Viewer State
  pdfNumPages: number | null;
  setPdfNumPages: (numPages: number | null) => void;
  pdfScale: number;
  setPdfScale: (scale: number) => void;
  pdfRotation: number;
  setPdfRotation: (rotation: number) => void;
  pdfCurrentPage: number;
  setPdfCurrentPage: (page: number) => void;
  pdfFitMode: PdfFitMode;
  setPdfFitMode: (fitMode: PdfFitMode) => void;
  isPdfLoading: boolean;
  setIsPdfLoading: (isLoading: boolean) => void;
  // Preview tab state
  previewTab: "pdf" | "content";
  setPreviewTab: (tab: "pdf" | "content") => void;
  // Processing status for current RAG file
  processingStatus: string | null;
  setProcessingStatus: (status: string | null) => void;

  setRAGState: (key: keyof RAGState, value: unknown) => void;
}

export const useRAGState = create<RAGState>((set) => ({
  files: [],
  setFiles: (update) =>
    set((state) => ({
      files: typeof update === "function" ? update(state.files) : update,
    })),
  ragFiles: [],
  setRagFiles: (ragFiles) => set({ ragFiles }),
  isModelOpen: false,
  setIsModelOpen: (isModelOpen) => set({ isModelOpen }),
  isLoading: false,
  setIsLoading: (isLoading) => set({ isLoading }),
  currentChunkIds: [],
  setCurrentChunkIds: (currentChunkIds) => set({ currentChunkIds }),
  currentRagId: "",
  setCurrentRagId: (currentRagId) => set({ currentRagId }),
  currentBaseDocumentId: "",
  setCurrentBaseDocumentId: (currentBaseDocumentId) =>
    set({ currentBaseDocumentId }),
  isOwner: false,
  setIsOwner: (isOwner) => set({ isOwner }),
  shouldCloneOnSend: false,
  setShouldCloneOnSend: (shouldCloneOnSend) => set({ shouldCloneOnSend }),
  highlightedChunks: [],
  setHighlightedChunks: (highlightedChunks) => set({ highlightedChunks }),
  targetPage: null,
  setTargetPage: (targetPage) => set({ targetPage }),

  // PDF Viewer State
  pdfNumPages: null,
  setPdfNumPages: (pdfNumPages) => set({ pdfNumPages }),
  pdfScale: 1.0,
  setPdfScale: (pdfScale) => set({ pdfScale }),
  pdfRotation: 0,
  setPdfRotation: (pdfRotation) => set({ pdfRotation }),
  pdfCurrentPage: 1,
  setPdfCurrentPage: (pdfCurrentPage) => set({ pdfCurrentPage }),
  pdfFitMode: "page",
  setPdfFitMode: (pdfFitMode) => set({ pdfFitMode }),
  isPdfLoading: true,
  setIsPdfLoading: (isPdfLoading) => set({ isPdfLoading }),

  // Preview tab state
  previewTab: "pdf",
  setPreviewTab: (previewTab) => set({ previewTab }),
  // Processing status
  processingStatus: null,
  setProcessingStatus: (processingStatus) => set({ processingStatus }),

  setRAGState: (key, value) => set({ [key]: value }),
}));
