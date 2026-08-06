import { Sparkles } from "lucide-react";
import { Textarea } from "./textarea";
import { ModelSelector } from "./model-selector";
import { SendButton } from "./send-button";

export function EmptyChatState({
    input,
    setInput,
    onSend,
    onKeyDown,
    models,
    selectedModel,
    setSelectedModel,
    streamStatus,
}: {
    input: string;
    setInput: (v: string) => void;
    onSend: () => void;
    onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
    models: { id: string; provider: string; modelName: string }[];
    selectedModel: string;
    setSelectedModel: (v: string) => void;
    streamStatus: string;
}) {
    const suggestions = [
        "Ringkas dokumen kriteria yang sudah diunggah",
        "Cek kelengkapan borang akreditasi",
        "Jelaskan alur pengisian Kriteria C.1",
        "Apa saja dokumen yang dibutuhkan untuk akreditasi?",
    ];

    return (
        <div className="flex flex-1 flex-col items-center justify-center px-4 relative overflow-hidden">
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute top-1/4 left-1/4 h-64 w-64 rounded-full bg-accent/5 blur-3xl" />
                <div className="absolute bottom-1/4 right-1/4 h-48 w-48 rounded-full bg-primary/5 blur-3xl" />
            </div>

            <div className="w-full max-w-2xl text-center relative z-10">
                <div className="mx-auto mb-5 relative inline-flex">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br from-accent/20 to-primary/20 border border-accent/20 shadow-lg shadow-accent/10">
                        <Sparkles className="h-7 w-7 text-accent" />
                    </div>
                </div>

                <h2 className="text-2xl font-semibold">Mulai percakapan baru</h2>
                <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
                    Tanyakan apa saja seputar dokumen mutu, kriteria, atau borang akreditasi kepada asisten AI RAGdiva.
                </p>

                <div className="mt-6 rounded-xl border border-border/60 bg-sidebar/80 backdrop-blur-sm p-2 shadow-sm focus-within:border-accent/40 focus-within:shadow-md transition-all duration-200 text-left">
                    <Textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={onKeyDown}
                        disabled={streamStatus !== "idle"}
                        placeholder={
                            streamStatus !== "idle"
                                ? "AI sedang merespons..."
                                : "Ketik pertanyaan Anda di sini..."
                        }
                        className="min-h-14 max-h-40 resize-none border-0 bg-transparent shadow-none focus-visible:ring-0 text-sm"
                    />
                    <div className="flex items-center justify-between pt-1 px-1">
                        <ModelSelector
                            models={models}
                            selectedModel={selectedModel}
                            setSelectedModel={setSelectedModel}
                        />
                        <SendButton
                            streamStatus={streamStatus}
                            inputEmpty={!input.trim()}
                            onClick={onSend}
                        />
                    </div>
                </div>

                {suggestions.length > 0 && (
                    <div className="mt-4">
                        <p className="text-xs text-muted-foreground/60 mb-2">Coba tanyakan:</p>
                        <div className="flex flex-wrap justify-center gap-2">
                            {suggestions.map((s) => (
                                <button
                                    key={s}
                                    onClick={() => setInput(s)}
                                    className="rounded-full border border-border/60 bg-sidebar/60 px-3 py-1.5 text-xs text-muted-foreground hover:bg-muted hover:text-foreground hover:border-accent/30 transition-all duration-150"
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}