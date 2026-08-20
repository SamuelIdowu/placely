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
  MoreHorizontal,
  Compass,
  Bookmark,
  Settings,
  ShieldCheck,
  Layers,
  Sparkles,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export interface BottomNavProps {
  role: "STUDENT" | "EMPLOYER" | "ADMIN";
}

interface NavItem {
  title: string;
  href: string;
  icon: React.ElementType;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const moreNavItems: Record<"STUDENT" | "EMPLOYER" | "ADMIN", NavSection[]> = {
  STUDENT: [
    {
      title: "Workspace",
      items: [
        { title: "IT Approved Directory", href: "/directory", icon: Compass },
      ],
    },
    {
      title: "Placement Pipeline",
      items: [
        { title: "Saved Placements", href: "/saved", icon: Bookmark },
      ],
    },
    {
      title: "Account",
      items: [
        { title: "Settings & Preferences", href: "/profile/settings", icon: Settings },
      ],
    },
  ],
  EMPLOYER: [
    {
      title: "Account",
      items: [
        { title: "Company Settings", href: "/employer/profile/settings", icon: Settings },
      ],
    },
  ],
  ADMIN: [
    {
      title: "Platform",
      items: [
        { title: "Design System", href: "/admin/design-system", icon: Sparkles },
      ],
    },
  ],
};

export function BottomNav({ role }: BottomNavProps) {
  const pathname = usePathname();
  const [moreOpen, setMoreOpen] = React.useState(false);

  const navItems = {
    STUDENT: [
      { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
      { title: "Browse", href: "/listings", icon: Briefcase },
      { title: "Apps", href: "/applications", icon: FileText },
      { title: "Profile", href: "/profile", icon: User },
      { title: "More", href: "__more__", icon: MoreHorizontal },
    ],
    EMPLOYER: [
      { title: "Dashboard", href: "/employer/dashboard", icon: LayoutDashboard },
      { title: "Listings", href: "/employer/listings", icon: Briefcase },
      { title: "Company", href: "/employer/profile", icon: Building2 },
      { title: "More", href: "__more__", icon: MoreHorizontal },
    ],
    ADMIN: [
      { title: "Overview", href: "/admin/dashboard", icon: LayoutDashboard },
      { title: "Verify", href: "/admin/verifications", icon: CheckCircle2 },
      { title: "Listings", href: "/admin/listings", icon: Briefcase },
      { title: "More", href: "__more__", icon: MoreHorizontal },
    ],
  }[role];

  const moreSections = moreNavItems[role];
  const hasMoreItems = moreSections.length > 0;
  const isMoreActive = moreSections.some(
    (section) =>
      section.items.some((item) => pathname === item.href || pathname.startsWith(item.href))
  );

  return (
    <>
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex h-16 w-full items-center justify-around border-t border-border bg-white/95 backdrop-blur-md px-2 shadow-sm">
        {navItems.map((item) => {
          if (item.href === "__more__") {
            return (
              <button
                key="more"
                onClick={() => setMoreOpen(true)}
                className={cn(
                  "flex flex-col items-center justify-center w-full py-1 text-xs font-medium transition-colors cursor-pointer",
                  isMoreActive ? "text-brand-indigo font-bold" : "text-body-muted hover:text-foreground"
                )}
              >
                <MoreHorizontal className={cn("h-5 w-5 mb-0.5", isMoreActive && "stroke-[2.5]")} />
                <span>More</span>
              </button>
            );
          }

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
                isActive ? "text-brand-indigo font-bold" : "text-body-muted hover:text-foreground"
              )}
            >
              <Icon className={cn("h-5 w-5 mb-0.5", isActive && "stroke-[2.5]")} />
              <span>{item.title}</span>
            </Link>
          );
        })}
      </nav>

      {/* More Navigation Sheet */}
      {hasMoreItems && (
        <Dialog open={moreOpen} onOpenChange={setMoreOpen}>
          <DialogContent className="sm:max-w-sm p-0 gap-0 bottom-0 top-auto translate-y-0 rounded-b-none rounded-t-2xl max-h-[70vh]">
            <DialogHeader className="px-5 pt-5 pb-3 border-b border-border">
              <DialogTitle className="text-base font-semibold text-foreground">
                Navigation
              </DialogTitle>
            </DialogHeader>
            <div className="overflow-y-auto p-3 space-y-1">
              {moreSections.map((section) => (
                <div key={section.title} className="space-y-0.5">
                  <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    {section.title}
                  </div>
                  {section.items.map((item) => {
                    const Icon = item.icon;
                    const isActive =
                      pathname === item.href || pathname.startsWith(item.href);
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMoreOpen(false)}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors",
                          isActive
                            ? "bg-brand-indigo text-white"
                            : "text-slate-700 hover:bg-slate-100"
                        )}
                      >
                        <Icon className="w-4 h-4 shrink-0" />
                        <span>{item.title}</span>
                      </Link>
                    );
                  })}
                </div>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
