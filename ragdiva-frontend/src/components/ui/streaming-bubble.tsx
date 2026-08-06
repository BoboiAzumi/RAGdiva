import { Bot, BrainCircuit, ChevronDown, ChevronUp } from "lucide-react";
import { Avatar, AvatarFallback } from "./avatar";
import { useState } from "react";
import { useTypewriter } from "@/hooks/use-typewriter";
import { MarkdownRenderer } from "./markdown-renderer";

export function StreamingBubble({
    content,
    reasoningContent,
}: {
    content: string;
    reasoningContent?: string;
}) {
    const { displayedContent, isTyping } = useTypewriter(content, 10);
    const [showReasoning, setShowReasoning] = useState(false);

    return (
        <div className="flex items-start gap-2.5">
            <Avatar className="h-7 w-7 shrink-0 ring-2 ring-background shadow-sm">
                <AvatarFallback className="bg-linear-to-br from-accent/20 to-primary/10 text-accent">
                    <Bot className="h-3.5 w-3.5" />
                </AvatarFallback>
            </Avatar>
            <div className="flex max-w-[85%] flex-col gap-2 min-w-0">
                {reasoningContent && (
                    <div className="rounded-xl bg-sidebar border border-border/40 overflow-hidden">
                        <button
                            onClick={() => setShowReasoning((prev) => !prev)}
                            className="flex items-center gap-2 w-full text-left px-3 py-2 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors"
                        >
                            <BrainCircuit className="h-3 w-3 text-accent shrink-0" />
                            <span>Proses berpikir</span>
                            <span className="ml-auto text-[10px] text-muted-foreground/50 flex items-center gap-1">
                                {showReasoning ? (
                                    <>Sembunyikan <ChevronUp className="h-3 w-3" /></>
                                ) : (
                                    <>Tampilkan <ChevronDown className="h-3 w-3" /></>
                                )}
                            </span>
                        </button>
                        {showReasoning && (
                            <div className="border-t border-border/30 px-3 py-2 max-h-36 overflow-y-auto bg-muted/20 font-mono text-[11px] leading-relaxed text-muted-foreground whitespace-pre-wrap wrap-break-word">
                                {reasoningContent}
                            </div>
                        )}
                    </div>
                )}

                <div className="rounded-2xl rounded-bl-sm bg-sidebar border border-border/50 px-4 py-2.5 text-sm leading-relaxed shadow-sm overflow-hidden">
                    <MarkdownRenderer content={displayedContent} />
                    {isTyping && (
                        <span className="inline-block w-1.5 h-3.5 bg-accent ml-0.5 animate-pulse align-middle rounded-sm" />
                    )}
                </div>
            </div>
        </div>
    );
}