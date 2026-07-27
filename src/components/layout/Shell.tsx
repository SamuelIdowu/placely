import * as React from "react";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { BottomNav } from "./BottomNav";

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
  return (
    <div className="min-h-screen flex flex-col bg-app-bg text-app-fg font-sans">
      <Header
        userRole={role}
        userEmail={userEmail}
        userName={userName}
        userAvatar={userAvatar}
      />
      <div className="flex flex-1">
        <Sidebar role={role} />
        <main className="flex-1 p-4 md:p-8 pb-20 md:pb-8 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
      <BottomNav role={role} />
    </div>
  );
}
