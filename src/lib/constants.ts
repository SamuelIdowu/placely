// src/lib/constants.ts
// Single source of truth for Placely engineering disciplines and app-wide constants.

export const DISCIPLINES = [
  'Electrical',
  'Mechanical',
  'Civil',
  'Computer',
  'Chemical',
  'Petroleum',
  'Agricultural',
  'Biomedical',
  'Systems',
  'Structural',
  'Mechatronics',
  'Aeronautical',
  'Environmental',
  'Software',
  'Industrial',
] as const;

export type DisciplineTag = (typeof DISCIPLINES)[number];
