// src/infrastructure/email/templates/offer-received.ts
// Specific email template sent to students when an offer is received.

export interface OfferReceivedEmailParams {
  applicantName: string;
  companyName: string;
  listingTitle: string;
  applicationUrl: string;
}

export function getOfferReceivedEmailTemplate(params: OfferReceivedEmailParams) {
  return {
    subject: `Congratulations! You received a SIWES offer from ${params.companyName}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Inter, -apple-system, sans-serif; background-color: #f8fafc; color: #0f172a; padding: 24px; }
            .card { background: #ffffff; border: 1px solid #10b981; border-radius: 8px; padding: 24px; max-width: 560px; margin: 0 auto; }
            .hero { font-size: 20px; font-weight: 700; color: #047857; margin-bottom: 12px; }
            .btn-accept { display: inline-block; background-color: #10b981; color: #ffffff; font-weight: 600; padding: 12px 20px; border-radius: 4px; text-decoration: none; margin-right: 12px; }
            .btn-secondary { display: inline-block; background-color: #f1f5f9; color: #334155; font-weight: 600; padding: 12px 20px; border-radius: 4px; text-decoration: none; }
            .footer { margin-top: 24px; font-size: 12px; color: #64748b; text-align: center; }
          </style>
        </head>
        <body>
          <div class="card">
            <div class="hero">🎉 You Have Received a Placement Offer!</div>
            <p>Hi <strong>${params.applicantName}</strong>,</p>
            <p><strong>${params.companyName}</strong> has selected you for their SIWES placement: <strong>${params.listingTitle}</strong>.</p>
            <p>Please review and confirm your decision to accept or decline the offer on Placely.</p>
            <div style="margin-top: 20px;">
              <a href="${params.applicationUrl}" class="btn-accept">Accept Offer →</a>
              <a href="${params.applicationUrl}" class="btn-secondary">View Details</a>
            </div>
            <div class="footer">
              <p>Placely — Verified SIWES Placements in Nigeria</p>
            </div>
          </div>
        </body>
      </html>
    `,
  };
}
