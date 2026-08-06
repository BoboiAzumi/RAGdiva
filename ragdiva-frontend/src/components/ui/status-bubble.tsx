import { Bot } from "lucide-react";
import { Avatar, AvatarFallback } from "./avatar";

export function StatusBubble({ icon, text }: { icon: React.ReactNode; text: string }) {
    return (
        <div className="flex items-start gap-2.5">
            <Avatar className="h-7 w-7 shrink-0 ring-2 ring-background shadow-sm">
                <AvatarFallback className="bg-linear-to-br from-accent/20 to-primary/10 text-accent">
                    <Bot className="h-3.5 w-3.5" />
                </AvatarFallback>
            </Avatar>
            <div className="flex items-center gap-2 rounded-2xl rounded-bl-sm bg-sidebar border border-border/40 px-4 py-2.5 text-sm text-muted-foreground shadow-sm">
                <span className="text-accent">{icon}</span>
                <span>{text}</span>
                <span className="flex gap-0.5 ml-1">
                    <span className="inline-block w-1 h-1 rounded-full bg-accent/60 animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="inline-block w-1 h-1 rounded-full bg-accent/60 animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="inline-block w-1 h-1 rounded-full bg-accent/60 animate-bounce" style={{ animationDelay: "300ms" }} />
                </span>
            </div>
        </div>
    );
}
