import type { PageServerLoad } from './$types';
import { fail } from '@sveltejs/kit';
import type { Actions } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
  const user = locals.user;
  if (!user) {
    return { chats: [] };
  }

  // Fetch chats for the user, sorted by last modified
  const { data: chats, error } = await locals.supabase
    .from('chats')
    .select(`
      id, 
      title, 
      updated_at,
      medical_context_id,
      messages(
        content,
        created_at
      )
    `)
    .eq('user_id', user.id)
    .order('updated_at', { ascending: false });

  if (error) {
    console.error('Error fetching chats:', error);
    return { chats: [] };
  }

  // Map chats to include last_message if available
  const mappedChats = (chats || []).map((chat: any) => {
    // Get the latest message (messages are ordered by created_at desc)
    const latestMessage = chat.messages && chat.messages.length > 0 
      ? chat.messages[0] 
      : null;

    return {
      id: chat.id,
      title: chat.title,
      updated_at: chat.updated_at,
      medical_context_id: chat.medical_context_id,
      last_message: latestMessage?.content || ''
    };
  });

  return { chats: mappedChats };
};

export const actions: Actions = {
  createChat: async ({ request, locals }) => {
    const user = locals.user;
    if (!user) {
      return fail(401, { error: 'Unauthorized' });
    }

    const formData = await request.formData();
    const title = formData.get('title') as string;
    const medicalContextId = formData.get('medical_context_id') as string || null;

    if (!title || title.trim().length === 0) {
      return fail(400, { error: 'Title is required' });
    }

    // Create new chat
    const { data: chat, error } = await locals.supabase
      .from('chats')
      .insert({
        user_id: user.id,
        title: title.trim(),
        medical_context_id: medicalContextId
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating chat:', error);
      return fail(500, { error: 'Failed to create chat' });
    }

    return { success: true, chat };
  },

  createMessage: async ({ request, locals }) => {
    const user = locals.user;
    if (!user) {
      return fail(401, { error: 'Unauthorized' });
    }

    const formData = await request.formData();
    const chatId = formData.get('chat_id') as string;
    const content = formData.get('content') as string;

    if (!chatId || !content || content.trim().length === 0) {
      return fail(400, { error: 'Chat ID and content are required' });
    }

    // Verify user owns the chat
    const { data: chat, error: chatError } = await locals.supabase
      .from('chats')
      .select('id')
      .eq('id', chatId)
      .eq('user_id', user.id)
      .single();

    if (chatError || !chat) {
      return fail(403, { error: 'Chat not found or access denied' });
    }

    // Create message
    const { data: message, error } = await locals.supabase
      .from('messages')
      .insert({
        chat_id: chatId,
        sender_id: user.id,
        content: content.trim()
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating message:', error);
      return fail(500, { error: 'Failed to create message' });
    }

    // Update chat's updated_at timestamp
    await locals.supabase
      .from('chats')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', chatId);

    return { success: true, message };
  }
}; 