import * as React from "react";
import { Shell } from "@/components/layout/Shell";
import { auth } from "@/lib/auth";

export default async function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <Shell
      role="STUDENT"
      userEmail={session?.user?.email ?? ""}
      userName={session?.user?.name ?? "Student Account"}
    >
      {children}
    </Shell>
  );
}
