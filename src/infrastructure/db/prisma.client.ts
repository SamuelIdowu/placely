// src/infrastructure/db/prisma.client.ts
// Prisma 7 singleton — prevents multiple PrismaClient instances during Next.js hot-reload.
// Import: import { PrismaClient } from '@/generated/prisma';

import ws from 'ws';
import { PrismaClient } from '@/generated/prisma';
import { neonConfig } from '@neondatabase/serverless';
import { PrismaNeon } from '@prisma/adapter-neon';

// Configure Neon WebSocket constructor for Node.js environments
neonConfig.webSocketConstructor = ws;

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

const createPrismaClient = () => {
  let connectionString = process.env.DATABASE_URL || process.env.DIRECT_URL || "";
  // Strip surrounding quotes if present from env file loading
  connectionString = connectionString.trim().replace(/^["']|["']$/g, '');

  if (!connectionString) {
    throw new Error('DATABASE_URL or DIRECT_URL environment variable is not defined.');
  }

  const adapter = new PrismaNeon({ connectionString });
  return new PrismaClient({ adapter });
};

export const prisma: PrismaClient =
  (globalForPrisma.prisma && 'notification' in globalForPrisma.prisma)
    ? globalForPrisma.prisma
    : createPrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
