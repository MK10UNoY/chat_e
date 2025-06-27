import { fail, redirect } from '@sveltejs/kit';

export const actions = {
  default: async ({ request, locals }) => {
    const formData = await request.formData();
    const email = formData.get('email');
    const password = formData.get('password');
    if (!email || !password) {
      return fail(400, { error: 'Email and password are required.' });
    }
    const { error } = await locals.supabase.auth.signInWithPassword({ email, password });
    if (error) {
      return fail(400, { error: error.message });
    }
    throw redirect(303, '/');
  }
}; 