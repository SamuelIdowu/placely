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
    const location = input.targetLocation ? `<p style="margin: 0; color: #64748b; font-size: 12px;">${input.targetLocation}</p>` : '';
    const matric = input.matricNumber ? ` (Matric No: <strong>${input.matricNumber}</strong>)` : '';
    const cgpaHtml = input.cgpa ? `<p style="margin: 2px 0; color: #1e293b;"><strong>Academic Standing:</strong> Current CGPA of ${input.cgpa.toFixed(2)}</p>` : '';
    const skillsHtml = input.skills && input.skills.length > 0
      ? `<p style="margin: 2px 0; color: #1e293b;"><strong>Core Competencies:</strong> ${input.skills.map((s) => `<span style="background: #e2e8f0; padding: 2px 6px; border-radius: 4px; font-size: 11px; margin-right: 4px;">${s}</span>`).join(' ')}</p>`
      : '';

    return `
<div class="siwes-letter-content" style="color: #0f172a; line-height: 1.6; font-size: 13px;">
  <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1.5px solid #e2e8f0; padding-bottom: 8px; margin-bottom: 14px;">
    <span style="display: inline-block; background: #eef2ff; color: #4338ca; font-weight: 700; font-size: 10px; text-transform: uppercase; letter-spacing: 0.05em; padding: 2.5px 8px; border-radius: 9999px; border: 1px solid #e0e7ff;">
      Official SIWES Placement Application
    </span>
    <span style="font-size: 12px; font-weight: 600; color: #64748b;">${formattedDate}</span>
  </div>

  <div style="margin-bottom: 12px;">
    <p style="margin: 0; font-weight: 700; color: #0f172a;">${recipient}</p>
    <p style="margin: 0; font-weight: 600; color: #4338ca;">${input.targetCompany}</p>
    ${location}
  </div>

  <p style="margin: 8px 0; font-weight: 600;">Dear Sir/Madam,</p>

  <h2 style="font-size: 13px; font-weight: 700; color: #0f172a; text-transform: uppercase; letter-spacing: 0.03em; margin: 12px 0 8px 0; border-left: 3px solid #4338ca; padding-left: 8px; line-height: 1.35;">
    APPLICATION FOR SIWES / INDUSTRIAL TRAINING PLACEMENT (${input.durationMonths}-MONTH DURATION)
  </h2>

  <p style="margin: 8px 0;">
    I am writing to formally apply for an Industrial Training (SIWES) placement at <strong>${input.targetCompany}</strong>. 
    I am an undergraduate student of <strong>${input.discipline}</strong> at <strong>${input.university}</strong>${matric}.
  </p>

  <p style="margin: 8px 0;">
    As part of the degree curriculum and the Students Industrial Work Experience Scheme (SIWES), 
    I am expected to undergo an intensive <strong>${input.durationMonths}-month</strong> industrial attachment designed to bridge classroom academic theory with active industrial practices.
  </p>

  <p style="margin: 8px 0;">
    Having followed ${input.targetCompany}'s track record and technical excellence, 
    I am eager to contribute effectively to your team while acquiring practical industry competencies under your guidance.
  </p>

  ${(cgpaHtml || skillsHtml) ? `
  <div style="background: #f8fafc; border: 1px solid #f1f5f9; border-radius: 8px; padding: 8px 12px; margin: 10px 0; font-size: 12px;">
    ${cgpaHtml}
    ${skillsHtml}
  </div>` : ''}

  <p style="margin: 8px 0;">
    I am dedicated, rapid in learning, and committed to upholding high standards of professional integrity. 
    Enclosed with this letter is my student profile and curriculum vitae for your consideration.
  </p>

  <p style="margin: 8px 0;">
    Thank you for your time, consideration, and commitment to student training.
  </p>

  <div style="margin-top: 16px; border-top: 1px solid #e2e8f0; padding-top: 10px;">
    <p style="margin: 0 0 2px 0; color: #64748b; font-size: 12px;">Yours faithfully,</p>
    <p style="margin: 0; font-weight: 700; color: #0f172a; font-size: 14px;">${input.studentName}</p>
    <p style="margin: 1px 0 0 0; color: #64748b; font-size: 12px;">Department of ${input.discipline}, ${input.university}</p>
  </div>
</div>
`.trim();
  }
}
