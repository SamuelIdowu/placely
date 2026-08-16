// src/infrastructure/email/resend-email.service.ts
// Resend implementation of EmailServicePort.
// Injected via container.ts.

import { Resend } from 'resend';
import type { EmailServicePort } from '@/domain/ports/email-service.port';
import { getVerificationApprovedEmailTemplate } from './templates/verification-approved';
import { getVerificationRejectedEmailTemplate } from './templates/verification-rejected';
import { getNewApplicationEmailTemplate } from './templates/new-application';
import { getApplicationStatusChangedEmailTemplate } from './templates/application-status-changed';
import { getOfferReceivedEmailTemplate } from './templates/offer-received';
import { getNewMessageEmailTemplate } from './templates/new-message';

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
    companyName?: string;
  }): Promise<void> {
    const isOffer = params.newStatus === 'OFFERED';
    const template = isOffer
      ? getOfferReceivedEmailTemplate({
          applicantName: params.applicantName,
          companyName: params.companyName ?? 'Employer',
          listingTitle: params.listingTitle,
          applicationUrl: params.applicationUrl,
        })
      : getApplicationStatusChangedEmailTemplate({
          applicantName: params.applicantName,
          listingTitle: params.listingTitle,
          newStatus: params.newStatus,
          applicationUrl: params.applicationUrl,
        });

    await this.resend.emails.send({
      from: this.from,
      to: params.to,
      subject: template.subject,
      html: template.html,
    });
  }

  async sendNewApplicationEmail(params: {
    to: string;
    employerName: string;
    listingTitle: string;
    applicantName: string;
    applicationUrl: string;
  }): Promise<void> {
    const template = getNewApplicationEmailTemplate({
      employerName: params.employerName,
      applicantName: params.applicantName,
      listingTitle: params.listingTitle,
      applicationUrl: params.applicationUrl,
    });

    await this.resend.emails.send({
      from: this.from,
      to: params.to,
      subject: template.subject,
      html: template.html,
    });
  }

  async sendVerificationResultEmail(params: {
    to: string;
    profileName: string;
    result: 'VERIFIED' | 'REJECTED';
    adminNote?: string;
  }): Promise<void> {
    const isVerified = params.result === 'VERIFIED';
    const template = isVerified
      ? getVerificationApprovedEmailTemplate({ profileName: params.profileName, appUrl: this.appUrl })
      : getVerificationRejectedEmailTemplate({ profileName: params.profileName, adminNote: params.adminNote, appUrl: this.appUrl });

    await this.resend.emails.send({
      from: this.from,
      to: params.to,
      subject: template.subject,
      html: template.html,
    });
  }

  async sendNewMessageNotification(params: {
    to: string;
    recipientName: string;
    senderName: string;
    listingTitle: string;
    messagePreview: string;
    applicationUrl: string;
  }): Promise<void> {
    const template = getNewMessageEmailTemplate({
      recipientName: params.recipientName,
      senderName: params.senderName,
      listingTitle: params.listingTitle,
      messagePreview: params.messagePreview,
      applicationUrl: params.applicationUrl,
    });

    await this.resend.emails.send({
      from: this.from,
      to: params.to,
      subject: template.subject,
      html: template.html,
    });
  }

  async sendSiwesOutreachEmail(params: {
    to: string;
    companyName: string;
    studentName: string;
    university: string;
    discipline: string;
    letterHtml: string;
    claimUrl: string;
  }): Promise<void> {
    const emailHtml = `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; color: #111827; max-width: 680px; margin: 0 auto; padding: 24px;">
        <div style="text-align: center; margin-bottom: 24px; padding-bottom: 16px; border-bottom: 1px solid #e5e7eb;">
          <h2 style="color: #2563eb; margin: 0 0 4px 0;">Placely SIWES Placement Application</h2>
          <p style="color: #6b7280; font-size: 14px; margin: 0;">Connecting Nigerian Employers with Top Verified Undergraduate Interns</p>
        </div>

        <p>Dear Hiring Team at <strong>${params.companyName}</strong>,</p>
        <p>You have received a formal <strong>SIWES (Students Industrial Work Experience Scheme)</strong> attachment application from <strong>${params.studentName}</strong>, an undergraduate in <strong>${params.discipline}</strong> at <strong>${params.university}</strong>.</p>

        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin: 24px 0;">
          ${params.letterHtml}
        </div>

        <div style="text-align: center; margin: 32px 0; background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 20px;">
          <h3 style="color: #1e40af; margin-top: 0; margin-bottom: 8px;">Accept or Review this Student on Placely</h3>
          <p style="color: #1e3a8a; font-size: 14px; margin-bottom: 16px;">Claim your free Placely Employer profile to view their full portfolio, schedule interviews, and accept placement with 1 click.</p>
          <a href="${params.claimUrl}" style="background-color: #2563eb; color: #ffffff; padding: 12px 28px; font-weight: 600; text-decoration: none; border-radius: 6px; display: inline-block;">
            Review Applicant & Claim Profile
          </a>
        </div>

        <p style="font-size: 13px; color: #6b7280; text-align: center; margin-top: 32px; border-top: 1px solid #f3f4f6; padding-top: 16px;">
          Sent via Placely — Nigeria's Dedicated SIWES & Internship Placement Network.<br />
          If this was sent in error, you may safely ignore this message.
        </p>
      </div>
    `;

    await this.resend.emails.send({
      from: this.from,
      to: params.to,
      subject: `SIWES Placement Application: ${params.studentName} (${params.discipline}, ${params.university})`,
      html: emailHtml,
    });
  }
}

