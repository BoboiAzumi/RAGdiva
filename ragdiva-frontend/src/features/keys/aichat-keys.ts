export const aichatKeys = {
    all: ["aichat"] as const,
    sessions: () => ["aichat", "sessions"],
    models: () => ["aichat", "models"],
    history: (sessionId: string) => ["aichat", "history", sessionId],
};
