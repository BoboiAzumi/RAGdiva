import { cn } from "@/lib/utils";
import type { AIChatHistoryType } from "@/types/aichat-types";
import { Avatar, AvatarFallback } from "./avatar";
import { Bot, User } from "lucide-react";
import { MarkdownRenderer } from "./markdown-renderer";

export function MessageBubble({ message }: { message: AIChatHistoryType }) {
    const isUser = message.role === "user";

    return (
        <div
            className={cn(
                "flex items-end gap-2.5 group",
                isUser && "flex-row-reverse",
            )}
        >
            <Avatar className="h-7 w-7 shrink-0 ring-2 ring-background shadow-sm">
                <AvatarFallback
                    className={cn(
                        isUser
                            ? "bg-linear-to-br from-primary to-primary/70 text-primary-foreground"
                            : "bg-linear-to-br from-accent/20 to-primary/10 text-accent",
                    )}
                >
                    {isUser ? (
                        <User className="h-3.5 w-3.5 text-white" />
                    ) : (
                        <Bot className="h-3.5 w-3.5" />
                    )}
                </AvatarFallback>
            </Avatar>

            <div
                className={cn(
                    "flex max-w-[78%] flex-col gap-1",
                    isUser && "items-end",
                )}
            >
                <div
                    className={cn(
                        "rounded-2xl px-4 py-2.5 text-sm leading-relaxed overflow-x-auto",
                        isUser
                            ? "bg-linear-to-br from-primary to-primary/80 text-primary-foreground rounded-br-sm whitespace-pre-wrap shadow-md shadow-primary/20"
                            : "bg-sidebar rounded-bl-sm border border-border/50 shadow-sm",
                    )}
                >
                    {isUser ? (
                        <p className="text-white">
                            {message.content}
                        </p>
                    ) : (
                        <MarkdownRenderer content={message.content} />
                    )}
                </div>
                <span className="px-1 text-[10px] text-muted-foreground/50 opacity-0 group-hover:opacity-100 transition-opacity">
                    {new Date(message.createdAt).toLocaleTimeString("id-ID", {
                        hour: "2-digit",
                        minute: "2-digit",
                    })}
                </span>
            </div>
        </div>
    );
}