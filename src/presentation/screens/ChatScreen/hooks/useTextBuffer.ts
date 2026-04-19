import { useEffect, useRef, useCallback } from "react";
import type { ChatMessage } from "../types";

type SetMessages = React.Dispatch<React.SetStateAction<ChatMessage[]>>;

function getLocalId(prefix: string) {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}
const REVEAL_INTERVAL_MS = 48;

/**
 * `useTextBuffer` manages the smooth, animated typing effect for incoming AI responses.
 * 
 * Instead of instantly rendering massive blocks of text whenever the WebSocket sends a chunk,
 * this hook places incoming text into a hidden buffer (`pendingRef`). 
 * It then uses a high-performance `requestAnimationFrame` loop to slowly "reveal"
 * characters from that buffer into the actual React state (`messages`) at a fixed interval.
 * 
 * Key Mechanisms:
 * - `pendingRef`: Stores incoming text that hasn't been shown on screen yet.
 * - `isDrainingRef`: When the backend signals the stream is "done", we don't instantly dump the
 *   remaining buffer. Instead, we enter a "draining" state where the loop speeds up (5x) to gracefully
 *   finish typing the remaining text before finalizing the message.
 * - `finalizeMessage`: A unified handler that correctly merges the buffer and updates the message
 *   status to 'completed', 'cancelled', or 'failed'.
 * - `interrupt`: Safely handles user interruptions. If the stream is already done but still draining, 
 *   it instantly flushes the rest of the text. If the stream is still active, it drops the pending
 *   text and cancels it, preventing ghost text from appearing later.
 */
export function useTextBuffer(setMessages: SetMessages, onComplete?: () => void) {
    const pendingRef = useRef("");
    const rafRef = useRef<number | null>(null);
    const activeAssistantIdRef = useRef<string | null>(null);
    const lastUpdateTimeStampRef = useRef<number>(0);
    const isDrainingRef = useRef(false);

    const finalizeMessage = useCallback((status: "completed" | "cancelled" | "failed", forceAppendPending: boolean) => {
        const activeId = activeAssistantIdRef.current;
        if (!activeId) return;

        const pending = forceAppendPending ? pendingRef.current : "";

        setMessages((prev) => {
            const msgIndex = prev.findIndex((m) => m.id === activeId);
            if (msgIndex === -1) return prev;
            const newMessages = [...prev];
            newMessages[msgIndex] = { 
                ...prev[msgIndex], 
                text: prev[msgIndex].text + pending, 
                status 
            };
            return newMessages;
        });

        pendingRef.current = "";
        activeAssistantIdRef.current = null;
        isDrainingRef.current = false;

        if (status === "completed") {
            onComplete?.();
        }
    }, [setMessages, onComplete]);

    useEffect(() => {
        const flush = (timestamp: number) => {
            const activeId = activeAssistantIdRef.current;
            const pending = pendingRef.current;
            const elapsed = timestamp - lastUpdateTimeStampRef.current;

            if (activeId && pending && elapsed >= REVEAL_INTERVAL_MS) {
                lastUpdateTimeStampRef.current = timestamp;
                // reveal a few chars per frame for smoother typing
                const speedMult = isDrainingRef.current ? 5 : 1;
                const take = Math.min(2 * speedMult, pending.length);
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

                if (isDrainingRef.current && pendingRef.current.length === 0) {
                    finalizeMessage("completed", false);
                }
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

    const markDoneDraining = useCallback(() => {
        if (!pendingRef.current) {
            finalizeMessage("completed", false);
        } else {
            isDrainingRef.current = true;
        }
    }, [finalizeMessage]);

    const flushNow = useCallback(() => finalizeMessage("completed", true), [finalizeMessage]);
    const cancel = useCallback(() => finalizeMessage("cancelled", false), [finalizeMessage]);
    const fail = useCallback(() => finalizeMessage("failed", false), [finalizeMessage]);

    const interrupt = useCallback(() => {
        if (isDrainingRef.current) {
            flushNow();
        } else {
            cancel();
        }
    }, [flushNow, cancel]);

    const getActiveAssistantId = useCallback(() => {
        return activeAssistantIdRef.current;
    }, []);

    return {
        createAssistantPlaceholder,
        append,
        flushNow,
        markDoneDraining,
        interrupt,
        cancel,
        fail,
        getActiveAssistantId,
    };
}