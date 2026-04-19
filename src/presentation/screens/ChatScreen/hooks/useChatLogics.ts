import { useRef, useState, useEffect, useMemo, useCallback, use } from "react";
import { FlatList, NativeScrollEvent, NativeSyntheticEvent } from "react-native";
import { useChatSocket } from "./useChatSocket";
import chatService from "@/services/network/chatService";
import type { ChatMessage, Conversation } from "../types";
import { appEventEmitter } from "@/utils/eventEmitter";

type UseChatLogicsProps = {
    conversationId?: string;
};

const useChatLogics = ({ conversationId: initialId }: UseChatLogicsProps) => {
    const [fetchedMessages, setFetchedMessages] = useState<ChatMessage[]>([]);
    const [inputText, setInputText] = useState("");
    const [conversationId, setConversationId] = useState(initialId);

    const [isFetchingHistory, setIsFetchingHistory] = useState(!!initialId);
    const [fetchError, setFetchError] = useState<string | null>(null);

    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [isFetchingConversations, setIsFetchingConversations] = useState(false);
    const [showScrollToBottom, setShowScrollToBottom] = useState(false);

    const flatListRef = useRef<FlatList>(null);
    const distanceFromBottom = useRef<number>(0);
    const isUserScrolledUp = useRef(false);
    const isAutoScrolling = useRef(false);
    const autoScrollTimeout = useRef<NodeJS.Timeout | null>(null);

    const {
        messages: liveMessages,
        sendMessage,
        cancel,
        isConnected,
        isReady,
        isThinking,
        isStreaming,
        isBusy,
        activeAssistantMessageId,
        connectionError,
        retryConnection,
        setMessages
    } = useChatSocket();

    const loadConversations = useCallback(async () => {
        setIsFetchingConversations(true);
        try {
            const data = await chatService.getConversations();
            setConversations(data);
        } catch (e) {
            console.error("Failed to load conversations:", e);
        } finally {
            setIsFetchingConversations(false);
        }
    }, []);

    const openDrawer = useCallback(() => {
        setIsDrawerOpen(true);
        loadConversations();
    }, [loadConversations]);

    const closeDrawer = useCallback(() => {
        setIsDrawerOpen(false);
    }, []);

    const switchConversation = useCallback((id: string) => {
        closeDrawer();
        if (id === conversationId) return;
        setConversationId(id);
        setFetchedMessages([]);
        setMessages([]);
        fetchHistory(id);
    }, [conversationId, closeDrawer, setMessages, fetchHistory]);

    const fetchHistory = useCallback(async (id: string) => {
        if (!id) return;
        setFetchError(null);
        setIsFetchingHistory(true);
        try {
            const data = await chatService.getConversation(id);
            if (data && Array.isArray(data.messages)) {
                const normalizedMessages: ChatMessage[] = data.messages.map((m: any) => ({
                    id: m.id,
                    role: m.role,
                    text: m.content,
                }));
                setFetchedMessages(normalizedMessages);
            } else {
                setFetchedMessages([]);
            }
        } catch (e: any) {
            console.error("Failed to fetch conversation:", e);
            setFetchError(e.message || "Failed to load chat history");
        } finally {
            setIsFetchingHistory(false);
        }
    }, []);

    useEffect(() => {
        let isMounted = true;
        // Only fetch history on initial mount if we start with a conversation
        if (conversationId) {
            fetchHistory(conversationId).then(() => {
                if (!isMounted) return;
            });
        }
        return () => {
            isMounted = false;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const isLoading = isFetchingHistory || (!isReady && !connectionError);
    const loadError = fetchError || connectionError;

    const retryLoad = useCallback(() => {
        if (fetchError && conversationId) fetchHistory(conversationId);
        if (connectionError) retryConnection();
    }, [fetchError, connectionError, fetchHistory, retryConnection, conversationId]);

    const messages = useMemo(() => {
        const combined = [...fetchedMessages, ...liveMessages];
        const len = combined.length;
        if (len === 0) return combined;

        return combined.map((m, index) => {
            const isLastNode = index === len - 1;
            if (m.isLast === isLastNode) return m;
            return { ...m, isLast: isLastNode };
        });
    }, [fetchedMessages, liveMessages]);

    const ensureConversation = useCallback(async () => {
        if (conversationId) return conversationId;

        const res = await chatService.createConversation();
        setConversationId(res.id);
        return res.id;
    }, [conversationId]);

    const handleSend = useCallback(async () => {
        if (isBusy) return;
        const text = inputText.trim();
        if (!text) return;

        try {
            const id = await ensureConversation();
            sendMessage(id, text);
            setInputText("");
            scrollToBottom();
        } catch (e) {
            console.error("Failed to send message:", e);
        }
    }, [inputText, ensureConversation, sendMessage, isBusy]);

    const handleStop = useCallback(() => {
        if (!conversationId) return;
        cancel(conversationId);
    }, [conversationId, cancel]);

    const handleRetry = useCallback(async (assistantMsgId: string) => {
        if (isBusy) return;

        const index = messages.findIndex(m => m.id === assistantMsgId);
        if (index <= 0) return;

        const prevMsg = messages[index - 1];
        if (prevMsg.role !== "user") return;

        const text = prevMsg.text;

        // Remove the failed assistant message so we can retry clean
        setMessages(prev => prev.filter(m => m.id !== assistantMsgId));

        try {
            const id = await ensureConversation();
            sendMessage(id, text, true);
        } catch (e) {
            console.error("Failed to retry message:", e);
        }
    }, [messages, isBusy, ensureConversation, sendMessage]);

    const scrollToBottom = useCallback(() => {
        isUserScrolledUp.current = false;
        isAutoScrolling.current = true;
        flatListRef.current?.scrollToEnd({ animated: true });

        if (autoScrollTimeout.current) clearTimeout(autoScrollTimeout.current);
        autoScrollTimeout.current = setTimeout(() => {
            isAutoScrolling.current = false;
        }, 500);
    }, []);

    useEffect(() => {
        const handleScrollEvent = () => {
            if (!isUserScrolledUp.current) {
                // Give FlatList a tiny bit of time to render the new chunk
                setTimeout(() => {
                    onContentSizeChange();
                }, 100);
            }
        };

        appEventEmitter.on('scroll_for_new_chat', handleScrollEvent);
        return () => {
            appEventEmitter.off('scroll_for_new_chat', handleScrollEvent);
        };
    }, [scrollToBottom]);

    const onContentSizeChange = useCallback(() => {
        if (!isUserScrolledUp.current) {
            scrollToBottom();
        }
    }, [scrollToBottom])

    const onListScroll = useCallback((e: NativeSyntheticEvent<NativeScrollEvent>) => {
        const { contentOffset, contentSize, layoutMeasurement } = e.nativeEvent;
        const distance = contentSize.height - (contentOffset.y + layoutMeasurement.height);
        distanceFromBottom.current = distance;

        if (distance > 150) {
            setShowScrollToBottom(prev => prev ? prev : true);
        } else {
            setShowScrollToBottom(prev => prev ? false : prev);
        }

        if (!isAutoScrolling.current) {
            isUserScrolledUp.current = distance > 80;
        }
    }, []);

    return {
        messages,
        inputText,
        setInputText,
        handleSend,
        handleStop,
        handleRetry,
        flatListRef,
        conversationId,
        isConnected,
        isReady,
        isThinking,
        isStreaming,
        isBusy,
        activeAssistantMessageId,
        onContentSizeChange,
        onListScroll,
        isLoading,
        loadError,
        retryLoad,
        isDrawerOpen,
        openDrawer,
        closeDrawer,
        conversations,
        isFetchingConversations,
        switchConversation,
        showScrollToBottom,
        scrollToBottom
    };
};

export default useChatLogics;