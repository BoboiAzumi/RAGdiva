import { BaseEmbedding } from "./base-embedding.js";

export class GemmaEmbedding extends BaseEmbedding {
    constructor() {
        super(768, "", "embeddinggemma");
    }

    protected override async _fetch(
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
                    input:
                        type == "query"
                            ? `task: search result | query: ${content}`
                            : `title: none | text: ${content}`,
                    model: this.modelName,
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
}
