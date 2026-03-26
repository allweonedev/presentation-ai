import { type Image as GeneratedImage } from "@/app/_actions/apps/image-studio/fetch";
import { type ImageModelList } from "@/app/_actions/apps/image-studio/generate";
import { type PlateSlide } from "@/components/notebook/presentation/utils/parser";
import { type ThemeProperties, type Themes } from "@/lib/presentation/themes";
import { create } from "zustand";
import { usePresentationHistoryState } from "./presentation-history-state";

export type HistoryType = "history";

export type ImageEditorMode =
  | "generate"
  | "your-images"
  | "embed"
  | "search"
  | "gif"
  | "chart";

export type RightPanelType =
  | "elements"
  | "charts"
  | "embed"
  | "background"
  | "theme"
  | "agent"
  | "globalSettings"
  | "imageEditor"
  | "chartEditor"
  | "infographicEditor"
  | "presentationImageEditor"
  | null;

type PendingPresentationCreateRequest = {
  language: string;
  modelId: string;
  modelProvider: "openai" | "ollama" | "lmstudio";
  numSlides: number;
  prompt: string;
  webSearchEnabled: boolean;
};

interface PresentationState {
  currentPresentationId: string | null;
  currentPresentationTitle: string | null;
  isGridView: boolean;
  isSheetOpen: boolean;
  numSlides: number;

  theme: Themes | string;
  customThemeData: ThemeProperties | null;
  language: string;
  pageStyle: string;
  showTemplates: boolean;
  presentationInput: string;
  imageModel: ImageModelList;
  imageSource: "automatic" | "ai" | "stock";
  stockImageProvider: "unsplash" | "pixabay";
  presentationStyle: string;
  modelProvider: "openai" | "ollama" | "lmstudio";
  modelId: string;
  // New customization options
  textContent: "minimal" | "concise" | "detailed" | "extensive";
  tone:
    | "auto"
    | "general"
    | "persuasive"
    | "inspiring"
    | "instructive"
    | "engaging";
  audience:
    | "auto"
    | "general"
    | "business"
    | "investor"
    | "teacher"
    | "student";
  scenario:
    | "auto"
    | "general"
    | "analysis-report"
    | "teaching-training"
    | "promotional-materials"
    | "public-speeches";
  savingStatus: "idle" | "saving" | "saved";
  isPresenting: boolean;
  isPresentingLoading: boolean;
  presentingScaleLocks: Record<string, boolean>;
  currentSlideId: string | null;
  isThemeCreatorOpen: boolean;

  pageBackground: Record<string, unknown>;
  setPageBackground: (pageBackground: Record<string, unknown>) => void;
  // Generation states
  shouldStartOutlineGeneration: boolean;
  shouldStartPresentationGeneration: boolean;
  shouldStartImageSlideGeneration: boolean;
  isGeneratingOutline: boolean;
  isGeneratingPresentation: boolean;
  pendingCreateRequest: PendingPresentationCreateRequest | null;
  outline: string[];
  searchResults: Array<{ query: string; results: unknown[] }>; // Store search results for context
  webSearchEnabled: boolean; // Toggle for web search in outline generation
  slides: PlateSlide[]; // This now holds the new object structure

  // Root image generation tracking by slideId
  rootImageGeneration: Record<
    string,
    {
      query: string;
      status: "queued" | "generating" | "success" | "error";
      url?: string;
      error?: string;
    }
  >;

  isSidebarCollapsed: boolean;
  setIsSidebarCollapsed: (update: boolean) => void;
  isRightPanelCollapsed: boolean;
  setIsRightPanelCollapsed: (update: boolean) => void;
  setSlides: (
    slides:
      | PlateSlide[]
      | ((slides: PlateSlide[]) => PlateSlide[]),
    type?: HistoryType,
  ) => void;
  updateSlide: (
    slideId: string,
    updates: Partial<PlateSlide>,
    type?: HistoryType,
  ) => void;
  startRootImageGeneration: (slideId: string, query: string) => void;
  completeRootImageGeneration: (slideId: string, url: string) => void;
  failRootImageGeneration: (slideId: string, error: string) => void;
  clearRootImageGeneration: (slideId: string) => void;
  setCurrentPresentation: (id: string | null, title: string | null) => void;
  setIsGridView: (isGrid: boolean) => void;
  setIsSheetOpen: (isOpen: boolean) => void;
  setNumSlides: (num: number) => void;
  setTheme: (
    theme: Themes | string,
    customData?: ThemeProperties | null,
    type?: HistoryType,
  ) => void;
  shouldShowExitHeader: boolean;
  setShouldShowExitHeader: (udpdate: boolean) => void;
  thumbnailUrl?: string;
  setThumbnailUrl: (url: string | undefined) => void;
  setLanguage: (lang: string) => void;
  setPageStyle: (style: string) => void;
  setShowTemplates: (show: boolean) => void;
  setPresentationInput: (input: string) => void;
  setOutline: (topics: string[]) => void;
  setSearchResults: (
    results: Array<{ query: string; results: unknown[] }>,
  ) => void;
  setWebSearchEnabled: (enabled: boolean) => void;
  setImageModel: (model: ImageModelList) => void;
  setImageSource: (source: "automatic" | "ai" | "stock") => void;
  setStockImageProvider: (provider: "unsplash" | "pixabay") => void;
  setPresentationStyle: (style: string) => void;
  setModelProvider: (provider: "openai" | "ollama" | "lmstudio") => void;
  setModelId: (id: string) => void;
  setTextContent: (
    content: "minimal" | "concise" | "detailed" | "extensive",
  ) => void;
  setTone: (
    tone:
      | "auto"
      | "general"
      | "persuasive"
      | "inspiring"
      | "instructive"
      | "engaging",
  ) => void;
  setAudience: (
    audience:
      | "auto"
      | "general"
      | "business"
      | "investor"
      | "teacher"
      | "student",
  ) => void;
  setScenario: (
    scenario:
      | "auto"
      | "general"
      | "analysis-report"
      | "teaching-training"
      | "promotional-materials"
      | "public-speeches",
  ) => void;
  setSavingStatus: (status: "idle" | "saving" | "saved") => void;
  setIsPresenting: (isPresenting: boolean) => void;
  resetPresentMode: () => void;
  setIsPresentingLoading: (isLoading: boolean) => void;
  setPresentingScaleLock: (slideId: string, locked: boolean) => void;
  resetPresentingScaleLocks: () => void;
  setCurrentSlideId: (id: string | null) => void;
  nextSlide: () => void;
  previousSlide: () => void;

  setIsThemeCreatorOpen: (update: boolean) => void;
  // Typography overrides
  fontSize: "S" | "M" | "L"; // S=12px, M=16px, L=18px
  setFontSize: (size: "S" | "M" | "L") => void;
  fontFamily: { body: string; heading: string };
  setFontFamily: (fonts: { body?: string; heading?: string }) => void;
  // Generation actions
  setShouldStartOutlineGeneration: (shouldStart: boolean) => void;
  setShouldStartPresentationGeneration: (shouldStart: boolean) => void;
  setShouldStartImageSlideGeneration: (shouldStart: boolean) => void;
  setIsGeneratingOutline: (isGenerating: boolean) => void;
  setIsGeneratingPresentation: (isGenerating: boolean) => void;
  setPendingCreateRequest: (
    request: PendingPresentationCreateRequest | null,
  ) => void;
  consumePendingCreateRequest: () => PendingPresentationCreateRequest | null;
  startOutlineGeneration: () => void;
  startPresentationGeneration: () => void;
  startImageSlideGeneration: () => void;
  resetGeneration: () => void;
  resetForNewGeneration: () => void;
  resetPresentationState: () => void;

  // Selection state
  isSelecting: boolean;
  selectedPresentations: string[];
  toggleSelecting: () => void;
  selectAllPresentations: (ids: string[]) => void;
  deselectAllPresentations: () => void;
  togglePresentationSelection: (id: string) => void;

  // Unified right panel state (replaces isAgentOpen, isGlobalSettingsOpen)
  activeRightPanel: RightPanelType;
  setActiveRightPanel: (panel: RightPanelType) => void;

  // Pending agent message (for slide-specific editing from Magic Menu)
  pendingAgentMessage: {
    message: string;
    slideContext: string; // Serialized XML of the slide
  } | null;
  setPendingAgentMessage: (
    pending: { message: string; slideContext: string } | null,
  ) => void;

  // Image editor state for root image editing
  imageEditorInitialMode: ImageEditorMode | null;
  openImageEditor: (mode?: ImageEditorMode) => void;
  closeImageEditor: () => void;

  // Chart editor state for inline chart element editing
  chartEditorData: {
    chartType: string;
    chartData: unknown;
    chartOptions: Record<string, unknown>;
  } | null;
  openChartEditor: (
    chartData?: {
      chartType: string;
      chartData: unknown;
      chartOptions: Record<string, unknown>;
    },
    updateElementFn?: (props: Record<string, unknown>) => void,
  ) => void;
  closeChartEditor: () => void;

  // Infographic editor state for inline infographic element editing
  openInfographicEditor: (
    updateElementFn?: (props: Record<string, unknown>) => void,
  ) => void;
  closeInfographicEditor: () => void;

  // Presentation image editor state (for inline TImageElement editing)
  presentationImageEditorInitialMode: ImageEditorMode | null;
  // Bound function to update the element from the panel
  boundUpdateElement: ((props: Record<string, unknown>) => void) | null;
  openPresentationImageEditor: (
    mode?: ImageEditorMode,
    updateElementFn?: (props: Record<string, unknown>) => void,
  ) => void;
  closePresentationImageEditor: () => void;

  // Reordering state
  isReorderingSlides: boolean;
  setIsReorderingSlides: (isReordering: boolean) => void;

  // Generated image cache by prompt
  generatedImageCache: Record<string, GeneratedImage[]>;
  setGeneratedImageCache: (prompt: string, images: GeneratedImage[]) => void;

  // Image search state
  imageSearchState: {
    mode: "unsplash" | "pixabay";
    unsplashQuery: string;
    pixabayQuery: string;
  };
  setImageSearchState: (
    state: Partial<{
      mode: "unsplash" | "pixabay";
      unsplashQuery: string;
      pixabayQuery: string;
    }>,
  ) => void;

  // Slide template selection for outline
  selectedSlideTemplates: string[]; // Array of template IDs from TEMPLATE_DEFINITIONS
  setSelectedSlideTemplates: (templates: string[]) => void;
  outlineTemplateOverrides: Record<string, string | null>; // Map of outline ID -> template ID | null (null = auto)
  setOutlineTemplateOverride: (
    outlineId: string,
    templateId: string | null,
  ) => void;
  clearOutlineTemplateOverrides: () => void;

  // Zoom state for slide scaling in edit mode
  zoomLevel: number; // Zoom multiplier (1 = 100%, 1.4 = 140%, etc.)
  setZoomLevel: (level: number) => void;
  isReadOnly: boolean;
  setIsReadOnly: (isReadOnly: boolean) => void;
}

// Helper to handle history snapshots with circular dependency workaround
const pushHistorySnapshot = (
  type: HistoryType | undefined,
  slideId: string | undefined,
  changeType: "slide" | "theme" | "full" = "full",
) => {
  if (type === "history") return;

  // Dynamic import to avoid circular dependency

  const { history, pushSnapshot } = usePresentationHistoryState.getState();
  // Only push if history is initialized
  if (history.present !== null) {
    pushSnapshot(slideId, changeType);
  }
};

const getPresentModeResetState = () => ({
  isPresenting: false,
  isPresentingLoading: false,
  presentingScaleLocks: {},
  shouldShowExitHeader: false,
});

export const usePresentationState = create<PresentationState>((set, get) => ({
  currentPresentationId: null,
  currentPresentationTitle: null,
  isGridView: true,
  isSheetOpen: false,
  shouldShowExitHeader: false,
  setShouldShowExitHeader: (update) => set({ shouldShowExitHeader: update }),
  thumbnailUrl: undefined,
  setThumbnailUrl: (url) => set({ thumbnailUrl: url }),
  numSlides: 5,
  language: "en-US",
  pageStyle: "default",
  showTemplates: false,
  presentationInput: "",
  outline: [],
  searchResults: [],
  webSearchEnabled: false,
  theme: "mystique",
  customThemeData: null,
  imageModel: "fal-ai/flux-2/flash",
  imageSource: "automatic",
  stockImageProvider: "unsplash",
  presentationStyle: "professional",
  modelProvider: "openai",
  modelId: "llama3.1:8b",
  textContent: "concise",
  tone: "auto",
  audience: "auto",
  scenario: "auto",
  slides: [], // Now holds the new slide object structure
  rootImageGeneration: {},
  savingStatus: "idle",
  isPresenting: false,
  isPresentingLoading: false,
  presentingScaleLocks: {},
  currentSlideId: null,
  isThemeCreatorOpen: false,
  pageBackground: {},
  // Typography defaults
  fontSize: "M",
  setFontSize: (size) => set({ fontSize: size }),
  fontFamily: { body: "", heading: "" },
  setFontFamily: (fonts) =>
    set((state) => ({
      fontFamily: {
        body: fonts.body ?? state.fontFamily.body,
        heading: fonts.heading ?? state.fontFamily.heading,
      },
    })),
  isReorderingSlides: false,
  setIsReorderingSlides: (isReordering) =>
    set({ isReorderingSlides: isReordering }),

  // Generated image cache
  generatedImageCache: {},
  setGeneratedImageCache: (prompt, images) =>
    set((state) => ({
      generatedImageCache: {
        ...state.generatedImageCache,
        [prompt]: images,
      },
    })),

  // Image search state
  imageSearchState: {
    mode: "unsplash",
    unsplashQuery: "",
    pixabayQuery: "",
  },
  setImageSearchState: (newState) =>
    set((state) => ({
      imageSearchState: { ...state.imageSearchState, ...newState },
    })),

  // Slide template selection for outline
  selectedSlideTemplates: [],
  setSelectedSlideTemplates: (templates) =>
    set({ selectedSlideTemplates: templates }),
  outlineTemplateOverrides: {},
  setOutlineTemplateOverride: (outlineId, templateId) =>
    set((state) => ({
      outlineTemplateOverrides: {
        ...state.outlineTemplateOverrides,
        [outlineId]: templateId,
      },
    })),
  clearOutlineTemplateOverrides: () => set({ outlineTemplateOverrides: {} }),

  // Zoom state for slide scaling in edit mode
  zoomLevel: 1, // Default to 100%
  setZoomLevel: (level) => set({ zoomLevel: level }),
  isReadOnly: false,
  setIsReadOnly: (isReadOnly) => set({ isReadOnly }),

  // Sidebar states
  isSidebarCollapsed: false,
  setIsSidebarCollapsed: (update) => set({ isSidebarCollapsed: update }),
  isRightPanelCollapsed: false,
  setIsRightPanelCollapsed: (update) => set({ isRightPanelCollapsed: update }),

  // Generation states
  shouldStartOutlineGeneration: false,
  shouldStartPresentationGeneration: false,
  shouldStartImageSlideGeneration: false,
  isGeneratingOutline: false,
  isGeneratingPresentation: false,
  pendingCreateRequest: null,

  setSlides: (slides, type) => {
    set((state) => ({
      slides:
        typeof slides === "function"
          ? slides(state.slides)
          : slides,
    }));

    pushHistorySnapshot(type, undefined, "full");
  },
  updateSlide: (slideId, updates, type) => {
    set((state) => ({
      slides: state.slides.map((slide) =>
        slide.id === slideId ? { ...slide, ...updates } : slide,
      ),
    }));

    pushHistorySnapshot(type, slideId, "slide");
  },
  setPageBackground: (pageBackground) => set({ pageBackground }),

  // Unified right panel state
  activeRightPanel: null,
  setActiveRightPanel: (panel) => set({ activeRightPanel: panel }),

  // Pending agent message
  pendingAgentMessage: null,
  setPendingAgentMessage: (pending) => set({ pendingAgentMessage: pending }),

  // Image editor state
  imageEditorInitialMode: null,
  openImageEditor: (mode = "generate") =>
    set({
      imageEditorInitialMode: mode,
      activeRightPanel: "imageEditor",
    }),
  closeImageEditor: () =>
    set((state) => ({
      imageEditorInitialMode: null,
      activeRightPanel:
        state.activeRightPanel === "imageEditor"
          ? null
          : state.activeRightPanel,
    })),

  // Chart editor state
  chartEditorData: null,
  openChartEditor: (chartData, updateElementFn) =>
    set({
      activeRightPanel: "chartEditor",
      chartEditorData: chartData ?? null,
      boundUpdateElement: updateElementFn ?? null,
    }),
  closeChartEditor: () =>
    set((state) => ({
      activeRightPanel:
        state.activeRightPanel === "chartEditor"
          ? null
          : state.activeRightPanel,
      chartEditorData: null,
      boundUpdateElement:
        state.activeRightPanel === "chartEditor"
          ? null
          : state.boundUpdateElement,
    })),

  // Infographic editor state
  openInfographicEditor: (updateElementFn) =>
    set({
      activeRightPanel: "infographicEditor",
      boundUpdateElement: updateElementFn ?? null,
    }),
  closeInfographicEditor: () =>
    set((state) => ({
      activeRightPanel:
        state.activeRightPanel === "infographicEditor"
          ? null
          : state.activeRightPanel,
      boundUpdateElement:
        state.activeRightPanel === "infographicEditor"
          ? null
          : state.boundUpdateElement,
    })),

  // Presentation image editor state (for inline TImageElement editing)
  presentationImageElementId: null,
  presentationImageEditorInitialMode: null,
  boundUpdateElement: null,
  openPresentationImageEditor: (mode = "generate", updateElementFn) =>
    set({
      presentationImageEditorInitialMode: mode,
      activeRightPanel: "presentationImageEditor",
      boundUpdateElement: updateElementFn ?? null,
    }),
  closePresentationImageEditor: () =>
    set((state) => ({
      presentationImageEditorInitialMode: null,
      boundUpdateElement: null,
      activeRightPanel:
        state.activeRightPanel === "presentationImageEditor"
          ? null
          : state.activeRightPanel,
    })),

  startRootImageGeneration: (slideId, query) =>
    set((state) => ({
      rootImageGeneration: {
        ...state.rootImageGeneration,
        [slideId]: { query, status: "queued" },
      },
    })),
  completeRootImageGeneration: (slideId, url) =>
    set((state) => ({
      rootImageGeneration: {
        ...state.rootImageGeneration,
        [slideId]: {
          ...(state.rootImageGeneration[slideId] ?? { query: "" }),
          status: "success",
          url,
        },
      },
    })),
  failRootImageGeneration: (slideId, error) =>
    set((state) => ({
      rootImageGeneration: {
        ...state.rootImageGeneration,
        [slideId]: {
          ...(state.rootImageGeneration[slideId] ?? { query: "" }),
          status: "error",
          error,
        },
      },
    })),
  clearRootImageGeneration: (slideId) =>
    set((state) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { [slideId]: _removed, ...rest } = state.rootImageGeneration;
      return { rootImageGeneration: rest } as Partial<PresentationState>;
    }),
  setCurrentPresentation: (id, title) =>
    set({ currentPresentationId: id, currentPresentationTitle: title }),
  setIsGridView: (isGrid) => set({ isGridView: isGrid }),
  setIsSheetOpen: (isOpen) => set({ isSheetOpen: isOpen }),
  setNumSlides: (num) => set({ numSlides: num }),
  setLanguage: (lang) => set({ language: lang }),
  setTheme: (theme, customData = null, type) => {
    set({
      theme: theme,
      customThemeData: customData,
    });

    if (theme !== null) {
      pushHistorySnapshot(type, undefined, "theme");
    }
  },
  setPageStyle: (style) => set({ pageStyle: style }),
  setShowTemplates: (show) => set({ showTemplates: show }),
  setPresentationInput: (input) => set({ presentationInput: input }),
  setOutline: (topics) => set({ outline: topics }),
  setSearchResults: (results) => set({ searchResults: results }),
  setWebSearchEnabled: (enabled) => set({ webSearchEnabled: enabled }),
  setImageModel: (model) => set({ imageModel: model }),
  setImageSource: (source) => set({ imageSource: source }),
  setStockImageProvider: (provider) => set({ stockImageProvider: provider }),
  setPresentationStyle: (style) => set({ presentationStyle: style }),
  setModelProvider: (provider) => set({ modelProvider: provider }),
  setModelId: (id) => set({ modelId: id }),
  setTextContent: (content) => set({ textContent: content }),
  setTone: (tone) => set({ tone }),
  setAudience: (audience) => set({ audience }),
  setScenario: (scenario) => set({ scenario }),
  setSavingStatus: (status) => set({ savingStatus: status }),
  setIsPresenting: (isPresenting) =>
    set(() =>
      isPresenting
        ? { isPresenting: true, shouldShowExitHeader: false }
        : getPresentModeResetState(),
    ),
  resetPresentMode: () => set(getPresentModeResetState()),
  setIsPresentingLoading: (isLoading) =>
    set({ isPresentingLoading: isLoading }),
  setPresentingScaleLock: (slideId, locked) =>
    set((state) => ({
      presentingScaleLocks: {
        ...state.presentingScaleLocks,
        [slideId]: locked,
      },
    })),
  resetPresentingScaleLocks: () => set({ presentingScaleLocks: {} }),
  setCurrentSlideId: (id) => set({ currentSlideId: id }),
  nextSlide: () => {
    set((state) => {
      const currentIndex = state.slides.findIndex(
        (s) => s.id === state.currentSlideId,
      );
      const newIndex = Math.min(
        (currentIndex === -1 ? 0 : currentIndex) + 1,
        state.slides.length - 1,
      );
      const newSlideId = state.slides[newIndex]?.id ?? null;
      return { currentSlideId: newSlideId };
    });
  },
  previousSlide: () =>
    set((state) => {
      const currentIndex = state.slides.findIndex(
        (s) => s.id === state.currentSlideId,
      );
      const newIndex = Math.max(
        (currentIndex === -1 ? 0 : currentIndex) - 1,
        0,
      );
      const newSlideId = state.slides[newIndex]?.id ?? null;
      return {
        currentSlideId: newSlideId,
      };
    }),

  // Generation actions
  setShouldStartOutlineGeneration: (shouldStart) =>
    set({ shouldStartOutlineGeneration: shouldStart }),
  setShouldStartPresentationGeneration: (shouldStart) =>
    set({ shouldStartPresentationGeneration: shouldStart }),
  setShouldStartImageSlideGeneration: (shouldStart) =>
    set({ shouldStartImageSlideGeneration: shouldStart }),
  setIsGeneratingOutline: (isGenerating) =>
    set({ isGeneratingOutline: isGenerating }),
  setIsGeneratingPresentation: (isGenerating) =>
    set({ isGeneratingPresentation: isGenerating }),
  setPendingCreateRequest: (pendingCreateRequest) =>
    set({ pendingCreateRequest }),
  consumePendingCreateRequest: () => {
    const pendingCreateRequest = get().pendingCreateRequest;
    if (!pendingCreateRequest) {
      return null;
    }

    set({ pendingCreateRequest: null });
    return pendingCreateRequest;
  },
  startOutlineGeneration: () =>
    set({
      ...getPresentModeResetState(),
      shouldStartOutlineGeneration: true,
      isGeneratingOutline: true,
      shouldStartPresentationGeneration: false,
      isGeneratingPresentation: false,
      outline: [],
      searchResults: [],
      outlineTemplateOverrides: {},
      slides: [],
    }),
  startPresentationGeneration: () =>
    set((state) =>
      state.outline.some((item) => item.trim().length > 0)
        ? {
            ...getPresentModeResetState(),
            shouldStartPresentationGeneration: true,
            isGeneratingPresentation: true,
            slides: [],
          }
        : {
            ...getPresentModeResetState(),
            shouldStartPresentationGeneration: false,
            isGeneratingPresentation: false,
          },
    ),
  startImageSlideGeneration: () =>
    set((state) =>
      state.outline.some((item) => item.trim().length > 0)
        ? {
            ...getPresentModeResetState(),
            shouldStartImageSlideGeneration: true,
            isGeneratingPresentation: true,
            slides: [],
          }
        : {
            ...getPresentModeResetState(),
            shouldStartImageSlideGeneration: false,
            isGeneratingPresentation: false,
          },
    ),
  resetGeneration: () =>
    set({
      shouldStartOutlineGeneration: false,
      shouldStartPresentationGeneration: false,
      shouldStartImageSlideGeneration: false,
      isGeneratingOutline: false,
      isGeneratingPresentation: false,
      searchResults: [],
    }),

  // Reset everything except ID and current input when starting new outline generation
  resetForNewGeneration: () =>
    set(() => ({
      ...getPresentModeResetState(),
      thumbnailUrl: undefined,
      outline: [],
      searchResults: [],
      slides: [],
      rootImageGeneration: {},
      pageBackground: {},
      selectedSlideTemplates: [],
      outlineTemplateOverrides: {},
    })),

  // Comprehensive reset when navigating back to /presentations page
  resetPresentationState: () =>
    set(() => ({
      ...getPresentModeResetState(),
      // Clear presentation-specific state
      currentPresentationId: null,
      currentPresentationTitle: null,
      presentationInput: "",
      outline: [],
      slides: [],
      searchResults: [],
      rootImageGeneration: {},
      pageBackground: {},
      thumbnailUrl: undefined,

      // Reset generation flags
      shouldStartOutlineGeneration: false,
      shouldStartPresentationGeneration: false,
      isGeneratingOutline: false,
      isGeneratingPresentation: false,
      pendingCreateRequest: null,

      // Reset UI state
      activeRightPanel: null,
      pendingAgentMessage: null,
      imageEditorInitialMode: null,
      presentationImageElementId: null,
      presentationImageEditorInitialMode: null,
      boundUpdateElement: null,
      isSidebarCollapsed: false,
      isRightPanelCollapsed: false,
      currentSlideId: null,
      savingStatus: "idle",
      generatedImageCache: {},
      selectedSlideTemplates: [],
      outlineTemplateOverrides: {},
      isReadOnly: false,
    })),

  setIsThemeCreatorOpen: (update) => set({ isThemeCreatorOpen: update }),
  // Selection state
  isSelecting: false,
  selectedPresentations: [],
  toggleSelecting: () =>
    set((state) => ({
      isSelecting: !state.isSelecting,
      selectedPresentations: [],
    })),
  selectAllPresentations: (ids) => set({ selectedPresentations: ids }),
  deselectAllPresentations: () => set({ selectedPresentations: [] }),
  togglePresentationSelection: (id) =>
    set((state) => ({
      selectedPresentations: state.selectedPresentations.includes(id)
        ? state.selectedPresentations.filter((p) => p !== id)
        : [...state.selectedPresentations, id],
    })),
}));
