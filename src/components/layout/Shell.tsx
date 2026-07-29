"use client";

import React, { useState } from "react";
import { Header } from "./Header";
import { FloatingNavRail } from "./FloatingNavRail";
import { BottomNav } from "./BottomNav";
import { cn } from "@/lib/utils";

export interface ShellProps {
  children: React.ReactNode;
  role: "STUDENT" | "EMPLOYER" | "ADMIN";
  userEmail?: string;
  userName?: string;
  userAvatar?: string;
}

export function Shell({
  children,
  role,
  userEmail,
  userName,
  userAvatar,
}: ShellProps) {
  const [isCollapsed, setIsCollapsed] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("placely_sidebar_collapsed");
      return saved === "true";
    }
    return false;
  });

  const handleToggle = () => {
    const nextState = !isCollapsed;
    setIsCollapsed(nextState);
    localStorage.setItem("placely_sidebar_collapsed", String(nextState));
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-indigo-500 selection:text-white">
      <Header
        userRole={role}
        userEmail={userEmail}
        userName={userName}
        userAvatar={userAvatar}
      />
      <div className="flex flex-1 relative">
        <FloatingNavRail
          role={role}
          isCollapsed={isCollapsed}
          onToggleCollapse={handleToggle}
        />
        <main
          className={cn(
            "flex-1 p-4 md:p-8 pb-20 md:pb-8 max-w-7xl mx-auto w-full transition-all duration-300 ease-in-out",
            isCollapsed ? "md:pl-24" : "md:pl-68"
          )}
        >
          {children}
        </main>
      </div>
      <BottomNav role={role} />
    </div>
  );
}
