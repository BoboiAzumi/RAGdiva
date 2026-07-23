import { queryOptions } from "@tanstack/react-query";
import { aichatApi } from "../api/aichat-api";
import { aichatKeys } from "../keys/aichat-keys";

export function aichatSessionsQueryOptions() {
    return queryOptions({
        queryFn: () => aichatApi.getSessions(),
        queryKey: aichatKeys.sessions(),
    });
}

export function aichatModelsQueryOptions() {
    return queryOptions({
        queryFn: () => aichatApi.getModels(),
        queryKey: aichatKeys.models(),
    });
}

export function aichatHistoryQueryOptions(sessionId: string) {
    return queryOptions({
        queryFn: () => aichatApi.getHistory(sessionId),
        queryKey: aichatKeys.history(sessionId),
    });
}
