import z from "zod";
import { prisma } from "../lib/database.js";
import { tool } from "langchain";

export const dbSearch = tool(
    (async ({query}) => {
        let result
        try {
            result = await prisma.$queryRawUnsafe(query)
            return JSON.stringify(result)
        } catch (e) {
            return JSON.stringify(e)
        }
    }),
    {
        name: "db_search",
        description: "Untuk mencari informasi dari database langsung",
        schema: z.object({
            query: z.string().describe("Query yang diberikan kepada mysql langsung")
        })
    }
)