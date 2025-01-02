import express from 'express';
import { greenAPIService } from '../../services/greenAPI/service.js';
import postgres from 'postgres';

const router = express.Router();

// Create a separate database connection for webhooks
let sql;
try {
    sql = postgres(process.env.DATABASE_URL, {
        ssl: 'require',
        max: 5,
        idle_timeout: 20
    });
    console.log('Webhook database connection initialized');
} catch (error) {
    console.error('Failed to initialize webhook database connection:', error);
    sql = null;
}

// Helper function to save chat to database
async function saveChat(senderData) {
    if (!sql) {
        throw new Error('Database connection not initialized');
    }
    try {
        const result = await sql`
            INSERT INTO whatsapp_chats (chat_id, phone_number, contact_name, last_message_timestamp)
            VALUES (${senderData.chatId}, ${senderData.sender}, ${senderData.senderName}, NOW())
            ON CONFLICT (chat_id) 
            DO UPDATE SET 
                contact_name = EXCLUDED.contact_name,
                last_message_timestamp = NOW(),
                updated_at = NOW()
            RETURNING *
        `;
        return result[0];
    } catch (error) {
        console.error('Error saving chat:', error);
        throw error;
    }
}

// Helper function to save message to database
async function saveMessage(messageData, chatId, isOutgoing = false) {
    if (!sql) {
        throw new Error('Database connection not initialized');
    }
    try {
        const result = await sql`
            INSERT INTO whatsapp_messages 
            (chat_id, message_id, message_type, content, media_url, is_outgoing, timestamp)
            VALUES (
                ${chatId},
                ${messageData.idMessage},
                ${messageData.typeMessage},
                ${messageData.textMessage || null},
                ${messageData.downloadUrl || null},
                ${isOutgoing},
                NOW()
            )
            RETURNING *
        `;
        return result[0];
    } catch (error) {
        console.error('Error saving message:', error);
        throw error;
    }
}

// Test endpoint to verify webhook is accessible
router.get('/', (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'WhatsApp webhook endpoint is active',
        timestamp: new Date().toISOString()
    });
});

// Webhook handler for incoming messages
router.post('/', async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        
        console.log('Received webhook request with headers:', req.headers);
        console.log('Received webhook body:', JSON.stringify(req.body, null, 2));
        
        // Verify webhook authorization if token is set
        if (process.env.GREEN_API_TOKEN) {
            if (!authHeader) {
                console.error('Missing authorization header');
                return res.status(401).json({ error: 'Authorization header is required' });
            }

            if (authHeader !== process.env.GREEN_API_TOKEN) {
                console.error('Invalid authorization token');
                return res.status(401).json({ error: 'Invalid authorization token' });
            }
        }

        const { body } = req;

        // Validate webhook payload
        if (!body || !body.typeWebhook) {
            console.error('Invalid webhook payload:', body);
            return res.status(400).json({ error: 'Invalid webhook payload' });
        }

        switch (body.typeWebhook) {
            case 'incomingMessageReceived':
                if (!body.senderData || !body.messageData) {
                    throw new Error('Missing required message data');
                }
                const chat = await saveChat(body.senderData);
                const message = await saveMessage(body.messageData, body.senderData.chatId);
                console.log('Saved incoming message:', message);
                break;

            case 'outgoingMessageStatus':
                if (!body.messageData?.idMessage || !body.status) {
                    throw new Error('Missing required status data');
                }
                await sql`
                    UPDATE whatsapp_messages 
                    SET status = ${body.status}, 
                        updated_at = NOW() 
                    WHERE message_id = ${body.messageData.idMessage}
                `;
                console.log('Updated message status:', body.messageData.idMessage, body.status);
                break;

            default:
                console.log('Unhandled webhook type:', body.typeWebhook);
        }

        res.status(200).json({ 
            status: 'success',
            message: 'Webhook processed successfully',
            webhookType: body.typeWebhook
        });

    } catch (error) {
        console.error('Webhook Error:', error);
        res.status(500).json({ 
            error: error.message || 'Internal server error',
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
});

export default router;
