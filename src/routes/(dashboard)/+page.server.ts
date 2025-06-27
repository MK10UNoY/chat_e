import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
  const user = locals.user;

  if (!user) {
    throw redirect(302, '/login');
  }

  // Fetch user's medical profile
  const { data: medicalProfile, error } = await locals.supabase
    .from('user_medical_data')
    .select('*')
    .eq('user_id', user.id)
    .single();

  if (error) {
    console.error('Error fetching medical profile:', error);
  }

  // If no medical profile exists, redirect to onboarding
  if (!medicalProfile) {
    throw redirect(302, '/onboarding');
  }

  return {
    user,
    medicalProfile
  };
}; 