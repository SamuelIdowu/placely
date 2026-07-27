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
}
