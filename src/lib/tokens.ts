/**
 * Placely Design System Tokens
 * Typed references to CSS variables defined in globals.css.
 */

export const typographyTokens = {
  inter: "var(--font-sans)",
  dmSerif: "var(--font-serif)",
  spaceGrotesk: "var(--font-display)",
  mono: "var(--font-mono)",
} as const;

/**
 * Centralized Color System Tokens
 */
export const colorTokens = {
  surface: {
    bg: "var(--background)",
    fg: "var(--foreground)",
    card: "var(--card)",
    cardFg: "var(--card-foreground)",
    popover: "var(--popover)",
    popoverFg: "var(--popover-foreground)",
    muted: "var(--muted)",
    mutedFg: "var(--muted-foreground)",
    accent: "var(--accent)",
    accentFg: "var(--accent-foreground)",
    border: "var(--border)",
    borderSubtle: "var(--border-subtle)",
  },
  brand: {
    primary: "var(--primary)",
    primaryFg: "var(--primary-foreground)",
    primaryHover: "var(--primary-hover)",
    primaryMuted: "var(--primary-muted)",
    indigo: "var(--brand-indigo)",
    indigoHover: "var(--brand-indigo-hover)",
    indigoLight: "var(--brand-indigo-light)",
    dark: "var(--surface-dark)",
    darkFg: "var(--surface-dark-foreground)",
    darkMuted: "var(--surface-dark-muted)",
    darkBorder: "var(--surface-dark-border)",
  },
  stats: {
    indigo: "var(--stat-indigo)",
    indigoLight: "var(--stat-indigo-light)",
    blue: "var(--stat-blue)",
    blueLight: "var(--stat-blue-light)",
    coral: "var(--stat-coral)",
    coralLight: "var(--stat-coral-light)",
    emerald: "var(--stat-emerald)",
    emeraldLight: "var(--stat-emerald-light)",
    purple: "var(--stat-purple)",
    purpleLight: "var(--stat-purple-light)",
    amber: "var(--stat-amber)",
    amberLight: "var(--stat-amber-light)",
  },
} as const;

/**
 * Unified UI Tokens
 */
export const uiTokens = {
  fontHeadline: "var(--font-display)",
  fontBody: "var(--font-sans)",
  primary: "var(--primary)", 
  primaryHover: "var(--primary-hover)",
  secondary: "var(--secondary)", 
  bg: "var(--background)",
  cardBg: "var(--card)",
  fg: "var(--foreground)",
  mutedFg: "var(--muted-foreground)",
  border: "var(--border)",
  radiusBtn: "var(--radius-pill)",
  radiusCard: "var(--radius-card)",
  cardShadow: "none",
  cardHoverShadow: "shadow-sm",
  spacingBase: 8,
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
  border: string;
  label: string;
  className: string;
}

export const statusTokens: Record<ApplicationStatusKey, StatusToken> = {
  APPLIED: {
    bg: "var(--status-draft-bg)",
    fg: "var(--status-draft-fg)",
    border: "var(--status-draft-border)",
    label: "Applied",
    className: "bg-status-draft-bg text-status-draft-fg border-status-draft-border",
  },
  SHORTLISTED: {
    bg: "var(--status-shortlisted-bg)",
    fg: "var(--status-shortlisted-fg)",
    border: "var(--status-shortlisted-border)",
    label: "Shortlisted",
    className: "bg-status-shortlisted-bg text-status-shortlisted-fg border-status-shortlisted-border",
  },
  OFFERED: {
    bg: "var(--status-offered-bg)",
    fg: "var(--status-offered-fg)",
    border: "var(--status-offered-border)",
    label: "Offered",
    className: "bg-status-offered-bg text-status-offered-fg border-status-offered-border",
  },
  ACCEPTED: {
    bg: "var(--status-accepted-bg)",
    fg: "var(--status-accepted-fg)",
    border: "var(--status-accepted-border)",
    label: "Accepted",
    className: "bg-status-accepted-bg text-status-accepted-fg border-status-accepted-border",
  },
  DECLINED: {
    bg: "var(--status-declined-bg)",
    fg: "var(--status-declined-fg)",
    border: "var(--status-declined-border)",
    label: "Declined",
    className: "bg-status-declined-bg text-status-declined-fg border-status-declined-border",
  },
  DRAFT: {
    bg: "var(--status-draft-bg)",
    fg: "var(--status-draft-fg)",
    border: "var(--status-draft-border)",
    label: "Draft",
    className: "bg-status-draft-bg text-status-draft-fg border-status-draft-border",
  },
  PENDING: {
    bg: "var(--status-pending-bg)",
    fg: "var(--status-pending-fg)",
    border: "var(--status-pending-border)",
    label: "Pending Review",
    className: "bg-status-pending-bg text-status-pending-fg border-status-pending-border",
  },
  REJECTED: {
    bg: "var(--status-rejected-bg)",
    fg: "var(--status-rejected-fg)",
    border: "var(--status-rejected-border)",
    label: "Rejected",
    className: "bg-status-rejected-bg text-status-rejected-fg border-status-rejected-border",
  },
} as const;

/**
 * Deterministic avatar color palette from centralized brand tokens
 */
const AVATAR_PALETTE = [
  "#4f46e5", // stat-indigo
  "#1863dc", // stat-blue
  "#10b981", // stat-emerald
  "#ff7759", // stat-coral
  "#8b5cf6", // stat-purple
  "#0891b2", // cyan
  "#d97706", // stat-amber
  "#059669", // emerald dark
];

export function getCompanyAvatarColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) & 0xffffffff;
  return AVATAR_PALETTE[Math.abs(hash) % AVATAR_PALETTE.length];
}
