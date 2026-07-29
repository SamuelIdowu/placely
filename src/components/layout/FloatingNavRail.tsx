"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Briefcase,
  FileText,
  MessageSquare,
  BookOpen,
  User,
  ShieldCheck,
  Building2,
  Users,
  Settings,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from "lucide-react";

export interface NavRailItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

export interface FloatingNavRailProps {
  role: "STUDENT" | "EMPLOYER" | "ADMIN";
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export function FloatingNavRail({
  role,
  isCollapsed: controlledIsCollapsed,
  onToggleCollapse,
}: FloatingNavRailProps) {
  const pathname = usePathname();
  const [internalIsCollapsed, setInternalIsCollapsed] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("placely_sidebar_collapsed");
      return saved === "true";
    }
    return false;
  });

  const isCollapsed = controlledIsCollapsed ?? internalIsCollapsed;

  const toggle = () => {
    if (onToggleCollapse) {
      onToggleCollapse();
    } else {
      const nextState = !internalIsCollapsed;
      setInternalIsCollapsed(nextState);
      localStorage.setItem("placely_sidebar_collapsed", String(nextState));
    }
  };

  const navItems: Record<FloatingNavRailProps["role"], NavRailItem[]> = {
    STUDENT: [
      { title: "Overview", href: "/dashboard", icon: LayoutDashboard },
      { title: "Browse Placements", href: "/listings", icon: Briefcase },
      { title: "Applications", href: "/applications", icon: FileText },
      { title: "Messages", href: "/messages", icon: MessageSquare },
      { title: "Logbook", href: "/logbook", icon: BookOpen },
      { title: "Profile Settings", href: "/profile", icon: User },
    ],
    EMPLOYER: [
      { title: "Overview", href: "/employer/dashboard", icon: LayoutDashboard },
      { title: "My Listings", href: "/employer/listings", icon: Briefcase },
      { title: "Applicants", href: "/employer/applicants", icon: Users },
      { title: "Messages", href: "/employer/messages", icon: MessageSquare },
      { title: "Company Profile", href: "/employer/profile", icon: Building2 },
    ],
    ADMIN: [
      { title: "Overview", href: "/admin/dashboard", icon: LayoutDashboard },
      { title: "Verifications", href: "/admin/verifications", icon: ShieldCheck },
      { title: "Listings Moderation", href: "/admin/listings", icon: Briefcase },
      { title: "User Directory", href: "/admin/users", icon: Users },
      { title: "System Settings", href: "/admin/settings", icon: Settings },
    ],
  };

  const items = navItems[role] ?? navItems.STUDENT;

  return (
    <aside
      className={cn(
        "hidden md:flex flex-col py-5 bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200/80 shadow-xl fixed left-4 top-4 bottom-4 h-[calc(100vh-2rem)] z-40 transition-all duration-300 ease-in-out",
        isCollapsed ? "w-16 px-2.5 items-center" : "w-60 px-4"
      )}
    >
      {/* Sidebar Header & Toggle */}
      <div
        className={cn(
          "flex items-center pb-4 border-b border-slate-100 mb-3",
          isCollapsed ? "flex-col gap-3 justify-center" : "justify-between"
        )}
      >
        <Link
          href={items[0]?.href ?? "/dashboard"}
          className="flex items-center gap-2.5 group"
        >
          <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-black text-base shadow-md shadow-indigo-200 group-hover:scale-105 transition-transform shrink-0">
            P
          </div>
          {!isCollapsed && (
            <span className="font-extrabold text-slate-900 text-lg tracking-tight">
              Placely<span className="text-indigo-600">.</span>
            </span>
          )}
        </Link>

        <button
          type="button"
          onClick={toggle}
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-slate-100 transition-colors shrink-0 cursor-pointer"
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </button>
      </div>

      {!isCollapsed && (
        <div className="px-1 py-1 text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-1">
          Navigation
        </div>
      )}

      {/* Nav List */}
      <nav className="flex-1 space-y-1.5 overflow-y-auto scrollbar-none">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" &&
              item.href !== "/employer/dashboard" &&
              item.href !== "/admin/dashboard" &&
              pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative group flex items-center rounded-xl transition-all duration-200 cursor-pointer",
                isCollapsed
                  ? "justify-center w-10 h-10 mx-auto"
                  : "gap-3 px-3 py-2.5 text-sm font-medium",
                isActive
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-200 font-semibold"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              )}
            >
              <Icon className="w-5 h-5 shrink-0" />

              {!isCollapsed && (
                <span className="truncate text-xs font-semibold">{item.title}</span>
              )}

              {/* Floating Tooltip when Collapsed */}
              {isCollapsed && (
                <span className="absolute left-14 px-2.5 py-1.5 rounded-md bg-slate-900 text-white text-xs font-semibold whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity shadow-lg z-50">
                  {item.title}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Role Indicator in Expanded Mode */}
      {!isCollapsed && (
        <div className="pt-3 border-t border-slate-100 mt-2">
          <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-slate-50 border border-slate-100">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
            <span className="text-[11px] font-bold text-slate-700 capitalize">
              {role.toLowerCase()} portal
            </span>
          </div>
        </div>
      )}
    </aside>
  );
}
