// src/infrastructure/email/templates/verification-rejected.ts

export function getVerificationRejectedEmailTemplate(params: {
  profileName: string;
  adminNote?: string;
  appUrl: string;
}): { subject: string; html: string } {
  return {
    subject: 'Verification Update — Action Required',
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111827; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e5e7eb; border-radius: 8px;">
        <h2 style="color: #dc2626; margin-top: 0;">Verification Request Update ❌</h2>
        <p>Hi <strong>${params.profileName}</strong>,</p>
        <p>Your recent verification request on Placely could not be approved at this time.</p>
        ${
          params.adminNote
            ? `<div style="background-color: #fef2f2; border-left: 4px solid #dc2626; padding: 12px 16px; margin: 16px 0; border-radius: 4px;">
                <strong style="color: #991b1b;">Admin Note:</strong>
                <p style="margin: 4px 0 0 0; color: #7f1d1d;">${params.adminNote}</p>
               </div>`
            : ''
        }
        <p>Please log into your account, review the submitted documents or information, and submit an updated document to re-trigger verification.</p>
        <div style="margin: 32px 0;">
          <a href="${params.appUrl}/profile" style="background-color: #2563eb; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Update Profile & Resubmit →</a>
        </div>
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;" />
        <p style="font-size: 12px; color: #6b7280;">Placely — Supporting Nigerian Students & Employers in SIWES Placements</p>
      </div>
    `,
  };
}
