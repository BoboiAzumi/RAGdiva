import { RecursiveCharacterTextSplitter, MarkdownTextSplitter } from "@langchain/textsplitters"

export const recursiveCharacterTextSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 4000,
    chunkOverlap: 200
})

export const markdownTextSplitter = new MarkdownTextSplitter({
    chunkSize: 4000,
    chunkOverlap: 500,
    keepSeparator: true,
})