import { cn } from "@/lib/utils";
import { Send, Square } from "lucide-react";

export function SendButton({
    streamStatus,
    inputEmpty,
    onClick,
}: {
    streamStatus: string;
    inputEmpty: boolean;
    onClick: () => void;
}) {
    const isStreaming = streamStatus !== "idle";
    return (
        <button
            onClick={onClick}
            disabled={inputEmpty && !isStreaming}
            className={cn(
                "shrink-0 flex h-8 w-8 items-center justify-center rounded-lg transition-all duration-200",
                isStreaming
                    ? "bg-destructive/80 hover:bg-destructive text-white"
                    : inputEmpty
                        ? "bg-muted text-muted-foreground cursor-not-allowed"
                        : "bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm hover:shadow-md active:scale-95",
            )}
        >
            {isStreaming ? (
                <Square className="h-3 w-3 fill-current" />
            ) : (
                <Send className="h-3.5 w-3.5" />
            )}
        </button>
    );
}