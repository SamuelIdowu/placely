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
  const [isCollapsed, setIsCollapsed] = useState(false);

  React.useEffect(() => {
    const saved = localStorage.getItem("placely_sidebar_collapsed");
    if (saved === "true") {
      setIsCollapsed(true);
    }
  }, []);

  const handleToggle = () => {
    const nextState = !isCollapsed;
    setIsCollapsed(nextState);
    localStorage.setItem("placely_sidebar_collapsed", String(nextState));
  };

  return (
    <div className="min-h-dvh flex flex-col bg-background text-foreground font-sans selection:bg-brand-indigo selection:text-white overflow-x-hidden w-full">
      <Header
        userRole={role}
        userEmail={userEmail}
        userName={userName}
        userAvatar={userAvatar}
      />
      <div className="flex flex-1 relative w-full overflow-x-hidden">
        <FloatingNavRail
          role={role}
          isCollapsed={isCollapsed}
          onToggleCollapse={handleToggle}
        />
        <main
          className={cn(
            "flex-1 px-4 sm:px-6 lg:pr-8 pt-2 pb-20 md:pb-10 w-full max-w-full overflow-x-hidden transition-all duration-200 ease-out",
            isCollapsed ? "lg:pl-28" : "lg:pl-[296px]"
          )}
        >
          <div className="w-full max-w-6xl">
            {children}
          </div>
        </main>
      </div>
      <BottomNav role={role} />
    </div>
  );
}
