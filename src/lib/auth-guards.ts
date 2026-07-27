// src/lib/auth-guards.ts
import { prisma } from '@/infrastructure/db/prisma.client';

export class ForbiddenError extends Error {
  constructor(message = 'You do not have permission to access this resource') {
    super(message);
    this.name = 'ForbiddenError';
  }
}

export class NotFoundError extends Error {
  constructor(message = 'Resource not found') {
    super(message);
    this.name = 'NotFoundError';
  }
}

export interface AppAccessDetails {
  applicationId: string;
  listingId: string;
  listingTitle: string;
  studentUserId: string;
  studentEmail: string;
  studentName: string;
  employerUserId: string;
  employerEmail: string;
  employerCompanyName: string;
  senderRole: 'STUDENT' | 'EMPLOYER' | 'ADMIN';
  recipientUserId: string;
  recipientEmail: string;
  status: string;
  isTerminal: boolean;
}

export async function requireStudentOwnsApplication(
  applicationId: string,
  studentId: string
): Promise<void> {
  const app = await prisma.application.findUnique({
    where: { id: applicationId },
    select: { studentId: true },
  });

  if (!app) {
    throw new NotFoundError('Application not found');
  }

  if (app.studentId !== studentId) {
    throw new ForbiddenError('You do not own this application');
  }
}

export async function requireEmployerOwnsApplication(
  applicationId: string,
  employerProfileId: string
): Promise<void> {
  const app = await prisma.application.findUnique({
    where: { id: applicationId },
    select: {
      listing: {
        select: { employerProfileId: true },
      },
    },
  });

  if (!app) {
    throw new NotFoundError('Application not found');
  }

  if (app.listing.employerProfileId !== employerProfileId) {
    throw new ForbiddenError('You do not own the listing associated with this application');
  }
}

export async function validateApplicationMessagingAccess(
  applicationId: string,
  userId: string
): Promise<AppAccessDetails> {
  const app = await prisma.application.findUnique({
    where: { id: applicationId },
    include: {
      student: {
        include: {
          user: true,
        },
      },
      listing: {
        include: {
          employerProfile: {
            include: {
              user: true,
            },
          },
        },
      },
    },
  });

  if (!app) {
    throw new NotFoundError('Application not found');
  }

  const studentUserId = app.student.userId;
  const employerUserId = app.listing.employerProfile.userId;

  let senderRole: 'STUDENT' | 'EMPLOYER' | 'ADMIN';
  let recipientUserId: string;
  let recipientEmail: string;

  if (userId === studentUserId) {
    senderRole = 'STUDENT';
    recipientUserId = employerUserId;
    recipientEmail = app.listing.employerProfile.user.email;
  } else if (userId === employerUserId) {
    senderRole = 'EMPLOYER';
    recipientUserId = studentUserId;
    recipientEmail = app.student.user.email;
  } else {
    throw new ForbiddenError('Access denied: You are neither the applicant student nor the listing employer');
  }

  const isTerminal = ['ACCEPTED', 'DECLINED'].includes(app.status);

  return {
    applicationId: app.id,
    listingId: app.listingId,
    listingTitle: app.listing.title,
    studentUserId,
    studentEmail: app.student.user.email,
    studentName: `${app.student.university} - ${app.student.discipline}`,
    employerUserId,
    employerEmail: app.listing.employerProfile.user.email,
    employerCompanyName: app.listing.employerProfile.companyName,
    senderRole,
    recipientUserId,
    recipientEmail,
    status: app.status,
    isTerminal,
  };
}
