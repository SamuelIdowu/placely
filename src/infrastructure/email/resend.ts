// src/infrastructure/email/resend.ts

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const defaultFrom = 'Placely <noreply@placely.ng>';

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}): Promise<void> {
  await resend.emails.send({
    from: defaultFrom,
    to,
    subject,
    html,
  });
}
