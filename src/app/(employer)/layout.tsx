import * as React from "react";
import { Shell } from "@/components/layout/Shell";
import { auth } from "@/lib/auth";

export default async function EmployerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <Shell
      role="EMPLOYER"
      userEmail={session?.user?.email ?? ""}
      userName={session?.user?.name ?? "Employer Account"}
    >
      {children}
    </Shell>
  );
}
