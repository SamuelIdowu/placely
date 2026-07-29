"use client";

import * as React from "react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { User, LogOut, Settings, Bell } from "lucide-react";
import { signOut } from "next-auth/react";

export interface HeaderProps {
  userRole?: "STUDENT" | "EMPLOYER" | "ADMIN";
  userEmail?: string;
  userName?: string;
  userAvatar?: string;
}

export function Header({
  userRole = "STUDENT",
  userEmail = "",
  userName = "Placely User",
  userAvatar,
}: HeaderProps) {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="flex h-14 w-full items-center justify-between px-4 md:px-8 z-30 pointer-events-none">
      {/* Mobile-only brand title */}
      <div className="flex md:hidden items-center gap-2.5 pointer-events-auto">
        <Link href="/" className="font-sans text-lg font-bold tracking-tight text-slate-900">
          Placely<span className="text-indigo-600">.</span>
        </Link>
        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-700 uppercase">
          {userRole}
        </span>
      </div>

      <div className="hidden md:block"></div>

      {/* Top Right Utilities (Notifications Bell + User Avatar Only) */}
      <div className="flex items-center gap-2.5 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-200/80 shadow-xs pointer-events-auto">
        <button
          className="relative rounded-full p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-900 cursor-pointer transition-colors"
          aria-label="Notifications"
        >
          <Bell className="h-4 h-4" />
          <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-white" />
        </button>

        <div className="h-4 w-px bg-slate-200" />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 outline-none cursor-pointer rounded-full p-0.5 hover:ring-2 hover:ring-indigo-500/20">
              <Avatar className="h-8 w-8 text-xs font-bold text-indigo-700 bg-indigo-50">
                <AvatarImage src={userAvatar} alt={userName} />
                <AvatarFallback className="bg-indigo-50 text-indigo-700 text-xs font-bold">
                  {getInitials(userName)}
                </AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 mt-1">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none text-foreground">{userName}</p>
                <p className="text-xs leading-none text-muted-foreground">{userEmail}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href={userRole === "EMPLOYER" ? "/employer/profile" : "/profile"} className="cursor-pointer">
                <User className="mr-2 h-4 w-4" />
                <span>Profile Settings</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/dashboard" className="cursor-pointer">
                <Settings className="mr-2 h-4 w-4" />
                <span>Dashboard</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-red-600 focus:text-red-600 cursor-pointer"
              onClick={() => signOut({ callbackUrl: "/sign-in" })}
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
