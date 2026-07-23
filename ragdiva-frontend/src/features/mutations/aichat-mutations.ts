import { useMutation } from "@tanstack/react-query";
import { aichatApi } from "../api/aichat-api";
import { queryClient } from "@/lib/query-context";
import { aichatKeys } from "../keys/aichat-keys";

export function useAichatCreateSession() {
    return useMutation({
        mutationKey: aichatKeys.all,
        mutationFn: aichatApi.createSession,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: aichatKeys.sessions() });
        },
    });
}

export function useAichatDeleteSession() {
    return useMutation({
        mutationKey: aichatKeys.all,
        mutationFn: aichatApi.deleteSession,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: aichatKeys.sessions() });
        },
    });
}
