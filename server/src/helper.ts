export function getUUID(key: string): string {
    const id = crypto.randomUUID() + Date.now().toString();
    return key ? key + "-" + id : id;
}



// Keep your original intent, but much richer

const AI_RESPONSES = [
    {
        type: "short",
        text: "That's a great question! Let me think about that for a moment..."
    },
    {
        type: "short",
        text: "Interesting point. Here's how I would approach it:"
    },
    {
        type: "medium",
        text: `I see what you're getting at. Let me break this down a bit.

First, it's important to understand the core idea behind your question. Often, problems like this have multiple layers, and addressing them step by step makes things clearer.

If you're building something or trying to reason about a system, I'd recommend starting simple and iterating. That usually leads to better outcomes than trying to solve everything at once.`
    },
    {
        type: "long",
        text: `This is actually a really interesting topic, and there are a few different angles we can explore here.

At a high level, the key idea is to focus on clarity and incremental improvement. Whether you're dealing with code, architecture, or even user experience, breaking things down into smaller, manageable pieces helps reduce complexity.

For example, instead of trying to solve the entire problem in one go, you can:
1. Identify the core requirement
2. Build a minimal working version
3. Iterate based on feedback

This approach not only reduces risk but also makes your system easier to reason about.

Let me know if you'd like me to go deeper into any specific part of this.`
    },
];


export function getAIMockResponse(userMessage: string) {
    const msg = userMessage.toLowerCase();

    // 👋 Greetings
    if (/(hello|hi|hey)/.test(msg)) {
        return `Hello! 👋

I'm your AI assistant. I can help you explore ideas, debug problems, or just have a conversation.

What would you like to dive into today?`;
    }

    // 😊 Status
    if (msg.includes("how are you")) {
        return `I'm doing great, thanks for asking!

I'm fully focused and ready to help you with whatever you're working on — whether it's coding, system design, or just brainstorming ideas.`;
    }

    // 🆘 Help
    if (msg.includes("help")) {
        return `Absolutely, I'd love to help.

You can ask me about:
• Programming concepts
• System design
• Debugging issues
• General knowledge

Or even just describe what you're trying to build, and I can guide you step by step.`;
    }

    // 🙏 Thanks
    if (msg.includes("thank")) {
        return `You're welcome! 😊

If you have more questions or want to explore something deeper, just let me know.`;
    }

    // 👋 Bye
    if (/(bye|goodbye)/.test(msg)) {
        return `Goodbye! 👋

It was great chatting with you. Feel free to come back anytime — I'll be here.`;
    }

    // 🌦 Weather
    if (msg.includes("weather")) {
        return `I don't have access to real-time weather data right now, but I can definitely explain weather patterns, climate systems, or help you interpret forecasts.

What exactly are you curious about?`;
    }

    // 😂 Joke
    if (msg.includes("joke")) {
        const jokes = [
            "Why do programmers prefer dark mode? Because light attracts bugs! 🐛",
            "Why did the developer go broke? Because he used up all his cache! 💸",
            "Why do Java developers wear glasses? Because they don’t C#! 🤓",
        ];
        return jokes[Math.floor(Math.random() * jokes.length)];
    }

    // 🧠 Default intelligent response
    const random = AI_RESPONSES[Math.floor(Math.random() * AI_RESPONSES.length)];

    return `${random.text}

---
`;
}


function chunkStreamingText(text: string): string[] {
    const tokens = text.match(/\S+|\s+/g) ?? [];
    const chunks: string[] = [];
    let buffer = "";

    for (const token of tokens) {
        buffer += token;

        if (
            buffer.length >= 12 &&
            /[\s,.!?]/.test(token)
        ) {
            chunks.push(buffer);
            buffer = "";
        }
    }

    if (buffer) chunks.push(buffer);
    return chunks;
}

export function delay(ms: number) {
    return new Promise((res) => setTimeout(res, ms));
}
export function createMockStream(text: string): ReadableStream<Uint8Array> {
    const encoder = new TextEncoder();

    const chunks = chunkStreamingText(text); // use smart chunking

    return new ReadableStream({
        async start(controller) {
            for (const chunk of chunks) {
                await delay(30 + Math.random() * 40); // 👈 natural feel

                const payload = JSON.stringify({
                    candidates: [
                        {
                            content: {
                                parts: [{ text: chunk }],
                            },
                        },
                    ],
                });

                controller.enqueue(encoder.encode(payload + "\n"));
            }

            controller.close();
        },
    });
}