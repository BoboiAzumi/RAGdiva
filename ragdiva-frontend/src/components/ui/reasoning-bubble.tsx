import { useEffect, useRef } from "react";
import { Avatar, AvatarFallback } from "./avatar";
import { Bot, BrainCircuit } from "lucide-react";

export function ReasoningBubble({
    reasoningContent,
    statusText,
}: {
    reasoningContent: string;
    statusText: string;
}) {
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [reasoningContent]);

    return (
        <div className="flex items-start gap-2.5">
            <Avatar className="h-7 w-7 shrink-0 ring-2 ring-background shadow-sm">
                <AvatarFallback className="bg-linear-to-br from-accent/20 to-primary/10 text-accent">
                    <Bot className="h-3.5 w-3.5" />
                </AvatarFallback>
            </Avatar>
            <div className="flex max-w-[85%] flex-col gap-1.5 min-w-65">
                <div className="rounded-2xl rounded-bl-sm bg-sidebar border border-accent/20 p-3 shadow-sm space-y-2">
                    <div className="flex items-center gap-2 text-xs font-semibold text-accent">
                        <BrainCircuit className="h-3.5 w-3.5 shrink-0" />
                        <span>{statusText}</span>
                        <span className="flex gap-0.5 ml-1">
                            <span className="inline-block w-1 h-1 rounded-full bg-accent animate-bounce" style={{ animationDelay: "0ms" }} />
                            <span className="inline-block w-1 h-1 rounded-full bg-accent animate-bounce" style={{ animationDelay: "150ms" }} />
                            <span className="inline-block w-1 h-1 rounded-full bg-accent animate-bounce" style={{ animationDelay: "300ms" }} />
                        </span>
                    </div>

                    {reasoningContent ? (
                        <div
                            ref={scrollRef}
                            className="max-h-48 overflow-y-auto rounded-lg bg-muted/30 p-2.5 text-[11px] font-mono leading-relaxed text-muted-foreground border border-border/30 whitespace-pre-wrap wrap-break-word scrollbar-thin"
                        >
                            {reasoningContent}
                            <span className="inline-block w-1 h-3 bg-accent ml-0.5 animate-pulse align-middle" />
                        </div>
                    ) : (
                        <div className="text-xs text-muted-foreground/60 italic flex items-center gap-1.5 py-0.5">
                            <span>Menganalisis konteks...</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}