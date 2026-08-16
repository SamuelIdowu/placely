// src/domain/ports/IApplicationRepository.ts
// Domain Port Interface for Application persistence.

import type { Application, ApplicationStatus, ApplicationType, OutreachStatus } from '../entities/application';

export interface ApplicationWithDetails {
  application: Application;
  listing: {
    id: string;
    title: string;
    location: string;
    isRemote: boolean;
    sourceType?: 'NATIVE' | 'CURATED_EXTERNAL';
    externalCompany?: string | null;
    externalUrl?: string | null;
    contactEmail?: string | null;
    employer: {
      id: string;
      companyName: string;
      verificationStatus: string;
    };
  };
}

export interface ApplicationWithStudentProfile {
  application: Application;
  student: {
    id: string;
    userId: string;
    university: string;
    discipline: string;
    resumeUrl: string | null;
    profileCompleteness: number;
    verificationStatus: string;
    user: {
      firstName?: string | null;
      lastName?: string | null;
      email: string;
    };
  };
}

export interface CreateApplicationDTO {
  listingId: string;
  studentId: string;
  note?: string;
  status?: ApplicationStatus;
  applicationType?: ApplicationType;
  outreachStatus?: OutreachStatus | null;
  outreachLetterUrl?: string | null;
  externalCompanyContact?: string | null;
  claimToken?: string | null;
}

export interface IApplicationRepository {
  create(data: CreateApplicationDTO): Promise<Application>;
  findById(id: string): Promise<Application | null>;
  findByClaimToken(claimToken: string): Promise<{ application: Application; student: ApplicationWithStudentProfile['student']; listing: ApplicationWithDetails['listing'] } | null>;
  findByStudent(studentId: string): Promise<ApplicationWithDetails[]>;
  findByListing(listingId: string): Promise<ApplicationWithStudentProfile[]>;
  findByListingId?(listingId: string): Promise<Application[]>;
  findByStudentId?(studentId: string): Promise<Application[]>;
  updateStatus(id: string, status: ApplicationStatus): Promise<Application>;
  updateOutreachStatus(id: string, status: OutreachStatus): Promise<Application>;
  existsByListingAndStudent(listingId: string, studentId: string): Promise<boolean>;
}

