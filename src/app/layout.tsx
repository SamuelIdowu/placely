import type { Metadata } from "next";
import { ToastProvider } from "@/components/providers/ToastProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Placely — SIWES Placement Marketplace for Nigerian Engineering Students",
  description:
    "Connect Nigerian engineering students with verified employer placements for SIWES internship programs.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col font-sans bg-background text-foreground">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[100] focus:bg-black focus:text-white focus:px-4 focus:py-2 text-xs font-bold uppercase rounded-[4px] shadow-lg"
        >
          Skip to main content
        </a>
        <ToastProvider>
          <div id="main-content" className="flex-1 flex flex-col">
            {children}
          </div>
        </ToastProvider>
      </body>
    </html>
  );
}
