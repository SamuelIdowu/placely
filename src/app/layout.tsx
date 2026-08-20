import type { Metadata } from "next";
import { DM_Serif_Display, Inter, Space_Grotesk } from "next/font/google";
import { ToastProvider } from "@/components/providers/ToastProvider";
import "./globals.css";

const dmSerifDisplay = DM_Serif_Display({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-dm-serif",
});

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-space-grotesk",
});

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
    <html lang="en" className={`${dmSerifDisplay.variable} ${inter.variable} ${spaceGrotesk.variable} h-full antialiased font-sans`}>
      <body className="min-h-full flex flex-col font-sans bg-background text-foreground">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[100] focus:bg-primary focus:text-primary-foreground focus:px-4 focus:py-2 text-xs font-bold uppercase rounded-full shadow-lg"
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

