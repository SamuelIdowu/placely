// src/domain/services/MatchScoreCalculator.ts
// Pure domain service to calculate student-to-listing compatibility match percentage (0–100%).

export interface StudentMatchProfile {
  discipline: string;
  university?: string;
  cgpa?: number | null;
}

export interface ListingMatchTarget {
  disciplines: string[];
  location: string;
  isRemote: boolean;
}

export class MatchScoreCalculator {
  static calculate(student: StudentMatchProfile, listing: ListingMatchTarget): number {
    let score = 0;

    // 1. Discipline Weight (Max 60 points)
    const studentDiscipline = student.discipline.trim().toLowerCase();
    const listingDisciplines = listing.disciplines.map((d) => d.trim().toLowerCase());

    const isExactMatch = listingDisciplines.some(
      (d) => d === studentDiscipline || d.includes(studentDiscipline) || studentDiscipline.includes(d)
    );

    if (isExactMatch) {
      score += 60;
    } else {
      // General engineering overlap check
      const isEngOverlap = listingDisciplines.some(
        (d) => d.includes('engineering') || studentDiscipline.includes('engineering')
      );
      if (isEngOverlap) {
        score += 35;
      } else {
        score += 15;
      }
    }

    // 2. Location / Work Mode Weight (Max 25 points)
    if (listing.isRemote) {
      score += 25;
    } else {
      score += 20; // Standard on-site availability
    }

    // 3. Academic Profile Weight (Max 15 points)
    if (student.cgpa !== undefined && student.cgpa !== null) {
      if (student.cgpa >= 3.5) {
        score += 15;
      } else if (student.cgpa >= 2.5) {
        score += 10;
      } else {
        score += 5;
      }
    } else {
      score += 10; // Default baseline if CGPA not set
    }

    return Math.min(100, Math.max(0, Math.round(score)));
  }
}
