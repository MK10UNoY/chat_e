import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals, url }) => {
  const user = locals.user;
  if (!user) {
    throw redirect(302, '/login');
  }

  // Skip medical profile check for onboarding route
  if (url.pathname === '/onboarding') {
    return { user };
  }

  // Check if user has completed medical profile
  const { data: medicalProfile } = await locals.supabase
    .from('user_medical_data')
    .select('id')
    .eq('user_id', user.id)
    .single();

  if (!medicalProfile) {
    throw redirect(302, '/onboarding');
  }

  return { user };
}; 