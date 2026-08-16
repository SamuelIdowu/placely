// src/application/student/generate-siwes-letter.usecase.ts
// Use case to generate a formal SIWES application letter for a student.

import type { IStudentProfileRepository } from '@/domain/ports/IStudentProfileRepository';
import type { ISiwesLetterGenerator } from '@/domain/ports/siwes-letter-generator.port';
import { NotFoundError } from '@/lib/errors';

export interface GenerateSiwesLetterDTO {
  studentProfileId: string;
  studentName: string;
  targetCompany: string;
  targetLocation?: string;
  contactPerson?: string;
  durationMonths?: number; // 3 or 6
  matricNumber?: string;
  skills?: string[];
}

export interface GeneratedSiwesLetterResult {
  letterHtml: string;
  letterText: string;
  studentName: string;
  university: string;
  discipline: string;
  durationMonths: number;
}

export class GenerateSiwesLetterUseCase {
  constructor(
    private readonly studentRepo: IStudentProfileRepository,
    private readonly letterGenerator: ISiwesLetterGenerator
  ) {}

  async execute(dto: GenerateSiwesLetterDTO): Promise<GeneratedSiwesLetterResult> {
    const student = await this.studentRepo.findById(dto.studentProfileId);
    if (!student) {
      throw new NotFoundError('StudentProfile', dto.studentProfileId);
    }

    const durationMonths = dto.durationMonths ?? 6;

    const letterInput = {
      studentName: dto.studentName,
      matricNumber: dto.matricNumber,
      university: student.university,
      discipline: student.discipline,
      durationMonths,
      targetCompany: dto.targetCompany,
      targetLocation: dto.targetLocation,
      contactPerson: dto.contactPerson,
      cgpa: student.cgpa,
      skills: dto.skills,
      portfolioUrl: student.portfolioUrl,
      linkedinUrl: student.linkedinUrl,
      date: new Date(),
    };

    const letterHtml = this.letterGenerator.generateLetterHtml(letterInput);
    const letterText = this.letterGenerator.generateLetterText(letterInput);

    return {
      letterHtml,
      letterText,
      studentName: dto.studentName,
      university: student.university,
      discipline: student.discipline,
      durationMonths,
    };
  }
}
