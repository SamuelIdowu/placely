import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { statusTokens, type ApplicationStatusKey } from "./tokens";

/**
 * Combines class names with clsx and merges Tailwind CSS classes cleanly.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Formats a date string, number, or Date instance into a clean readable date string.
 */
export function formatDate(date: Date | string | number): string {
  const d = new Date(date);
  if (isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/**
 * Returns the Tailwind color CSS classes for a given application status.
 */
export function getStatusColor(status: ApplicationStatusKey | string): string {
  const key = status.toUpperCase() as ApplicationStatusKey;
  return statusTokens[key]?.className ?? "bg-slate-100 text-slate-700 border-slate-200";
}
