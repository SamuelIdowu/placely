// src/domain/ports/siwes-letter-generator.port.ts
// Port for generating formatted SIWES introductory & application letters.
// Zero external dependencies.

export interface SiwesLetterInput {
  studentName: string;
  matricNumber?: string;
  university: string;
  discipline: string;
  durationMonths: number; // e.g. 3 or 6 months
  targetCompany: string;
  targetLocation?: string;
  contactPerson?: string;
  cgpa?: number | null;
  skills?: string[];
  portfolioUrl?: string | null;
  linkedinUrl?: string | null;
  date: Date;
}

export interface ISiwesLetterGenerator {
  generateLetterHtml(input: SiwesLetterInput): string;
  generateLetterText(input: SiwesLetterInput): string;
}
