import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
  pages: {
    signIn: '/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      console.log("authorized called", auth);
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
      console.log('pathname: ', nextUrl.pathname)
      if (isOnDashboard) {
        return isLoggedIn;
      } else if (isLoggedIn) {
        if (['/login', '/register'].some(path => nextUrl.pathname === path)) {
          return Response.redirect(new URL('/dashboard', nextUrl));
        } else return true;

      }
      return false;
    },
    signIn({ account, profile }) {
      console.log("signIn called");
      return true;
    },
    async redirect({ url, baseUrl }) {
      return '/dashboard';
    },
  },
  providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig;