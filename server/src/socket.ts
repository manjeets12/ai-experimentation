import { WebSocketServer } from "ws";
import { ClientMessage, ServerMessage } from "./types";
import { generateGeminiContentStream, streamToWebSocket } from "./gemini";
import { delay } from "./helper";




export function createSocketServer(httpServer: any) {
    const wss = new WebSocketServer({ server: httpServer });

    wss.on("connection", (ws: WebSocket) => {
        console.log("Client connected");

        // ✅ scoped per connection
        const activeStreams = new Map<string, AbortController>();

        // ✅ handshake state
        let isReady = false;

        ws.on("message", async (raw) => {
            console.log("RAW WS:", raw.toString());

            try {
                const msg: ClientMessage = JSON.parse(raw.toString());

                switch (msg.type) {
                    /* =========================
                       HANDSHAKE
                    ========================= */
                    case "hello": {
                        console.log("Received HELLO");

                        isReady = true;

                        ws.send(
                            JSON.stringify({
                                type: "ack",
                                clientId: msg.clientId,
                            } satisfies ServerMessage)
                        );

                        console.log("Sent ACK");
                        return;
                    }

                    /* =========================
                       MESSAGE
                    ========================= */
                    case "message": {
                        if (!isReady) {
                            ws.send(
                                JSON.stringify({
                                    type: "error",
                                    message: "Handshake required",
                                } satisfies ServerMessage)
                            );
                            return;
                        }

                        await handleMessage(ws, activeStreams, msg);
                        return;
                    }

                    /* =========================
                       CANCEL
                    ========================= */
                    case "cancel": {
                        if (!isReady) {
                            ws.send(
                                JSON.stringify({
                                    type: "error",
                                    message: "Handshake required",
                                } satisfies ServerMessage)
                            );
                            return;
                        }

                        handleCancel(activeStreams, msg.conversationId);
                        return;
                    }

                    /* =========================
                       DEFAULT
                    ========================= */
                    default: {
                        ws.send(
                            JSON.stringify({
                                type: "error",
                                message: "Unknown message type",
                            } satisfies ServerMessage)
                        );
                    }
                }
            } catch (error) {
                console.error("STREAM ERROR:", error);

                ws.send(
                    JSON.stringify({
                        type: "error",
                        message: "Invalid payload",
                    } satisfies ServerMessage)
                );
            }
        });

        ws.on("close", () => {
            console.log("Client disconnected");

            activeStreams.forEach((c) => c.abort());
            activeStreams.clear();
        });
    });
}

/* =========================
   MESSAGE HANDLER
========================= */

async function handleMessage(
    ws: WebSocket,
    activeStreams: Map<string, AbortController>,
    {
        conversationId,
        message,
    }: Extract<ClientMessage, { type: "message" }>
) {
    // cancel previous stream
    if (activeStreams.has(conversationId)) {
        activeStreams.get(conversationId)?.abort();
        activeStreams.delete(conversationId);
    }

    const controller = new AbortController();
    activeStreams.set(conversationId, controller);

    try {
        await delay(2000); //Mocking thinking process of AI
        const stream = await generateGeminiContentStream(
            message,
            controller.signal
        );

        await streamToWebSocket(
            ws,
            conversationId,
            stream,
            controller
        );
    } catch (error) {
        console.error("Streaming error in handleMessage:", error);
        ws.send(
            JSON.stringify({
                type: "error",
                conversationId,
                message: "Streaming failed",
            } satisfies ServerMessage)
        );
    } finally {
        activeStreams.delete(conversationId);
    }
}

/* =========================
   CANCEL HANDLER
========================= */

function handleCancel(
    activeStreams: Map<string, AbortController>,
    conversationId: string
) {
    const controller = activeStreams.get(conversationId);

    if (controller) {
        controller.abort();
        activeStreams.delete(conversationId);
    }
}




