// src/infrastructure/db/prisma.client.ts
// Prisma 7 singleton — prevents multiple PrismaClient instances during Next.js hot-reload.
// Import: import { PrismaClient } from '@/generated/prisma/client';

import { PrismaClient } from '@/generated/prisma/client';
import { Pool } from '@neondatabase/serverless';
import { PrismaNeon } from '@prisma/adapter-neon';

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

const createPrismaClient = () => {
  const connectionString = process.env.DATABASE_URL || "postgres://dummy:dummy@localhost:5432/dummy";
  const pool = new Pool({ connectionString });
  const adapter = new PrismaNeon(pool as any);
  return new PrismaClient({ adapter });
};

export const prisma: PrismaClient =
  globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
