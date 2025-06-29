import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ locals }) => {
  try {
    // Sign out from Supabase
    const { error } = await locals.supabase.auth.signOut();
    
    if (error) {
      console.error('Logout error:', error);
      return json({ error: 'Logout failed' }, { status: 500 });
    }

    return json({ success: true });
  } catch (error) {
    console.error('Logout error:', error);
    return json({ error: 'Logout failed' }, { status: 500 });
  }
}; 