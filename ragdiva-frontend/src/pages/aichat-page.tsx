import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Plus,
    Bot,
    MessageSquare,
    Trash2,
    BrainCircuit,
    Wrench,
    PanelLeftClose,
    PanelLeftOpen,
    X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAichat } from "@/hooks/use-aichat";
import { toast } from "sonner";
import { useEffect, useRef, useState } from "react";
import { useTitle } from "@/hooks/use-title";
import { EmptyChatState } from "@/components/ui/empty-chat-state";
import { MessageBubble } from "@/components/ui/message-bubble";
import { ReasoningBubble } from "@/components/ui/reasoning-bubble";
import { StatusBubble } from "@/components/ui/status-bubble";
import { StreamingBubble } from "@/components/ui/streaming-bubble";
import { ModelSelector } from "@/components/ui/model-selector";
import { SendButton } from "@/components/ui/send-button";

export function AIChatPage() {
    useTitle("AI Chat");
    const aichat = useAichat();
    const bottomRef = useRef<HTMLDivElement>(null);
    const [sidebarOpen, setSidebarOpen] = useState(true);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [aichat.messages, aichat.streamStatus, aichat.streamingContent]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            if (aichat.streamStatus === "idle" && aichat.input.trim()) {
                aichat.handleSend();
            }
        }
    };

    return (
        <div className="flex h-[calc(100vh-3.1rem)] overflow-hidden relative">
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/40 z-20 md:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            <aside
                className={cn(
                    "shrink-0 border-r bg-sidebar flex flex-col overflow-hidden transition-all duration-300 ease-in-out",
                    "fixed md:relative z-30 md:z-auto h-full",
                    sidebarOpen ? "w-72 translate-x-0" : "w-0 -translate-x-full md:translate-x-0 md:w-0",
                )}
            >
                <div className="w-72 flex flex-col h-full overflow-hidden">
                    <div className="p-3 space-y-2">
                        <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-2 px-1">
                                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent/10">
                                    <BrainCircuit className="h-4 w-4 text-accent" />
                                </div>
                                <span className="text-sm font-semibold">RAGdiva AI</span>
                            </div>
                            <button
                                onClick={() => setSidebarOpen(false)}
                                className="md:hidden p-1 rounded-md hover:bg-muted transition-colors text-muted-foreground"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                        <Button
                            className="mt-3 w-full justify-start gap-2 bg-accent/10 hover:bg-accent/20 text-accent border border-accent/20 hover:border-accent/40 transition-all duration-200"
                            variant="ghost"
                            onClick={() => {
                                aichat.navigate({ to: "/admin/aichat" });
                                if (window.innerWidth < 768) setSidebarOpen(false);
                            }}
                        >
                            <Plus className="h-4 w-4" />
                            Sesi baru
                        </Button>
                    </div>

                    <div className="px-4 py-1.5 flex items-center gap-2">
                        <div className="h-px flex-1 bg-border/60" />
                        <span className="text-[10px] font-semibold tracking-wider uppercase text-muted-foreground/60">
                            Riwayat
                        </span>
                        <div className="h-px flex-1 bg-border/60" />
                    </div>

                    <ScrollArea className="flex-1 px-2 pb-4">
                        <div className="space-y-0.5">
                            {aichat.sessions.length === 0 && (
                                <div className="flex flex-col items-center justify-center py-8 text-center px-4">
                                    <MessageSquare className="h-8 w-8 text-muted-foreground/30 mb-2" />
                                    <p className="text-xs text-muted-foreground/60">Belum ada riwayat sesi</p>
                                </div>
                            )}
                            {aichat.sessions
                                .sort(
                                    (a, b) =>
                                        new Date(b.createdAt).getTime() -
                                        new Date(a.createdAt).getTime(),
                                )
                                .map((s) => (
                                    <div
                                        key={s.id}
                                        className={cn(
                                            "group flex items-center gap-1 rounded-lg transition-all duration-150",
                                            aichat.sid === s.id
                                                ? "bg-primary/10 border border-primary/20 shadow-sm"
                                                : "hover:bg-muted/70 border border-transparent",
                                        )}
                                    >
                                        <button
                                            onClick={() => {
                                                aichat.navigate({
                                                    to: "/admin/aichat/$sid",
                                                    params: { sid: s.id },
                                                });
                                                if (window.innerWidth < 768) setSidebarOpen(false);
                                            }}
                                            className="flex-1 text-left px-2.5 py-2 text-sm flex items-center gap-2 min-w-0"
                                        >
                                            <MessageSquare
                                                className={cn(
                                                    "h-3.5 w-3.5 shrink-0 transition-colors",
                                                    aichat.sid === s.id
                                                        ? "text-primary"
                                                        : "text-muted-foreground/60",
                                                )}
                                            />
                                            <p
                                                className={cn(
                                                    "leading-snug text-[13px]",
                                                    aichat.sid === s.id
                                                        ? "text-foreground font-medium"
                                                        : "text-muted-foreground",
                                                )}
                                            >
                                                {s.topic}
                                            </p>
                                        </button>
                                        <button
                                            onClick={() => {
                                                aichat.setDeleteData(s.id);
                                                aichat.setDeleteDialog(true);
                                            }}
                                            className="opacity-0 group-hover:opacity-100 p-1.5 mr-1 rounded-md hover:bg-destructive/10 transition-all duration-150 shrink-0"
                                            title="Hapus sesi"
                                        >
                                            <Trash2 className="h-3 w-3 text-destructive/70" />
                                        </button>
                                    </div>
                                ))}
                        </div>
                    </ScrollArea>
                </div>
            </aside>

            <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
                <div className="flex items-center gap-2 px-3 py-2 border-b bg-sidebar/80 backdrop-blur-sm shrink-0">
                    <button
                        onClick={() => setSidebarOpen((prev) => !prev)}
                        className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                        title={sidebarOpen ? "Tutup sidebar" : "Buka sidebar"}
                    >
                        {sidebarOpen ? (
                            <PanelLeftClose className="h-4 w-4" />
                        ) : (
                            <PanelLeftOpen className="h-4 w-4" />
                        )}
                    </button>
                    <div className="flex items-center gap-2">
                        <div className="flex h-6 w-6 items-center justify-center rounded-md bg-accent/10">
                            <Bot className="h-3.5 w-3.5 text-accent" />
                        </div>
                        <span className="text-sm font-semibold">AI Chat</span>
                    </div>
                    {aichat.streamStatus !== "idle" && (
                        <div className="ml-auto flex items-center gap-1.5 text-xs text-accent">
                            <span className="flex gap-0.5">
                                <span className="inline-block w-1 h-1 rounded-full bg-accent animate-bounce" style={{ animationDelay: "0ms" }} />
                                <span className="inline-block w-1 h-1 rounded-full bg-accent animate-bounce" style={{ animationDelay: "150ms" }} />
                                <span className="inline-block w-1 h-1 rounded-full bg-accent animate-bounce" style={{ animationDelay: "300ms" }} />
                            </span>
                            <span>AI merespons...</span>
                        </div>
                    )}
                </div>

                {!aichat.sid ? (
                    <EmptyChatState
                        input={aichat.input}
                        setInput={aichat.setInput}
                        onSend={aichat.handleSend}
                        onKeyDown={handleKeyDown}
                        models={aichat.models}
                        selectedModel={aichat.selectedModel}
                        setSelectedModel={aichat.setSelectedModel}
                        streamStatus={aichat.streamStatus}
                    />
                ) : (
                    <div className="flex flex-1 flex-col overflow-hidden">
                        <div className="flex-1 min-h-0 overflow-y-auto">
                            <div className="mx-auto max-w-3xl space-y-5 px-4 py-6">
                                {aichat.messages.map((m) => (
                                    <MessageBubble key={m.id} message={m} />
                                ))}
                                {aichat.streamStatus === "reasoning" && (
                                    <ReasoningBubble
                                        reasoningContent={aichat.streamingReasoning}
                                        statusText="AI sedang berpikir..."
                                    />
                                )}
                                {aichat.streamStatus === "tool_call" && (
                                    <StatusBubble
                                        icon={<Wrench className="h-3.5 w-3.5" />}
                                        text="AI sedang menggunakan alat..."
                                    />
                                )}
                                {aichat.streamStatus === "streaming" &&
                                    !aichat.streamingContent && (
                                        <ReasoningBubble
                                            reasoningContent={aichat.streamingReasoning}
                                            statusText="AI sedang menyusun jawaban..."
                                        />
                                    )}
                                {aichat.streamStatus === "streaming" &&
                                    aichat.streamingContent && (
                                        <StreamingBubble
                                            content={aichat.streamingContent}
                                            reasoningContent={aichat.streamingReasoning}
                                        />
                                    )}
                                <div ref={bottomRef} />
                            </div>
                        </div>

                        <div className="border-t bg-sidebar/90 backdrop-blur-sm p-3 shrink-0">
                            <div className="mx-auto max-w-3xl">
                                <div className="rounded-xl border border-border/60 bg-background/60 backdrop-blur-sm shadow-sm focus-within:border-accent/40 focus-within:shadow-md transition-all duration-200">
                                    <Textarea
                                        value={aichat.input}
                                        onChange={(e) =>
                                            aichat.setInput(e.target.value)
                                        }
                                        onKeyDown={handleKeyDown}
                                        disabled={aichat.streamStatus !== "idle"}
                                        placeholder={
                                            aichat.streamStatus !== "idle"
                                                ? "AI sedang merespons..."
                                                : "Tulis pesan... (Enter kirim, Shift+Enter baris baru)"
                                        }
                                        className="min-h-1 max-h-40 resize-none border-0 bg-transparent shadow-none focus-visible:ring-0 px-3 py-2.5 text-sm w-full"
                                    />
                                    <div className="flex items-center justify-between gap-2 px-2 pb-2">
                                        <ModelSelector
                                            models={aichat.models}
                                            selectedModel={aichat.selectedModel}
                                            setSelectedModel={aichat.setSelectedModel}
                                        />
                                        <SendButton
                                            streamStatus={aichat.streamStatus}
                                            inputEmpty={!aichat.input.trim()}
                                            onClick={aichat.handleSend}
                                        />
                                    </div>
                                </div>
                                <p className="mt-1.5 text-center text-[10px] text-muted-foreground/50">
                                    AI dapat membuat kesalahan. Verifikasi informasi penting.
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <Dialog
                open={aichat.deleteDialog}
                onOpenChange={aichat.setDeleteDialog}
            >
                <DialogContent className="sm:max-w-sm">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Trash2 className="h-4 w-4 text-destructive" />
                            Hapus Sesi Chat
                        </DialogTitle>
                    </DialogHeader>
                    <p className="text-sm text-muted-foreground">
                        Apakah anda yakin ingin menghapus sesi ini? Tindakan ini tidak dapat dibatalkan.
                    </p>
                    <DialogFooter className="gap-2">
                        <Button
                            variant="outline"
                            onClick={() => aichat.setDeleteDialog(false)}
                        >
                            Batal
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={() => {
                                aichat.handleDelete().catch((e: Error) =>
                                    toast("Error", {
                                        description: e.message,
                                    }),
                                );
                            }}
                        >
                            Hapus
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
