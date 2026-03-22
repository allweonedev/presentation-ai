type SpanAttributes = Record<string, string | number | boolean | undefined>;

class NoopSpan {
  annotate(_attributes: SpanAttributes) {}
  event(_name: string, _attributes?: SpanAttributes) {}
  error(error: unknown) {
    console.error(error);
  }
  end() {}
}

export const logger = {
  startSpan(_name: string, _options?: { attributes?: SpanAttributes }) {
    return new NoopSpan();
  },
};
