import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { ShieldCheck, GraduationCap, Building2, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Placely — SIWES Placement Marketplace for Nigerian Engineering Students",
  description:
    "Verified SIWES placement opportunities for engineering students across Nigeria. Connect directly with vetted corporate employers.",
  openGraph: {
    title: "Placely — SIWES Placement Marketplace",
    description:
      "Connect Nigerian engineering students with verified corporate employers for SIWES internship programs.",
    type: "website",
  },
};

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-landing-bg text-landing-fg font-hanken">
      {/* Header */}
      <header className="border-b border-black py-4 px-6 md:px-12 flex items-center justify-between">
        <Link href="/" className="font-serif text-2xl font-bold tracking-tight text-black">
          Placely<span className="text-landing-primary">.ng</span>
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/sign-in">
            <Button variant="landingOutline" size="sm">
              Sign In
            </Button>
          </Link>
          <Link href="/sign-up">
            <Button variant="landing" size="sm">
              Get Started
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-6 md:px-12 max-w-6xl mx-auto w-full border-b border-black">
        <div className="max-w-3xl space-y-6">
          <div className="inline-block border border-black px-3 py-1 text-xs font-semibold uppercase tracking-widest bg-zinc-100">
            SIWES Placement Marketplace for Nigerian Engineering Students
          </div>
          <h1 className="font-serif text-5xl md:text-7xl font-normal leading-tight tracking-tight text-black">
            Verified industrial placements. Zero hustle.
          </h1>
          <p className="text-xl md:text-2xl text-zinc-700 leading-relaxed font-light">
            Connecting Nigerian engineering undergraduates with verified company internships for their 3 to 6-month SIWES requirements.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Link href="/sign-up">
              <Button variant="landing" size="lg" className="w-full sm:w-auto">
                Find Placement <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/sign-up?role=EMPLOYER">
              <Button variant="landingOutline" size="lg" className="w-full sm:w-auto">
                Post Internship
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="py-16 px-6 md:px-12 max-w-6xl mx-auto w-full grid grid-cols-1 md:grid-cols-3 gap-8">
        <Card variant="landing" className="bg-white p-2">
          <CardHeader>
            <GraduationCap className="h-8 w-8 text-landing-primary mb-2" />
            <CardTitle className="font-serif text-xl">For Engineering Students</CardTitle>
            <CardDescription className="text-zinc-600">
              Browse pre-screened placements matching your engineering discipline (Mechanical, Civil, Electrical, Software, Oil & Gas).
            </CardDescription>
          </CardHeader>
          <CardContent className="text-sm font-medium">
            100% verified placement letters & IT logbook approvals.
          </CardContent>
        </Card>

        <Card variant="landing" className="bg-white p-2">
          <CardHeader>
            <Building2 className="h-8 w-8 text-landing-primary mb-2" />
            <CardTitle className="font-serif text-xl">For Verified Employers</CardTitle>
            <CardDescription className="text-zinc-600">
              Access top engineering talent from top Nigerian universities with verified CGPAs and course tracks.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-sm font-medium">
            CAC verified employer profiles with automated applicant tracking.
          </CardContent>
        </Card>

        <Card variant="landing" className="bg-white p-2">
          <CardHeader>
            <ShieldCheck className="h-8 w-8 text-landing-primary mb-2" />
            <CardTitle className="font-serif text-xl">Verified Trust & Verification</CardTitle>
            <CardDescription className="text-zinc-600">
              Institutional validation ensures legitimate company listings and authentic student credentials.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-sm font-medium">
            Direct application messaging and instant status updates.
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-black py-8 px-6 md:px-12 text-sm text-zinc-600 flex flex-col sm:flex-row justify-between items-center gap-4">
        <p>© {new Date().getFullYear()} Placely.ng — Built for Nigerian Engineering Students.</p>
        <div className="flex gap-6">
          <Link href="/sign-in" className="hover:underline">Sign In</Link>
          <Link href="/sign-up" className="hover:underline">Register Account</Link>
        </div>
      </footer>
    </div>
  );
}
