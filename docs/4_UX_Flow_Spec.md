# Placely — UX Flow Spec

Core flows only — purpose and content of each screen, not pixel-level UI detail.

## Student Flow

1. Landing/marketing page — value proposition, "Find your SIWES placement" call to action.
2. Sign up — email/password, select role: student.
3. Profile setup — university, discipline, CGPA (optional), resume upload, links, school ID upload for verification.
4. Pending verification state — visible banner; can browse but not apply until admin approves.
5. Browse listings — filter by discipline/location/keyword; card view with employer name and verification badge.
6. Listing detail — full description, requirements, apply button.
7. Apply — short confirmation (attaches profile, optional note), submit.
8. My applications — status list (applied/shortlisted/offered/accepted/declined).
9. Application detail + messaging — thread scoped to that one application.
10. Email notification on any status change, linking back to the application detail screen.

## Employer Flow

1. Sign up — select role: employer.
2. Company profile setup — company name, CAC number/document upload, description.
3. Pending verification state — cannot post listings until approved.
4. Post listing — title, description, discipline tags, location, open/close toggle.
5. My listings — list with applicant counts and open/close controls.
6. Applicant review — list of applicants per listing; view profile and resume; shortlist/reject/offer actions.
7. Applicant detail + messaging — same application-scoped thread pattern as the student side.
8. Email notification on new application received.

## Admin Flow (internal, minimal UI)

1. Verification queue — pending student ID and employer CAC verifications; approve/reject with a note.
2. Listings moderation — flag or remove inappropriate listings.
3. Basic user list — search/lookup for support purposes.

## Scope Notes

- No separate onboarding wizard beyond the single profile-setup screen — data is collected once, verified once.
- No in-app notification center for v1; email is the single channel.
- Profile-completeness search ranking is invisible to the student — no dedicated UI, just a backend sort weight applied to the employer's existing browse screen.
