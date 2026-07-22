// prisma.config.ts
// Prisma 7 configuration file
// - migrations use DIRECT_URL (bypasses PgBouncer pooler — required for DDL)
// - application queries use DATABASE_URL (pooled)

import 'dotenv/config';
import { defineConfig } from 'prisma/config';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    // Migrations MUST use the direct (unpooled) connection.
    // PgBouncer's transaction-mode pooler blocks DDL statements.
    url: process.env['DIRECT_URL'] ?? process.env['DATABASE_URL'],
  },
});
