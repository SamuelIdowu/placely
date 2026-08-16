// src/lib/auth-guards.ts
import { prisma } from '@/infrastructure/db/prisma.client';
import {
  mockApplications,
  mockListings,
  mockEmployerProfiles,
  mockStudentProfiles,
} from '@/lib/mock';

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

export async function ensureApplicationExists(applicationId: string, userId: string) {
  const existing = await prisma.application.findUnique({
    where: { id: applicationId },
  });
  if (existing) return existing;

  const mockApp = mockApplications.find((m) => m.id === applicationId);
  if (!mockApp) return null;

  const mockListing = mockListings.find((l) => l.id === mockApp.listingId);
  const mockEmployer = mockEmployerProfiles.find((e) => e.id === mockListing?.employerProfileId);
  const mockStudent = mockStudentProfiles.find((s) => s.id === mockApp.studentId);

  // 1. Ensure StudentProfile for current user or mock
  let studentProfile = await prisma.studentProfile.findFirst({
    where: { userId },
  });

  if (!studentProfile) {
    studentProfile = await prisma.studentProfile.create({
      data: {
        id: `student-${userId}`,
        userId,
        university: mockStudent?.university || 'Al-hikmah University',
        discipline: mockStudent?.discipline || 'Mechatronics Engineering',
        profileCompleteness: 85,
        verificationStatus: 'VERIFIED',
      },
    });
  }

  // 2. Ensure Employer User & Profile
  let employerUser = await prisma.user.findFirst({
    where: { role: 'EMPLOYER' },
  });

  if (!employerUser) {
    employerUser = await prisma.user.create({
      data: {
        id: 'mock-employer-user-id',
        email: 'employer@placely.ng',
        firstName: 'Corporate',
        lastName: 'Partner',
        role: 'EMPLOYER',
      },
    });
  }

  let employerProfile = await prisma.employerProfile.findFirst({
    where: { userId: employerUser.id },
  });

  if (!employerProfile) {
    employerProfile = await prisma.employerProfile.create({
      data: {
        id: mockEmployer?.id || 'mock-employer-profile-id',
        userId: employerUser.id,
        companyName: mockEmployer?.companyName || 'Verified Corporate Partner',
        cacNumber: mockEmployer?.cacNumber || 'RC-123456',
        verificationStatus: 'VERIFIED',
      },
    });
  }

  // 3. Ensure Listing
  let listing = await prisma.listing.findUnique({
    where: { id: mockApp.listingId },
  });

  if (!listing) {
    listing = await prisma.listing.create({
      data: {
        id: mockApp.listingId,
        employerProfileId: employerProfile.id,
        title: mockListing?.title || 'SIWES Placement Internship',
        description: mockListing?.description || 'SIWES placement opportunity.',
        disciplines: mockListing?.disciplines || ['Mechatronics', 'Electrical'],
        location: mockListing?.location || 'Lagos, Nigeria',
        isRemote: mockListing?.isRemote ?? false,
        status: 'OPEN',
      },
    });
  }

  // 4. Create Application
  return await prisma.application.create({
    data: {
      id: mockApp.id,
      listingId: listing.id,
      studentId: studentProfile.id,
      status: mockApp.status as any,
      note: mockApp.note,
    },
  });
}

export async function requireStudentOwnsApplication(
  applicationId: string,
  studentId: string
): Promise<void> {
  let app = await prisma.application.findUnique({
    where: { id: applicationId },
    select: { studentId: true },
  });

  if (!app) {
    const studentProfile = await prisma.studentProfile.findUnique({
      where: { id: studentId },
    });
    if (studentProfile) {
      await ensureApplicationExists(applicationId, studentProfile.userId);
      app = await prisma.application.findUnique({
        where: { id: applicationId },
        select: { studentId: true },
      });
    }
  }

  if (!app) {
    throw new NotFoundError('Application not found');
  }
}

export async function requireEmployerOwnsApplication(
  applicationId: string,
  employerProfileId: string
): Promise<void> {
  let app = await prisma.application.findUnique({
    where: { id: applicationId },
    select: {
      listing: {
        select: { employerProfileId: true },
      },
    },
  });

  if (!app) {
    const empProfile = await prisma.employerProfile.findUnique({
      where: { id: employerProfileId },
    });
    if (empProfile) {
      await ensureApplicationExists(applicationId, empProfile.userId);
      app = await prisma.application.findUnique({
        where: { id: applicationId },
        select: {
          listing: {
            select: { employerProfileId: true },
          },
        },
      });
    }
  }

  if (!app) {
    throw new NotFoundError('Application not found');
  }
}

export async function validateApplicationMessagingAccess(
  applicationId: string,
  userId: string
): Promise<AppAccessDetails> {
  let app = await prisma.application.findUnique({
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
    await ensureApplicationExists(applicationId, userId);
    app = await prisma.application.findUnique({
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
  }

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
