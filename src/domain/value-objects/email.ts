// src/domain/value-objects/email.ts
// Email value object — validates format, immutable.

import { ValidationError } from '@/lib/errors';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export class Email {
  private readonly value: string;

  constructor(email: string) {
    const normalized = email.toLowerCase().trim();
    if (!EMAIL_REGEX.test(normalized)) {
      throw new ValidationError(`Invalid email address: ${email}`);
    }
    this.value = normalized;
  }

  toString(): string { return this.value; }
  equals(other: Email): boolean { return this.value === other.value; }

  static isValid(email: string): boolean {
    return EMAIL_REGEX.test(email.toLowerCase().trim());
  }
}
