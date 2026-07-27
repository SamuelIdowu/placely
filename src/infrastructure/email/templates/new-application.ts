// src/infrastructure/email/templates/new-application.ts
// Email template sent to employers when a new application is submitted.

export interface NewApplicationEmailParams {
  employerName: string;
  applicantName: string;
  listingTitle: string;
  applicationUrl: string;
}

export function getNewApplicationEmailTemplate(params: NewApplicationEmailParams) {
  return {
    subject: `New application received for ${params.listingTitle}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Inter, -apple-system, sans-serif; background-color: #f8fafc; color: #0f172a; padding: 24px; }
            .card { background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 24px; max-width: 560px; margin: 0 auto; }
            .btn { display: inline-block; background-color: #000000; color: #ffffff; font-weight: 600; padding: 12px 20px; border-radius: 4px; text-decoration: none; margin-top: 16px; }
            .footer { margin-top: 24px; font-size: 12px; color: #64748b; text-align: center; }
          </style>
        </head>
        <body>
          <div class="card">
            <h2>New Applicant Notification</h2>
            <p>Hi <strong>${params.employerName}</strong>,</p>
            <p><strong>${params.applicantName}</strong> has submitted a new application for your SIWES placement listing: <strong>${params.listingTitle}</strong>.</p>
            <p>Review their verified profile, CGPA, and resume directly on your employer portal.</p>
            <a href="${params.applicationUrl}" class="btn">Review Applicant →</a>
            <div class="footer">
              <p>Placely — Verified SIWES Placements in Nigeria</p>
            </div>
          </div>
        </body>
      </html>
    `,
  };
}
