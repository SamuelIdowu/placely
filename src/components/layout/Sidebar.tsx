"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Briefcase,
  FileText,
  User,
  CheckCircle2,
  Users,
  Building2,
} from "lucide-react";

export interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

export interface SidebarProps {
  role: "STUDENT" | "EMPLOYER" | "ADMIN";
}

export function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname();

  const navItems: Record<SidebarProps["role"], NavItem[]> = {
    STUDENT: [
      { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
      { title: "Browse Placements", href: "/listings", icon: Briefcase },
      { title: "My Applications", href: "/applications", icon: FileText },
      { title: "Profile Settings", href: "/profile", icon: User },
    ],
    EMPLOYER: [
      { title: "Dashboard", href: "/employer/dashboard", icon: LayoutDashboard },
      { title: "My Listings", href: "/employer/listings", icon: Briefcase },
      { title: "Company Profile", href: "/employer/profile", icon: Building2 },
    ],
    ADMIN: [
      { title: "Admin Overview", href: "/admin/dashboard", icon: LayoutDashboard },
      { title: "Verification Queue", href: "/admin/verifications", icon: CheckCircle2 },
      { title: "Listing Moderation", href: "/admin/listings", icon: Briefcase },
      { title: "User Management", href: "/admin/users", icon: Users },
    ],
  };

  const items = navItems[role] ?? navItems.STUDENT;

  return (
    <aside className="hidden md:flex flex-col w-64 shrink-0 border-r border-app-border bg-white min-h-[calc(100vh-4rem)] p-4 space-y-1">
      <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
        Navigation
      </div>
      <nav className="flex-1 space-y-1">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href || (item.href !== "/dashboard" && item.href !== "/employer/dashboard" && item.href !== "/admin/dashboard" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-[4px] text-sm font-medium transition-colors cursor-pointer",
                isActive
                  ? "bg-black text-white"
                  : "text-app-fg hover:bg-slate-100"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span>{item.title}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
