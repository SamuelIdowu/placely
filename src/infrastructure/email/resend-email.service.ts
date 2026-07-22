// src/infrastructure/email/resend-email.service.ts
// Resend implementation of EmailServicePort.
// Domain never imports this — injected via container.ts.

import { Resend } from 'resend';
import type { EmailServicePort } from '@/domain/ports/email-service.port';

export class ResendEmailService implements EmailServicePort {
  private readonly resend = new Resend(process.env.RESEND_API_KEY);
  private readonly from = 'Placely <noreply@placely.ng>';
  private readonly appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://placely.ng';

  async sendStatusChangeEmail(params: {
    to: string;
    applicantName: string;
    listingTitle: string;
    newStatus: string;
    applicationUrl: string;
  }): Promise<void> {
    await this.resend.emails.send({
      from: this.from,
      to: params.to,
      subject: `Application update: ${params.newStatus} — ${params.listingTitle}`,
      html: `
        <p>Hi ${params.applicantName},</p>
        <p>Your application for <strong>${params.listingTitle}</strong>
           has been updated to <strong>${params.newStatus}</strong>.</p>
        <p><a href="${params.applicationUrl}">View your application →</a></p>
        <hr/>
        <small>Placely — Nigerian SIWES Placement Platform</small>
      `,
    });
  }

  async sendNewApplicationEmail(params: {
    to: string;
    employerName: string;
    listingTitle: string;
    applicantName: string;
    applicationUrl: string;
  }): Promise<void> {
    await this.resend.emails.send({
      from: this.from,
      to: params.to,
      subject: `New application: ${params.applicantName} applied to ${params.listingTitle}`,
      html: `
        <p>Hi ${params.employerName},</p>
        <p><strong>${params.applicantName}</strong> has applied to
           <strong>${params.listingTitle}</strong>.</p>
        <p><a href="${params.applicationUrl}">Review the application →</a></p>
        <hr/>
        <small>Placely — Nigerian SIWES Placement Platform</small>
      `,
    });
  }

  async sendVerificationResultEmail(params: {
    to: string;
    profileName: string;
    result: 'VERIFIED' | 'REJECTED';
    adminNote?: string;
  }): Promise<void> {
    const isVerified = params.result === 'VERIFIED';
    await this.resend.emails.send({
      from: this.from,
      to: params.to,
      subject: `Verification ${isVerified ? 'approved' : 'rejected'} — Placely`,
      html: `
        <p>Hi ${params.profileName},</p>
        <p>Your verification request has been <strong>${isVerified ? 'approved ✅' : 'rejected ❌'}</strong>.</p>
        ${params.adminNote ? `<p>Admin note: ${params.adminNote}</p>` : ''}
        <p><a href="${this.appUrl}/profile">Visit your profile →</a></p>
        <hr/>
        <small>Placely — Nigerian SIWES Placement Platform</small>
      `,
    });
  }
}
