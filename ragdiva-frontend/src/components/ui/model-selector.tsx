import { ChevronDown, Cpu } from "lucide-react";

export function ModelSelector({
    models,
    selectedModel,
    setSelectedModel,
}: {
    models: { id: string; provider: string; modelName: string }[];
    selectedModel: string;
    setSelectedModel: (v: string) => void;
}) {
    return (
        <div className="relative min-w-0 flex-1">
            <Cpu className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-accent shrink-0" />
            <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="w-full h-8 appearance-none rounded-lg border border-border/50 bg-muted/40 pl-7 pr-6 text-xs text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent/50 transition-colors hover:border-accent/30 cursor-pointer truncate"
            >
                {models.map((m) => (
                    <option key={m.id} value={m.modelName}>
                        {m.modelName}
                    </option>
                ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-1.5 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground shrink-0" />
        </div>
    );
}