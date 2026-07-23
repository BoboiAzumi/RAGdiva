import { apiClient } from "@/lib/api-client";
import type {
    AIChatCreateSessionResponseType,
    AIChatHistoryResponseType,
    AIChatModelsResponseType,
    AIChatSessionsResponseType,
} from "@/types/aichat-types";

export const aichatApi = {
    getSessions: (): Promise<AIChatSessionsResponseType> =>
        apiClient.get("/aichat"),
    getModels: (): Promise<AIChatModelsResponseType> =>
        apiClient.get("/aichat/models"),
    getHistory: (sessionId: string): Promise<AIChatHistoryResponseType> =>
        apiClient.get(`/aichat/${sessionId}`),
    createSession: (
        message: string,
    ): Promise<AIChatCreateSessionResponseType> =>
        apiClient.post("/aichat/new", { message }),
    deleteSession: (sessionId: string): Promise<{ message: string }> =>
        apiClient.delete(`/aichat/${sessionId}`),
};
