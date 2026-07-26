import { BaseEmbedding } from "./base-embedding.js";

export class Nemotron3Embedding extends BaseEmbedding {
    constructor(){
        super(2048, "", "nvidia/nemotron-3-embed-1b")
    }
}