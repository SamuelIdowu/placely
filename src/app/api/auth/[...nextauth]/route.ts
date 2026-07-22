// app/api/auth/[...nextauth]/route.ts
// NextAuth v5 route handler — catches all /api/auth/* requests.

import { handlers } from '@/lib/auth';

export const { GET, POST } = handlers;
