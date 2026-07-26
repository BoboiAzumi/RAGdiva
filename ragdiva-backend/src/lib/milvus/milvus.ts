import { DataType, IndexType, MetricType, MilvusClient } from "@zilliz/milvus2-sdk-node"

export const client = new MilvusClient({
    address: process.env.MILVUS_URL!,
    token: "root:Milvus",
});

export async function ensureDatabase(dbName: string){
    const { db_names } = await client.listDatabases()
    if(!db_names.includes(dbName)){
        await client.createDatabase({ db_name: dbName })
        console.log(`Database ${dbName} telah dibuat`)
    }
}

export async function ensureCollection(collectionName: string, embeddingDim: number = 1024){
    const { value: exists } = await client.hasCollection({ collection_name: collectionName })

    if(!exists) {
        await client.createCollection({
            collection_name: collectionName,
            fields: [
                { 
                    name: "id", 
                    data_type: DataType.Int64,
                    is_primary_key: true,
                    autoID: true
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
                    dim: embeddingDim
                },
                {
                    name: "content",
                    data_type: DataType.VarChar,
                    max_length: 5000
                }
            ]
        })

        await client.createIndex({
            collection_name: collectionName,
            field_name: 'embedding',
            index_type: IndexType.HNSW,
            metric_type: MetricType.COSINE,
            params: { M: 16, efConstruction: 200 }
        })
    }

    const { state } = await client.getLoadState({ collection_name: collectionName })

    if(state != "LoadStateLoaded"){
        await client.loadCollection({ collection_name: collectionName })
        console.log(`Collection "${collectionName}" diload`)
    }
}

export async function clearCollection(collectionName: string = "ragdiva_rag_collection"){
    await client.useDatabase({ db_name: process.env.MILVUS_DB! })
    try {
        await client.dropCollection({ collection_name: collectionName })
        await client.dropIndex({ collection_name: collectionName })
    } catch {}
}

export async function milvusSetup(embeddingDim: number = 1024){
    await ensureDatabase(process.env.MILVUS_DB!)
    await client.useDatabase({ db_name: process.env.MILVUS_DB! })
    await ensureCollection("ragdiva_rag_collection", embeddingDim)
}