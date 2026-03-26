type LogLevel = "info" | "warn" | "error";

type LogDetails = Record<string, unknown>;

function serializeError(error: unknown) {
  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
      stack: error.stack,
    };
  }

  if (typeof error === "string") {
    return { message: error };
  }

  return { value: error };
}

function writeLog(
  level: LogLevel,
  scope: string,
  message: string,
  details?: LogDetails,
  error?: unknown,
) {
  const payload = {
    timestamp: new Date().toISOString(),
    scope,
    ...(details ? { details } : {}),
    ...(error !== undefined ? { error: serializeError(error) } : {}),
  };
  const prefix = `[presentation-ai][${scope}] ${message}`;

  if (level === "error") {
    console.error(prefix, payload);
    return;
  }

  if (level === "warn") {
    console.warn(prefix, payload);
    return;
  }

  console.info(prefix, payload);
}

export function createLogger(scope: string) {
  return {
    child(childScope: string) {
      return createLogger(`${scope}:${childScope}`);
    },
    info(message: string, details?: LogDetails) {
      writeLog("info", scope, message, details);
    },
    warn(message: string, details?: LogDetails) {
      writeLog("warn", scope, message, details);
    },
    error(message: string, error?: unknown, details?: LogDetails) {
      writeLog("error", scope, message, details, error);
    },
  };
}

export const appLogger = createLogger("app");
