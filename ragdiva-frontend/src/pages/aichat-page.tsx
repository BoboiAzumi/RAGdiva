import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Plus,
    Send,
    Bot,
    User,
    MessageSquare,
    Sparkles,
    Trash,
    BrainCircuit,
    Wrench,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAichat } from "@/hooks/use-aichat";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useEffect, useRef, useState } from "react";
import type { AIChatHistoryType } from "@/types/aichat-types";
import { useTitle } from "@/hooks/use-title";

export function AIChatPage() {
    useTitle("AI Chat")
    const aichat = useAichat();
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [aichat.messages, aichat.streamStatus, aichat.streamingContent]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            aichat.handleSend();
        }
    };

    return (
        <div className="flex h-[calc(100vh-3.1rem)] overflow-hidden">
            <aside className="w-72 shrink-0 border-r bg-sidebar flex flex-col overflow-hidden">
                <div className="p-3">
                    <Button
                        className="w-full justify-start gap-2 bg-accent hover:bg-accent-dark dark:hover:bg-accent-light"
                        onClick={() =>
                            aichat.navigate({ to: "/admin/aichat" })
                        }
                    >
                        <Plus className="h-4 w-4" />
                        Sesi baru
                    </Button>
                </div>
                <Separator />
                <div className="px-4 pt-3 pb-1 text-xs font-medium text-muted-foreground">
                    Riwayat sesi
                </div>
                <ScrollArea className="flex-1 px-2 pb-4">
                    <div className="space-y-1">
                        {aichat.sessions.map((s) => (
                            <div
                                key={s.id}
                                className={cn(
                                    "group flex items-center gap-1 rounded-md transition-colors hover:bg-muted",
                                    aichat.sid === s.id &&
                                        "bg-muted font-medium",
                                )}
                            >
                                <button
                                    onClick={() =>
                                        aichat.navigate({
                                            to: "/admin/aichat/$sid",
                                            params: { sid: s.id },
                                        })
                                    }
                                    className="flex-1 text-left px-3 py-2 text-sm flex items-start gap-2 min-w-0"
                                >
                                    <MessageSquare className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                                    <p className="truncate leading-snug max-w-44">
                                        {s.topic}
                                    </p>
                                </button>
                                <button
                                    onClick={() => {
                                        aichat.setDeleteData(s.id);
                                        aichat.setDeleteDialog(true);
                                    }}
                                    className="opacity-0 group-hover:opacity-100 p-1.5 mr-1 rounded-md hover:bg-destructive/10 transition-opacity"
                                >
                                    <Trash className="h-3.5 w-3.5 text-destructive" />
                                </button>
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            </aside>

            <div className="flex flex-1 flex-col min-w-0">
                {!aichat.sid ? (
                    <EmptyChatState
                        input={aichat.input}
                        setInput={aichat.setInput}
                        onSend={aichat.handleSend}
                        onKeyDown={handleKeyDown}
                        models={aichat.models}
                        selectedModel={aichat.selectedModel}
                        setSelectedModel={aichat.setSelectedModel}
                    />
                ) : (
                    <div className="flex flex-1 flex-col overflow-hidden">
                        <div className="flex-1 min-h-0 overflow-y-auto">
                            <div className="mx-auto max-w-3xl space-y-6 px-4 py-6">
                                {aichat.messages.map((m) => (
                                    <MessageBubble key={m.id} message={m} />
                                ))}
                                {aichat.streamStatus === "reasoning" && (
                                    <StatusBubble
                                        icon={
                                            <BrainCircuit className="h-4 w-4" />
                                        }
                                        text="AI sedang berpikir..."
                                    />
                                )}
                                {aichat.streamStatus === "tool_call" && (
                                    <StatusBubble
                                        icon={
                                            <Wrench className="h-4 w-4" />
                                        }
                                        text="AI sedang menggunakan alat..."
                                    />
                                )}
                                {aichat.streamStatus === "streaming" &&
                                    !aichat.streamingContent && (
                                        <StatusBubble
                                            icon={
                                                <BrainCircuit className="h-4 w-4" />
                                            }
                                            text="AI sedang berpikir..."
                                        />
                                    )}
                                {aichat.streamStatus === "streaming" &&
                                    aichat.streamingContent && (
                                        <StreamingBubble
                                            content={aichat.streamingContent}
                                        />
                                    )}
                                <div ref={bottomRef} />
                            </div>
                        </div>

                        <div className="border-t p-4 bg-sidebar">
                            <div className="mx-auto flex max-w-3xl items-center gap-2">
                                <ModelSelector
                                    models={aichat.models}
                                    selectedModel={aichat.selectedModel}
                                    setSelectedModel={aichat.setSelectedModel}
                                />
                                <Textarea
                                    value={aichat.input}
                                    onChange={(e) =>
                                        aichat.setInput(e.target.value)
                                    }
                                    onKeyDown={handleKeyDown}
                                    placeholder="Tulis pesan... (Enter untuk kirim, Shift+Enter untuk baris baru)"
                                    className="min-h-11 max-h-40 resize-none"
                                />
                                <Button
                                    size={"icon-lg"}
                                    onClick={aichat.handleSend}
                                    disabled={
                                        !aichat.input.trim() ||
                                        aichat.streamStatus !== "idle"
                                    }
                                >
                                    <Send className="h-10 w-10 text-white" />
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <Dialog
                open={aichat.deleteDialog}
                onOpenChange={aichat.setDeleteDialog}
            >
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Hapus Sesi Chat</DialogTitle>
                    </DialogHeader>
                    <h6>Apakah anda yakin ingin menghapus sesi ini ?</h6>
                    <DialogFooter>
                        <Button
                            variant={"outline"}
                            onClick={() => aichat.setDeleteDialog(false)}
                        >
                            Batal
                        </Button>
                        <Button
                            onClick={() => {
                                aichat
                                    .handleDelete()
                                    .catch((e: Error) =>
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

function ModelSelector({
    models,
    selectedModel,
    setSelectedModel,
}: {
    models: { id: string; provider: string; modelName: string }[];
    selectedModel: string;
    setSelectedModel: (v: string) => void;
}) {
    return (
        <select
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            className="h-11 rounded-md border border-input bg-sidebar px-3 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
            {models.map((m) => (
                <option key={m.id} value={m.modelName}>
                    {m.modelName}
                </option>
            ))}
        </select>
    );
}

function EmptyChatState({
    input,
    setInput,
    onSend,
    onKeyDown,
    models,
    selectedModel,
    setSelectedModel,
}: {
    input: string;
    setInput: (v: string) => void;
    onSend: () => void;
    onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
    models: { id: string; provider: string; modelName: string }[];
    selectedModel: string;
    setSelectedModel: (v: string) => void;
}) {
    const suggestions: string[] = [
        // "Ringkas dokumen kriteria yang sudah diunggah",
        // "Cek kelengkapan borang akreditasi",
        // "Jelaskan alur pengisian Kriteria C.1",
    ];

    return (
        <div className="flex flex-1 flex-col items-center justify-center px-4">
            <div className="w-full max-w-xl text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <Sparkles className="h-6 w-6 text-accent" />
                </div>
                <h2 className="text-lg font-semibold">
                    Mulai percakapan baru
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                    Tanyakan apa saja seputar dokumen mutu, kriteria, atau
                    borang akreditasi.
                </p>

                <div className="mt-6 flex gap-2 items-center">
                    <ModelSelector
                        models={models}
                        selectedModel={selectedModel}
                        setSelectedModel={setSelectedModel}
                    />
                    <Textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={onKeyDown}
                        placeholder="Ketik pertanyaan Anda di sini..."
                        className="min-h-12 max-h-40 resize-none bg-sidebar"
                    />
                    <Button
                        size={"icon-lg"}
                        onClick={onSend}
                        disabled={!input.trim()}
                    >
                        <Send className="h-4 w-4 text-white" />
                    </Button>
                </div>

                <div className="mt-4 flex flex-wrap justify-center gap-2">
                    {suggestions.map((s) => (
                        <button
                            key={s}
                            onClick={() => setInput(s)}
                            className="rounded-full border px-3 py-1.5 text-xs text-muted-foreground hover:bg-muted transition-colors"
                        >
                            {s}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}

function MessageBubble({ message }: { message: AIChatHistoryType }) {
    const isUser = message.role === "user";

    return (
        <div className={cn("flex items-start gap-3", isUser && "flex-row-reverse")}>
            <Avatar className="h-8 w-8 shrink-0">
                <AvatarFallback
                    className={
                        isUser
                            ? "bg-primary text-white"
                            : "bg-sidebar"
                    }
                >
                    {isUser ? (
                        <User className="h-4 w-4" />
                    ) : (
                        <Bot className="h-4 w-4" />
                    )}
                </AvatarFallback>
            </Avatar>

            <div
                className={cn(
                    "flex max-w-[75%] flex-col gap-1",
                    isUser && "items-end",
                )}
            >
                <div
                    className={cn(
                        "rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
                        isUser
                            ? "bg-primary text-white rounded-tr-sm whitespace-pre-wrap"
                            : "bg-sidebar rounded-tl-sm prose prose-sm dark:prose-invert max-w-none overflow-x-auto",
                    )}
                >
                    {isUser ? (
                        message.content
                    ) : (
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {message.content}
                        </ReactMarkdown>
                    )}
                </div>
                <span className="px-1 text-[11px] text-muted-foreground">
                    {new Date(message.createdAt).toLocaleTimeString("id-ID", {
                        hour: "2-digit",
                        minute: "2-digit",
                    })}
                </span>
            </div>
        </div>
    );
}

const TYPEWRITER_SPEED_MS = 8;

function useTypewriter(content: string, speed: number = TYPEWRITER_SPEED_MS) {
    const [displayLength, setDisplayLength] = useState(0);
    const prevContentRef = useRef("");

    useEffect(() => {
        if (content.length < prevContentRef.current.length) {
            setDisplayLength(0);
        }
        prevContentRef.current = content;
    }, [content]);

    useEffect(() => {
        if (displayLength >= content.length) return;

        const timer = setTimeout(() => {
            setDisplayLength((prev) => Math.min(prev + 1, content.length));
        }, speed);

        return () => clearTimeout(timer);
    }, [displayLength, content, speed]);

    return content.slice(0, displayLength);
}

function StreamingBubble({ content }: { content: string }) {
    const displayedContent = useTypewriter(content);

    return (
        <div className="flex items-start gap-3">
            <Avatar className="h-8 w-8 shrink-0">
                <AvatarFallback className="bg-sidebar">
                    <Bot className="h-4 w-4" />
                </AvatarFallback>
            </Avatar>
            <div className="flex max-w-[75%] flex-col gap-1">
                <div className="rounded-2xl rounded-tl-sm bg-sidebar px-4 py-2.5 text-sm leading-relaxed prose prose-sm dark:prose-invert max-w-none">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {displayedContent}
                    </ReactMarkdown>
                </div>
            </div>
        </div>
    );
}

function StatusBubble({ icon, text }: { icon: React.ReactNode; text: string }) {
    return (
        <div className="flex items-start gap-3">
            <Avatar className="h-8 w-8 shrink-0">
                <AvatarFallback className="bg-sidebar">
                    <Bot className="h-4 w-4" />
                </AvatarFallback>
            </Avatar>
            <div className="flex items-center gap-2 rounded-2xl rounded-tl-sm bg-sidebar px-4 py-3 text-sm text-muted-foreground">
                <span className="animate-pulse">{icon}</span>
                <span>{text}</span>
            </div>
        </div>
    );
}