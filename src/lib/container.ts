// src/lib/container.ts
// Manual DI registry (ADR-06: no DI framework at MVP scale).
// All singletons and use case instances are exported from this single file.

import { PrismaApplicationRepository } from '@/infrastructure/db/ApplicationRepository';
import { PrismaStudentProfileRepository } from '@/infrastructure/db/student-profile.repository';
import { PrismaEmployerProfileRepository } from '@/infrastructure/db/employer-profile.repository';
import { PrismaListingRepository } from '@/infrastructure/db/listing.repository';
import { MessageRepository } from '@/infrastructure/db/MessageRepository';
import { PrismaVerificationRepository } from '@/infrastructure/db/verification.repository';
import { ResendEmailService } from '@/infrastructure/email/resend-email.service';
import { VercelBlobStorage } from '@/infrastructure/storage/vercel-blob.storage';

// ── Repositories (singletons) ────────────────────────────────────────────────
export const applicationRepo = new PrismaApplicationRepository();
export const studentProfileRepo = new PrismaStudentProfileRepository();
export const employerProfileRepo = new PrismaEmployerProfileRepository();
export const listingRepo = new PrismaListingRepository();
export const messageRepo = new MessageRepository();
export const verificationRepo = new PrismaVerificationRepository();

// ── Services (singletons) ────────────────────────────────────────────────────
export const emailService = new ResendEmailService();
export const fileStorage = new VercelBlobStorage();

// ── Use Cases ─────────────────────────────────────────────────────────────────
import { RegisterStudentUseCase } from '@/application/student/register-student.usecase';
import { UpdateStudentProfileUseCase } from '@/application/student/update-student-profile';
import { UploadResumeUseCase } from '@/application/student/upload-resume';
import { SubmitApplicationUseCase } from '@/application/student/submit-application';
import { GetMyApplicationsUseCase } from '@/application/student/get-my-applications';
import { RespondToOfferUseCase } from '@/application/student/respond-to-offer';
import { BrowseListingsUseCase } from '@/application/student/browse-listings';

import { RegisterEmployerUseCase } from '@/application/employer/register-employer.usecase';
import { UpdateEmployerProfileUseCase } from '@/application/employer/update-employer-profile';
import { UploadCacDocumentUseCase } from '@/application/employer/upload-cac-document';
import { PostListingUseCase } from '@/application/employer/post-listing.usecase';
import { CreateListingUseCase } from '@/application/employer/create-listing';
import { UpdateListingUseCase } from '@/application/employer/update-listing';
import { ToggleListingStatusUseCase } from '@/application/employer/toggle-listing-status';
import { ReviewApplicantsUseCase } from '@/application/employer/review-applicants.usecase';
import { SendOfferUseCase } from '@/application/employer/send-offer.usecase';
import { UpdateApplicationStatusUseCase } from '@/application/employer/update-application-status';
import { GetApplicantsUseCase } from '@/application/employer/get-applicants';

import { ApproveVerificationUseCase } from '@/application/admin/approve-verification.usecase';
import { RejectVerificationUseCase } from '@/application/admin/reject-verification';
import { ModerateListingUseCase } from '@/application/admin/moderate-listing.usecase';

import { SendMessageUseCase } from '@/application/messaging/send-message';
import { GetThreadUseCase } from '@/application/messaging/get-thread';

// Student
export const registerStudentUseCase = new RegisterStudentUseCase(studentProfileRepo, emailService);
export const updateStudentProfileUseCase = new UpdateStudentProfileUseCase(studentProfileRepo);
export const uploadResumeUseCase = new UploadResumeUseCase(studentProfileRepo, verificationRepo, fileStorage);
export const submitApplicationUseCase = new SubmitApplicationUseCase(applicationRepo, listingRepo, studentProfileRepo, emailService, employerProfileRepo);
export const getMyApplicationsUseCase = new GetMyApplicationsUseCase(applicationRepo);
export const respondToOfferUseCase = new RespondToOfferUseCase(applicationRepo);
export const browseListingsUseCase = new BrowseListingsUseCase(listingRepo);

// Employer
export const registerEmployerUseCase = new RegisterEmployerUseCase(employerProfileRepo);
export const updateEmployerProfileUseCase = new UpdateEmployerProfileUseCase(employerProfileRepo);
export const uploadCacDocumentUseCase = new UploadCacDocumentUseCase(employerProfileRepo, verificationRepo, fileStorage);
export const postListingUseCase = new PostListingUseCase(listingRepo, employerProfileRepo);
export const createListingUseCase = new CreateListingUseCase(listingRepo, employerProfileRepo);
export const updateListingUseCase = new UpdateListingUseCase(listingRepo);
export const toggleListingStatusUseCase = new ToggleListingStatusUseCase(listingRepo);
export const reviewApplicantsUseCase = new ReviewApplicantsUseCase(applicationRepo);
export const sendOfferUseCase = new SendOfferUseCase(applicationRepo, emailService);
export const updateApplicationStatusUseCase = new UpdateApplicationStatusUseCase(applicationRepo, listingRepo, emailService);
export const getApplicantsUseCase = new GetApplicantsUseCase(applicationRepo, listingRepo);

// Admin
export const approveVerificationUseCase = new ApproveVerificationUseCase(verificationRepo, studentProfileRepo, employerProfileRepo, emailService);
export const rejectVerificationUseCase = new RejectVerificationUseCase(verificationRepo, studentProfileRepo, employerProfileRepo, emailService);
export const moderateListingUseCase = new ModerateListingUseCase(listingRepo);

// Messaging
export const sendMessageUseCase = new SendMessageUseCase(messageRepo, emailService);
export const getThreadUseCase = new GetThreadUseCase(messageRepo);
