/**
 * Placely Unified Design System Tokens
 * Authoritative typed tokens mapping to Tailwind CSS v4 variables in globals.css.
 */

export const typographyTokens = {
  inter: "var(--font-sans)",
  dmSerif: "var(--font-serif)",
  spaceGrotesk: "var(--font-display)",
  mono: "var(--font-mono)",
  fontHeadline: "var(--font-display)",
  fontSerifHeadline: "var(--font-serif)",
  fontBody: "var(--font-sans)",
} as const;

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
    bodyMuted: "var(--body-muted)",
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
    indigoFg: "var(--brand-indigo-foreground)",
    dark: "var(--surface-dark)",
    darkFg: "var(--surface-dark-foreground)",
    darkMuted: "var(--surface-dark-muted)",
    darkBorder: "var(--surface-dark-border)",
    darkActive: "var(--surface-dark-active)",
  },
  sidebar: {
    bg: "var(--sidebar-bg)",
    fg: "var(--sidebar-fg)",
    muted: "var(--sidebar-muted)",
    activeBg: "var(--sidebar-active-bg)",
    activeFg: "var(--sidebar-active-fg)",
    border: "var(--sidebar-border)",
    hoverBg: "var(--sidebar-hover-bg)",
  },
  stats: {
    indigo: "var(--stat-indigo)",
    indigoHover: "var(--stat-indigo-hover)",
    indigoLight: "var(--stat-indigo-light)",
    blue: "var(--stat-blue)",
    blueHover: "var(--stat-blue-hover)",
    blueLight: "var(--stat-blue-light)",
    coral: "var(--stat-coral)",
    coralLight: "var(--stat-coral-light)",
    emerald: "var(--stat-emerald)",
    emeraldDark: "var(--stat-emerald-dark)",
    emeraldLight: "var(--stat-emerald-light)",
    purple: "var(--stat-purple)",
    purpleLight: "var(--stat-purple-light)",
    amber: "var(--stat-amber)",
    amberWarning: "var(--stat-amber-warning)",
    amberLight: "var(--stat-amber-light)",
    amberBorder: "var(--stat-amber-border)",
  },
} as const;

export const radiusTokens = {
  sm: "var(--radius-sm)",
  md: "var(--radius-md)",
  lg: "var(--radius-lg)",
  card: "var(--radius-card)",
  cardLg: "var(--radius-card-lg)",
  pill: "var(--radius-pill)",
} as const;

export const uiTokens = {
  fontHeadline: typographyTokens.fontHeadline,
  fontSerifHeadline: typographyTokens.fontSerifHeadline,
  fontBody: typographyTokens.fontBody,
  primary: colorTokens.brand.primary,
  primaryHover: colorTokens.brand.primaryHover,
  secondary: "var(--secondary)",
  bg: colorTokens.surface.bg,
  cardBg: colorTokens.surface.card,
  fg: colorTokens.surface.fg,
  mutedFg: colorTokens.surface.mutedFg,
  bodyMutedFg: colorTokens.surface.bodyMuted,
  border: colorTokens.surface.border,
  radiusBtn: radiusTokens.pill,
  radiusCard: radiusTokens.card,
  radiusCardLg: radiusTokens.cardLg,
  cardShadow: "none",
  cardHoverShadow: "shadow-xs",
  spacingBase: 8,
} as const;

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

export const AVATAR_PALETTE = [
  "var(--stat-indigo)",
  "var(--stat-blue)",
  "var(--stat-emerald)",
  "var(--stat-coral)",
  "var(--stat-purple)",
  "var(--stat-amber)",
  "var(--stat-emerald-dark)",
  "var(--brand-indigo)",
];

export function getCompanyAvatarColor(name: string): string {
  if (!name) return AVATAR_PALETTE[0];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = (hash * 31 + name.charCodeAt(i)) & 0xffffffff;
  }
  return AVATAR_PALETTE[Math.abs(hash) % AVATAR_PALETTE.length];
}

export function getStatusBadgeToken(status: string): StatusToken {
  const key = status?.toUpperCase() as ApplicationStatusKey;
  return statusTokens[key] ?? {
    bg: "var(--status-draft-bg)",
    fg: "var(--status-draft-fg)",
    border: "var(--status-draft-border)",
    label: status,
    className: "bg-status-draft-bg text-status-draft-fg border-status-draft-border",
  };
}
