# Placely — Scalable Project Setup Guide

> **Architecture:** Clean Architecture + Domain-Driven Design + Hexagonal (Ports & Adapters)  
> **Stack:** Next.js 14 (App Router, TypeScript) · Neon Postgres · Prisma · NextAuth · Vercel · Resend  
> **Target:** Nigerian SIWES placement marketplace — two-sided, verified, engineering-only

---

## 1. Architecture Philosophy

Placely is built on three complementary patterns, applied pragmatically — no over-engineering:

| Pattern | Purpose in Placely |
|---|---|
| **Clean Architecture** | Layer separation: domain → use cases → adapters → infrastructure |
| **Domain-Driven Design (DDD)** | Rich entities with business rules: `Application`, `Listing`, `VerificationRequest` |
| **Hexagonal (Ports & Adapters)** | Swap DB, email, file storage without touching business logic |

**Dependency Rule:** All dependencies point inward. The domain layer (`/domain`) never imports from Next.js, Prisma, or Resend.

```
┌────────────────────────────────────────────┐
│              Next.js (App Router)           │  ← Outer Layer (Framework)
│  ┌──────────────────────────────────────┐  │
│  │     Adapters (API routes, Server     │  │  ← Interface Adapters
│  │     Actions, Repositories)           │  │
│  │  ┌────────────────────────────────┐  │  │
│  │  │    Use Cases / Services        │  │  │  ← Application Layer
│  │  │  ┌──────────────────────────┐  │  │  │
│  │  │  │   Domain (Entities,      │  │  │  │  ← Core (no deps)
│  │  │  │   Value Objects, Events) │  │  │  │
│  │  │  └──────────────────────────┘  │  │  │
│  │  └────────────────────────────────┘  │  │
│  └──────────────────────────────────────┘  │
└────────────────────────────────────────────┘
```

---

## 2. Repository & Directory Structure

```
placely/
├── src/
│   ├── domain/                      # Core — zero external deps
│   │   ├── entities/
│   │   │   ├── user.ts
│   │   │   ├── student-profile.ts
│   │   │   ├── employer-profile.ts
│   │   │   ├── listing.ts
│   │   │   ├── application.ts
│   │   │   ├── message.ts
│   │   │   └── verification-request.ts
│   │   ├── value-objects/
│   │   │   ├── email.ts
│   │   │   ├── discipline.ts
│   │   │   ├── application-status.ts
│   │   │   └── verification-status.ts
│   │   ├── events/
│   │   │   ├── application-submitted.ts
│   │   │   ├── offer-sent.ts
│   │   │   └── verification-approved.ts
│   │   └── ports/                   # Abstract interfaces (Ports)
│   │       ├── student-profile-repository.port.ts
│   │       ├── employer-profile-repository.port.ts
│   │       ├── listing-repository.port.ts
│   │       ├── application-repository.port.ts
│   │       ├── message-repository.port.ts
│   │       ├── verification-repository.port.ts
│   │       ├── email-service.port.ts
│   │       └── file-storage.port.ts
│   │
│   ├── application/                 # Use Cases — orchestrates domain
│   │   ├── student/
│   │   │   ├── register-student.usecase.ts
│   │   │   ├── submit-application.usecase.ts
│   │   │   └── get-my-applications.usecase.ts
│   │   ├── employer/
│   │   │   ├── register-employer.usecase.ts
│   │   │   ├── post-listing.usecase.ts
│   │   │   ├── review-applicants.usecase.ts
│   │   │   └── send-offer.usecase.ts
│   │   ├── admin/
│   │   │   ├── approve-verification.usecase.ts
│   │   │   └── moderate-listing.usecase.ts
│   │   └── messaging/
│   │       └── send-message.usecase.ts
│   │
│   ├── infrastructure/              # Adapters — concrete implementations
│   │   ├── db/
│   │   │   ├── prisma.client.ts
│   │   │   ├── student-profile.repository.ts
│   │   │   ├── employer-profile.repository.ts
│   │   │   ├── listing.repository.ts
│   │   │   ├── application.repository.ts
│   │   │   ├── message.repository.ts
│   │   │   └── verification.repository.ts
│   │   ├── email/
│   │   │   └── resend-email.service.ts
│   │   └── storage/
│   │       └── vercel-blob.storage.ts   # or supabase-storage.ts
│   │
│   └── lib/
│       ├── auth.ts                  # NextAuth config
│       ├── container.ts             # Dependency Injection registry
│       └── errors.ts                # Domain error types
│
├── app/                             # Next.js App Router pages
│   ├── (public)/
│   │   └── page.tsx                 # Landing page
│   ├── (auth)/
│   │   ├── sign-in/page.tsx
│   │   └── sign-up/page.tsx
│   ├── (student)/
│   │   ├── dashboard/page.tsx
│   │   ├── profile/page.tsx
│   │   ├── listings/page.tsx
│   │   ├── listings/[id]/page.tsx
│   │   └── applications/
│   │       ├── page.tsx
│   │       └── [id]/page.tsx
│   ├── (employer)/
│   │   ├── dashboard/page.tsx
│   │   ├── profile/page.tsx
│   │   ├── listings/
│   │   │   ├── page.tsx
│   │   │   ├── new/page.tsx
│   │   │   └── [id]/applicants/page.tsx
│   │   └── applications/[id]/page.tsx
│   ├── (admin)/
│   │   ├── verifications/page.tsx
│   │   ├── listings/page.tsx
│   │   └── users/page.tsx
│   └── api/
│       └── (internal)/              # Server Actions preferred; API routes for webhooks
│
├── prisma/
│   ├── schema.prisma
│   └── migrations/
│
├── docs/                            # Existing spec docs
├── tests/
│   ├── unit/                        # Pure domain + use case tests
│   ├── integration/                 # Repository tests against test DB
│   └── e2e/                         # Playwright flows
│
├── .env.example
├── next.config.ts
├── tailwind.config.ts               # Optional: add if UI library chosen
└── tsconfig.json
```

---

## 3. Bounded Domains (DDD Context Map)

```
┌──────────────────┐    ┌──────────────────┐    ┌──────────────────┐
│   Identity &     │    │   Placement      │    │  Verification    │
│   Auth Context   │───▶│   Context        │◀───│  Context         │
│                  │    │                  │    │                  │
│  User            │    │  Listing         │    │  VerifRequest    │
│  Session         │    │  Application     │    │  AdminReview     │
│  Role            │    │  Message         │    │                  │
└──────────────────┘    └──────────────────┘    └──────────────────┘
         │                       │
         ▼                       ▼
┌──────────────────┐    ┌──────────────────┐
│   Profile        │    │  Notification    │
│   Context        │    │  Context         │
│                  │    │                  │
│  StudentProfile  │    │  EmailEvent      │
│  EmployerProfile │    │  (Resend)        │
│  Completeness    │    │                  │
└──────────────────┘    └──────────────────┘
```

---

## 4. Prisma Schema

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id            String   @id @default(cuid())
  email         String   @unique
  role          Role     @default(STUDENT)
  emailVerified DateTime?
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  student       StudentProfile?
  employer      EmployerProfile?
  sentMessages  Message[]
}

enum Role {
  STUDENT
  EMPLOYER
  ADMIN
}

model StudentProfile {
  id                  String             @id @default(cuid())
  userId              String             @unique
  user                User               @relation(fields: [userId], references: [id], onDelete: Cascade)

  university          String
  discipline          String
  cgpa                Float?
  resumeUrl           String?
  linkedinUrl         String?
  portfolioUrl        String?
  bio                 String?
  profileCompleteness Int                @default(0)  // 0-100 computed

  verificationStatus  VerificationStatus @default(PENDING)
  verificationRequest VerificationRequest?

  applications        Application[]
  createdAt           DateTime           @default(now())
  updatedAt           DateTime           @updatedAt
}

model EmployerProfile {
  id                  String             @id @default(cuid())
  userId              String             @unique
  user                User               @relation(fields: [userId], references: [id], onDelete: Cascade)

  companyName         String
  cacNumber           String
  description         String?
  logoUrl             String?
  websiteUrl          String?

  verificationStatus  VerificationStatus @default(PENDING)
  verificationRequest VerificationRequest?

  listings            Listing[]
  createdAt           DateTime           @default(now())
  updatedAt           DateTime           @updatedAt
}

enum VerificationStatus {
  PENDING
  VERIFIED
  REJECTED
}

model VerificationRequest {
  id              String             @id @default(cuid())
  type            VerificationType
  documentUrl     String
  status          VerificationStatus @default(PENDING)
  adminNote       String?
  reviewedAt      DateTime?

  studentProfile  StudentProfile?    @relation(fields: [studentProfileId], references: [id])
  studentProfileId String?           @unique
  employerProfile EmployerProfile?   @relation(fields: [employerProfileId], references: [id])
  employerProfileId String?          @unique

  createdAt       DateTime           @default(now())
  updatedAt       DateTime           @updatedAt
}

enum VerificationType {
  SCHOOL_ID
  CAC_DOCUMENT
}

model Listing {
  id               String          @id @default(cuid())
  employerProfile  EmployerProfile @relation(fields: [employerProfileId], references: [id])
  employerProfileId String

  title            String
  description      String
  disciplines      String[]        // ["Electrical", "Civil", "Computer"]
  location         String
  isRemote         Boolean         @default(false)
  status           ListingStatus   @default(OPEN)
  isModerated      Boolean         @default(false)  // admin flag

  applications     Application[]
  createdAt        DateTime        @default(now())
  updatedAt        DateTime        @updatedAt
}

enum ListingStatus {
  OPEN
  CLOSED
}

model Application {
  id               String            @id @default(cuid())
  listing          Listing           @relation(fields: [listingId], references: [id])
  listingId        String
  student          StudentProfile    @relation(fields: [studentId], references: [id])
  studentId        String
  status           ApplicationStatus @default(APPLIED)
  note             String?           // student's cover note

  messages         Message[]
  createdAt        DateTime          @default(now())
  updatedAt        DateTime          @updatedAt

  @@unique([listingId, studentId])  // one application per listing per student
}

enum ApplicationStatus {
  APPLIED
  SHORTLISTED
  OFFERED
  ACCEPTED
  DECLINED
}

model Message {
  id            String      @id @default(cuid())
  application   Application @relation(fields: [applicationId], references: [id])
  applicationId String
  sender        User        @relation(fields: [senderId], references: [id])
  senderId      String
  body          String
  createdAt     DateTime    @default(now())
}
```

---

## 5. Domain Entities (TypeScript)

### Application Entity — with business rules

```typescript
// src/domain/entities/application.ts

export type ApplicationStatus =
  | 'APPLIED'
  | 'SHORTLISTED'
  | 'OFFERED'
  | 'ACCEPTED'
  | 'DECLINED';

export interface ApplicationProps {
  id: string;
  listingId: string;
  studentId: string;
  status: ApplicationStatus;
  note?: string;
  createdAt: Date;
  updatedAt: Date;
}

export class Application {
  private readonly props: ApplicationProps;

  constructor(props: ApplicationProps) {
    this.props = props;
  }

  get id() { return this.props.id; }
  get status() { return this.props.status; }

  // Business rule: employer can only shortlist from APPLIED
  shortlist(): Application {
    if (this.props.status !== 'APPLIED') {
      throw new DomainError('Only APPLIED applications can be shortlisted');
    }
    return new Application({ ...this.props, status: 'SHORTLISTED' });
  }

  // Business rule: offer requires shortlisted state
  sendOffer(): Application {
    if (this.props.status !== 'SHORTLISTED') {
      throw new DomainError('Only SHORTLISTED applications can receive offers');
    }
    return new Application({ ...this.props, status: 'OFFERED' });
  }

  // Business rule: student can only accept offers
  accept(): Application {
    if (this.props.status !== 'OFFERED') {
      throw new DomainError('Only OFFERED applications can be accepted');
    }
    return new Application({ ...this.props, status: 'ACCEPTED' });
  }

  decline(): Application {
    if (!['APPLIED', 'SHORTLISTED', 'OFFERED'].includes(this.props.status)) {
      throw new DomainError('Cannot decline at current status');
    }
    return new Application({ ...this.props, status: 'DECLINED' });
  }
}
```

### Value Objects

```typescript
// src/domain/value-objects/discipline.ts

const VALID_DISCIPLINES = [
  'Electrical',
  'Mechanical',
  'Civil',
  'Computer',
  'Chemical',
  'Petroleum',
  'Agricultural',
] as const;

export type DisciplineValue = typeof VALID_DISCIPLINES[number];

export class Discipline {
  private readonly value: DisciplineValue;

  constructor(value: string) {
    if (!VALID_DISCIPLINES.includes(value as DisciplineValue)) {
      throw new DomainError(`Invalid discipline: ${value}`);
    }
    this.value = value as DisciplineValue;
  }

  toString() { return this.value; }
  equals(other: Discipline) { return this.value === other.value; }

  static all() { return VALID_DISCIPLINES; }
}
```

---

## 6. Ports (Interfaces)

```typescript
// src/domain/ports/application-repository.port.ts

import { Application, ApplicationStatus } from '../entities/application';

export interface ApplicationRepositoryPort {
  findById(id: string): Promise<Application | null>;
  findByStudentId(studentId: string): Promise<Application[]>;
  findByListingId(listingId: string): Promise<Application[]>;
  findByListingAndStudent(listingId: string, studentId: string): Promise<Application | null>;
  save(application: Application): Promise<Application>;
  updateStatus(id: string, status: ApplicationStatus): Promise<Application>;
}
```

```typescript
// src/domain/ports/email-service.port.ts

export interface EmailServicePort {
  sendStatusChangeEmail(params: {
    to: string;
    applicantName: string;
    listingTitle: string;
    newStatus: string;
    applicationUrl: string;
  }): Promise<void>;

  sendNewApplicationEmail(params: {
    to: string;
    employerName: string;
    listingTitle: string;
    applicantName: string;
    applicationUrl: string;
  }): Promise<void>;
}
```

```typescript
// src/domain/ports/file-storage.port.ts

export interface FileStoragePort {
  upload(file: File, path: string): Promise<{ url: string }>;
  delete(url: string): Promise<void>;
}
```

---

## 7. Use Cases

```typescript
// src/application/employer/send-offer.usecase.ts

import { ApplicationRepositoryPort } from '@/domain/ports/application-repository.port';
import { EmailServicePort } from '@/domain/ports/email-service.port';

export interface SendOfferInput {
  applicationId: string;
  employerId: string;  // for authorization check
}

export interface SendOfferOutput {
  success: boolean;
  error?: string;
}

export class SendOfferUseCase {
  constructor(
    private readonly applications: ApplicationRepositoryPort,
    private readonly email: EmailServicePort,
  ) {}

  async execute(input: SendOfferInput): Promise<SendOfferOutput> {
    const application = await this.applications.findById(input.applicationId);
    if (!application) return { success: false, error: 'Application not found' };

    // Authorization: employer must own the listing
    // (listing ownership checked via repository join — not shown here for brevity)

    let updated: Application;
    try {
      updated = application.sendOffer();  // Domain rule enforced here
    } catch (e) {
      return { success: false, error: (e as Error).message };
    }

    await this.applications.updateStatus(application.id, updated.status);

    await this.email.sendStatusChangeEmail({
      to: /* student email */,
      applicantName: /* student name */,
      listingTitle: /* listing title */,
      newStatus: 'OFFERED',
      applicationUrl: `https://placely.ng/applications/${application.id}`,
    });

    return { success: true };
  }
}
```

---

## 8. Infrastructure Adapters

### Prisma Repository (Adapter)

```typescript
// src/infrastructure/db/application.repository.ts

import { prisma } from './prisma.client';
import { ApplicationRepositoryPort } from '@/domain/ports/application-repository.port';
import { Application } from '@/domain/entities/application';

export class PrismaApplicationRepository implements ApplicationRepositoryPort {
  async findById(id: string): Promise<Application | null> {
    const row = await prisma.application.findUnique({ where: { id } });
    return row ? this.toDomain(row) : null;
  }

  async findByStudentId(studentId: string): Promise<Application[]> {
    const rows = await prisma.application.findMany({ where: { studentId } });
    return rows.map(this.toDomain);
  }

  async updateStatus(id: string, status: ApplicationStatus): Promise<Application> {
    const row = await prisma.application.update({
      where: { id },
      data: { status, updatedAt: new Date() },
    });
    return this.toDomain(row);
  }

  // Map DB row → Domain entity (no Prisma types escape this class)
  private toDomain(row: any): Application {
    return new Application({
      id: row.id,
      listingId: row.listingId,
      studentId: row.studentId,
      status: row.status,
      note: row.note ?? undefined,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    });
  }
}
```

### Resend Email Adapter

```typescript
// src/infrastructure/email/resend-email.service.ts

import { Resend } from 'resend';
import { EmailServicePort } from '@/domain/ports/email-service.port';

export class ResendEmailService implements EmailServicePort {
  private resend = new Resend(process.env.RESEND_API_KEY);

  async sendStatusChangeEmail(params: {
    to: string;
    applicantName: string;
    listingTitle: string;
    newStatus: string;
    applicationUrl: string;
  }): Promise<void> {
    await this.resend.emails.send({
      from: 'Placely <noreply@placely.ng>',
      to: params.to,
      subject: `Your application status: ${params.newStatus}`,
      html: `
        <p>Hi ${params.applicantName},</p>
        <p>Your application for <strong>${params.listingTitle}</strong>
           has been updated to <strong>${params.newStatus}</strong>.</p>
        <p><a href="${params.applicationUrl}">View your application →</a></p>
      `,
    });
  }

  // ... other email methods
}
```

---

## 9. Dependency Injection Container

```typescript
// src/lib/container.ts
// Simple manual DI — no framework needed at MVP scale.

import { PrismaApplicationRepository } from '@/infrastructure/db/application.repository';
import { PrismaListingRepository } from '@/infrastructure/db/listing.repository';
import { ResendEmailService } from '@/infrastructure/email/resend-email.service';
import { VercelBlobStorage } from '@/infrastructure/storage/vercel-blob.storage';
import { SendOfferUseCase } from '@/application/employer/send-offer.usecase';
import { SubmitApplicationUseCase } from '@/application/student/submit-application.usecase';

// Singletons
const applicationRepo = new PrismaApplicationRepository();
const listingRepo = new PrismaListingRepository();
const emailService = new ResendEmailService();
const fileStorage = new VercelBlobStorage();

// Use Cases
export const sendOfferUseCase = new SendOfferUseCase(applicationRepo, emailService);
export const submitApplicationUseCase = new SubmitApplicationUseCase(applicationRepo, listingRepo, emailService);
```

---

## 10. NextAuth Configuration

```typescript
// src/lib/auth.ts

import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { prisma } from '@/infrastructure/db/prisma.client';
import bcrypt from 'bcryptjs';

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });
        if (!user || !user.passwordHash) return null;
        const valid = await bcrypt.compare(
          credentials.password as string,
          user.passwordHash
        );
        return valid ? { id: user.id, email: user.email, role: user.role } : null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) { token.role = (user as any).role; token.id = user.id; }
      return token;
    },
    async session({ session, token }) {
      session.user.role = token.role as string;
      session.user.id = token.id as string;
      return session;
    },
  },
  pages: {
    signIn: '/sign-in',
    error: '/sign-in',
  },
});
```

### Middleware — Route Protection

```typescript
// middleware.ts (root level)

import { auth } from '@/src/lib/auth';
import { NextResponse } from 'next/server';

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const role = req.auth?.user?.role;

  if (pathname.startsWith('/(student)') && role !== 'STUDENT') {
    return NextResponse.redirect(new URL('/sign-in', req.url));
  }
  if (pathname.startsWith('/(employer)') && role !== 'EMPLOYER') {
    return NextResponse.redirect(new URL('/sign-in', req.url));
  }
  if (pathname.startsWith('/(admin)') && role !== 'ADMIN') {
    return NextResponse.redirect(new URL('/', req.url));
  }
});

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
```

---

## 11. Environment Variables

```bash
# .env.example

# Database (Neon)
DATABASE_URL="postgresql://user:pass@host/db?sslmode=require"

# Auth (NextAuth)
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"

# Email (Resend)
RESEND_API_KEY="re_..."

# File Storage — pick one
BLOB_READ_WRITE_TOKEN="vercel-blob-token"          # Vercel Blob
# or
SUPABASE_URL="https://xxx.supabase.co"             # Supabase Storage
SUPABASE_SERVICE_ROLE_KEY="..."

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

---

## 12. Setup Checklist (Ordered)

### Phase 0 — Prerequisites

- [ ] Node.js 20 LTS installed
- [ ] GitHub repo created, `main` branch protected
- [ ] Vercel project created and linked to repo
- [ ] Neon Postgres instance provisioned, connection string copied
- [ ] Resend account created, domain `placely.ng` verified, API key copied
- [ ] File storage provider chosen: **Vercel Blob** (recommended — same platform, simplest) or Supabase Storage

### Phase 1 — Scaffold

```bash
npx create-next-app@latest placely \
  --typescript \
  --eslint \
  --src-dir \
  --app \
  --import-alias "@/*"

cd placely

# ORM
npm install prisma @prisma/client
npx prisma init

# Auth
npm install next-auth@beta bcryptjs
npm install -D @types/bcryptjs

# Email
npm install resend

# File storage (Vercel Blob)
npm install @vercel/blob

# Dev utilities
npm install -D tsx ts-node
```

### Phase 2 — Database

```bash
# Paste schema from Section 4 into prisma/schema.prisma
# Then:

npx prisma migrate dev --name init

# Verify:
npx prisma studio
```

### Phase 3 — Auth

- [ ] Copy `src/lib/auth.ts` from Section 10
- [ ] Add `app/api/auth/[...nextauth]/route.ts`:

```typescript
import { handlers } from '@/src/lib/auth';
export const { GET, POST } = handlers;
```

- [ ] Copy `middleware.ts` from Section 10
- [ ] Add `types/next-auth.d.ts` to extend session with `role` and `id`

### Phase 4 — Domain Layer

- [ ] Create all entities in `src/domain/entities/`
- [ ] Create all value objects in `src/domain/value-objects/`
- [ ] Define all ports in `src/domain/ports/`
- [ ] **Rule:** no imports from `prisma`, `next`, `resend` inside `/domain`

### Phase 5 — Infrastructure Adapters

- [ ] Implement all Prisma repositories in `src/infrastructure/db/`
- [ ] Implement `ResendEmailService` in `src/infrastructure/email/`
- [ ] Implement `VercelBlobStorage` in `src/infrastructure/storage/`
- [ ] Wire up `src/lib/container.ts`

### Phase 6 — Use Cases

- [ ] Implement all use cases in `src/application/`
- [ ] Each use case is independently unit-testable with mock adapters

### Phase 7 — App Layer (Pages & Server Actions)

- [ ] Scaffold all route groups as shown in Section 2
- [ ] Use Server Actions for all mutations (no separate API routes for CRUD)
- [ ] Server Actions call use cases from the container:

```typescript
// app/(employer)/listings/[id]/applicants/actions.ts
'use server';
import { auth } from '@/src/lib/auth';
import { sendOfferUseCase } from '@/src/lib/container';

export async function sendOffer(applicationId: string) {
  const session = await auth();
  if (session?.user?.role !== 'EMPLOYER') throw new Error('Unauthorized');

  return sendOfferUseCase.execute({
    applicationId,
    employerId: session.user.id,
  });
}
```

### Phase 8 — Vercel Deployment

```bash
vercel env pull .env.local          # pull env from Vercel
vercel deploy --prod
```

- [ ] `DATABASE_URL` set in Vercel → Settings → Environment Variables
- [ ] `NEXTAUTH_SECRET` and `NEXTAUTH_URL` set (URL = production domain)
- [ ] Confirm Neon `sslmode=require` in connection string

---

## 13. Testing Strategy

| Layer | Tool | What to test |
|---|---|---|
| Domain entities | **Vitest** (no DB needed) | Business rules, state transitions, value object validation |
| Use cases | **Vitest** + mock adapters | Orchestration logic, error paths |
| Repository adapters | **Vitest** + Neon branch / local Postgres | SQL correctness, mapping |
| E2E flows | **Playwright** | Full student → apply → employer → offer → accept cycle |

```bash
npm install -D vitest @vitest/ui playwright
```

```typescript
// tests/unit/application.entity.test.ts

import { describe, it, expect } from 'vitest';
import { Application } from '@/src/domain/entities/application';

describe('Application entity', () => {
  it('allows shortlisting from APPLIED', () => {
    const app = new Application({ ...baseProps, status: 'APPLIED' });
    expect(app.shortlist().status).toBe('SHORTLISTED');
  });

  it('throws when shortlisting non-APPLIED application', () => {
    const app = new Application({ ...baseProps, status: 'DECLINED' });
    expect(() => app.shortlist()).toThrow('Only APPLIED applications can be shortlisted');
  });
});
```

---

## 14. Profile Completeness Algorithm

(Invisible to student — used as sort weight in employer browse.)

```typescript
// src/domain/entities/student-profile.ts

export function computeCompleteness(profile: StudentProfileProps): number {
  const weights: Record<string, number> = {
    university: 20,
    discipline: 20,
    resumeUrl: 30,
    bio: 15,
    linkedinUrl: 10,
    cgpa: 5,
  };

  return Object.entries(weights).reduce((score, [field, weight]) => {
    return score + (profile[field as keyof StudentProfileProps] ? weight : 0);
  }, 0);
}
```

Applied as `ORDER BY profileCompleteness DESC` in the listing browse query.

---

## 15. Key Architectural Decisions Log (ADR)

| # | Decision | Rationale |
|---|---|---|
| ADR-01 | Single Next.js app (no FastAPI) | No ML at MVP. Two deployments, CORS, type duplication add cost with no benefit. FastAPI introduced only for ML ranking. |
| ADR-02 | Polling for messages (no WebSocket) | SIWES messaging is low-frequency. WebSocket infra (Pusher/Ably) deferred until usage demands it. |
| ADR-03 | Manual CAC verification | No reliable free Nigerian company registry API. Manual admin review is appropriate, trustworthy, and scalable to MVP volume. |
| ADR-04 | Vercel Blob for file storage | Same platform = no extra auth, simpler config. Supabase Storage is the fallback if free tier limits are hit. |
| ADR-05 | Clean Architecture layers | Domain stays framework-agnostic. Enables test-first development, future DB swap, and FastAPI microservice extraction without rewrites. |
| ADR-06 | Manual DI via container.ts | Avoids DI framework overhead at MVP scale. Promotes to InversifyJS / tsyringe if the number of use cases grows past ~20. |
| ADR-07 | Server Actions over API Routes | Reduces surface area, eliminates CORS, shares types between client and server for free in Next.js App Router. |

---

## 16. Open Decisions (Must Resolve Before Milestone 2)

> [!IMPORTANT]
> **File Storage Provider** — Run a quick comparison of Vercel Blob vs. Supabase Storage:
> - Vercel Blob: 500 MB free, $0.023/GB transfer
> - Supabase Storage: 1 GB free, 2 GB bandwidth
> Decision gate: before building the resume/CAC upload flow (Milestone 2).

> [!IMPORTANT]
> **"What counts as verified"** — Document the exact admin review checklist for CAC before implementation:
> - What documents are accepted?
> - What data must match (company name vs. CAC doc)?
> - What's the SLA for admin to review?

> [!NOTE]
> **Target intake metrics** — Set once employer outreach capacity is known. Required to define a launch success signal.
