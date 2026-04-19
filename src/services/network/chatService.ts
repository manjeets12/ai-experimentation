import baseApi from "@shared/network/base";
import { CONFIG } from "@config";

const BASE_URL = CONFIG.HTTP_URL;
const ChatService = () => {
    const api = baseApi(BASE_URL, {});

    const getConversations = () => {
        return api.get("/conversations");
    }

    const createConversation = () => {
        return api.post("/conversations");
    }

    const getConversation = (id: string) => {
        return api.get(`/conversations/${id}`);
    }

    const createMessage = (id: string, message: string) => {
        return api.post(`/conversations/${id}/messages`, { message });
    }

    return {
        getConversations,
        createConversation,
        getConversation,
        createMessage,
    }
}

export default ChatService();