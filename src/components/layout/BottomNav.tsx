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
  Building2,
  Users,
} from "lucide-react";

export interface BottomNavProps {
  role: "STUDENT" | "EMPLOYER" | "ADMIN";
}

export function BottomNav({ role }: BottomNavProps) {
  const pathname = usePathname();

  const navItems = {
    STUDENT: [
      { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
      { title: "Browse", href: "/listings", icon: Briefcase },
      { title: "Applications", href: "/applications", icon: FileText },
      { title: "Profile", href: "/profile", icon: User },
    ],
    EMPLOYER: [
      { title: "Dashboard", href: "/employer/dashboard", icon: LayoutDashboard },
      { title: "Listings", href: "/employer/listings", icon: Briefcase },
      { title: "Company", href: "/employer/profile", icon: Building2 },
    ],
    ADMIN: [
      { title: "Overview", href: "/admin/dashboard", icon: LayoutDashboard },
      { title: "Verify", href: "/admin/verifications", icon: CheckCircle2 },
      { title: "Listings", href: "/admin/listings", icon: Briefcase },
      { title: "Users", href: "/admin/users", icon: Users },
    ],
  }[role];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex h-16 w-full items-center justify-around border-t border-app-border bg-white px-2 shadow-lg">
      {navItems.map((item) => {
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
              "flex flex-col items-center justify-center w-full py-1 text-xs font-medium transition-colors cursor-pointer",
              isActive ? "text-black" : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Icon className={cn("h-5 w-5 mb-0.5", isActive && "stroke-[2.5]")} />
            <span>{item.title}</span>
          </Link>
        );
      })}
    </nav>
  );
}
