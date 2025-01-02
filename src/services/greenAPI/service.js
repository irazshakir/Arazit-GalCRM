import { greenAPIClient, config } from './config.js';
import { db } from '../../db.js'; // Assuming you have a database connection setup

class GreenAPIService {
    constructor() {
        this.instanceId = config.instanceId;
        this.apiTokenInstance = config.apiTokenInstance;
    }

    // Fetch all chats
    async getChats() {
        try {
            const response = await greenAPIClient.get('getChats');
            await this.syncChatsToDatabase(response.data);
            return response.data;
        } catch (error) {
            console.error('Error fetching chats:', error);
            throw error;
        }
    }

    // Fetch messages for a specific chat
    async getMessages(chatId, count = 100) {
        try {
            const response = await greenAPIClient.post('getChatHistory', {
                chatId,
                count
            });
            await this.syncMessagesToDatabase(chatId, response.data);
            return response.data;
        } catch (error) {
            console.error('Error fetching messages:', error);
            throw error;
        }
    }

    // Send text message
    async sendMessage(chatId, message) {
        try {
            const response = await greenAPIClient.post('sendMessage', {
                chatId,
                message
            });
            await this.saveMessageToDatabase({
                chatId,
                messageId: response.idMessage,
                content: message,
                is_outgoing: true,
                message_type: 'text',
                status: 'sent'
            });
            return response;
        } catch (error) {
            console.error('Error sending message:', error);
            throw error;
        }
    }

    // Send media message
    async sendMedia(chatId, mediaUrl, caption = '') {
        try {
            const response = await greenAPIClient.post('sendFileByUrl', {
                chatId,
                urlFile: mediaUrl,
                fileName: 'media',
                caption
            });
            await this.saveMessageToDatabase({
                chatId,
                messageId: response.idMessage,
                content: caption,
                media_url: mediaUrl,
                is_outgoing: true,
                message_type: 'media',
                status: 'sent'
            });
            return response;
        } catch (error) {
            console.error('Error sending media:', error);
            throw error;
        }
    }

    // Mark messages as read
    async markAsRead(chatId) {
        try {
            const response = await greenAPIClient.post('readChat', {
                chatId
            });
            return response;
        } catch (error) {
            console.error('Error marking messages as read:', error);
            throw error;
        }
    }

    // Database sync methods
    async syncChatsToDatabase(chats) {
        for (const chat of chats) {
            const { id, name, phone } = chat;
            await db`
                INSERT INTO whatsapp_chats (chat_id, contact_name, phone_number)
                VALUES (${id}, ${name}, ${phone})
                ON CONFLICT (chat_id) 
                DO UPDATE SET 
                    contact_name = EXCLUDED.contact_name,
                    updated_at = CURRENT_TIMESTAMP
            `;
        }
    }

    async syncMessagesToDatabase(chatId, messages) {
        for (const message of messages) {
            await this.saveMessageToDatabase({
                chatId,
                messageId: message.idMessage,
                content: message.textMessage,
                media_url: message.downloadUrl,
                is_outgoing: message.type === 'outgoing',
                message_type: message.type,
                status: message.status,
                timestamp: new Date(message.timestamp * 1000)
            });
        }
    }

    async saveMessageToDatabase(messageData) {
        const {
            chatId,
            messageId,
            content,
            media_url,
            is_outgoing,
            message_type,
            status,
            timestamp = new Date()
        } = messageData;

        await db`
            INSERT INTO whatsapp_messages 
            (chat_id, message_id, content, media_url, is_outgoing, message_type, status, timestamp)
            VALUES (
                ${chatId}, ${messageId}, ${content}, ${media_url}, 
                ${is_outgoing}, ${message_type}, ${status}, ${timestamp}
            )
            ON CONFLICT (message_id) 
            DO UPDATE SET 
                status = EXCLUDED.status,
                updated_at = CURRENT_TIMESTAMP
        `;
    }

    getMessageType(message) {
        if (message.mediaUrl) {
            return message.mediaType || 'media';
        }
        return 'text';
    }
}

export const greenAPIService = new GreenAPIService();
