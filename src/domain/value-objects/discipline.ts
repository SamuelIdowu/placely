// src/domain/value-objects/discipline.ts
// Discipline value object — SIWES engineering disciplines.
// Immutable, validated, enumerable.

import { ValidationError } from '@/lib/errors';

export const VALID_DISCIPLINES = [
  'Electrical',
  'Mechanical',
  'Civil',
  'Computer',
  'Chemical',
  'Petroleum',
  'Agricultural',
] as const;

export type DisciplineValue = (typeof VALID_DISCIPLINES)[number];

export class Discipline {
  private readonly value: DisciplineValue;

  constructor(value: string) {
    if (!VALID_DISCIPLINES.includes(value as DisciplineValue)) {
      throw new ValidationError(
        `Invalid discipline: "${value}". Valid options: ${VALID_DISCIPLINES.join(', ')}`,
      );
    }
    this.value = value as DisciplineValue;
  }

  toString(): string { return this.value; }
  equals(other: Discipline): boolean { return this.value === other.value; }

  static all(): readonly DisciplineValue[] { return VALID_DISCIPLINES; }

  static isValid(value: string): boolean {
    return VALID_DISCIPLINES.includes(value as DisciplineValue);
  }
}
