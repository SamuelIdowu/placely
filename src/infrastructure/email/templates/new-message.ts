// src/infrastructure/email/templates/new-message.ts
// Email template sent when a user receives a new message.

export interface NewMessageEmailParams {
  recipientName: string;
  senderName: string;
  listingTitle: string;
  messagePreview: string; // Truncated preview (max 150 chars)
  applicationUrl: string;
}

export function getNewMessageEmailTemplate(params: NewMessageEmailParams) {
  const truncatedPreview =
    params.messagePreview.length > 150
      ? `${params.messagePreview.slice(0, 147)}...`
      : params.messagePreview;

  return {
    subject: `New message from ${params.senderName} about ${params.listingTitle}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Inter, -apple-system, sans-serif; background-color: #f8fafc; color: #0f172a; padding: 24px; }
            .card { background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 24px; max-width: 560px; margin: 0 auto; }
            .preview-box { background: #f1f5f9; border-left: 4px solid #0f172a; padding: 12px 16px; margin: 16px 0; border-radius: 4px; font-style: italic; color: #334155; }
            .btn { display: inline-block; background-color: #000000; color: #ffffff; font-weight: 600; padding: 12px 20px; border-radius: 4px; text-decoration: none; margin-top: 16px; }
            .footer { margin-top: 24px; font-size: 12px; color: #64748b; text-align: center; }
          </style>
        </head>
        <body>
          <div class="card">
            <h2>New Message Received</h2>
            <p>Hi <strong>${params.recipientName}</strong>,</p>
            <p>You have received a new message from <strong>${params.senderName}</strong> regarding <strong>${params.listingTitle}</strong>.</p>
            <div class="preview-box">
              "${truncatedPreview}"
            </div>
            <p>Please log in to your Placely account to view the full message thread and reply.</p>
            <a href="${params.applicationUrl}" class="btn">View & Reply on Placely →</a>
            <div class="footer">
              <p>Placely — Verified SIWES Placements in Nigeria</p>
            </div>
          </div>
        </body>
      </html>
    `,
  };
}
