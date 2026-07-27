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
    <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-app-border bg-white px-4 md:px-6 shadow-2xs">
      <div className="flex items-center gap-3">
        <Link href="/" className="font-sans text-xl font-bold tracking-tight text-app-fg">
          Placely<span className="text-app-secondary-green">.</span>
        </Link>
        <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-700">
          {userRole}
        </span>
      </div>

      <div className="flex items-center gap-4">
        <button
          className="relative rounded-full p-2 text-muted-foreground hover:bg-accent hover:text-foreground cursor-pointer transition-colors"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-app-secondary-green" />
        </button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 outline-none cursor-pointer rounded-full p-0.5 hover:ring-2 hover:ring-app-border">
              <Avatar className="h-9 w-9">
                <AvatarImage src={userAvatar} alt={userName} />
                <AvatarFallback>{getInitials(userName)}</AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
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
