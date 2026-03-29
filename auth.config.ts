import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
  pages: {
    signIn: '/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
      console.log('pathname: ', nextUrl.pathname)
      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      } else if (isLoggedIn) {
        if (['/login', '/register'].some(path => nextUrl.pathname === path)) {
          return Response.redirect(new URL('/dashboard', nextUrl));
        } else return true;

      }
      return false;
    },
  },
  providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig;