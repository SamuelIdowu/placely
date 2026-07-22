// src/lib/container.ts
// Manual DI registry (ADR-06: no DI framework at MVP scale).
// All use cases are singletons, constructed once at module load time.
// Promotes to InversifyJS/tsyringe if use cases exceed ~20.

import { PrismaApplicationRepository } from '@/infrastructure/db/application.repository';
import { PrismaStudentProfileRepository } from '@/infrastructure/db/student-profile.repository';
import { PrismaEmployerProfileRepository } from '@/infrastructure/db/employer-profile.repository';
import { PrismaListingRepository } from '@/infrastructure/db/listing.repository';
import { PrismaMessageRepository } from '@/infrastructure/db/message.repository';
import { PrismaVerificationRepository } from '@/infrastructure/db/verification.repository';
import { ResendEmailService } from '@/infrastructure/email/resend-email.service';
import { VercelBlobStorage } from '@/infrastructure/storage/vercel-blob.storage';

// ── Repositories (singletons) ────────────────────────────────────────────────
export const applicationRepo = new PrismaApplicationRepository();
export const studentProfileRepo = new PrismaStudentProfileRepository();
export const employerProfileRepo = new PrismaEmployerProfileRepository();
export const listingRepo = new PrismaListingRepository();
export const messageRepo = new PrismaMessageRepository();
export const verificationRepo = new PrismaVerificationRepository();

// ── Services (singletons) ────────────────────────────────────────────────────
export const emailService = new ResendEmailService();
export const fileStorage = new VercelBlobStorage();

// ── Use Cases ─────────────────────────────────────────────────────────────────
// Imported lazily to avoid circular deps if use cases cross-call.
// Use cases are constructed below after all adapters are ready.

import { RegisterStudentUseCase } from '@/application/student/register-student.usecase';
import { SubmitApplicationUseCase } from '@/application/student/submit-application.usecase';
import { GetMyApplicationsUseCase } from '@/application/student/get-my-applications.usecase';
import { RegisterEmployerUseCase } from '@/application/employer/register-employer.usecase';
import { PostListingUseCase } from '@/application/employer/post-listing.usecase';
import { ReviewApplicantsUseCase } from '@/application/employer/review-applicants.usecase';
import { SendOfferUseCase } from '@/application/employer/send-offer.usecase';
import { ApproveVerificationUseCase } from '@/application/admin/approve-verification.usecase';
import { ModerateListingUseCase } from '@/application/admin/moderate-listing.usecase';
import { SendMessageUseCase } from '@/application/messaging/send-message.usecase';

// Student
export const registerStudentUseCase = new RegisterStudentUseCase(studentProfileRepo, emailService);
export const submitApplicationUseCase = new SubmitApplicationUseCase(applicationRepo, listingRepo, studentProfileRepo, emailService);
export const getMyApplicationsUseCase = new GetMyApplicationsUseCase(applicationRepo);

// Employer
export const registerEmployerUseCase = new RegisterEmployerUseCase(employerProfileRepo);
export const postListingUseCase = new PostListingUseCase(listingRepo, employerProfileRepo);
export const reviewApplicantsUseCase = new ReviewApplicantsUseCase(applicationRepo);
export const sendOfferUseCase = new SendOfferUseCase(applicationRepo, emailService);

// Admin
export const approveVerificationUseCase = new ApproveVerificationUseCase(verificationRepo, studentProfileRepo, employerProfileRepo, emailService);
export const moderateListingUseCase = new ModerateListingUseCase(listingRepo);

// Messaging
export const sendMessageUseCase = new SendMessageUseCase(messageRepo, applicationRepo);
