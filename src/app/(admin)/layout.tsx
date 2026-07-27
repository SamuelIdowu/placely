import * as React from "react";
import { Shell } from "@/components/layout/Shell";
import { auth } from "@/lib/auth";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <Shell
      role="ADMIN"
      userEmail={session?.user?.email ?? ""}
      userName={session?.user?.name ?? "Administrator"}
    >
      {children}
    </Shell>
  );
}
