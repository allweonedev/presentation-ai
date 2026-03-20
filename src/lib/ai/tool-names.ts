export const WEB_SEARCH_TOOL_NAME = "tavily_search_results_json";
export const LEGACY_WEB_SEARCH_TOOL_NAME = "webSearch";

export function isWebSearchToolName(toolName: string) {
  return (
    toolName === WEB_SEARCH_TOOL_NAME ||
    toolName === LEGACY_WEB_SEARCH_TOOL_NAME
  );
}
