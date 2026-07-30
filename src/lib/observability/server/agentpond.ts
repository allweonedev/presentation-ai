import { createFilesSpanExporterFromRuntimeEnv } from "@agentpond/files-sdk/otel";
import { LangChainInstrumentation } from "@arizeai/openinference-instrumentation-langchain";
import { NodeSDK } from "@opentelemetry/sdk-node";

let sdk: NodeSDK | undefined;
let instrumentation: LangChainInstrumentation | undefined;
let initialization: Promise<boolean> | undefined;

export async function startAgentPond(): Promise<boolean> {
  if (process.env.AGENTPOND_ENABLED !== "true") {
    return false;
  }

  initialization ??= (async () => {
    try {
      sdk = new NodeSDK({
        serviceName: "allweone-presentation-ai",
        traceExporter: createFilesSpanExporterFromRuntimeEnv(),
      });
      sdk.start();

      instrumentation = new LangChainInstrumentation({
        traceConfig: {
          hideInputs: true,
          hideOutputs: true,
        },
      });
      const callbackManager = await import("@langchain/core/callbacks/manager");
      instrumentation.manuallyInstrument(callbackManager);

      process.once("beforeExit", () => {
        void shutdownAgentPond();
      });
      return true;
    } catch (error) {
      console.warn(
        "[AgentPond] Tracing could not be initialized; continuing without it.",
        error,
      );
      instrumentation = undefined;
      sdk = undefined;
      return false;
    }
  })();

  return initialization;
}

export async function shutdownAgentPond(): Promise<void> {
  instrumentation?.disable();
  instrumentation = undefined;

  const activeSdk = sdk;
  sdk = undefined;
  if (activeSdk) {
    await activeSdk.shutdown();
  }
}
