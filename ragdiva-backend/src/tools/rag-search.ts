import { tool } from "langchain";
import z from "zod";

export const ragSearch = tool(
    ({query}) => {
        return 'Info: RAG belum dibuat !'
    },
    {
        name: "rag_search",
        description: "Untuk mencari informasi dari file internal",
        schema: z.object({
            query: z.string().describe("Query pencarian yang digunakan untuk mencari dokumen")
        })
    }
)