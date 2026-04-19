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
    }
    | {
        id: string;
        role: "assistant";
        text: string;
        status?: "failed" | "cancelled" | "completed";
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