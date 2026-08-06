import { embeddingSemaphore } from "../semaphore/semaphore.js";

export interface Embedding {
    setEmbeddingEndpoint(endpoint: string): void;
    setEmbeddingModelName(modelName: string): void;
    setEmbeddingModelDim(dim: number): void;
    setCredential(credential: string): void;
    getEmbeddingModelDim(): number;
    queryEmbed(content: string[]): Promise<number[][]>;
    passageEmbed(content: string[]): Promise<number[][]>;
}

export class BaseEmbedding implements Embedding {
    protected dim: number;
    protected endpoint: string;
    protected modelName: string;
    protected credential: string;
    protected maxBatch: number;

    constructor(
        dim: number = 0,
        endpoint: string = "",
        modelName: string = "",
    ) {
        this.dim = dim;
        this.endpoint = endpoint;
        this.modelName = modelName;
        this.credential = "";
        this.maxBatch = 4;
    }

    setEmbeddingEndpoint(endpoint: string): void {
        this.endpoint = endpoint;
    }

    setEmbeddingModelName(modelName: string): void {
        this.modelName = modelName;
    }

    setEmbeddingModelDim(dim: number): void {
        this.dim = dim;
    }

    getEmbeddingModelDim(): number {
        return this.dim;
    }

    setCredential(credential: string): void {
        this.credential = credential;
    }

    setMaxBatch(batch: number): void {
        this.maxBatch = batch;
    }

    async queryEmbed(content: string[]): Promise<number[][]> {
        let result: number[][] = [];
        try {
            if (this.maxBatch == 0) {
                const json = await this._fetch(content, "query");

                return this._adapter(json);
            }

            const batchCount = Math.ceil(content.length / this.maxBatch);
            for (let i = 0; i < batchCount; i++) {
                const batch = content.slice(
                    i * this.maxBatch,
                    this.maxBatch * (i + 1),
                );
                const json = await this._fetch(batch, "query");
                result = result.concat(this._adapter(json));
            }
        } finally {}

        return result;
    }

    async passageEmbed(content: string[]): Promise<number[][]> {
        await embeddingSemaphore.acquire();
        let result: number[][] = [];
        try {
            if (this.maxBatch == 0) {
                const json = await this._fetch(content, "passage");

                return this._adapter(json);
            }

            const batchCount = Math.ceil(content.length / this.maxBatch);
            for (let i = 0; i < batchCount; i++) {
                console.log(`Batch ${i + 1} / ${batchCount}`)
                const batch = content.slice(
                    i * this.maxBatch,
                    this.maxBatch * (i + 1),
                );
                const json = await this._fetch(batch, "passage");
                result = result.concat(this._adapter(json));
            }
        } finally {
            embeddingSemaphore.release();
        }

        return result;
    }

    protected async _fetch(
        content: string[],
        type: "passage" | "query",
    ): Promise<any> {
        try {
            const apifetch = await fetch(this.endpoint, {
                signal: AbortSignal.timeout(300_000),
                headers: {
                    "Content-Type": "application/json",
                    ...(this.credential != ""
                        ? {
                              Authorization: `Bearer ${this.credential}`,
                          }
                        : {}),
                },
                method: "POST",
                body: JSON.stringify({
                    input: content,
                    model: this.modelName,
                    input_type: type,
                    encoding_format: "float",
                }),
            });
            if (!apifetch.ok) {
                throw new Error(
                    `Embedding endpoint ${apifetch.status}: ${await apifetch.text()}`,
                );
            }
            const json = await apifetch.json();

            return json;
        } catch (e) {
            console.error("[_fetch] failed:", e, "cause:", (e as any)?.cause);
            throw e;
        }
    }

    protected _adapter(data: any): number[][] {
        const isOpenAiFormat = data.data ? true : false;
        const isOllamaFormat = data.embeddings ? true : false;
        let result: number[][];

        if (isOpenAiFormat) {
            data.data.sort(
                (
                    a: {
                        embedding: number[];
                        index: number;
                        object: string;
                    },
                    b: {
                        embedding: number[];
                        index: number;
                        object: string;
                    },
                ) => a.index - b.index,
            );

            result = data.data.map(
                (v: { embedding: number[]; index: number; object: string }) =>
                    v.embedding,
            );
        } else if (isOllamaFormat) {
            result = data.embeddings;
        } else {
            result = [[]];
        }

        return result;
    }
}
