import express from "express";
import { getUUID } from './helper.js';
import http from 'http'
import cors from 'cors';
import { createSocketServer } from "./socket.js";

const app = express();
const server = http.createServer(app);

createSocketServer(server);


//middlerware
app.use(cors())
app.use(express.urlencoded({ extended: true }))
app.use(express.json());
//middlerware


/**
 * What I need
 * 1. In memory conversations
 * 2. In memory conversations/id
 * 3. In memory conversations/id/messages
 */

const conversations = new Map(); //{id, userId, createdAt, messages:[{id, role, content, createdAt}]}

app.get("/check-health", (req, res) => {
    res.send("Server is healthy");
})

app.get('/conversations', (req, res) => {
    const { userId } = req.query;
    const userConversations = Array.from(conversations.values()).filter(c => c.userId === userId).sort((a, b) => a.createdAt - b.createdAt);
    res.json(userConversations);
})

//create a conversation
app.post("/conversations", (req, res) => {
    const { userId } = req.body;

    const id = getUUID('conversation');
    const data = { id, userId, createdAt: new Date(), messages: [] }
    conversations.set(id, data);
    res.json(data);
});

app.post("/conversations/:id/messages", (req, res) => {
    const { id } = req.params;
    const { message } = req.body;
    const conversation = conversations.get(id);
    if (!conversation) {
        return res.status(404).json({ error: "Conversation not found" });
    }
    const messageId = getUUID('message');
    const data = { id: messageId, role: 'user', content: message, createdAt: new Date() }
    conversation.messages.push(data);
    conversations.set(id, conversation);
    res.json(data);
})









const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {

    console.log(`   HTTP Server: http://localhost:${PORT}`);
    console.log(`   WebSocket:   ws://localhost:${PORT}`);
});

export default server;