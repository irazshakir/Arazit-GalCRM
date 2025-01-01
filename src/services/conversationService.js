import { supabase } from '../config/supabase';

const conversationService = {
  async getConversations(filter = 'unassigned') {
    try {
      let query = supabase
        .from('conversations')
        .select(`
          *,
          assigned_to:users!conversations_assigned_to_fkey (
            id,
            name,
            email
          ),
          customer:customers (
            id,
            name,
            phone,
            email
          ),
          messages (
            id,
            content,
            created_at,
            is_from_customer
          )
        `)
        .order('updated_at', { ascending: false });

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
      return data;
    } catch (error) {
      throw error;
    }
  },

  async assignConversation(conversationId, userId) {
    try {
      const { data, error } = await supabase
        .from('conversations')
        .update({ assigned_to: userId })
        .eq('id', conversationId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      throw error;
    }
  },

  async sendMessage(conversationId, content, isFromCustomer = false) {
    try {
      const { data, error } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversationId,
          content,
          is_from_customer: isFromCustomer
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      throw error;
    }
  },

  async updateStatus(conversationId, status) {
    try {
      const { data, error } = await supabase
        .from('conversations')
        .update({ status })
        .eq('id', conversationId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      throw error;
    }
  }
};

export default conversationService;
