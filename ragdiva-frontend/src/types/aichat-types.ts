export type AIChatSessionType = {
    id: string;
    userId: string;
    topic: string;
};

export type AIChatHistoryType = {
    id: string;
    sessionId: string;
    role: string;
    content: string;
    createdAt: string;
};

export type AIModelType = {
    id: string;
    provider: string;
    modelName: string;
};

export type AIChatSessionsResponseType = {
    message: string;
    data: AIChatSessionType[];
};

export type AIChatModelsResponseType = {
    message: string;
    data: AIModelType[];
};

export type AIChatHistoryResponseType = {
    message: string;
    data: AIChatHistoryType[];
};

export type AIChatCreateSessionResponseType = {
    message: string;
    data: {
        sessionId: string;
    };
};

export type AIChatStreamChunkType = {
    type: "text" | "reasoning" | "tool_call" | "agent-error" | "agent-retry";
    content: string;
};
