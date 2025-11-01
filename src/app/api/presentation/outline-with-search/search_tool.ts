import { env } from "@/env";
import { tavily } from "@tavily/core";
import { type Tool } from "ai";
import z from "zod";

const tavilyService = env.TAVILY_API_KEY ? tavily({ apiKey: env.TAVILY_API_KEY }) : null;

export const search_tool: Tool = {
  description:
    "A search engine optimized for comprehensive, accurate, and trusted results. Useful for when you need to answer questions about current events like news, weather, stock price etc. Input should be a search query.",
  parameters: z.object({
    query: z.string(),
  }),
  execute: async ({ query }: { query: string }) => {
    try {
      console.log("🔍 Executing web search:", query);
      
      if (!tavilyService) {
        const errorMsg = "⚠️ Tavily API key not configured. Set TAVILY_API_KEY environment variable to enable web search.";
        console.warn(errorMsg);
        return JSON.stringify({ 
          error: "Search service not configured", 
          message: "TAVILY_API_KEY environment variable is not set",
          query,
          results: [],
          fallback: true
        });
      }
      
      // Add timeout to prevent hanging
      const timeoutPromise = new Promise<never>((_, reject) => 
        setTimeout(() => reject(new Error('Search timeout after 15 seconds')), 15000)
      );
      
      const searchPromise = tavilyService.search(query, { 
        max_results: 3,
        search_depth: "basic",
        include_answer: false,
        include_raw_content: false
      });
      
      const response = await Promise.race([searchPromise, timeoutPromise]);
      console.log("✅ Search completed for query:", query);
      console.log("📊 Search results count:", (response as any)?.results?.length || 0);
      return JSON.stringify({
        ...response,
        query,
        success: true,
        fallback: false
      });
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      console.error("❌ Search error for query:", query, "Error:", errorMsg);
      return JSON.stringify({ 
        error: "Search failed", 
        message: errorMsg,
        query,
        results: [],
        fallback: true
      });
    }
  },
};
