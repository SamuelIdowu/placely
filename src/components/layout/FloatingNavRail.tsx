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
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface FloatingNavRailProps {
  role?: 'STUDENT' | 'EMPLOYER' | 'ADMIN';
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export function FloatingNavRail({
  role = 'STUDENT',
  isCollapsed = false,
  onToggleCollapse,
}: FloatingNavRailProps) {
  const pathname = usePathname();

  const studentItems = [
    { icon: LayoutDashboard, href: '/dashboard', label: 'Dashboard' },
    { icon: Compass, href: '/listings', label: 'Explore Placements' },
    { icon: FileText, href: '/applications', label: 'My Applications' },
    { icon: Bookmark, href: '/saved', label: 'Saved Placements' },
    { icon: Settings, href: '/profile', label: 'Settings' },
  ];

  const employerItems = [
    { icon: LayoutDashboard, href: '/employer/dashboard', label: 'Dashboard' },
    { icon: Building2, href: '/employer/listings', label: 'My Listings' },
    { icon: FileText, href: '/employer/applications', label: 'Applicants' },
    { icon: Settings, href: '/employer/profile', label: 'Settings' },
  ];

  const adminItems = [
    { icon: LayoutDashboard, href: '/admin/dashboard', label: 'Dashboard' },
    { icon: ShieldCheck, href: '/admin/verification', label: 'Verification Queue' },
    { icon: Building2, href: '/admin/listings', label: 'Moderation Queue' },
    { icon: Settings, href: '/admin/users', label: 'User Management' },
  ];

  const navItems = role === 'ADMIN' ? adminItems : role === 'EMPLOYER' ? employerItems : studentItems;

  return (
    <aside
      className={cn(
        'fixed left-4 top-4 bottom-4 h-[calc(100vh-2rem)] z-40 hidden lg:flex flex-col rounded-xl border transition-all duration-300 ease-in-out py-5 px-3',
        'bg-[#17171c] border-[rgba(255,255,255,0.08)]',
        isCollapsed ? 'w-16 items-center' : 'w-60'
      )}
    >
      {/* Brand Header & Toggle */}
      <div className={cn('flex items-center mb-6 w-full', isCollapsed ? 'justify-center flex-col gap-2' : 'justify-between px-2')}>
        <div className="flex items-center gap-2.5">
          <Link
            href="/"
            title="Placely Home"
            className="flex items-center gap-2.5 group"
          >
            {/* Logo mark — unchanged indigo badge */}
            <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-extrabold text-lg shrink-0 group-hover:bg-indigo-500 transition-colors">
              P
            </div>
            {!isCollapsed && (
              <span className="font-sans text-lg font-bold tracking-tight text-white">
                Placely<span className="text-indigo-400">.</span>
              </span>
            )}
          </Link>
        </div>

        {onToggleCollapse && !isCollapsed && (
          <button
            onClick={onToggleCollapse}
            aria-label="Collapse sidebar"
            className="p-1.5 rounded-md text-[#93939f] hover:text-white hover:bg-white/5 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Navigation List */}
      <nav className="flex flex-col gap-1.5 flex-1 w-full">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname?.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'group relative rounded-lg transition-all duration-200 flex items-center gap-3 text-xs font-semibold',
                isCollapsed ? 'p-3 justify-center' : 'px-3.5 py-2.5',
                isActive
                  ? 'bg-[#4f46e5] text-white'
                  : 'text-[#93939f] hover:text-white hover:bg-white/5'
              )}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {!isCollapsed && <span className="truncate">{item.label}</span>}

              {/* Tooltip for collapsed mode */}
              {isCollapsed && (
                <div className="absolute left-full ml-3 px-2.5 py-1.5 rounded-md bg-[#17171c] border border-[rgba(255,255,255,0.12)] text-white text-xs font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 shadow-lg z-50 flex items-center gap-1">
                  <div className="w-1.5 h-1.5 bg-[#17171c] border-l border-b border-[rgba(255,255,255,0.12)] rotate-45 absolute -left-1 top-1/2 -translate-y-1/2" />
                  {item.label}
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Separator + Collapse toggle at bottom */}
      <div className="mt-auto pt-4 w-full border-t border-[rgba(255,255,255,0.08)] flex justify-center">
        {onToggleCollapse && (
          <div className="relative group w-full flex justify-center">
            <button
              onClick={onToggleCollapse}
              aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              className="p-2 rounded-lg text-[#93939f] hover:text-white hover:bg-white/5 transition-colors flex items-center justify-center"
            >
              {isCollapsed
                ? <ChevronRight className="w-4 h-4" />
                : <ChevronLeft className="w-4 h-4" />
              }
            </button>
            {isCollapsed && (
              <div className="absolute left-full ml-3 px-2.5 py-1.5 rounded-md bg-[#17171c] border border-[rgba(255,255,255,0.12)] text-white text-xs font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 shadow-lg z-50">
                <div className="w-1.5 h-1.5 bg-[#17171c] border-l border-b border-[rgba(255,255,255,0.12)] rotate-45 absolute -left-1 top-1/2 -translate-y-1/2" />
                Expand Sidebar
              </div>
            )}
          </div>
        )}
      </div>
    </aside>
  );
}
