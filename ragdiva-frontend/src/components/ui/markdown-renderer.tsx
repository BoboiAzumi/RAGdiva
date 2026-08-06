import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeHighlight from "rehype-highlight";
import rehypeKatex from "rehype-katex";
import {
    Check,
    Copy,
    ExternalLink,
    Info,
    AlertTriangle,
    AlertCircle,
    Sparkles,
    ShieldAlert,
    FileCode,
    FileText,
    CheckSquare,
    Square,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface MarkdownRendererProps {
    content: string;
    className?: string;
}

function preprocessMarkdown(text: string): string {
    if (!text) return "";
    return text
        .replace(/`\[([^\]]+)\]\(([^)]+)\)`/g, "[$1]($2)")
        .replace(/`<a\s+[^>]*href=["']([^"']+)["'][^>]*>(.*?)<\/a>`/gi, "[$2]($1)");
}

const LANGUAGE_NAMES: Record<string, string> = {
    js: "JavaScript",
    javascript: "JavaScript",
    ts: "TypeScript",
    typescript: "TypeScript",
    tsx: "React TSX",
    jsx: "React JSX",
    py: "Python",
    python: "Python",
    sh: "Bash",
    bash: "Bash",
    zsh: "Bash",
    shell: "Shell",
    sql: "SQL",
    json: "JSON",
    html: "HTML",
    css: "CSS",
    scss: "SCSS",
    yaml: "YAML",
    yml: "YAML",
    md: "Markdown",
    go: "Go",
    rust: "Rust",
    cpp: "C++",
    c: "C",
    java: "Java",
    kotlin: "Kotlin",
    php: "PHP",
    dockerfile: "Docker",
};

function CodeBlock({
    language,
    children,
}: {
    language?: string;
    children: React.ReactNode;
}) {
    const [copied, setCopied] = useState(false);

    const getRawText = (node: React.ReactNode): string => {
        if (typeof node === "string") return node;
        if (typeof node === "number") return String(node);
        if (Array.isArray(node)) return node.map(getRawText).join("");
        if (React.isValidElement(node) && node.props && (node.props as { children?: React.ReactNode }).children) {
            return getRawText((node.props as { children?: React.ReactNode }).children);
        }
        return "";
    };

    const handleCopy = () => {
        const textToCopy = getRawText(children).replace(/\n$/, "");
        if (!textToCopy) return;

        navigator.clipboard.writeText(textToCopy).then(
            () => {
                setCopied(true);
                toast.success("Kode berhasil disalin!");
                setTimeout(() => setCopied(false), 2000);
            },
            () => {
                toast.error("Gagal menyalin kode");
            },
        );
    };

    const langDisplayName = language
        ? LANGUAGE_NAMES[language.toLowerCase()] || language
        : "Code";

    return (
        <div className="group relative my-4 overflow-hidden rounded-xl border border-border/70 bg-zinc-950 dark:bg-zinc-950 text-zinc-100 shadow-md font-mono text-xs md:text-sm">
            <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-900/90 px-4 py-2 text-xs font-sans text-zinc-400">
                <div className="flex items-center gap-1.5 font-medium">
                    <FileCode className="h-3.5 w-3.5 text-accent" />
                    <span className="font-semibold text-zinc-300">
                        {langDisplayName}
                    </span>
                </div>
                <button
                    onClick={handleCopy}
                    type="button"
                    className="flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-medium text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors cursor-pointer focus:outline-hidden"
                >
                    {copied ? (
                        <>
                            <Check className="h-3.5 w-3.5 text-emerald-400" />
                            <span className="text-emerald-400 font-medium">
                                Tersalin!
                            </span>
                        </>
                    ) : (
                        <>
                            <Copy className="h-3.5 w-3.5" />
                            <span>Salin kode</span>
                        </>
                    )}
                </button>
            </div>
            <div className="overflow-x-auto p-4 leading-relaxed scrollbar-thin scrollbar-thumb-zinc-800">
                <pre className="m-0 bg-transparent p-0 font-mono text-xs md:text-sm leading-relaxed">
                    <code>{children}</code>
                </pre>
            </div>
        </div>
    );
}

function CustomBlockquote({ children }: { children: React.ReactNode }) {
    const extractText = (node: React.ReactNode): string => {
        if (typeof node === "string") return node;
        if (Array.isArray(node)) return node.map(extractText).join("");
        if (React.isValidElement(node) && node.props && (node.props as { children?: React.ReactNode }).children) {
            return extractText((node.props as { children?: React.ReactNode }).children);
        }
        return "";
    };

    const textContent = extractText(children).trim();
    const calloutMatch = textContent.match(
        /^\[\!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]/i,
    );

    if (calloutMatch) {
        const type = calloutMatch[1].toUpperCase();

        const config = {
            NOTE: {
                icon: <Info className="h-4 w-4 text-blue-500 shrink-0 mt-0.5" />,
                title: "Catatan",
                styles: "border-blue-500/30 bg-blue-500/10 text-blue-950 dark:text-blue-200",
            },
            TIP: {
                icon: (
                    <Sparkles className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                ),
                title: "Tips",
                styles: "border-emerald-500/30 bg-emerald-500/10 text-emerald-950 dark:text-emerald-200",
            },
            IMPORTANT: {
                icon: (
                    <AlertCircle className="h-4 w-4 text-purple-500 shrink-0 mt-0.5" />
                ),
                title: "Penting",
                styles: "border-purple-500/30 bg-purple-500/10 text-purple-950 dark:text-purple-200",
            },
            WARNING: {
                icon: (
                    <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                ),
                title: "Peringatan",
                styles: "border-amber-500/30 bg-amber-500/10 text-amber-950 dark:text-amber-200",
            },
            CAUTION: {
                icon: (
                    <ShieldAlert className="h-4 w-4 text-rose-500 shrink-0 mt-0.5" />
                ),
                title: "Perhatian",
                styles: "border-rose-500/30 bg-rose-500/10 text-rose-950 dark:text-rose-200",
            },
        }[type] || {
            icon: <Info className="h-4 w-4 text-accent shrink-0 mt-0.5" />,
            title: type,
            styles: "border-accent/30 bg-accent/10 text-foreground",
        };

        return (
            <div
                className={cn(
                    "my-4 flex items-start gap-3 rounded-xl border p-3.5 text-sm leading-relaxed",
                    config.styles,
                )}
            >
                {config.icon}
                <div className="flex-1 min-w-0">
                    <span className="font-semibold block mb-0.5 text-xs uppercase tracking-wider opacity-90">
                        {config.title}
                    </span>
                    <div className="[&>p]:my-0">{children}</div>
                </div>
            </div>
        );
    }

    return (
        <blockquote className="my-4 border-l-4 border-accent/80 bg-accent/5 dark:bg-accent/10 py-2.5 px-4 rounded-r-lg text-muted-foreground italic text-sm leading-relaxed [&>p]:my-0">
            {children}
        </blockquote>
    );
}

export function MarkdownRenderer({
    content,
    className,
}: MarkdownRendererProps) {
    const processedContent = React.useMemo(
        () => preprocessMarkdown(content),
        [content],
    );

    return (
        <div
            className={cn(
                "markdown-content text-sm leading-relaxed text-foreground space-y-3 break-words",
                className,
            )}
        >
            <ReactMarkdown
                remarkPlugins={[remarkGfm, remarkMath]}
                rehypePlugins={[rehypeHighlight, rehypeKatex]}
                components={{
                    h1: ({ children }) => (
                        <h1 className="mt-6 mb-3 text-xl font-bold tracking-tight text-foreground border-b pb-2 border-border/60 first:mt-0">
                            {children}
                        </h1>
                    ),
                    h2: ({ children }) => (
                        <h2 className="mt-5 mb-2.5 text-lg font-semibold tracking-tight text-foreground border-b pb-1.5 border-border/40 first:mt-0">
                            {children}
                        </h2>
                    ),
                    h3: ({ children }) => (
                        <h3 className="mt-4 mb-2 text-base font-semibold tracking-tight text-foreground first:mt-0">
                            {children}
                        </h3>
                    ),
                    h4: ({ children }) => (
                        <h4 className="mt-3.5 mb-1.5 text-sm font-semibold tracking-tight text-foreground first:mt-0">
                            {children}
                        </h4>
                    ),

                    p: ({ children }) => (
                        <p className="my-2.5 leading-relaxed text-foreground/95 first:mt-0 last:mb-0">
                            {children}
                        </p>
                    ),

                    code: ({ className, children, ...props }) => {
                        const match = /language-(\w+)/.exec(className || "");
                        const codeString = String(children).replace(/\n$/, "");
                        const isInline = !codeString.includes("\n");

                        if (isInline) {
                            return (
                                <code
                                    className="rounded-md bg-muted/80 dark:bg-muted/50 px-1.5 py-0.5 font-mono text-[0.875em] font-semibold text-accent border border-border/40"
                                    {...props}
                                >
                                    {children}
                                </code>
                            );
                        }

                        return (
                            <CodeBlock language={match ? match[1] : undefined}>
                                {children}
                            </CodeBlock>
                        );
                    },

                    pre: ({ children }) => <>{children}</>,

                    blockquote: ({ children }) => (
                        <CustomBlockquote>{children}</CustomBlockquote>
                    ),

                    table: ({ children }) => (
                        <div className="my-4 w-full overflow-x-auto rounded-xl border border-border/80 bg-card/40 shadow-xs">
                            <table className="w-full text-left text-sm border-collapse min-w-[400px]">
                                {children}
                            </table>
                        </div>
                    ),
                    thead: ({ children }) => (
                        <thead className="bg-muted/70 dark:bg-muted/40 border-b border-border font-semibold text-foreground text-xs uppercase tracking-wider">
                            {children}
                        </thead>
                    ),
                    th: ({ children }) => (
                        <th className="px-4 py-3 font-semibold text-foreground/90">
                            {children}
                        </th>
                    ),
                    td: ({ children }) => (
                        <td className="border-t border-border/40 px-4 py-2.5 text-sm text-foreground/90">
                            {children}
                        </td>
                    ),
                    tr: ({ children }) => (
                        <tr className="hover:bg-muted/30 transition-colors duration-150">
                            {children}
                        </tr>
                    ),

                    a: ({ href, children }) => {
                        const isFileLink =
                            href?.startsWith("/api/file/") ||
                            href?.includes("/api/file/") ||
                            href?.startsWith("/file/");
                        const isExternal =
                            href?.startsWith("http://") ||
                            href?.startsWith("https://");

                        if (isFileLink) {
                            return (
                                <a
                                    href={href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1.5 font-semibold text-accent bg-accent/10 hover:bg-accent/20 border border-accent/30 rounded-lg px-2.5 py-1 my-1 text-xs transition-colors shadow-xs group cursor-pointer"
                                    title="Lihat / Unduh Dokumen"
                                >
                                    <FileText className="h-3.5 w-3.5 text-accent shrink-0 group-hover:scale-110 transition-transform" />
                                    <span className="underline decoration-accent/40 underline-offset-2 group-hover:decoration-accent">
                                        {children}
                                    </span>
                                    <ExternalLink className="h-3 w-3 shrink-0 opacity-70 ml-0.5" />
                                </a>
                            );
                        }

                        return (
                            <a
                                href={href}
                                target={isExternal ? "_blank" : undefined}
                                rel={
                                    isExternal
                                        ? "noopener noreferrer"
                                        : undefined
                                }
                                className="inline-flex items-center gap-0.5 font-medium text-accent underline underline-offset-4 decoration-accent/40 hover:decoration-accent hover:text-accent-secondary-dark dark:hover:text-accent-light transition-colors"
                            >
                                <span>{children}</span>
                                {isExternal && (
                                    <ExternalLink className="h-3 w-3 shrink-0 opacity-75" />
                                )}
                            </a>
                        );
                    },

                    ul: ({ children }) => (
                        <ul className="my-2.5 ml-5 list-disc space-y-1 text-foreground/95 marker:text-accent">
                            {children}
                        </ul>
                    ),
                    ol: ({ children }) => (
                        <ol className="my-2.5 ml-5 list-decimal space-y-1 text-foreground/95 marker:text-accent marker:font-semibold">
                            {children}
                        </ol>
                    ),
                    li: ({ children, className }) => {
                        const isTaskList = className?.includes("task-list-item");
                        return (
                            <li
                                className={cn(
                                    "leading-relaxed",
                                    isTaskList && "list-none -ml-5 flex items-start gap-2 my-1",
                                )}
                            >
                                {children}
                            </li>
                        );
                    },

                    input: ({ type, checked, disabled }) => {
                        if (type === "checkbox") {
                            return (
                                <span className="inline-flex items-center shrink-0 mt-1 select-none">
                                    {checked ? (
                                        <CheckSquare className="h-4 w-4 text-accent fill-accent/20" />
                                    ) : (
                                        <Square className="h-4 w-4 text-muted-foreground/60" />
                                    )}
                                </span>
                            );
                        }
                        return <input type={type} checked={checked} disabled={disabled} />;
                    },

                    hr: () => (
                        <hr className="my-6 border-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
                    ),

                    img: ({ src, alt }) => (
                        <span className="my-4 block overflow-hidden rounded-xl border border-border/60 shadow-sm">
                            <img
                                src={src}
                                alt={alt}
                                className="max-h-96 w-auto rounded-xl object-contain mx-auto"
                                loading="lazy"
                            />
                            {alt && (
                                <span className="block text-center text-xs text-muted-foreground mt-1.5 italic">
                                    {alt}
                                </span>
                            )}
                        </span>
                    ),
                }}
            >
                {processedContent}
            </ReactMarkdown>
        </div>
    );
}
