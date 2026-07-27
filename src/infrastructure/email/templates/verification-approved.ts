// src/infrastructure/email/templates/verification-approved.ts

export function getVerificationApprovedEmailTemplate(params: {
  profileName: string;
  appUrl: string;
}): { subject: string; html: string } {
  return {
    subject: 'Verification Approved — Welcome to Placely! 🎉',
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111827; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e5e7eb; border-radius: 8px;">
        <h2 style="color: #059669; margin-top: 0;">Verification Request Approved! ✅</h2>
        <p>Hi <strong>${params.profileName}</strong>,</p>
        <p>Great news! Your account verification request on Placely has been reviewed and <strong>approved</strong> by our team.</p>
        <p>You now have full access to verified features on Placely:</p>
        <ul>
          <li>Apply to verified SIWES placement opportunities</li>
          <li>Display a verified badge on your profile</li>
          <li>Direct messaging with employers and institution supervisors</li>
        </ul>
        <div style="margin: 32px 0;">
          <a href="${params.appUrl}/profile" style="background-color: #059669; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">View Verified Profile →</a>
        </div>
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;" />
        <p style="font-size: 12px; color: #6b7280;">Placely — Supporting Nigerian Students & Employers in SIWES Placements</p>
      </div>
    `,
  };
}
