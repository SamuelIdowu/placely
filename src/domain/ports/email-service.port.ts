// src/domain/ports/email-service.port.ts
// Email service port (Hexagonal: port = abstract interface).
// Implemented by ResendEmailService in infrastructure/email/.

export interface EmailServicePort {
  sendStatusChangeEmail(params: {
    to: string;
    applicantName: string;
    listingTitle: string;
    newStatus: string;
    applicationUrl: string;
  }): Promise<void>;

  sendNewApplicationEmail(params: {
    to: string;
    employerName: string;
    listingTitle: string;
    applicantName: string;
    applicationUrl: string;
  }): Promise<void>;

  sendVerificationResultEmail(params: {
    to: string;
    profileName: string;
    result: 'VERIFIED' | 'REJECTED';
    adminNote?: string;
  }): Promise<void>;
}
