import { TavilySearch } from "@langchain/tavily";

export const tavilyTool = new TavilySearch({
    name: "tavily",
    maxResults: 5,
    topic: "general",
    // includeAnswer: false,
    // includeRawContent: false,
    includeImages: false,
    includeImageDescriptions: false,
    searchDepth: "basic",
    timeRange: "day",
    // includeDomains: [],
    // excludeDomains: [],
});
