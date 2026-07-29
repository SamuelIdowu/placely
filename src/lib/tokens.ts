/**
 * Placely Design System Tokens
 * Typed references to CSS variables defined in globals.css.
 */

export const typographyTokens = {
  inter: "var(--font-inter)",
  dmSerif: "var(--font-dm-serif)",
  hanken: "var(--font-hanken)",
} as const;

/**
 * Editorial Minimalist Design Tokens (Landing Page / Unauthenticated)
 */
export const landingTokens = {
  fontHeadline: "var(--font-dm-serif)",
  fontBody: "var(--font-hanken)",
  primary: "var(--landing-primary)",
  primaryHover: "var(--landing-primary-hover)",
  bg: "var(--landing-bg)",
  fg: "var(--landing-fg)",
  border: "var(--landing-border)",
  radiusBtn: "var(--radius-landing-btn)", // 0px
  radiusCard: "var(--radius-landing-card)", // 0px
  spacingBase: 8,
} as const;

/**
 * Placely Corporate Minimalism Tokens (App / Authenticated Dashboard)
 */
export const appTokens = {
  fontHeadline: "var(--font-inter)",
  fontBody: "var(--font-inter)",
  primary: "var(--app-primary)", // #4F46E5 Brand Indigo
  primaryHover: "var(--app-primary-hover)",
  primaryDark: "var(--app-slate-dark)", // #0F172A Near-Black Slate
  secondaryGreen: "var(--app-secondary-green)", // #10B981 Emerald
  secondaryGreenHover: "var(--app-secondary-green-hover)", // #059669
  bg: "var(--app-bg)", // #F8FAFC
  cardBg: "var(--app-card-bg)",
  fg: "var(--app-fg)",
  mutedFg: "var(--app-muted-fg)",
  border: "var(--app-border)",
  radiusBtn: "rounded-md", // 6px
  radiusCard: "rounded-lg", // 8px
  cardShadow: "shadow-md",
  cardHoverShadow: "shadow-lg",
  spacingBase: 4,
} as const;

/**
 * Semantic Application Status Tokens
 */
export type ApplicationStatusKey =
  | "APPLIED"
  | "SHORTLISTED"
  | "OFFERED"
  | "ACCEPTED"
  | "DECLINED"
  | "DRAFT"
  | "PENDING"
  | "REJECTED";

export interface StatusToken {
  bg: string;
  fg: string;
  label: string;
  className: string;
}

export const statusTokens: Record<ApplicationStatusKey, StatusToken> = {
  APPLIED: {
    bg: "var(--status-applied-bg, #F1F5F9)",
    fg: "var(--status-applied-fg, #475569)",
    label: "Applied",
    className: "bg-slate-100 text-slate-700 border-slate-200",
  },
  SHORTLISTED: {
    bg: "var(--status-shortlisted-bg, #DBEAFE)",
    fg: "var(--status-shortlisted-fg, #1D4ED8)",
    label: "Shortlisted",
    className: "bg-blue-100 text-blue-800 border-blue-200",
  },
  OFFERED: {
    bg: "var(--status-offered-bg, #F3E8FF)",
    fg: "var(--status-offered-fg, #6B21A8)",
    label: "Offered",
    className: "bg-purple-100 text-purple-800 border-purple-200",
  },
  ACCEPTED: {
    bg: "var(--status-accepted-bg, #D1FAE5)",
    fg: "var(--status-accepted-fg, #047857)",
    label: "Accepted",
    className: "bg-emerald-100 text-emerald-800 border-emerald-200",
  },
  DECLINED: {
    bg: "var(--status-declined-bg, #FFE4E6)",
    fg: "var(--status-declined-fg, #BE123C)",
    label: "Declined",
    className: "bg-rose-100 text-rose-800 border-rose-200",
  },
  DRAFT: {
    bg: "var(--status-draft-bg, #F1F5F9)",
    fg: "var(--status-draft-fg, #475569)",
    label: "Draft",
    className: "bg-slate-100 text-slate-700 border-slate-200",
  },
  PENDING: {
    bg: "var(--status-pending-bg, #FEF3C7)",
    fg: "var(--status-pending-fg, #B45309)",
    label: "Pending Review",
    className: "bg-amber-100 text-amber-800 border-amber-200",
  },
  REJECTED: {
    bg: "var(--status-rejected-bg, #FFE4E6)",
    fg: "var(--status-rejected-fg, #BE123C)",
    label: "Rejected",
    className: "bg-rose-100 text-rose-800 border-rose-200",
  },
} as const;
