export type FileType = {
    id: string;
    title: string;
    fileName: string;
    fileHash: string;
    mimeType: string;
    createdAt: string;
    updateAt: string;
    status: string;
    page?: string;
};

export type FileResponseType = {
    message: string;
    data: FileType[];
};
