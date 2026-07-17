# Placely — Technical Architecture

## Stack

- Next.js (App Router, TypeScript) — single app serving student, employer, and admin surfaces via role-gated routes.
- Postgres via Neon — free tier covers MVP scale.
- Prisma as ORM.
- NextAuth — email/password or magic link, with a role field (student/employer/admin) on the user record.
- Vercel for hosting.
- Resend (or similar) for transactional email — status-change and verification notifications.
- File storage for resumes/CVs, CAC documents, and logos — Vercel Blob or Supabase Storage (compare free tiers before committing).

## Data Model (high level)

- **User** — id, role, email, auth fields.
- **StudentProfile** — userId, university, discipline, CGPA (optional), resumeUrl, links, verificationStatus, profileCompleteness.
- **EmployerProfile** — userId, companyName, CAC number, description, verificationStatus.
- **Listing** — employerId, title, description, discipline tags, location, status (open/closed).
- **Application** — listingId, studentId, status (applied/shortlisted/offered/accepted/declined), timestamps.
- **Message** — applicationId, senderId, body, timestamp — scoped to an application, not open DMs, to keep moderation simple.
- **VerificationRequest** — userId, type (student/employer), documents, status, adminId, reviewedAt.

## Auth Approach

NextAuth handles session and credentials. Role lives on the user and is checked in middleware for route access (student routes, employer routes, /admin). No separate auth provider or RBAC library needed at this scale.

## Messaging

No websockets or real-time infrastructure (Pusher/Ably) at MVP volume. SIWES messaging is low-frequency ("did the employer reply", not live chat), so server actions with revalidation on send, or polling on an interval, are sufficient and cost nothing extra. Real-time upgrade is a named v1.x item, revisited only if message volume genuinely demands it.

## Verification Queue

An admin-only page listing pending VerificationRequest rows with approve/reject actions. No OCR or automated document parsing at this stage — manual review is appropriate at MVP scale and is arguably more trustworthy early on.

## Backend: Next.js only, for now

Core CRUD, auth, and messaging stay inside the single Next.js app (API routes / server actions) rather than a separate FastAPI service. Splitting into two services now would mean two deployments, CORS, duplicated types across Python and TypeScript, and a network hop for no MVP-stage benefit.

The trigger for introducing FastAPI is specific and Python-shaped: an ML-based matching or ranking service (e.g. resume-parsing intelligence) that needs a Python ML library. At that point FastAPI runs as a separate microservice that Next.js calls for that one job — it does not replace the core app.

## Key Risks

- **CAC verification** — no reliable free public API in Nigeria for automated company registry lookup. Manual review (document upload, admin spot-check) is the only realistic option for v1. This won't scale past a few hundred employers, but that's far beyond MVP volume. Worth documenting what "verified" actually means before doing this under time pressure.
- **File storage provider** — not finalized; needs a quick comparison of Vercel Blob vs. Supabase Storage free tiers before building the upload flow.
