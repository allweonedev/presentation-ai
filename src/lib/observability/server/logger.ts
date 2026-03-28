import { appLogger } from "@/lib/observability/logger";

type SpanAttributes = Record<string, string | number | boolean | undefined>;

class ConsoleSpan {
  private readonly startedAt = Date.now();
  private attributes: SpanAttributes;

  constructor(
    private readonly name: string,
    initialAttributes?: SpanAttributes,
  ) {
    this.attributes = { ...initialAttributes };
    appLogger.child("server").info("Span started", {
      spanName: this.name,
      attributes: this.attributes,
    });
  }

  annotate(attributes: SpanAttributes) {
    this.attributes = {
      ...this.attributes,
      ...attributes,
    };
  }

  event(name: string, attributes?: SpanAttributes) {
    appLogger.child("server").info(name, {
      spanName: this.name,
      attributes: {
        ...this.attributes,
        ...attributes,
      },
    });
  }

  error(error: unknown) {
    appLogger.child("server").error("Span failed", error, {
      spanName: this.name,
      attributes: this.attributes,
    });
  }

  end() {
    appLogger.child("server").info("Span ended", {
      spanName: this.name,
      durationMs: Date.now() - this.startedAt,
      attributes: this.attributes,
    });
  }
}

export const logger = {
  info(message: string, attributes?: SpanAttributes) {
    appLogger.child("server").info(message, attributes);
  },
  warn(message: string, attributes?: SpanAttributes) {
    appLogger.child("server").warn(message, attributes);
  },
  error(message: string, error?: unknown, attributes?: SpanAttributes) {
    appLogger.child("server").error(message, error, attributes);
  },
  startSpan(name: string, options?: { attributes?: SpanAttributes }) {
    return new ConsoleSpan(name, options?.attributes);
  },
};
