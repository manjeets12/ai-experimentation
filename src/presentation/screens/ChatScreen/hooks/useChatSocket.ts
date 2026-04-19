import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { Vibration } from "react-native";
import { CONFIG } from "@config";
import { useTextBuffer } from "./useTextBuffer";
import type { ChatMessage, StreamState } from "../types";
import { appEventEmitter } from "@/utils/eventEmitter";

const WS_URL = CONFIG.WS_URL;
const SCROLL_THRESHOLD_CHARS = 20;

function getLocalId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

/**
 * `useChatSocket` acts as the network and transport layer for the chat interface.
 * 
 * It manages the WebSocket connection to the backend, handles the initial handshake,
 * and processes real-time streaming events ("start", "chunk", "done", "error").
 * 
 * Key Responsibilities:
 * - Connection Lifecycle: Automatically connects to the WebSocket, handles reconnects,
 *   and manages the `isReady` state after a successful handshake (`"ack"`).
 * - Stream State Management: Tracks whether the AI is currently "idle", "thinking",
 *   or "streaming" (`streamState`), which directly powers the UI's typing indicators.
 * - Event Broadcasting: Emits `scroll_for_new_chat` events locally via `appEventEmitter`
 *   to tell the UI to smoothly scroll down as chunks arrive (every `SCROLL_THRESHOLD_CHARS`).
 * - Message Orchestration: Delegates the actual text buffering to `useTextBuffer`, 
 *   serving as the bridge between raw WebSocket frames and the smooth rendering hook.
 */
export const useChatSocket = (url: string = WS_URL) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [streamState, setStreamState] = useState<StreamState>({ phase: "idle" });
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const handleComplete = useCallback(() => {
    Vibration.vibrate(50);
    appEventEmitter.emit('scroll_for_new_chat');
    charsSinceLastScroll.current = 0;
    setStreamState({ phase: "idle" });

  }, []);

  const {
    createAssistantPlaceholder,
    append,
    markDoneDraining,
    interrupt,
    cancel: cancelBuffer,
    fail,
    getActiveAssistantId,
  } = useTextBuffer(setMessages, handleComplete);

  const ws = useRef<WebSocket | null>(null);
  const charsSinceLastScroll = useRef(0);

  useEffect(() => {
    setConnectionError(null);
    const clientId = getLocalId("client");
    const socket = new WebSocket(url);
    ws.current = socket;

    socket.onopen = () => {
      setIsConnected(true);
      socket.send(JSON.stringify({ type: "hello", clientId }));
    };

    socket.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);

        switch (message.type) {
          case "ack": {
            setIsReady(true);
            break;
          }

          case "start": {
            // keep current phase as thinking
            break;
          }

          case "chunk": {
            append(message.data);

            charsSinceLastScroll.current += message.data.length;
            if (charsSinceLastScroll.current > SCROLL_THRESHOLD_CHARS) {
              appEventEmitter.emit('scroll_for_new_chat');
              charsSinceLastScroll.current = 0;
            }

            setStreamState((prev) => {
              if (prev.phase === "idle") return prev;
              if (prev.phase === "streaming") return prev;

              return {
                ...prev,
                phase: "streaming",
              };
            });

            break;
          }

          case "done": {
            markDoneDraining();
            break;
          }

          case "error": {
            console.error(message.message);
            fail();
            setStreamState({ phase: "idle" });
            break;
          }

          default:
            break;
        }
      } catch (e) {
        console.error("WS parse error:", e);
      }
    };

    socket.onclose = () => {
      setIsConnected(false);
      setIsReady(false);
      cancelBuffer();
      setStreamState({ phase: "idle" });
    };

    socket.onerror = (e) => {
      console.error("WS error:", e);
      setConnectionError("Failed to connect to chat server.");
    };

    return () => {
      socket.close();
    };
  }, [url, retryCount]);

  const retryConnection = useCallback(() => {
    setRetryCount(c => c + 1);
  }, []);

  const sendMessage = useCallback(
    (conversationId: string, text: string, isRetry: boolean = false) => {
      if (!ws.current || ws.current.readyState !== WebSocket.OPEN || !isReady) {
        console.warn("WS not ready");
        return;
      }

      // cancel or flush any existing local active stream state first
      interrupt();

      if (!isRetry) {
        setMessages((prev) => [
          ...prev,
          {
            id: getLocalId("user"),
            role: "user",
            text,
          },
        ]);
      }

      charsSinceLastScroll.current = 0;

      const assistantMessageId = createAssistantPlaceholder();

      setStreamState({
        phase: "thinking",
        conversationId,
        assistantMessageId,
      });

      ws.current.send(
        JSON.stringify({
          type: "message",
          conversationId,
          message: text,
        })
      );
    },
    [isReady, createAssistantPlaceholder, interrupt]
  );

  const cancel = useCallback(
    (conversationId: string) => {
      if (ws.current?.readyState === WebSocket.OPEN) {
        ws.current.send(
          JSON.stringify({
            type: "cancel",
            conversationId,
          })
        );
      }

      cancelBuffer();
      setStreamState({ phase: "idle" });
    },
    [cancelBuffer]
  );

  const isThinking = useMemo(
    () => streamState.phase === "thinking",
    [streamState]
  );

  const isStreaming = useMemo(
    () => streamState.phase === "streaming",
    [streamState]
  );

  const isBusy = useMemo(
    () => streamState.phase !== "idle",
    [streamState]
  );

  const activeAssistantMessageId = useMemo(() => {
    if (streamState.phase === "idle") return null;
    return streamState.assistantMessageId;
  }, [streamState]);

  return {
    isConnected,
    isReady,
    messages,
    streamState,
    isThinking,
    isStreaming,
    isBusy,
    activeAssistantMessageId,
    sendMessage,
    cancel,
    setMessages, // optional, useful if you want to merge fetched history outside
    connectionError,
    retryConnection,
  };
};