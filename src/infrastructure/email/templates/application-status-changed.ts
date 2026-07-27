// src/infrastructure/email/templates/application-status-changed.ts
// Email template sent to students when application status is updated.

export interface ApplicationStatusChangedEmailParams {
  applicantName: string;
  listingTitle: string;
  newStatus: string;
  applicationUrl: string;
}

export function getApplicationStatusChangedEmailTemplate(params: ApplicationStatusChangedEmailParams) {
  return {
    subject: `Application Status Updated: ${params.newStatus} — ${params.listingTitle}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Inter, -apple-system, sans-serif; background-color: #f8fafc; color: #0f172a; padding: 24px; }
            .card { background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 24px; max-width: 560px; margin: 0 auto; }
            .badge { display: inline-block; padding: 4px 12px; border-radius: 9999px; font-weight: 600; font-size: 14px; background-color: #e2e8f0; color: #1e293b; }
            .btn { display: inline-block; background-color: #000000; color: #ffffff; font-weight: 600; padding: 12px 20px; border-radius: 4px; text-decoration: none; margin-top: 16px; }
            .footer { margin-top: 24px; font-size: 12px; color: #64748b; text-align: center; }
          </style>
        </head>
        <body>
          <div class="card">
            <h2>Application Status Update</h2>
            <p>Hi <strong>${params.applicantName}</strong>,</p>
            <p>Your application status for <strong>${params.listingTitle}</strong> has been updated:</p>
            <p><span class="badge">${params.newStatus}</span></p>
            <p>Click below to track your application and view details.</p>
            <a href="${params.applicationUrl}" class="btn">View Application Details →</a>
            <div class="footer">
              <p>Placely — Verified SIWES Placements in Nigeria</p>
            </div>
          </div>
        </body>
      </html>
    `,
  };
}
