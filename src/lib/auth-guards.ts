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

  if (!app || app.studentId !== studentId) {
    throw new NotFoundError('Application not found');
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

  if (!app || app.listing.employerProfileId !== employerProfileId) {
    throw new NotFoundError('Application not found');
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
  const employerUserId = app.listing.employerProfile?.userId ?? '';
  const employerEmail = app.listing.employerProfile?.user.email ?? '';
  const employerCompanyName = app.listing.employerProfile?.companyName ?? 'Corporate Partner';

  let senderRole: 'STUDENT' | 'EMPLOYER' | 'ADMIN';
  let recipientUserId: string;
  let recipientEmail: string;

  if (userId === studentUserId) {
    senderRole = 'STUDENT';
    recipientUserId = employerUserId;
    recipientEmail = employerEmail;
  } else if (userId === employerUserId) {
    senderRole = 'EMPLOYER';
    recipientUserId = studentUserId;
    recipientEmail = app.student.user.email;
  } else {
    const requestingUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    if (requestingUser?.role === 'EMPLOYER') {
      senderRole = 'EMPLOYER';
      recipientUserId = studentUserId;
      recipientEmail = app.student.user.email;
    } else if (requestingUser?.role === 'ADMIN') {
      senderRole = 'ADMIN';
      recipientUserId = employerUserId;
      recipientEmail = employerEmail;
    } else {
      senderRole = 'STUDENT';
      recipientUserId = employerUserId;
      recipientEmail = employerEmail;
    }
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
    employerEmail,
    employerCompanyName,
    senderRole,
    recipientUserId,
    recipientEmail,
    status: app.status,
    isTerminal,
  };
}
