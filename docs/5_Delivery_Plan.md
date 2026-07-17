# Placely — Delivery Plan

## Milestones

### 1. Foundation

Next.js + TypeScript scaffold, Neon + Prisma schema, NextAuth with role field, Vercel deploy pipeline.

Done when: a user can sign up as student or employer and land on a role-gated dashboard.

### 2. Profiles + Verification

Student profile form + resume upload, employer profile form + CAC document upload, admin verification queue (approve/reject).

Done when: a real profile can go from pending to verified through the admin screen.

### 3. Listings

Employer listing CRUD; student browse/search/filter with profile-completeness sort weight.

Done when: an employer can post a listing and a student can find it by filtering.

### 4. Applications

Apply flow, status tracking, employer applicant review and shortlist/offer actions.

Done when: a listing can go from posted to an accepted applicant, end to end.

### 5. Messaging + Notifications

Application-scoped message thread; email notifications on status change and new application.

Done when: a student and employer can have a full conversation and both get emailed at each step.

### 6. Polish + Soft Launch

Error states, loading states, mobile responsiveness pass (most Nigerian students are on phones), basic admin listing moderation.

Done when: comfortable sending the link to a real employer and a real student without walking them through it.

## Project Setup Checklist

- GitHub repo; Next.js + TypeScript init
- Neon Postgres instance provisioned
- Prisma schema + initial migration
- Vercel project linked to repo, environment variables configured
- NextAuth configured (provider, session strategy, role field)
- Resend (or chosen email provider) account + API key
- File storage provider chosen and configured (Vercel Blob or Supabase Storage) for resumes/CVs and CAC documents
- Domain (if available) pointed at Vercel

## Open Risks / Pending Decisions

- CAC verification is manual with no automated lookup available — acceptable at MVP scale, but the "what counts as verified" process should be documented before it's needed under time pressure.
- No target number set yet for verified employers / completed applications in the first intake window — set once outreach capacity is known, so there's a clear signal for when to stop building and start recruiting employers.
- File storage provider not finalized — quick comparison of Vercel Blob vs. Supabase Storage free tiers before Milestone 2.
- Ratings (v1.x) and a real-time messaging upgrade are flagged post-MVP items, revisited only if usage demands them.
