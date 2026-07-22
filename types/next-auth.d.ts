// types/next-auth.d.ts
// Extends NextAuth v5 session and JWT types with Placely's custom fields.
// `role` maps to the Role enum (STUDENT | EMPLOYER | ADMIN).
// `id` is the Prisma User.id (cuid).

import type { DefaultSession, DefaultJWT } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      role: string;
    } & DefaultSession['user'];
  }

  interface User {
    role: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT extends DefaultJWT {
    id: string;
    role: string;
  }
}
