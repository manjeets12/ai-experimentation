export type ClientMessage =
    | {
        type: "hello";
        clientId: string; // optional but useful
    }
    | {
        type: "message";
        conversationId: string;
        message: string;
    }
    | {
        type: "cancel";
        conversationId: string;
    };

export type ServerMessage =
    | {
        type: "ack";
        clientId: string;
    }
    | { type: "start"; conversationId: string }
    | { type: "chunk"; conversationId: string; data: string }
    | { type: "done"; conversationId: string }
    | { type: "error"; conversationId: string; message: string };

export type GeminiRequest = {
    contents: {
        role: string,
        parts: { text: string }[];
    }[];
};

export type GeminiStreamChunk = {
    candidates?: {
        content?: {
            parts?: { text?: string }[];
        };
    }[];
};