"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  Layers,
  Palette,
  Type,
  Layout,
  CheckCircle2,
  Users,
  Briefcase,
  TrendingUp,
  Bookmark,
  Plus,
  ArrowRight,
  ShieldCheck,
  Search,
  SlidersHorizontal,
  Code2,
  Copy,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { PageHeader } from "@/components/ui/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { EmptyState } from "@/components/ui/empty-state";
import { FormGroup } from "@/components/ui/form-group";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { OpportunityCard } from "@/components/shared/OpportunityCard";
import { ListingCard } from "@/components/listings/ListingCard";
import { statusTokens, type ApplicationStatusKey } from "@/lib/tokens";

export default function DesignSystemPage() {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [cardDensity, setCardDensity] = useState<"default" | "compact">("default");
  const [bookmarkedOpp, setBookmarkedOpp] = useState(true);

  const copySnippet = (name: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(name);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const sampleListing = {
    id: "sample-ds-1",
    title: "Lead Structural Engineer Intern (SIWES)",
    employerId: "emp-1",
    companyName: "Julius Berger Nigeria Plc",
    location: "Abuja (FCT)",
    state: "FCT",
    discipline: "Civil Engineering",
    disciplines: ["Civil Engineering", "Structural Design", "AutoCAD"],
    description:
      "Join our bridge infrastructure engineering team for a hands-on 6-month industrial training program working on federal highway structures.",
    stipendMin: 75000,
    stipendMax: 95000,
    isStipendDisclosed: true,
    isRemote: false,
    durationMonths: 6,
    status: "ACTIVE" as const,
    sourceType: "DIRECT" as const,
    companyVerificationStatus: "VERIFIED" as const,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  return (
    <div className="space-y-10 pb-16">
      {/* ── Page Header ── */}
      <PageHeader
        title="Placely Centralized Design System"
        description="Authoritative source of truth for visual tokens, UI primitives, layouts, and component patterns across all Placely applications."
        badge={
          <Badge variant="outline" className="bg-brand-indigo-light text-brand-indigo border-indigo-200">
            <Sparkles className="w-3 h-3 mr-1" /> v1.0 Production
          </Badge>
        }
        breadcrumbs={[
          { label: "Admin Console", href: "/admin/dashboard" },
          { label: "Design System & UI Catalog" },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                copySnippet(
                  "import-all",
                  `import { Button } from "@/components/ui/button";\nimport { Card } from "@/components/ui/card";\nimport { PageHeader } from "@/components/ui/page-header";\nimport { StatCard } from "@/components/ui/stat-card";`
                )
              }
            >
              {copiedSection === "import-all" ? (
                <Check className="w-3.5 h-3.5 text-emerald-600" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
              Copy Core Imports
            </Button>
            <Link href="/listings">
              <Button variant="indigo" size="sm">
                Explore Live App <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>
        }
      />

      {/* ── Tabs Navigation for Sandbox ── */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid grid-cols-2 sm:grid-cols-5 w-full max-w-2xl bg-muted p-1 rounded-xl">
          <TabsTrigger value="overview" className="rounded-lg text-xs font-semibold">Overview</TabsTrigger>
          <TabsTrigger value="tokens" className="rounded-lg text-xs font-semibold">Tokens &amp; Color</TabsTrigger>
          <TabsTrigger value="primitives" className="rounded-lg text-xs font-semibold">UI Primitives</TabsTrigger>
          <TabsTrigger value="domain" className="rounded-lg text-xs font-semibold">Domain Cards</TabsTrigger>
          <TabsTrigger value="recipes" className="rounded-lg text-xs font-semibold">Page Recipes</TabsTrigger>
        </TabsList>

        {/* ────────────────────────────────────────────────────────────────
            TAB 1: OVERVIEW & KEY PRINCIPLES
        ──────────────────────────────────────────────────────────────── */}
        <TabsContent value="overview" className="space-y-8 pt-6">
          {/* Quick Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Design Tokens"
              value="48+"
              delta={{ value: "Authoritative", isPositive: true, label: "Zero CSS drift" }}
              icon={<Palette className="w-5 h-5" />}
            />
            <StatCard
              title="UI Primitives"
              value="18"
              delta={{ value: "Radix UI", isPositive: true, label: "Accessible" }}
              icon={<Layers className="w-5 h-5" />}
              iconBgColor="bg-blue-50"
              iconColor="text-blue-600"
            />
            <StatCard
              title="Typography Scale"
              value="3 Fonts"
              description="DM Serif • Inter • Space Grotesk"
              icon={<Type className="w-5 h-5" />}
              iconBgColor="bg-purple-50"
              iconColor="text-purple-600"
            />
            <StatCard
              title="Theme Architecture"
              value="Unified"
              description="Tailwind v4 @theme custom variables"
              icon={<Layout className="w-5 h-5" />}
              iconBgColor="bg-emerald-50"
              iconColor="text-emerald-600"
            />
          </div>

          {/* Golden Rules Card */}
          <Card variant="subtle" className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <ShieldCheck className="w-5 h-5 text-brand-indigo" />
              <h2 className="text-lg font-bold text-foreground">The 4 Golden Rules of Placely Design</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
              <div className="bg-white p-4 rounded-xl border border-border space-y-1">
                <p className="font-bold text-foreground">1. Never hardcode arbitrary slate or hex colors</p>
                <p className="text-body-muted leading-relaxed">
                  Always consume semantic tokens: <code className="text-brand-indigo font-mono bg-indigo-50 px-1 rounded">bg-card</code>, <code className="text-brand-indigo font-mono bg-indigo-50 px-1 rounded">text-body-muted</code>, <code className="text-brand-indigo font-mono bg-indigo-50 px-1 rounded">border-border</code>.
                </p>
              </div>
              <div className="bg-white p-4 rounded-xl border border-border space-y-1">
                <p className="font-bold text-foreground">2. Use tokenized container radii</p>
                <p className="text-body-muted leading-relaxed">
                  Use <code className="text-brand-indigo font-mono bg-indigo-50 px-1 rounded">rounded-card</code> (1.375rem) for card containers and <code className="text-brand-indigo font-mono bg-indigo-50 px-1 rounded">rounded-full</code> for action buttons.
                </p>
              </div>
              <div className="bg-white p-4 rounded-xl border border-border space-y-1">
                <p className="font-bold text-foreground">3. Compose with PageHeader &amp; Primitives</p>
                <p className="text-body-muted leading-relaxed">
                  Never manually write one-off page headers. Always use <code className="text-brand-indigo font-mono bg-indigo-50 px-1 rounded">&lt;PageHeader /&gt;</code> for consistent layout and breadcrumbs.
                </p>
              </div>
              <div className="bg-white p-4 rounded-xl border border-border space-y-1">
                <p className="font-bold text-foreground">4. Strict Clean Architecture Separation</p>
                <p className="text-body-muted leading-relaxed">
                  UI components and design tokens remain strictly within <code className="text-brand-indigo font-mono bg-indigo-50 px-1 rounded">src/components/</code> and <code className="text-brand-indigo font-mono bg-indigo-50 px-1 rounded">src/lib/design-system/</code>. Zero UI leakage into domain entities.
                </p>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* ────────────────────────────────────────────────────────────────
            TAB 2: DESIGN TOKENS & COLOR PALETTE
        ──────────────────────────────────────────────────────────────── */}
        <TabsContent value="tokens" className="space-y-8 pt-6">
          {/* Brand & Surface Colors */}
          <div className="space-y-4">
            <h2 className="text-base font-bold text-foreground flex items-center gap-2">
              <Palette className="w-4 h-4 text-brand-indigo" /> Brand &amp; Core Surfaces
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
              {[
                { name: "Primary Black", var: "--primary", hex: "#17171c", text: "text-white" },
                { name: "Brand Indigo", var: "--brand-indigo", hex: "#4f46e5", text: "text-white" },
                { name: "Indigo Light", var: "--brand-indigo-light", hex: "#eef2ff", text: "text-brand-indigo" },
                { name: "Background", var: "--background", hex: "#ffffff", text: "text-foreground", border: true },
                { name: "Card Surface", var: "--card", hex: "#ffffff", text: "text-foreground", border: true },
                { name: "Dark Surface", var: "--surface-dark", hex: "#17171c", text: "text-white" },
              ].map((swatch) => (
                <div
                  key={swatch.name}
                  className="rounded-xl border border-border p-3 flex flex-col justify-between h-28 shadow-none"
                  style={{ backgroundColor: swatch.hex }}
                >
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${swatch.text}`}>
                    {swatch.name}
                  </span>
                  <div className={swatch.text}>
                    <p className="text-xs font-mono font-bold">{swatch.hex}</p>
                    <p className="text-[10px] opacity-75 font-mono">{swatch.var}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Application Status Tokens */}
          <div className="space-y-4">
            <h2 className="text-base font-bold text-foreground">Application Status Tokens</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {(Object.keys(statusTokens) as ApplicationStatusKey[]).map((key) => {
                const token = statusTokens[key];
                return (
                  <div
                    key={key}
                    className="p-3.5 rounded-xl border flex items-center justify-between"
                    style={{
                      backgroundColor: token.bg,
                      borderColor: token.border,
                      color: token.fg,
                    }}
                  >
                    <div>
                      <p className="text-xs font-bold">{token.label}</p>
                      <p className="text-[10px] opacity-80 font-mono mt-0.5">{key}</p>
                    </div>
                    <StatusBadge status={key} />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Typography Scale */}
          <div className="space-y-4">
            <h2 className="text-base font-bold text-foreground flex items-center gap-2">
              <Type className="w-4 h-4 text-brand-indigo" /> Typography Hierarchy
            </h2>
            <Card className="p-6 space-y-6">
              <div className="space-y-1 pb-4 border-b border-border">
                <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                  Serif Editorial Headline (DM Serif Display)
                </span>
                <p className="font-serif text-3xl sm:text-4xl text-foreground font-normal">
                  Verified industrial placements. Zero hustle.
                </p>
              </div>

              <div className="space-y-1 pb-4 border-b border-border">
                <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                  Sans UI Title / Section Heading (Inter Bold)
                </span>
                <p className="font-sans text-xl sm:text-2xl font-bold text-foreground">
                  Engineering Disciplines &amp; Placement Tracks
                </p>
              </div>

              <div className="space-y-1 pb-4 border-b border-border">
                <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                  Sans Body Text (Inter Regular / text-body-muted)
                </span>
                <p className="text-sm sm:text-base text-body-muted leading-relaxed max-w-3xl">
                  Connecting ambitious Nigerian engineering undergraduates with verified corporate employers for 3- to 6-month SIWES attachments with transparent monthly stipends and institutional validation.
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                  Display / Badge Tag (Space Grotesk)
                </span>
                <p className="font-display text-sm font-bold tracking-wide text-brand-indigo uppercase">
                  SIWES 2026 VERIFICATION COHORT
                </p>
              </div>
            </Card>
          </div>
        </TabsContent>

        {/* ────────────────────────────────────────────────────────────────
            TAB 3: UI PRIMITIVES & SANDBOX
        ──────────────────────────────────────────────────────────────── */}
        <TabsContent value="primitives" className="space-y-8 pt-6">
          {/* Buttons Matrix */}
          <div className="space-y-4">
            <h2 className="text-base font-bold text-foreground">Button Matrix &amp; Variants</h2>
            <Card className="p-6 space-y-6">
              <div className="space-y-2">
                <p className="text-xs font-semibold text-muted-foreground">Primary &amp; Brand Variants</p>
                <div className="flex flex-wrap items-center gap-3">
                  <Button variant="default">Default Primary</Button>
                  <Button variant="indigo">Brand Indigo</Button>
                  <Button variant="accent">Accent Light</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="outline">Outline</Button>
                  <Button variant="ghost">Ghost</Button>
                  <Button variant="destructive">Destructive</Button>
                  <Button variant="link">Link Style</Button>
                </div>
              </div>

              <div className="space-y-2 pt-4 border-t border-border">
                <p className="text-xs font-semibold text-muted-foreground">Size Scale</p>
                <div className="flex flex-wrap items-center gap-3">
                  <Button variant="indigo" size="xs">XS Button</Button>
                  <Button variant="indigo" size="sm">Small (sm)</Button>
                  <Button variant="indigo" size="default">Default</Button>
                  <Button variant="indigo" size="lg">Large (lg)</Button>
                </div>
              </div>
            </Card>
          </div>

          {/* Cards & Density Sandbox */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-foreground">Card Variants &amp; Density Sandbox</h2>
              <div className="flex items-center gap-1.5 bg-muted p-1 rounded-full">
                <button
                  type="button"
                  onClick={() => setCardDensity("default")}
                  className={`px-3 py-1 text-xs font-semibold rounded-full transition-all ${
                    cardDensity === "default" ? "bg-white text-foreground shadow-xs" : "text-muted-foreground"
                  }`}
                >
                  Standard Density
                </button>
                <button
                  type="button"
                  onClick={() => setCardDensity("compact")}
                  className={`px-3 py-1 text-xs font-semibold rounded-full transition-all ${
                    cardDensity === "compact" ? "bg-white text-foreground shadow-xs" : "text-muted-foreground"
                  }`}
                >
                  Compact Density
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card variant="default" density={cardDensity}>
                <CardHeader>
                  <CardTitle>Default Surface Card</CardTitle>
                  <CardDescription>Clean border with tokenized radius</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-body-muted">Used for static containers and general dashboard sections.</p>
                </CardContent>
              </Card>

              <Card variant="interactive" density={cardDensity}>
                <CardHeader>
                  <CardTitle>Interactive Card</CardTitle>
                  <CardDescription>Hover lift &amp; brand border transition</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-body-muted">Used for clickable placement cards, applications, and listings.</p>
                </CardContent>
              </Card>

              <Card variant="dark" density={cardDensity}>
                <CardHeader>
                  <CardTitle className="text-white">Dark Surface Bento</CardTitle>
                  <CardDescription className="text-surface-dark-muted">High contrast spotlight</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-surface-dark-muted">Used for dark mode highlights and executive summary cards.</p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Form Controls Sandbox */}
          <div className="space-y-4">
            <h2 className="text-base font-bold text-foreground">Form Controls &amp; FormGroup</h2>
            <Card className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <FormGroup id="demo-title" label="Placement Role Title" required helperText="Provide a clear, descriptive role name.">
                  <Input id="demo-title" placeholder="e.g. Electrical Control Intern" defaultValue="Substation Operations Intern" />
                </FormGroup>

                <FormGroup id="demo-disc" label="Engineering Track" required>
                  <Select defaultValue="electrical">
                    <SelectTrigger id="demo-disc">
                      <SelectValue placeholder="Select discipline" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="electrical">Electrical Engineering</SelectItem>
                      <SelectItem value="mechanical">Mechanical Engineering</SelectItem>
                      <SelectItem value="civil">Civil Engineering</SelectItem>
                    </SelectContent>
                  </Select>
                </FormGroup>

                <FormGroup id="demo-error" label="Institutional SIWES Code" required error="SIWES code must be in ITF-XXX-2026 format">
                  <Input id="demo-error" defaultValue="INVALID_CODE" className="border-destructive" />
                </FormGroup>
              </div>
            </Card>
          </div>

          {/* Empty State Primitive */}
          <div className="space-y-4">
            <h2 className="text-base font-bold text-foreground">Empty State Primitive</h2>
            <EmptyState
              icon={Briefcase}
              title="No Pending Applications Found"
              description="You have reviewed all student applications in this queue. New candidate submissions will appear here in real time."
              action={<Button variant="indigo">View Archived Records</Button>}
              secondaryAction={<Button variant="outline">Refresh Data</Button>}
            />
          </div>
        </TabsContent>

        {/* ────────────────────────────────────────────────────────────────
            TAB 4: DOMAIN CARDS & LIVE SAMPLES
        ──────────────────────────────────────────────────────────────── */}
        <TabsContent value="domain" className="space-y-8 pt-6">
          <div className="space-y-4">
            <h2 className="text-base font-bold text-foreground">Composite Domain Components</h2>
            <p className="text-xs text-body-muted">
              Live components consuming the centralized design tokens and primitives.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <p className="text-xs font-semibold text-muted-foreground mb-2">OpportunityCard (Student View)</p>
                <OpportunityCard
                  id="demo-opp-1"
                  title="Pipeline & Gas Turbines Intern"
                  companyName="NLNG Limited"
                  stipend="₦85,000/mo"
                  location="Bonny Island, Rivers"
                  discipline="Mechanical / Chemical"
                  duration="6 Months"
                  isRemote={false}
                  isBookmarked={bookmarkedOpp}
                  onBookmarkToggle={() => setBookmarkedOpp(!bookmarkedOpp)}
                />
              </div>

              <div>
                <p className="text-xs font-semibold text-muted-foreground mb-2">ListingCard (Marketplace Grid View)</p>
                <ListingCard listing={sampleListing as any} />
              </div>
            </div>

            <div className="pt-4">
              <p className="text-xs font-semibold text-muted-foreground mb-2">ListingCard (List View Mode)</p>
              <ListingCard listing={sampleListing as any} viewMode="list" />
            </div>
          </div>
        </TabsContent>

        {/* ────────────────────────────────────────────────────────────────
            TAB 5: PAGE RECIPES & BLUEPRINTS
        ──────────────────────────────────────────────────────────────── */}
        <TabsContent value="recipes" className="space-y-6 pt-6">
          <div className="space-y-2">
            <h2 className="text-base font-bold text-foreground">Page Scaffolding Blueprints</h2>
            <p className="text-xs text-body-muted">
              Copy-paste starter templates to create any new Placely page with 100% design consistency.
            </p>
          </div>

          <Card className="p-6 bg-surface-dark text-white space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Code2 className="w-4 h-4 text-brand-indigo" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Standard Dashboard Page Scaffold
                </span>
              </div>
              <Button
                variant="outline"
                size="xs"
                className="text-white border-surface-dark-border hover:bg-surface-dark-hover"
                onClick={() =>
                  copySnippet(
                    "recipe-dashboard",
                    `import { PageHeader } from "@/components/ui/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function MyNewPage() {
  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        title="Page Title"
        description="Clear purpose and explanation for this view."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Current Page" }]}
        actions={<Button variant="indigo">Primary Action</Button>}
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard title="Metric 1" value="240" />
        <StatCard title="Metric 2" value="98.5%" />
        <StatCard title="Metric 3" value="₦450k" />
      </div>

      <Card variant="default">
        <CardHeader>
          <CardTitle>Main Section</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-body-muted">Content goes here...</p>
        </CardContent>
      </Card>
    </div>
  );
}`
                  )
                }
              >
                {copiedSection === "recipe-dashboard" ? (
                  <Check className="w-3 h-3 text-emerald-400" />
                ) : (
                  <Copy className="w-3 h-3" />
                )}
                Copy Scaffold
              </Button>
            </div>

            <pre className="p-4 bg-black/40 rounded-xl overflow-x-auto text-xs font-mono text-emerald-400 leading-relaxed">
{`import { PageHeader } from "@/components/ui/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function MyNewPage() {
  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        title="Page Title"
        description="Clear purpose and explanation for this view."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Current Page" }]}
        actions={<Button variant="indigo">Primary Action</Button>}
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard title="Metric 1" value="240" />
        <StatCard title="Metric 2" value="98.5%" />
        <StatCard title="Metric 3" value="₦450k" />
      </div>

      <Card variant="default">
        <CardHeader>
          <CardTitle>Main Section</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-body-muted">Content goes here...</p>
        </CardContent>
      </Card>
    </div>
  );
}`}
            </pre>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
