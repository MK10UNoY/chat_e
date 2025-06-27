import type { PageServerLoad } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
  const user = locals.user;
  if (!user) {
    throw redirect(307, '/login');
  }

  // Check if user already has a medical profile
  const { data: existingProfile } = await locals.supabase
    .from('user_medical_data')
    .select('id')
    .eq('user_id', user.id)
    .single();

  if (existingProfile) {
    // If profile exists, redirect to dashboard
    throw redirect(307, '/');
  }

  return {};
};

export const actions: Actions = {
  createMedicalProfile: async ({ request, locals }) => {
    console.log("=== FORM SUBMISSION STARTED ===");
    const user = locals.user;
    if (!user) {
      console.log("No user found, returning 401");
      return fail(401, { error: 'Unauthorized' });
    }

    console.log("User authenticated:", user.id);
    const formData = await request.formData();
    
    // Log all form data for debugging
    console.log("=== FORM DATA RECEIVED ===");
    for (const [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }
    console.log("===========================");

    try {
      // Parse form data
      const firstName = formData.get('firstName') as string;
      const lastName = formData.get('lastName') as string;
      const dobString = formData.get('dob') as string;
      const gender = formData.get('gender') as string;
      const height = formData.get('height') ? parseInt(formData.get('height') as string) : null;
      const weight = formData.get('weight') ? parseInt(formData.get('weight') as string) : null;
      
      // Parse JSON fields with error handling
      let medicalHistory: string[] = [];
      let allergies: string[] = [];
      let medications: string[] = [];
      
      try {
        medicalHistory = JSON.parse(formData.get('medicalHistory') as string || '[]');
        allergies = JSON.parse(formData.get('allergies') as string || '[]');
        medications = JSON.parse(formData.get('medications') as string || '[]');
      } catch (e) {
        console.error('Error parsing JSON fields:', e);
        return fail(400, { error: 'Invalid JSON data in form submission' });
      }
      
      // Validate required fields
      if (!firstName || !lastName || !dobString || !gender) {
        console.log("Validation failed - missing required fields");
        return fail(400, { error: 'Required fields are missing' });
      }

      // Parse the date string to ensure it's in the correct format
      let dob: string;
      try {
        // Remove any 'T' or time component from the date string
        dob = dobString.split('T')[0];
        // Validate that it's a valid date
        if (!isValidDate(dob)) {
          throw new Error('Invalid date format');
        }
      } catch (e) {
        console.error('Error parsing date:', e);
        return fail(400, { error: 'Invalid date format' });
      }

      // Create the payload with proper typing
      const supabasePayload = {
        user_id: user.id,
        first_name: firstName,
        last_name: lastName,
        dob, // This will be in YYYY-MM-DD format
        gender,
        height,
        weight,
        medical_history: medicalHistory,
        allergies: allergies,
        medications: medications
      };

      console.log('=== SUPABASE PAYLOAD ===');
      console.log(JSON.stringify(supabasePayload, null, 2));
      console.log('========================');

      // Insert into database with error handling
      const { data, error } = await locals.supabase
        .from('user_medical_data')
        .insert(supabasePayload)
        .select()
        .single();

      if (error) {
        console.error('Supabase Error:', error);
        return fail(500, { 
          error: 'Failed to create medical profile',
          details: error.message
        });
      }

      console.log('=== SUCCESS: Medical profile created ===');
      console.log('User ID:', user.id);
      console.log('Profile data:', data);
      console.log('===============================');

      // Return success with redirect instead of throwing
      return {
        success: true,
        redirect: '/'
      };

    } catch (error) {
      console.error('Unexpected error:', error);
      return fail(500, { 
        error: 'An unexpected error occurred',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
};

// Helper function to validate date format
function isValidDate(dateString: string): boolean {
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date.getTime());
} 