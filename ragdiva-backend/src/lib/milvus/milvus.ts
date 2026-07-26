import {
    DataType,
    FunctionType,
    IndexType,
    MetricType,
    MilvusClient,
} from "@zilliz/milvus2-sdk-node";

export const client = new MilvusClient({
    address: process.env.MILVUS_URL!,
    token: "root:Milvus",
});

export async function ensureDatabase(dbName: string) {
    const { db_names } = await client.listDatabases();
    if (!db_names.includes(dbName)) {
        await client.createDatabase({ db_name: dbName });
        console.log(`Database ${dbName} telah dibuat`);
    }
}

export async function ensureCollection(
    collectionName: string,
    embeddingDim: number = 1024,
) {
    const { value: exists } = await client.hasCollection({
        collection_name: collectionName,
    });

    if (!exists) {
        const functions = [
            {
                name: "text_bm25_emb",
                description: "bm_25 function",
                type: FunctionType.BM25,
                input_field_names: ["content"],
                output_field_names: ["sparse"],
                params: {},
            },
        ];
        await client.createCollection({
            collection_name: collectionName,
            fields: [
                {
                    name: "id",
                    data_type: DataType.Int64,
                    is_primary_key: true,
                    autoID: true,
                },
                {
                    name: "document_id",
                    data_type: DataType.VarChar,
                    max_length: 191,
                },
                {
                    name: "metadata",
                    data_type: DataType.JSON,
                },
                {
                    name: "embedding",
                    data_type: DataType.Float16Vector,
                    dim: embeddingDim,
                },
                {
                    name: "content",
                    data_type: DataType.VarChar,
                    max_length: 5000,
                    enable_analyzer: true,
                    enable_match: true,
                },
                {
                    name: "sparse",
                    data_type: DataType.SparseFloatVector,
                },
            ],
            functions: functions,
        });

        await client.createIndex({
            collection_name: collectionName,
            field_name: "embedding",
            index_type: IndexType.HNSW,
            metric_type: MetricType.COSINE,
            params: { M: 16, efConstruction: 200 },
        });

        await client.createIndex({
            collection_name: collectionName,
            field_name: "sparse",
            index_type: IndexType.SPARSE_INVERTED_INDEX,
            params: {
                inverted_index_algo: "DAAT_MAXSCORE",
                bm25_k1: 1.2,
                bm25_b: 0.75,
            },
        });
    }

    const { state } = await client.getLoadState({
        collection_name: collectionName,
    });

    if (state != "LoadStateLoaded") {
        await client.loadCollection({ collection_name: collectionName });
        console.log(`Collection "${collectionName}" diload`);
    }
}

export async function clearCollection(
    collectionName: string = "ragdiva_rag_collection",
) {
    await client.useDatabase({ db_name: process.env.MILVUS_DB! });
    try {
        await client.dropCollection({ collection_name: collectionName });
        await client.dropIndex({ collection_name: collectionName });
    } catch {}
}

export async function milvusSetup(embeddingDim: number = 1024) {
    await ensureDatabase(process.env.MILVUS_DB!);
    await client.useDatabase({ db_name: process.env.MILVUS_DB! });
    await ensureCollection("ragdiva_rag_collection", embeddingDim);
}

export const weightedRanker = {
    name: "weight",
    input_field_names: [],
    function_type: FunctionType.RERANK,
    params: {
        reranker: "weighted",
        weights: [0.1, 0.9],
        norm_score: true,
    },
};

export const rrfReranker = {
    name: "rrf",
    input_field_names: [],
    function_type: FunctionType.RERANK,
    params: {
        reranker: "rrf",
        k: 60,
    },
}