import type { PageServerLoad } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
  const user = locals.user;
  if (!user) {
    return { medicalContexts: [] };
  }

  // Fetch user's medical contexts for the dropdown
  const { data: medicalContexts, error } = await locals.supabase
    .from('user_medical_data')
    .select('id, full_name')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching medical contexts:', error);
    return { medicalContexts: [] };
  }

  // Map to include a title for display
  const mappedContexts = (medicalContexts || []).map((context: any) => ({
    id: context.id,
    title: context.full_name || `Medical Record ${context.id.slice(0, 8)}`
  }));

  return { medicalContexts: mappedContexts };
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

    // Redirect to the new chat
    throw redirect(302, `/chats/${chat.id}`);
  }
}; 