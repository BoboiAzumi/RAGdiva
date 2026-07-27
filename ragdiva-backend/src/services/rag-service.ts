import { HTTPException } from "hono/http-exception";
import { AutoEmbedding } from "../lib/embedding/auto-embedding.js";
import { client, rrfReranker } from "../lib/milvus/milvus.js";
import { rabbitmq } from "../lib/rabbitmq/rabbitmq.js";
import { markdownTextSplitter } from "../lib/text-splitter/text-splitter.js";
import { getAiConfig } from "../repositories/ai-config-repo.js";
import {
    findFileByIdList,
    updateFileStatus,
} from "../repositories/file-repo.js";
import type { DocumentParserType } from "../types/document-parser-type.js";
import { Document } from "@langchain/core/documents";
import { broadcasting } from "../lib/broadcast/broadcast.js";
import { FunctionType, MetricType } from "@zilliz/milvus2-sdk-node";

export async function dataIngestion(fileIds: string[]) {
    const files = await findFileByIdList(fileIds);

    const promise: Promise<DocumentParserType | null>[] = files.map(
        async (v) => {
            try {
                const feedback = (await rabbitmq.sendToQueueWithReply(
                    "document.converter",
                    "node-python",
                    v,
                )) as { success: boolean; data: DocumentParserType };

                if (!feedback.success) {
                    await updateFileStatus(v.id, "Failed");
                    return null;
                }

                return feedback.data;
            } catch {
                await updateFileStatus(v.id, "Failed");
                return null;
            }
        },
    );

    const markdownDocuments = (await Promise.all(promise)).filter(
        (v) => v != null,
    );

    return markdownDocuments;
}

export async function dataChunking(data: DocumentParserType[]) {
    const document = data.map((v) => {
        return new Document({
            pageContent: v.content,
            metadata: v.metadata,
        });
    });

    const chunk = await markdownTextSplitter.splitDocuments(document);

    return chunk;
}

export async function dataEmbedding(documents: Document[]) {
    try {
        const aiConfig = await getAiConfig();
        const embedding = AutoEmbedding(
            aiConfig.get("embedding_model")!,
            aiConfig.get("embedding_endpoint")!,
            aiConfig.get("embedding_credential")!,
            parseInt(aiConfig.get("embedding_dim")!),
        );

        const embedPayload = documents.map((v) => v.pageContent);
        const embedFloat = await embedding.passageEmbed(embedPayload);

        const embedResult = embedFloat.map((v, i) => ({
            document: documents[i],
            embedding: v,
        }));

        return embedResult;
    } catch (e) {
        await Promise.all(
            documents.map(async (v) => {
                updateFileStatus(v.metadata.id, "Failed");
            }),
        );
        throw new HTTPException(500, { message: (e as Error).message });
    }
}

export async function dataIndexing(
    embedResult: { document: Document; embedding: number[] }[],
) {
    const milvusPayload = embedResult.map((v) => ({
        document_id: v.document.metadata.id,
        metadata: v.document.metadata,
        embedding: v.embedding,
        content: v.document.pageContent,
    }));

    try {
        await client.insert({
            collection_name: process.env.MILVUS_COLLECTION || "ragdiva_rag_collection",
            data: milvusPayload,
        });
    } catch {
        await Promise.all(
            milvusPayload.map(async (v) => {
                await updateFileStatus(v.document_id, "Failed");
            }),
        );
    }
}

export async function dataInsertService(fileIds: string[]) {
    try {
        broadcasting("rag", { message: "Data Ingestion", data: Array.from(new Set(fileIds)).join(", ") }).catch(
            (e) => console.log(e),
        );
        const ingestions = await dataIngestion(fileIds);

        broadcasting("rag", {
            message: "Data Chunking",
            data: Array.from(new Set(ingestions.map((v) => v.metadata.file_title))).join(", "),
        }).catch((e) => console.log(e));
        const chunk = await dataChunking(ingestions);

        broadcasting("rag", {
            message: "Data Embedding",
            data: Array.from(new Set(chunk.map((v) => v.metadata.file_title))).join(", "),
        }).catch((e) => console.log(e));
        const embedding = await dataEmbedding(chunk);

        broadcasting("rag", {
            message: "Data Indexing",
            data: Array.from(new Set(embedding.map((v) => v.document.metadata.file_title))).join(", "),
        }).catch((e) => console.log(e));
        await dataIndexing(embedding);

        broadcasting("rag", {
            message: "Successfully",
            data: `Berhasil memasukkan data ${Array.from(new Set(embedding.map((v) => v.document.metadata.file_title))).join(", ")}`,
        }).catch((e) => console.log(e));

        await Promise.all(
            embedding.map(async (v) => {
                await updateFileStatus(v.document.metadata.id, "Completed");
            }),
        );
    }
    catch (e: any) {
        broadcasting("rag", { message: "Error", data: e.message }).catch(
            (e) => console.log(e),
        );
    }
}

export async function retrievalService(query: string) {
    const aiConfig = await getAiConfig();
    const embedding = AutoEmbedding(
        aiConfig.get("embedding_model")!,
        aiConfig.get("embedding_endpoint")!,
        aiConfig.get("embedding_credential")!,
        parseInt(aiConfig.get("embedding_dim")!),
    );

    const embedQuery = await embedding.queryEmbed([query]);

    const result = await client.hybridSearch({
        collection_name: process.env.MILVUS_COLLECTION || "ragdiva_rag_collection",
        data: [
            {
                data: [embedQuery[0]],
                anns_field: "embedding",
                params: { metric_type: MetricType.COSINE },
                limit: 20
            },
            {
                data: [query],
                anns_field: "sparse",
                params: {},
                limit: 20
            } as any
        ],
        ranker: rrfReranker,
        limit: 5,
        output_fields: ["metadata", "content"],
    });

    return result.results;
}
