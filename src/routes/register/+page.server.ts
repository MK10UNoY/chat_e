import { fail, redirect } from '@sveltejs/kit';

export const actions = {
  default: async ({ request, locals }) => {
    const formData = await request.formData();
    const email = formData.get('email');
    const password = formData.get('password');
    const confirmPassword = formData.get('confirmPassword');
    if (!email || !password || !confirmPassword) {
      return fail(400, { error: 'All fields are required.' });
    }
    if (password !== confirmPassword) {
      return fail(400, { error: 'Passwords do not match.' });
    }
    const { error } = await locals.supabase.auth.signUp({ email, password });
    if (error) {
      return fail(400, { error: error.message });
    }
    throw redirect(303, '/login');
  }
}; 