// src/infrastructure/services/siwes-letter-generator.service.ts
// Service for generating formatted SIWES introductory & application letters.

import {
  ISiwesLetterGenerator,
  SiwesLetterInput,
} from '@/domain/ports/siwes-letter-generator.port';

export class SiwesLetterGeneratorService implements ISiwesLetterGenerator {
  generateLetterText(input: SiwesLetterInput): string {
    const formattedDate = input.date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });

    const recipient = input.contactPerson || 'The Human Resources Manager / Head of Training';
    const location = input.targetLocation ? `\n${input.targetLocation}` : '';
    const matric = input.matricNumber ? ` (Matriculation No: ${input.matricNumber})` : '';
    const cgpaInfo = input.cgpa ? `\nAcademic Standing: CGPA of ${input.cgpa.toFixed(2)}` : '';
    const skillsInfo = input.skills && input.skills.length > 0
      ? `\nCore Technical Competencies: ${input.skills.join(', ')}`
      : '';
    const links = [
      input.portfolioUrl ? `Portfolio: ${input.portfolioUrl}` : null,
      input.linkedinUrl ? `LinkedIn: ${input.linkedinUrl}` : null,
    ].filter(Boolean).join(' | ');

    return `
${formattedDate}

${recipient}
${input.targetCompany}${location}

Dear Sir/Madam,

APPLICATION FOR SIWES / INDUSTRIAL TRAINING PLACEMENT (${String(input.durationMonths)}-MONTH DURATION)

I am writing to formally apply for an Industrial Training (SIWES) placement at ${input.targetCompany}. I am an undergraduate student of ${input.discipline} at ${input.university}${matric}.

As part of the degree requirements and the Students Industrial Work Experience Scheme (SIWES), I am expected to undergo an intensive ${input.durationMonths}-month industrial attachment designed to bridge the gap between academic theory and practical industry experience.

Having followed ${input.targetCompany}'s remarkable track record and engineering excellence, I am enthusiastic about the opportunity to contribute effectively to your esteemed organization while acquiring practical industry competencies under your guidance.${cgpaInfo}${skillsInfo}

I am proactive, eager to learn, and dedicated to upholding the highest standards of professional ethics and organizational values. Enclosed with this letter is my curriculum vitae and student profile for your kind consideration.

Thank you for your time, consideration, and commitment to student development. I look forward to the possibility of discussing how I can be of value to your team.

Yours faithfully,

${input.studentName}
${input.university}
${links ? '\n' + links : ''}
`.trim();
  }

  generateLetterHtml(input: SiwesLetterInput): string {
    const formattedDate = input.date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });

    const recipient = input.contactPerson || 'The Human Resources Manager / Head of Training';
    const location = input.targetLocation ? `<p style="margin: 0; color: #4b5563;">${input.targetLocation}</p>` : '';
    const matric = input.matricNumber ? ` (Matric No: <strong>${input.matricNumber}</strong>)` : '';
    const cgpaHtml = input.cgpa ? `<p style="margin: 4px 0; color: #1f2937;"><strong>Academic Standing:</strong> Current CGPA of ${input.cgpa.toFixed(2)}</p>` : '';
    const skillsHtml = input.skills && input.skills.length > 0
      ? `<p style="margin: 4px 0; color: #1f2937;"><strong>Core Competencies:</strong> ${input.skills.map((s) => `<span style="background: #f3f4f6; padding: 2px 6px; border-radius: 4px; font-size: 12px; margin-right: 4px;">${s}</span>`).join(' ')}</p>`
      : '';

    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>SIWES Application Letter - ${input.studentName}</title>
  <style>
    body {
      font-family: 'Segoe UI', Arial, sans-serif;
      line-height: 1.6;
      color: #1f2937;
      background-color: #ffffff;
      margin: 0;
      padding: 32px;
    }
    .letter-container {
      max-width: 760px;
      margin: 0 auto;
      background: #ffffff;
      border: 1px solid #e5e7eb;
      border-radius: 12px;
      padding: 40px 48px;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
    }
    .header {
      border-bottom: 2px solid #3b82f6;
      padding-bottom: 20px;
      margin-bottom: 28px;
    }
    .badge {
      display: inline-block;
      background: #eff6ff;
      color: #1d4ed8;
      font-weight: 600;
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      padding: 4px 10px;
      border-radius: 9999px;
      margin-bottom: 12px;
    }
    .title {
      font-size: 18px;
      font-weight: 700;
      color: #111827;
      text-transform: uppercase;
      letter-spacing: 0.2px;
      margin: 24px 0 16px 0;
      border-left: 4px solid #3b82f6;
      padding-left: 12px;
    }
    .footer {
      margin-top: 40px;
      border-top: 1px solid #e5e7eb;
      padding-top: 20px;
    }
  </style>
</head>
<body>
  <div class="letter-container">
    <div class="header">
      <div class="badge">Official SIWES Placement Application</div>
      <p style="margin: 0; font-weight: 600; color: #374151;">${formattedDate}</p>
    </div>

    <div style="margin-bottom: 24px;">
      <p style="margin: 0; font-weight: 700; color: #111827;">${recipient}</p>
      <p style="margin: 0; font-weight: 600; color: #2563eb;">${input.targetCompany}</p>
      ${location}
    </div>

    <p style="font-weight: 500;">Dear Sir/Madam,</p>

    <div class="title">
      APPLICATION FOR SIWES / INDUSTRIAL TRAINING PLACEMENT (${input.durationMonths}-MONTH DURATION)
    </div>

    <p>
      I am writing to formally apply for an Industrial Training (SIWES) placement at <strong>${input.targetCompany}</strong>. 
      I am an undergraduate student of <strong>${input.discipline}</strong> at <strong>${input.university}</strong>${matric}.
    </p>

    <p>
      As part of the degree curriculum and the nationwide Students Industrial Work Experience Scheme (SIWES), 
      I am required to undergo a <strong>${input.durationMonths}-month</strong> hands-on industrial attachment to bridge classroom theory 
      with active industrial practices.
    </p>

    <p>
      Having closely observed ${input.targetCompany}'s impact, high technical standards, and leadership in the industry, 
      I am enthusiastic about contributing meaningfully to your team while expanding my professional competencies under your mentorship.
    </p>

    <div style="background: #f9fafb; border: 1px solid #f3f4f6; border-radius: 8px; padding: 16px; margin: 20px 0;">
      ${cgpaHtml}
      ${skillsHtml}
    </div>

    <p>
      I am dedicated, rapid in learning, and committed to upholding the highest standards of professional integrity. 
      My comprehensive student profile and credentials are attached for your evaluation.
    </p>

    <p>
      Thank you for your time and continuous investment in emerging talent. I look forward to the opportunity to discuss my application.
    </p>

    <div class="footer">
      <p style="margin: 0 0 4px 0;">Yours faithfully,</p>
      <p style="margin: 0; font-weight: 700; font-size: 16px; color: #111827;">${input.studentName}</p>
      <p style="margin: 2px 0 0 0; color: #4b5563; font-size: 14px;">Department of ${input.discipline}, ${input.university}</p>
    </div>
  </div>
</body>
</html>
`.trim();
  }
}
