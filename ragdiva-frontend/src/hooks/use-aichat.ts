import {
    useAichatCreateSession,
    useAichatDeleteSession,
} from "@/features/mutations/aichat-mutations";
import {
    aichatHistoryQueryOptions,
    aichatModelsQueryOptions,
    aichatSessionsQueryOptions,
} from "@/features/queries/aichat-queries";
import { getSession } from "@/lib/session";
import type {
    AIChatHistoryType,
    AIChatStreamChunkType,
    AIModelType,
} from "@/types/aichat-types";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";

const BASE_URL = import.meta.env.VITE_API_URL ?? "/api";

type StreamStatus = "idle" | "reasoning" | "tool_call" | "streaming";

export function useAichat() {
    const { sid } = useParams({ strict: false }) as { sid?: string };
    const navigate = useNavigate();

    const [messages, setMessages] = useState<AIChatHistoryType[]>([]);
    const [input, setInput] = useState("");
    const [streamStatus, setStreamStatus] = useState<StreamStatus>("idle");
    const [streamingContent, setStreamingContent] = useState("");
    const [selectedModel, setSelectedModel] = useState(
        () => localStorage.getItem("ragdiva-ai-model") ?? "",
    );
    const [deleteDialog, setDeleteDialog] = useState(false);
    const [deleteData, setDeleteData] = useState("");

    const abortRef = useRef<AbortController | null>(null);

    const {
        data: sessionsData,
        isLoading: sessionsLoading,
        refetch: refetchSessions,
    } = useQuery({
        ...aichatSessionsQueryOptions(),
        enabled: false,
    });

    const { data: modelsData, refetch: refetchModels } = useQuery({
        ...aichatModelsQueryOptions(),
        enabled: false,
    });

    const { data: historyData, refetch: refetchHistory } = useQuery({
        ...aichatHistoryQueryOptions(sid ?? ""),
        enabled: false,
    });

    const createMutation = useAichatCreateSession();
    const deleteMutation = useAichatDeleteSession();

    const sessions = sessionsData?.data ?? [];
    const models: AIModelType[] = modelsData?.data ?? [];

    useEffect(() => {
        refetchSessions();
        refetchModels();
    }, []);

    useEffect(() => {
        if (models.length === 0) return;

        const saved = localStorage.getItem("ragdiva-ai-model");
        const exists = models.some((m) => m.modelName === saved);

        if (saved && exists) {
            setSelectedModel(saved);
        } else {
            localStorage.removeItem("ragdiva-ai-model");
            setSelectedModel(models[0].modelName);
        }
    }, [models]);

    const handleSelectModel = useCallback(
        (model: string) => {
            setSelectedModel(model);
            localStorage.setItem("ragdiva-ai-model", model);
        },
        [],
    );

    useEffect(() => {
        if (historyData?.data && Array.isArray(historyData.data)) {
            setMessages([...(historyData.data as AIChatHistoryType[])].reverse());
        } else {
            setMessages([]);
        }
    }, [historyData]);

    useEffect(() => {
        if (sid) {
            refetchHistory();
        } else {
            setMessages([]);
        }
    }, [sid]);

    const streamChat = useCallback(
        async (sessionId: string, message: string) => {
            setStreamStatus("streaming");
            setStreamingContent("");

            const controller = new AbortController();
            abortRef.current = controller;

            try {
                const res = await fetch(`${BASE_URL}/aichat/stream`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: getSession()
                            ? `Bearer ${getSession()}`
                            : "",
                    },
                    body: JSON.stringify({
                        sessionId,
                        model: selectedModel,
                        message,
                    }),
                    signal: controller.signal,
                });

                if (!res.ok || !res.body) {
                    setStreamStatus("idle");
                    return;
                }

                const reader = res.body.getReader();
                const decoder = new TextDecoder();
                let buffer = "";
                let accumulatedText = "";

                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;

                    buffer += decoder.decode(value, { stream: true });
                    const lines = buffer.split("\n");
                    buffer = lines.pop() ?? "";

                    let currentEvent = "";

                    for (const line of lines) {
                        if (line.startsWith("event:")) {
                            currentEvent = line.slice(6).trim();
                            continue;
                        }

                        if (
                            line.startsWith("data:") &&
                            currentEvent === "agent-result"
                        ) {
                            const rawData = line.slice(5).trim();
                            try {
                                const chunk: AIChatStreamChunkType =
                                    JSON.parse(rawData);

                                if (chunk.type === "reasoning") {
                                    setStreamStatus("reasoning");
                                } else if (chunk.type === "tool_call") {
                                    setStreamStatus("tool_call");
                                } else if (chunk.type === "text") {
                                    setStreamStatus("streaming");
                                    accumulatedText = chunk.content;
                                    setStreamingContent(accumulatedText);
                                }
                            } catch {
                                /* ignore parse errors */
                            }
                            currentEvent = "";
                        }
                    }
                }

                if (accumulatedText) {
                    setMessages((prev) => [
                        ...prev,
                        {
                            id: crypto.randomUUID(),
                            sessionId,
                            role: "agent",
                            content: accumulatedText,
                            createdAt: new Date().toISOString(),
                        },
                    ]);
                }
            } catch (e) {
                if ((e as Error).name !== "AbortError") {
                    console.error(e);
                }
            } finally {
                setStreamingContent("");
                setStreamStatus("idle");
                abortRef.current = null;
            }
        },
        [selectedModel],
    );

    const handleSend = useCallback(async () => {
        const text = input.trim();
        if (!text || streamStatus !== "idle") return;

        setInput("");

        let currentSid = sid;

        if (!currentSid) {
            try {
                const result = await createMutation.mutateAsync(text);
                currentSid = result.data.sessionId;
                refetchSessions();
                navigate({
                    to: "/admin/aichat/$sid",
                    params: { sid: currentSid },
                });
            } catch {
                return;
            }
        }

        const userMessage: AIChatHistoryType = {
            id: crypto.randomUUID(),
            sessionId: currentSid,
            role: "user",
            content: text,
            createdAt: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, userMessage]);

        streamChat(currentSid, text);
    }, [
        input,
        sid,
        streamStatus,
        createMutation,
        refetchSessions,
        navigate,
        streamChat,
    ]);

    const handleDelete = useCallback(async () => {
        try {
            await deleteMutation.mutateAsync(deleteData);
            await refetchSessions();
            if (sid === deleteData) {
                navigate({ to: "/admin/aichat" });
            }
        } catch {
            /* handled by toast in page */
        }
        setDeleteData("");
        setDeleteDialog(false);
    }, [deleteData, deleteMutation, refetchSessions, sid, navigate]);

    return {
        sid,
        navigate,
        messages,
        input,
        setInput,
        streamStatus,
        streamingContent,
        selectedModel,
        setSelectedModel: handleSelectModel,
        sessions,
        sessionsLoading,
        models,
        deleteDialog,
        setDeleteDialog,
        deleteData,
        setDeleteData,
        deleteMutation,
        handleSend,
        handleDelete,
    };
}
