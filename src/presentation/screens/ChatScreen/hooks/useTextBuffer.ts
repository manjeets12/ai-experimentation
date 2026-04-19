import { useEffect, useRef, useCallback } from "react";
import type { ChatMessage } from "../types";

type SetMessages = React.Dispatch<React.SetStateAction<ChatMessage[]>>;

function getLocalId(prefix: string) {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}
const REVEAL_INTERVAL_MS = 50;

export function useTextBuffer(setMessages: SetMessages) {
    const pendingRef = useRef("");
    const rafRef = useRef<number | null>(null);
    const activeAssistantIdRef = useRef<string | null>(null);
    const lastUpdateTimeStampRef = useRef<number>(0);

    useEffect(() => {
        const flush = (timestamp: number) => {
            const activeId = activeAssistantIdRef.current;
            const pending = pendingRef.current;
            const elapsed = timestamp - lastUpdateTimeStampRef.current;

            if (activeId && pending && elapsed >= REVEAL_INTERVAL_MS) {
                lastUpdateTimeStampRef.current = timestamp;
                // reveal a few chars per frame for smoother typing
                const take = Math.min(3, pending.length);
                const nextChunk = pending.slice(0, take);

                pendingRef.current = pending.slice(take);

                setMessages((prev) =>
                    prev.map((msg) => {
                        if (msg.role !== "assistant") return msg;
                        if (msg.id !== activeId) return msg;

                        return {
                            ...msg,
                            text: msg.text + nextChunk,
                        };
                    })
                );
            }

            rafRef.current = requestAnimationFrame(flush);
        };

        rafRef.current = requestAnimationFrame(flush);

        return () => {
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
        };
    }, [setMessages]);

    const createAssistantPlaceholder = useCallback(() => {
        const assistantMessageId = getLocalId("assistant");
        activeAssistantIdRef.current = assistantMessageId;
        pendingRef.current = "";

        setMessages((prev) => [
            ...prev,
            {
                id: assistantMessageId,
                role: "assistant",
                text: "",
            },
        ]);

        return assistantMessageId;
    }, [setMessages]);

    const append = useCallback((text: string) => {
        if (!activeAssistantIdRef.current) return;
        pendingRef.current += text;
    }, []);

    const flushNow = useCallback(() => {
        const activeId = activeAssistantIdRef.current;
        const pending = pendingRef.current;

        if (activeId) {
            setMessages((prev) =>
                prev.map((msg) => {
                    if (msg.role !== "assistant") return msg;
                    if (msg.id !== activeId) return msg;

                    return {
                        ...msg,
                        text: msg.text + pending,
                        status: "completed",
                    };
                })
            );
        }

        pendingRef.current = "";
        activeAssistantIdRef.current = null;
    }, [setMessages]);

    const cancel = useCallback(() => {
        const activeId = activeAssistantIdRef.current;
        if (activeId) {
            const pending = pendingRef.current;
            setMessages((prev) => {
                const msgIndex = prev.findIndex((m) => m.id === activeId);
                if (msgIndex === -1) return prev;

                const msg = prev[msgIndex];
                const finalStr = msg.text + pending;

                const newMessages = [...prev];
                newMessages[msgIndex] = { ...msg, text: finalStr, status: "cancelled" };
                return newMessages;
            });
        }
        pendingRef.current = "";
        activeAssistantIdRef.current = null;
    }, [setMessages]);

    const fail = useCallback(() => {
        const activeId = activeAssistantIdRef.current;
        if (activeId) {
            const pending = pendingRef.current;
            setMessages((prev) => {
                const msgIndex = prev.findIndex((m) => m.id === activeId);
                if (msgIndex === -1) return prev;

                const msg = prev[msgIndex];
                const finalStr = msg.text + pending;

                const newMessages = [...prev];
                newMessages[msgIndex] = { ...msg, text: finalStr, status: "failed" };
                return newMessages;
            });
        }
        pendingRef.current = "";
        activeAssistantIdRef.current = null;
    }, [setMessages]);

    const getActiveAssistantId = useCallback(() => {
        return activeAssistantIdRef.current;
    }, []);

    return {
        createAssistantPlaceholder,
        append,
        flushNow,
        cancel,
        fail,
        getActiveAssistantId,
    };
}