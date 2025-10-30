import { env } from "@/env";
import { tavily } from "@tavily/core";
import { type Tool } from "ai";
import z from "zod";

const tavilyService = tavily({ apiKey: env.TAVILY_API_KEY });

export const search_tool: Tool = {
  description:
    "A search engine optimized for comprehensive, accurate, and trusted results. Useful for when you need to answer questions about current events like news, weather, stock price etc. Input should be a search query.",
  parameters: z.object({
    query: z.string(),
  }),
  execute: async ({ query }: { query: string }) => {
    try {
      console.log("🔍 Executing web search:", query);
      
      // Add timeout to prevent hanging
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Search timeout')), 10000) // 10 second timeout
      );
      
      const searchPromise = tavilyService.search(query, { max_results: 3 });
      
      const response = await Promise.race([searchPromise, timeoutPromise]);
      console.log("✅ Search completed:", query);
      return JSON.stringify(response);
    } catch (error) {
      console.error("❌ Search error:", error);
      return JSON.stringify({ error: "Search failed", query });
    }
  },
};
