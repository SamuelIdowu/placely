'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Compass,
  FileText,
  Bookmark,
  Settings,
  Building2,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Plus,
  GraduationCap,
  Users,
  Briefcase,
  Layers,
  Sparkles,
  FileCheck,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface FloatingNavRailProps {
  role?: 'STUDENT' | 'EMPLOYER' | 'ADMIN';
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

interface NavSection {
  title?: string;
  items: {
    icon: React.ElementType;
    href: string;
    label: string;
    badge?: string;
    badgeColor?: string;
  }[];
}

export function FloatingNavRail({
  role = 'STUDENT',
  isCollapsed = false,
  onToggleCollapse,
}: FloatingNavRailProps) {
  const pathname = usePathname();

  const studentSections: NavSection[] = [
    {
      title: 'Workspace',
      items: [
        { icon: LayoutDashboard, href: '/dashboard', label: 'Dashboard' },
        { icon: Compass, href: '/listings', label: 'Explore Placements', badge: 'Live', badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' },
      ],
    },
    {
      title: 'Placement Pipeline',
      items: [
        { icon: FileText, href: '/applications', label: 'My Applications' },
        { icon: Bookmark, href: '/saved', label: 'Saved Placements' },
      ],
    },
    {
      title: 'Institutional Credentials',
      items: [
        { icon: GraduationCap, href: '/profile', label: 'Student Profile & ID' },
        { icon: Settings, href: '/profile/settings', label: 'Settings' },
      ],
    },
  ];

  const employerSections: NavSection[] = [
    {
      title: 'Talent Workspace',
      items: [
        { icon: LayoutDashboard, href: '/employer/dashboard', label: 'Dashboard' },
        { icon: Briefcase, href: '/employer/listings', label: 'SIWES Listings' },
      ],
    },
    {
      title: 'Corporate Identity',
      items: [
        { icon: Building2, href: '/employer/profile', label: 'Company Profile & CAC' },
        { icon: Settings, href: '/employer/profile/settings', label: 'Settings' },
      ],
    },
  ];

  const adminSections: NavSection[] = [
    {
      title: 'Platform Governance',
      items: [
        { icon: LayoutDashboard, href: '/admin/dashboard', label: 'Admin Overview' },
        { icon: ShieldCheck, href: '/admin/verifications', label: 'Verification Queue', badge: 'Review', badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30' },
        { icon: Layers, href: '/admin/listings', label: 'Listings Moderation' },
        { icon: Users, href: '/admin/users', label: 'User Directory' },
      ],
    },
  ];

  const sections = role === 'ADMIN' ? adminSections : role === 'EMPLOYER' ? employerSections : studentSections;

  return (
    <aside
      className={cn(
        'fixed left-4 top-4 bottom-4 h-[calc(100vh-2rem)] z-40 hidden lg:flex flex-col rounded-[22px] border transition-[width,padding,margin] duration-200 ease-out py-5 px-3 shadow-2xl',
        'bg-[#17171c] border-[#26262e] text-[#93939f]',
        isCollapsed ? 'w-18 items-center' : 'w-64'
      )}
    >
      {/* ── Brand Header & Toggle ── */}
      <div
        className={cn(
          'flex items-center mb-5 w-full pb-4 border-b border-[#26262e]',
          isCollapsed ? 'justify-center flex-col gap-2' : 'justify-between px-2'
        )}
      >
        <div className="flex items-center gap-2.5">
          <Link href="/" title="Placely Home" className="flex items-center gap-2.5 group">
            {/* Logo mark */}
            <div className="w-8 h-8 rounded-xl bg-[#4f46e5] flex items-center justify-center text-white font-serif font-bold text-lg shrink-0 group-hover:bg-[#4338ca] transition-all shadow-xs active:scale-95">
              P
            </div>
            {!isCollapsed && (
              <div className="flex flex-col">
                <span className="font-serif text-lg font-normal tracking-tight text-white leading-none">
                  Placely<span className="text-[#4f46e5]">.ng</span>
                </span>
                <span className="text-[9px] font-bold uppercase tracking-[0.1em] text-[#6b6b7a] mt-0.5">
                  {role === 'EMPLOYER' ? 'Corporate Portal' : role === 'ADMIN' ? 'Admin Suite' : 'SIWES OS'}
                </span>
              </div>
            )}
          </Link>
        </div>

        {onToggleCollapse && !isCollapsed && (
          <button
            onClick={onToggleCollapse}
            aria-label="Collapse sidebar"
            className="p-1.5 rounded-lg text-[#6b6b7a] hover:text-white hover:bg-[#26262e] transition-all active:scale-95 cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* ── Primary Action Button for Employers ── */}
      {role === 'EMPLOYER' && !isCollapsed && (
        <div className="mb-4 px-1">
          <Link
            href="/employer/listings/new"
            className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-full bg-[#4f46e5] hover:bg-[#4338ca] text-white text-xs font-bold transition-all shadow-xs active:scale-[0.98]"
          >
            <Plus className="w-3.5 h-3.5" /> Post SIWES Opening
          </Link>
        </div>
      )}

      {role === 'EMPLOYER' && isCollapsed && (
        <div className="mb-4">
          <Link
            href="/employer/listings/new"
            title="Post SIWES Opening"
            className="w-10 h-10 rounded-full bg-[#4f46e5] hover:bg-[#4338ca] text-white flex items-center justify-center transition-all shadow-xs active:scale-95"
          >
            <Plus className="w-4 h-4" />
          </Link>
        </div>
      )}

      {/* ── Grouped Navigation Sections ── */}
      <div className="flex-1 w-full space-y-5 overflow-y-auto overflow-x-hidden pr-0.5 scrollbar-none">
        {sections.map((section, sIdx) => (
          <div key={sIdx} className="space-y-1.5">
            {!isCollapsed && section.title && (
              <div className="px-3 text-[10px] font-bold uppercase tracking-[0.08em] text-[#6b6b7a]">
                {section.title}
              </div>
            )}

            <nav className="flex flex-col gap-1 w-full">
              {section.items.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href !== '/dashboard' &&
                    item.href !== '/employer/dashboard' &&
                    item.href !== '/admin/dashboard' &&
                    pathname?.startsWith(item.href));
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'group relative rounded-xl transition-all duration-150 flex items-center gap-3 text-xs font-semibold active:scale-[0.98]',
                      isCollapsed ? 'p-2.5 justify-center' : 'px-3 py-2',
                      isActive
                        ? 'bg-[#4f46e5] text-white shadow-xs'
                        : 'text-[#93939f] hover:text-white hover:bg-[#26262e]/60'
                    )}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    {!isCollapsed && <span className="truncate flex-1">{item.label}</span>}

                    {!isCollapsed && item.badge && (
                      <span
                        className={cn(
                          'text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border',
                          item.badgeColor || 'bg-white/10 text-white border-white/20'
                        )}
                      >
                        {item.badge}
                      </span>
                    )}

                    {/* Tooltip for collapsed rail mode */}
                    {isCollapsed && (
                      <div className="absolute left-full ml-3 px-2.5 py-1.5 rounded-lg bg-[#17171c] border border-[#26262e] text-white text-xs font-semibold whitespace-nowrap opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 origin-left transition-all duration-150 pointer-events-none shadow-xl z-50 flex items-center gap-1.5">
                        <span>{item.label}</span>
                        {item.badge && (
                          <span
                            className={cn(
                              'text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded-full border',
                              item.badgeColor || 'bg-white/10 text-white border-white/20'
                            )}
                          >
                            {item.badge}
                          </span>
                        )}
                      </div>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>
        ))}
      </div>

      {/* ── Footer with Expand/Collapse & Institutional Status ── */}
      <div className="mt-auto pt-3 w-full border-t border-[#26262e] flex flex-col gap-2">
        {!isCollapsed && (
          <div className="px-2 py-1 flex items-center justify-between text-[10px] text-[#6b6b7a] font-medium">
            <span>NUC &amp; ITF Compliant</span>
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          </div>
        )}

        {onToggleCollapse && (
          <div className="relative group w-full flex justify-center">
            <button
              onClick={onToggleCollapse}
              aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              className="w-full p-2 rounded-xl text-[#6b6b7a] hover:text-white hover:bg-[#26262e] transition-all active:scale-95 flex items-center justify-center cursor-pointer"
            >
              {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
            {isCollapsed && (
              <div className="absolute left-full ml-3 px-2.5 py-1.5 rounded-lg bg-[#17171c] border border-[#26262e] text-white text-xs font-semibold whitespace-nowrap opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 origin-left transition-all pointer-events-none shadow-xl z-50">
                Expand Sidebar
              </div>
            )}
          </div>
        )}
      </div>
    </aside>
  );
}
