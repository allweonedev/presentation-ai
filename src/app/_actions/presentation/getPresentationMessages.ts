"use server";

import { createPresentationGraph } from "@/ai/agents/presentation/createAgent";
import { ensureCheckpointerSetup } from "@/ai/lib/postgres";
import { auth } from "@/server/auth";
import { toHydratedUiMessages } from "@/server/ai/chatMessages";
import { type UIMessage } from "ai";
import { type BaseMessage } from "@langchain/core/messages";

interface PresentationGraphState {
  values: {
    messages?: BaseMessage[];
    activeMessages?: BaseMessage[];
  };
  tasks?: Array<{
    interrupts?: unknown[];
    state?: unknown;
  }>;
}

export async function getPresentationMessages(
  presentationId: string,
): Promise<UIMessage[]> {
  const session = await auth();

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  await ensureCheckpointerSetup();

  const graph = createPresentationGraph();
  let state: PresentationGraphState | null = null;

  try {
    state = (await graph.getState(
      {
        configurable: {
          thread_id: presentationId,
        },
      },
      { subgraphs: true },
    )) as PresentationGraphState;
  } catch {
    state = null;
  }

  if (!state) {
    return [];
  }

  const stateValues = state.values;

  let allMessages = [
    ...(stateValues.messages ?? []),
    ...(stateValues.activeMessages ?? []),
  ].filter(
    (message) => message.type !== "system" && message.type !== "developer",
  );

  if (state.tasks && state.tasks.length > 0) {
    const taskWithInterrupt = state.tasks.find(
      (task) => task.interrupts && task.interrupts.length > 0,
    );

    if (taskWithInterrupt) {
      const nestedState = (
        taskWithInterrupt.state as {
          tasks?: Array<{
            state?: {
              values?: {
                messages?: BaseMessage[];
                activeMessages?: BaseMessage[];
              };
            };
          }>;
        }
      ).tasks?.[0]?.state?.values;

      if (nestedState) {
        allMessages = [
          ...(nestedState.messages ?? []),
          ...(nestedState.activeMessages ?? []),
        ].filter(
          (message) => message.type !== "system" && message.type !== "developer",
        );
      }
    }
  }

  return toHydratedUiMessages(allMessages);
}
