import { BaseEmbedding, type Embedding } from "./base-embedding.js";
import { BgeM3Embedding } from "./bge-m3-embedding.js";
import { GemmaEmbedding } from "./gemma-embedding.js";
import { Nemotron3Embedding } from "./nemotron-3-embedding.js";
import { NvEmbedding } from "./nv-embedding.js";

const embeddingMap = [
    {
        match: "bge-m3",
        create: () => new BgeM3Embedding()
    },
    {
        match: "nemotron",
        create: () => new Nemotron3Embedding()
    },
    {
        match: "gemma",
        create: () => new GemmaEmbedding()
    },
    {
        match: "nv-embed",
        create: () => new NvEmbedding()
    }
]

export function AutoEmbedding(
    model: string,
    endpoint: string,
    credential: string,
    dim: number = 0
): Embedding {
    const found = embeddingMap.find((x) => model.includes(x.match))
    const embedding = found ? found.create() : new BaseEmbedding()

    embedding.setEmbeddingEndpoint(endpoint)
    embedding.setEmbeddingModelName(model)
    embedding.setEmbeddingModelDim(dim)
    embedding.setCredential(credential)

    return embedding
}