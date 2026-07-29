import * as React from "react";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Shell } from "@/components/layout/Shell";

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
    <Shell
      role="ADMIN"
      userEmail={session.user.email ?? ""}
      userName={session.user.name ?? "Administrator"}
    >
      {children}
    </Shell>
  );
}
