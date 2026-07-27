import * as React from "react";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { AdminSidebar } from "@/components/layout/AdminSidebar";
import { BottomNav } from "@/components/layout/BottomNav";

export default async function AdminConsoleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session || session.user.role !== "ADMIN") {
    redirect("/");
  }

  return (
    <div className="min-h-screen flex flex-col bg-app-bg text-app-fg font-sans">
      <Header
        userRole="ADMIN"
        userEmail={session.user.email ?? ""}
        userName={session.user.name ?? "Administrator"}
      />
      <div className="flex flex-1">
        <AdminSidebar />
        <main className="flex-1 p-4 md:p-8 pb-20 md:pb-8 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
      <BottomNav role="ADMIN" />
    </div>
  );
}
