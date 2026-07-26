import { BaseEmbedding } from "./base-embedding.js";

export class NvEmbedding extends BaseEmbedding {
    constructor(){
        super(1024, "", "nvidia/nv-embed-v1")
    }
}