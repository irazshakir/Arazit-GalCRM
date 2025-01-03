import { supabase } from '../config/db.js';
import { greenAPIService } from './greenAPI/service.js';

const conversationService = {
  async getConversations(filter = 'unassigned') {
    try {
      let query = supabase
        .from('whatsapp_chats')
        .select(`
          *,
          assigned_to:users!whatsapp_chats_assigned_to_fkey (
            id,
            name,
            email
          ),
          messages:whatsapp_messages (
            id,
            message_id,
            message_type,
            content,
            media_url,
            is_outgoing,
            status,
            timestamp,
            created_at
          )
        `)
        .order('last_message_timestamp', { ascending: false });

      // Apply filters
      switch (filter) {
        case 'unassigned':
          query = query.is('assigned_to', null);
          break;
        case 'assigned':
          query = query.not('assigned_to', 'is', null);
          break;
        case 'resolved':
          query = query.eq('status', 'resolved');
          break;
        case 'open':
          query = query.eq('status', 'open');
          break;
      }

      const { data, error } = await query;

      if (error) throw error;
      
      // Format the data for the UI
      return data.map(chat => ({
        id: chat.chat_id,
        name: chat.contact_name || chat.phone_number,
        phone: chat.phone_number,
        assigned_to: chat.assigned_to,
        status: chat.status || 'open',
        last_message: chat.messages?.[0]?.content || '',
        last_message_time: chat.last_message_timestamp,
        messages: chat.messages?.map(msg => ({
          id: msg.id,
          content: msg.content,
          type: msg.message_type,
          mediaUrl: msg.media_url,
          timestamp: msg.timestamp,
          isFromCustomer: !msg.is_outgoing,
          status: msg.status
        })) || []
      }));
    } catch (error) {
      console.error('Error fetching conversations:', error);
      throw error;
    }
  },

  async syncWhatsAppChats() {
    try {
      const chats = await greenAPIService.getChats();
      return chats;
    } catch (error) {
      console.error('Error syncing WhatsApp chats:', error);
      throw error;
    }
  },

  async assignConversation(chatId, userId) {
    try {
      const { data, error } = await supabase
        .from('whatsapp_chats')
        .update({ 
          assigned_to: userId,
          updated_at: new Date().toISOString()
        })
        .eq('chat_id', chatId);

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error assigning conversation:', error);
      throw error;
    }
  },

  async sendMessage(chatId, content, isOutgoing = true) {
    try {
      // First, create the message
      const { data: message, error: messageError } = await supabase
        .from('whatsapp_messages')
        .insert({
          chat_id: chatId,
          content,
          message_type: 'textMessage',
          is_outgoing: isOutgoing,
          timestamp: new Date().toISOString()
        })
        .select()
        .single();

      if (messageError) throw messageError;

      // Then update the chat's last message timestamp
      const { error: chatError } = await supabase
        .from('whatsapp_chats')
        .update({ 
          last_message_timestamp: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('chat_id', chatId);

      if (chatError) throw chatError;

      return message;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  },

  async updateStatus(chatId, status) {
    try {
      const { data, error } = await supabase
        .from('whatsapp_chats')
        .update({ 
          status,
          updated_at: new Date().toISOString()
        })
        .eq('chat_id', chatId);

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating status:', error);
      throw error;
    }
  }
};

export default conversationService;
