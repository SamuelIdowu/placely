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
    <div className="min-h-screen flex flex-col bg-white text-[#212121] font-sans selection:bg-indigo-500 selection:text-white overflow-x-hidden w-full">
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
            "flex-1 p-4 md:p-6 pb-20 md:pb-8 w-full max-w-full overflow-x-hidden transition-all duration-300 ease-in-out",
            isCollapsed ? "lg:pl-24" : "lg:pl-68"
          )}
        >
          <div className="max-w-7xl mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
      <BottomNav role={role} />
    </div>
  );
}
