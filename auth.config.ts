import type { NextAuthConfig } from 'next-auth';
import { getUser } from './app/lib/auth-actions';

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
      console.log("signIn called", { account, profile });

      return !account?.userId;
    },
    async redirect({ url, baseUrl }) {
      return '/dashboard';
    },
    async jwt({ token, user }) {
      console.log("jwt called", { token, user });

      return token;
    },
    session({ session, token }) {
      session.user.id = token.sub || '';
      console.log("session called", { session, token });

      return session;
    },
  },
  providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig;