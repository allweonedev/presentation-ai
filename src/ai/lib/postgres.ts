import { env } from "@/env";
import { PostgresSaver } from "@langchain/langgraph-checkpoint-postgres";

export const checkpointer = PostgresSaver.fromConnString(env.DATABASE_URL);

let setupPromise: Promise<void> | null = null;

export async function ensureCheckpointerSetup() {
  if (!setupPromise) {
    setupPromise = checkpointer.setup().catch((error) => {
      setupPromise = null;
      throw error;
    });
  }

  await setupPromise;
}
