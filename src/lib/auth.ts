// src/lib/auth.ts
// NextAuth v5 (Auth.js) configuration for Placely.
//
// Corrections vs. setup guide:
// - Uses `session: { strategy: 'jwt' }` — required for Credentials provider
// - References `user.passwordHash` (added to Prisma schema)
// - Imports PrismaClient from generated location (Prisma 7: @/generated/prisma/client)
// - `AUTH_SECRET` env var (NextAuth v5 renamed from NEXTAUTH_SECRET)

import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { prisma } from '@/infrastructure/db/prisma.client';
import bcrypt from 'bcryptjs';

// Prisma singleton is imported to avoid multiple connections during auth callbacks

export const { handlers, auth, signIn, signOut } = NextAuth({
  // Required for Credentials provider — cannot use 'database' strategy
  session: { strategy: 'jwt' },
  trustHost: true,

  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });

        if (!user || !user.passwordHash) return null;

        const isValid = await bcrypt.compare(
          credentials.password as string,
          user.passwordHash,
        );

        if (!isValid) return null;

        return {
          id: user.id,
          email: user.email,
          role: user.role,
          name: [user.firstName, user.lastName].filter(Boolean).join(' ') || undefined,
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      // Persist role, id and name into JWT on first sign-in
      if (user) {
        token.role = (user as { id: string; email: string; role: string; name?: string }).role;
        token.id = user.id;
        if (user.name) {
          token.name = user.name;
        }
      }
      return token;
    },
    async session({ session, token }) {
      // Expose role, id and name on the session object (type extended in types/next-auth.d.ts)
      session.user.role = token.role as string;
      session.user.id = token.id as string;
      if (token.name) {
        session.user.name = token.name as string;
      }
      return session;
    },
  },

  pages: {
    signIn: '/sign-in',
    error: '/sign-in',
  },
});
