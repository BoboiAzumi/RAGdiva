export type DocumentParserType = {
    metadata: DocumentMetadataType;
    content: string;
};

export type DocumentMetadataType = {
    id: string;
    title: string | null;
    file_title: string;
    file_name: string;
    file_hash: string;
    mime_type: string;
    created_at: string;
};
