import { useEffect, useRef, useState } from "react";

const TYPEWRITER_SPEED_MS = 100;

export function useTypewriter(content: string, speed: number = TYPEWRITER_SPEED_MS) {
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
            setDisplayLength((prev) => prev + 1);
        }, speed);

        return () => clearTimeout(timer);
    }, [displayLength, content, speed]);

    return {
        displayedContent: content.slice(0, displayLength),
        isTyping: displayLength < content.length,
    };
}