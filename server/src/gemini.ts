import { ServerMessage, GeminiRequest, } from './types';
//import { baseApi } from '@shared/network/base';
import "dotenv/config";
import { createMockStream, getAIMockResponse } from './helper';
import { WebSocket } from "ws"; //On Server Websocket is not globally available like RN or browser



// const GeminiApi = baseApi('https://generativelanguage.googleapis.com/v1beta', {
//     "x-goog-api-key": process.env.GEMINI_API_KEY!,
// });

export async function generateGeminiContentStream(
    message: string,
    signal?: AbortSignal
): Promise<ReadableStream<Uint8Array>> {
    // here i am just mocking the API response for UI Testing

    //TODO: add proper api call here instead of mock
    // return await GeminiApi.stream<GeminiRequest>(
    //     "/models/gemini-2.0-flash:streamGenerateContent",
    //     {
    //         body: {
    //             contents: [
    //                 { role: "user", parts: [{ text: message }] },
    //             ],
    //         },
    //         signal,
    //     }
    // );
    const response = getAIMockResponse(message);


    return createMockStream(response);
}

export async function streamToWebSocket(
    ws: WebSocket,
    conversationId: string,
    stream: ReadableStream<Uint8Array>,
    controller: AbortController
) {
    try {

        ws.send(JSON.stringify({ type: "start", conversationId }));

        for await (const chunk of parseGeminiStream(
            stream,
            controller.signal
        )) {
            if (ws.readyState !== WebSocket.OPEN) break;

            ws.send(
                JSON.stringify({
                    type: "chunk",
                    conversationId,
                    data: chunk,
                } satisfies ServerMessage)
            );
        }
        if (controller.signal.aborted) {
            ws.send(JSON.stringify({ type: "cancelled", conversationId, }));
            return;
        }


        ws.send(JSON.stringify({ type: "done", conversationId }));
    } catch (error) {
        if (controller.signal.aborted) {
            ws.send(JSON.stringify({ type: "cancelled", conversationId, }));
            return;
        }
        console.error("Streaming error:", error);
        ws.send(
            JSON.stringify({
                type: "error",
                conversationId,
                message: "Streaming failed",
            } satisfies ServerMessage)
        );
    }
}

async function* parseGeminiStream(
    stream: ReadableStream<Uint8Array>,
    signal?: AbortSignal
): AsyncGenerator<string> {
    const reader = stream.getReader();
    const decoder = new TextDecoder();

    let buffer = "";

    while (true) {
        if (signal?.aborted) break;

        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        const parts = buffer.split("\n");
        buffer = parts.pop() || "";

        for (const part of parts) {

            try {
                const json = JSON.parse(part);

                const text =
                    json?.candidates?.[0]?.content?.parts?.[0]?.text;

                if (text) {
                    yield text;
                }
            } catch {
                // ignore partial JSON
            }
        }
    }
}


