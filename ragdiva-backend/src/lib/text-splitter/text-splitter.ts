import { RecursiveCharacterTextSplitter, MarkdownTextSplitter } from "@langchain/textsplitters"

export const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 2000,
    chunkOverlap: 200
})

export const markdownTextSplitter = new MarkdownTextSplitter()