import { tool } from "langchain";
import z from "zod";
import { retrievalService } from "../services/rag-service.js";

export const ragSearch = tool(
    async ({query}) => {
        return await retrievalService(query)
    },
    {
        name: "rag_search",
        description: "Untuk mencari informasi dari file internal",
        schema: z.object({
            query: z.string().describe("Query pencarian yang digunakan untuk mencari dokumen")
        })
    }
)