import { create } from "zustand";

let activeInfographicStreamingSessions = 0;
let pendingInfographicStreamingReset:
  | ReturnType<typeof setTimeout>
  | null = null;

type InfographicStreamingState = {
  completedInfographicIds: Record<string, true>;
  startedGenerationRequests: Record<string, true>;
  beginStreamingSession: () => void;
  endStreamingSession: () => void;
  setCompletedInfographicIds: (ids: string[]) => void;
  tryStartGenerationRequest: (requestId: string) => boolean;
  clearGenerationRequestStarted: (requestId: string) => void;
  resetInfographicStreaming: () => void;
};

function toCompletedInfographicMap(ids: string[]): Record<string, true> {
  const nextState: Record<string, true> = {};

  for (const id of ids) {
    const trimmedId = id.trim();

    if (trimmedId) {
      nextState[trimmedId] = true;
    }
  }

  return nextState;
}

function areCompletedInfographicMapsEqual(
  left: Record<string, true>,
  right: Record<string, true>,
): boolean {
  const leftKeys = Object.keys(left);
  const rightKeys = Object.keys(right);

  if (leftKeys.length !== rightKeys.length) {
    return false;
  }

  return leftKeys.every((key) => right[key] === true);
}

export const useInfographicStreamingState = create<InfographicStreamingState>(
  (set, get) => ({
    completedInfographicIds: {},
    startedGenerationRequests: {},
    beginStreamingSession: () => {
      activeInfographicStreamingSessions += 1;

      if (pendingInfographicStreamingReset !== null) {
        clearTimeout(pendingInfographicStreamingReset);
        pendingInfographicStreamingReset = null;
      }
    },
    endStreamingSession: () => {
      activeInfographicStreamingSessions = Math.max(
        0,
        activeInfographicStreamingSessions - 1,
      );

      if (
        activeInfographicStreamingSessions > 0
        || pendingInfographicStreamingReset !== null
      ) {
        return;
      }

      pendingInfographicStreamingReset = setTimeout(() => {
        pendingInfographicStreamingReset = null;

        if (activeInfographicStreamingSessions > 0) {
          return;
        }

        get().resetInfographicStreaming();
      }, 0);
    },
    setCompletedInfographicIds: (ids: string[]) =>
      set((state) => {
        const nextCompletedInfographicIds = toCompletedInfographicMap(ids);

        if (
          areCompletedInfographicMapsEqual(
            state.completedInfographicIds,
            nextCompletedInfographicIds,
          )
        ) {
          return state;
        }

        return { completedInfographicIds: nextCompletedInfographicIds };
      }),
    tryStartGenerationRequest: (requestId: string) => {
      if (!requestId) {
        return false;
      }

      if (get().startedGenerationRequests[requestId] === true) {
        return false;
      }

      set((state) => ({
        startedGenerationRequests: {
          ...state.startedGenerationRequests,
          [requestId]: true,
        },
      }));

      return true;
    },
    clearGenerationRequestStarted: (requestId: string) =>
      set((state) => {
        if (!requestId || !(requestId in state.startedGenerationRequests)) {
          return state;
        }

        const { [requestId]: _removed, ...rest } = state.startedGenerationRequests;

        return {
          startedGenerationRequests: rest,
        };
      }),
    resetInfographicStreaming: () =>
      set((state) => {
        if (pendingInfographicStreamingReset !== null) {
          clearTimeout(pendingInfographicStreamingReset);
          pendingInfographicStreamingReset = null;
        }

        return Object.keys(state.completedInfographicIds).length > 0
            || Object.keys(state.startedGenerationRequests).length > 0
          ? { completedInfographicIds: {}, startedGenerationRequests: {} }
          : state;
      }),
  }),
);
