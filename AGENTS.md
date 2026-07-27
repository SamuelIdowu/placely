<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

**Actual version: Next.js 16.2.10** — the setup docs reference v14, which is outdated. Always trust `package.json` over any documentation in this repo.
<!-- END:nextjs-agent-rules -->

<!-- BEGIN:clean-architecture-rules -->
# Dependency Rule — NEVER violate this

This project follows Clean Architecture + Hexagonal (Ports & Adapters). The dependency rule is absolute:

```
domain/ ← application/ ← infrastructure/ ← app/ (Next.js)
```

- `src/domain/` must have **zero imports** from Next.js, Prisma, Resend, `@vercel/blob`, or any package in `node_modules`. It may only import other files within `src/domain/` and Node built-ins.
- `src/application/` (use cases) must only import from `src/domain/`. Never import Prisma or infrastructure directly.
- Repositories in `src/infrastructure/db/` implement the port interfaces defined in `src/domain/ports/`. They are the only place Prisma is used.
- Violating this collapses the architecture. If you're tempted to import Prisma into a use case or domain entity, you're doing it wrong — define a port instead.
<!-- END:clean-architecture-rules -->

<!-- BEGIN:prisma7-rules -->
# Prisma 7 — This is NOT the Prisma you know

This project uses **Prisma 7** with `@prisma/adapter-neon`. Breaking changes from v5/v6:

- The generated client lives at `src/generated/prisma`, **not** `@prisma/client`. Always import via the singleton at `@/infrastructure/db/prisma.client` — never import the generated client directly in application or domain code.
- The `schema.prisma` datasource has **no `url` field**. The database URL is configured in `prisma.config.ts` (a Prisma 7 requirement). Do not add `url = env("DATABASE_URL")` to the schema.
- Run `pnpm exec prisma generate` after any schema change.
- Run `pnpm exec prisma migrate dev` to create migrations. Never edit migration files manually.
<!-- END:prisma7-rules -->

<!-- BEGIN:nextauth-v5-rules -->
# NextAuth v5 Beta — This is NOT the NextAuth you know

This project uses **next-auth@5.0.0-beta** (Auth.js). The v4 API is completely gone:

- **Do NOT use** `getServerSession()`, `useSession()` from `next-auth/react`, or `SessionProvider` from v4.
- Import `auth`, `handlers`, `signIn`, `signOut` from `@/lib/auth`.
- In Server Components and Route Handlers, call `const session = await auth()` to get the session.
- The `session.user` object is extended with `id` and `role` via the JWT callback in `src/lib/auth.ts`. These are available as `session.user.id` and `session.user.role`.
- The `role` field comes from our custom `User.role` (enum: `STUDENT`, `EMPLOYER`, `ADMIN`), not from OAuth providers.
<!-- END:nextauth-v5-rules -->

<!-- BEGIN:di-container-rules -->
# Dependency Injection — No framework, manual container only

There is no DI framework (no Inversify, tsyringe, etc.). Use cases and repositories are wired manually:

- All singletons and use case instances are exported from `src/lib/container.ts`.
- When adding a new use case: instantiate its dependencies in `container.ts` and export the instance.
- Never instantiate repositories or use cases inside React components, Server Actions, or API routes — import the pre-built instance from `container.ts`.
- Keep `container.ts` as the single source of truth for all wiring.
<!-- END:di-container-rules -->
