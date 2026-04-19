# AI Chat Application

A React Native AI Chat Application featuring real-time message streaming, typing indicators, and a robust frontend state management system.

## Getting Started

Follow these instructions to get the application running on your local machine.

### 1. Start the Server

First, you need to start the mock chat server locally.

```bash
cd server
npm install
npm run start
```
*(Note: The server must be running on your local machine for the app to function.)*

### 2. Configure Local IP Address

To allow your mobile device or emulator to connect to the local server, you need to update the configuration with your machine's local IP address.

**Find your IP Address:**
- **Mac:** Run `ipconfig getifaddr en0` in your terminal (or `ipconfig getifaddr en1` if on Wi-Fi/Ethernet differently).
- **Windows:** Run `ipconfig` and look for "IPv4 Address".
- **Linux:** Run `hostname -I`.

Once you have your IP address, open `config.ts` in the root of the project and update the `IP_ADDRESS` variable:

```typescript
const IP_ADDRESS = "YOUR_IP_ADDRESS_HERE"; // Please update ip to run it on mobile
```

### 3. Start the Client App

Return to the root directory of the project, install dependencies, and start the Expo development server.

```bash
# Assuming you are in the server directory
cd ..
npm install
npx expo start
```
*(Note: Expo is being used in this project due to memory constraints on the development laptop, allowing for easier testing and compilation.)*

---

## Architecture & Technical Decisions

This project incorporates several robust design patterns to handle real-time chat streaming smoothly on the frontend without relying on heavy backend modifications.

### 1. AI-Driven UI & Design System
Most of the UI components (Atoms, Molecules), the main Chat Screen, and the underlying Design System were generated and refined with the help of AI. This ensured a clean, modern, and consistent visual aesthetic across the application.

### 2. Communication Flow & WebSockets
**Flow:** Client sends a message -> Server receives the request -> Server streams mocked response chunks back via WebSocket.

*Why WebSockets?* Due to Server-Sent Events (SSE) limitations and parsing constraints in certain React Native networking environments, we opted for WebSockets. This provides a highly stable, bidirectional, and real-time streaming pipeline for chat chunks.

### 3. Typing Indicator & Text Buffering
To simulate a smooth "typing" effect when receiving rapid message chunks from the server, we don't immediately render everything and overwhelm React's render cycle. Instead, we use a buffered approach:
- Incoming chunks are appended to a lightweight `pendingRef` string buffer.
- We use `requestAnimationFrame` (RAF) combined with a time threshold (`REVEAL_INTERVAL_MS = 50ms`) to periodically extract a few characters from the buffer and trigger a React state update (`setState`).
- This batches React UI updates, prevents frame drops, and creates a highly performant, human-like typing animation without blocking the main UI thread.

### 4. Cancel and Retry Mechanisms
We built a unified "Global Stream Phase" state machine to handle interruptions gracefully:
- **Cancel:** If a user stops a stream, a cancel event is fired, and the current message's status is locally updated to `"cancelled"`. Crucially, any "late" or "ghost" chunks that might arrive from the server afterward are safely ignored because the buffer locks them out.
- **Retry:** If a stream fails or is cancelled, a visual "Retry" button appears. Clicking it traverses the local message history, identifies the original user prompt that preceded the failed message, and automatically re-initiates the `sendMessage` pipeline.

### 5. Scroll Behavior
To maintain a natural chat experience, the `FlatList` automatically tracks its scroll position. We calculate the `distanceFromBottom` whenever the list scrolls or its content size changes. If the user is currently reading near the bottom of the list (within an 80px threshold), the arrival of new streaming chunks will automatically trigger `scrollToEnd({ animated: true })`, ensuring the active conversation always remains visible.
