import { useRef, useState, useEffect, useMemo, useCallback, use } from "react";
import { FlatList, NativeScrollEvent, NativeSyntheticEvent } from "react-native";
import { useChatSocket } from "./useChatSocket";
import chatService from "@/services/network/chatService";
import type { ChatMessage, Conversation } from "../types";

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

    const flatListRef = useRef<FlatList>(null);
    const distanceFromBottom = useRef<number>(0);

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
        return [...fetchedMessages, ...liveMessages];
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

    const onContentSizeChange = useCallback(() => {
        //using 80 here but it could very on different screen as well as keyboard state
        //we will use it for now
        if (distanceFromBottom.current < 80) {
            flatListRef.current?.scrollToEnd({ animated: true })
        }
    }, [])

    const onListScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
        const { contentOffset, contentSize, layoutMeasurement } = e.nativeEvent;
        distanceFromBottom.current =
            contentSize.height - (contentOffset.y + layoutMeasurement.height);
    }

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
        switchConversation
    };
};

export default useChatLogics;