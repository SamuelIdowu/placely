"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  CheckCircle2,
  Briefcase,
  Users,
  Shield,
} from "lucide-react";

export function AdminSidebar() {
  const pathname = usePathname();

  const navItems = [
    { title: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { title: "Verification Queue", href: "/admin/verifications", icon: CheckCircle2 },
    { title: "Listings Moderation", href: "/admin/listings", icon: Briefcase },
    { title: "User Management", href: "/admin/users", icon: Users },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 shrink-0 border-r border-app-border bg-white min-h-[calc(100vh-4rem)] p-4 space-y-2">
      <div className="flex items-center gap-2 px-3 py-2 text-xs font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-3 mb-1">
        <Shield className="h-4 w-4 text-emerald-600" />
        <span>Admin Console</span>
      </div>
      <nav className="flex-1 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href ||
            (item.href !== "/admin/dashboard" && pathname.startsWith(item.href));

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
