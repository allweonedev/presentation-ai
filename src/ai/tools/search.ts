import { env } from "@/env";
import { requireOptionalIntegration } from "@/lib/env/optional-integrations";
import { tavily } from "@tavily/core";
import { tool } from "@langchain/core/tools";
import z from "zod";

export const search_tool = tool(
  async ({ query }) => {
    try {
      const tavilyConfig = requireOptionalIntegration({
        integration: "Tavily",
        envVar: "TAVILY_API_KEY",
        value: env.TAVILY_API_KEY,
        feature: "web search",
      });

      if (!tavilyConfig.ok) {
        return tavilyConfig.error;
      }

      const tavilyService = tavily({ apiKey: tavilyConfig.value });
      const response = await tavilyService.search(query, { max_results: 5 });
      return JSON.stringify(response);
    } catch (error) {
      console.error("Search error:", error);
      return "Search failed";
    }
  },
  {
    name: "webSearch",
    description:
      "Search the web for current information relevant to the presentation topic.",
    schema: z.object({
      query: z.string(),
    }),
  },
);
