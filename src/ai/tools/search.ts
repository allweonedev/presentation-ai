import { env } from "@/env";
import { tavily } from "@tavily/core";
import { tool } from "@langchain/core/tools";
import z from "zod";

const tavilyService = tavily({ apiKey: env.TAVILY_API_KEY });

export const search_tool = tool(
  async ({ query }) => {
    try {
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
