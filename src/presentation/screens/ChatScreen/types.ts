export type Conversation = {
    id: string;
    userId: string;
    createdAt: string;
    messages: any[];
};

export type ChatMessage =
    | {
        id: string;
        role: "user";
        text: string;
        isLast?: boolean;
    }
    | {
        id: string;
        role: "assistant";
        text: string;
        status?: "failed" | "cancelled" | "completed";
        isLast?: boolean;
    };

export type StreamState =
    | {
        phase: "idle";
    }
    | {
        phase: "thinking" | "streaming";
        conversationId: string;
        assistantMessageId: string;
    };