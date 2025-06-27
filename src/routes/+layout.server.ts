import { redirect } from '@sveltejs/kit';

export const load = async ({ locals, url }) => {
  // Allow /landing, /login, and /register to be public
  if (
    url.pathname.startsWith('/landing') ||
    url.pathname.startsWith('/login') ||
    url.pathname.startsWith('/register')
  ) {
    return {};
  }
  // Redirect unauthenticated users to /landing
  if (!locals.user) {
    throw redirect(302, '/landing');
  }
  return { user: locals.user };
}; 