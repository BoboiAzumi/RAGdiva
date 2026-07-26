import { BaseEmbedding } from "./base-embedding.js";

export class BgeM3Embedding extends BaseEmbedding {
    constructor(){
        super(1024, "", "bge-m3")
    }
}