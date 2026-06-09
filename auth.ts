import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
import type { User } from '@/app/lib/definitions';
import bcrypt from 'bcrypt';
import postgres from 'postgres';
import GoogleProvider from "next-auth/providers/google";
import Apple from 'next-auth/providers/apple';
import GitHub from 'next-auth/providers/github';
import PostgresAdapter from "@auth/pg-adapter"
import { Pool } from "@neondatabase/serverless"
import { getUser } from './app/lib/auth-actions';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });
const pool = new Pool({ connectionString: process.env.DATABASE_URL });


export const { auth, signIn, signOut, handlers } = NextAuth({
    ...authConfig,
    adapter: PostgresAdapter(pool),
    session: {
        strategy: 'jwt',
    },
    providers: [
        Credentials({
            async authorize(credentials) {
                console.log("authorize called");
                const parsedCredentials = z
                    .object({ email: z.string().email(), password: z.string().min(6) })
                    .safeParse(credentials);

                if (parsedCredentials.success) {
                    const { email, password } = parsedCredentials.data;
                    const user = await getUser(email);
                    if (!user) return null;

                    const passwordsMatch = await bcrypt.compare(password, user.password!);
                    if (passwordsMatch) return user;
                }


                console.log('Invalid credentials');
                return null;
            },
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            authorization: {
                params: {
                    prompt: "consent",
                    access_type: "offline",
                    response_type: "code"
                }
            }
        }),
        Apple({

        }),
        GitHub({
            clientId: process.env.GITHUB_ID,
            clientSecret: process.env.GITHUB_SECRET
        }),
    ],
});