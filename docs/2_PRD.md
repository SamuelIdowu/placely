# Placely — Product Requirements Document

## Problem Statement

Nigerian engineering students seeking mandatory SIWES placements rely on informal networks (WhatsApp groups, notice boards, personal connections), which shuts out students without industry contacts. Employers lack a reliable way to post structured opportunities or vet candidates. The closest existing tool, SIWES Finder, is a one-way browse directory with no application tracking or employer accounts.

## Target User

- Primary: Nigerian university/polytechnic engineering students needing SIWES placement.
- Secondary: SMEs/startups/mid-size companies willing to take on verified interns.

## Goals and Success Metrics

v1 goals are about proving the core loop works end to end, not vanity metrics:

- A student can complete: register → verify → apply → get messaged/offered → accept, entirely on-platform.
- An employer can complete: register → verify → post a listing → review applicants → message → offer.
- A specific target for verified employers and completed applications within the first SIWES intake window is still open — to be set once outreach capacity is known.

## MVP Feature Set — User Stories

- **Student registration & profile** — As a student, I create a profile with my school, discipline, and resume so employers can evaluate me.
- **School ID verification (manual admin review)** — As a student, I get verified so employers trust my profile is real.
- **Employer registration & company profile** — As an employer, I create a company profile so students know who's hiring.
- **CAC verification (manual admin review)** — As an employer, I get verified so students trust the listing is legitimate.
- **Listing CRUD** — As an employer, I post, edit, and close internship listings.
- **Browse/search/filter** — As a student, I filter listings by discipline and location to find relevant ones.
- **Apply + status tracking** — As a student, I apply and see my application status change over time.
- **Applicant review & offer flow** — As an employer, I review applicants, shortlist, and send offers.
- **1:1 messaging (scoped to an application)** — As a student or employer, I message the other party about a specific application without sharing personal contact info upfront.
- **Email notifications on status change** — As a student, I get emailed when my status changes so I don't have to keep checking.
- **Admin verification/moderation queue** — As an admin, I approve or reject verification requests and remove bad listings.
- **Profile-completeness search ranking** — As a student, completing my profile increases my visibility to employers without a public leaderboard.

## Out of Scope for v1

- Payments/wallet
- Badges, gamification, leaderboards (public student or employer rankings)
- Interview scheduling
- Offline-first sync architecture
- University SIS/LMS integration
- Multi-discipline expansion beyond engineering
- AI simulation / learning hub (separate future roadmap track)
- Enterprise-scale infrastructure: Elasticsearch, penetration testing, formal uptime SLAs
