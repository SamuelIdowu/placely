# Placely Design System & Component Library (`src/components/ui/`)

> Built directly on **Radix UI primitives**, typed tokens in `src/lib/design-system/tokens.ts`, and styled with **Tailwind CSS v4**.

---

## 🎨 Design Tokens & Principles

- **Primary Colors:** `--primary` (Midnight Black `#17171c`), `--brand-indigo` (`#4f46e5`), `--background` (`#ffffff`), `--card` (`#ffffff`).
- **Typography:** DM Serif Display (`--font-serif`) for editorial headings, Inter (`--font-sans`) for crisp UI and body text, Space Grotesk (`--font-display`) for badges and labels.
- **Radii:** `rounded-card` (1.375rem / 22px) for main container cards, `rounded-pill` (full) for primary CTA buttons, `rounded-md` for inputs/menus.
- **Semantic Statuses:** Use `StatusBadge` or `statusTokens` for application and listing states (`applied`, `shortlisted`, `offered`, `accepted`, `declined`, `rejected`, `pending`, `draft`).

---

## 📦 Component Index & Usage Recipes

### 1. PageHeader (`page-header.tsx`)
Standardized header for all views (supports breadcrumbs, title, description, badge, actions, and back link).
```tsx
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

<PageHeader
  title="Placements & Openings"
  description="Manage verified SIWES openings for engineering candidates."
  breadcrumbs={[
    { label: "Employer", href: "/employer/dashboard" },
    { label: "Listings" },
  ]}
  actions={
    <Button variant="indigo">
      <Plus className="w-4 h-4" /> Post New Listing
    </Button>
  }
/>
```

### 2. StatCard (`stat-card.tsx`)
Standardized metric/KPI card.
```tsx
import { StatCard } from "@/components/ui/stat-card";
import { Users } from "lucide-react";

<StatCard
  title="Active Candidates"
  value="1,420"
  delta={{ value: "+18.4%", isPositive: true, label: "vs last month" }}
  icon={<Users className="w-5 h-5" />}
/>
```

### 3. Card (`card.tsx`)
Container primitive with `default`, `interactive`, `subtle`, `dark`, and `flat` variants.
```tsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";

// Interactive clickable card
<Card variant="interactive">
  <CardHeader>
    <CardTitle>Mechanical Engineering Track</CardTitle>
    <CardDescription>32 Verified Openings</CardDescription>
  </CardHeader>
  <CardContent>
    ...
  </CardContent>
</Card>
```

### 4. Button (`button.tsx`)
Supports `default` (black pill), `indigo` (brand pill), `secondary`, `outline`, `ghost`, `destructive`, `link`, `accent`.
```tsx
import { Button } from "@/components/ui/button";

<Button variant="default">Save Draft</Button>
<Button variant="indigo">Apply Now</Button>
<Button variant="outline">Learn More</Button>
<Button variant="accent">Download Letter</Button>
```

### 5. EmptyState (`empty-state.tsx`)
Standardized no-data container.
```tsx
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import { Briefcase } from "lucide-react";

<EmptyState
  icon={Briefcase}
  title="No Placements Saved Yet"
  description="Bookmark opportunities you find interesting to track deadlines and application status."
  action={<Button variant="indigo">Browse Openings</Button>}
/>
```

### 6. FormGroup (`form-group.tsx`)
Form control layout wrapper with label, helper text, and error validation.
```tsx
import { FormGroup } from "@/components/ui/form-group";
import { Input } from "@/components/ui/input";

<FormGroup
  id="companyName"
  label="Company Name"
  required
  error={errors.companyName?.message}
>
  <Input id="companyName" placeholder="e.g. Dangote Group" />
</FormGroup>
```

### 7. Badge & StatusBadge (`badge.tsx` / `StatusBadge.tsx`)
```tsx
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/shared/StatusBadge";

<StatusBadge status="SHORTLISTED" />
<Badge variant="outline">6 Months</Badge>
```

---

## ⚡ How to Build a New Page with Design Consistency

1. Wrap the page content in the standard layout (`Shell` or `Container`).
2. Insert `PageHeader` at the top.
3. Use a 2/3/4-column responsive grid (`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5`).
4. Place `StatCard`, `Card`, or `EmptyState` primitives inside.
5. Use design token colors (`text-foreground`, `text-body-muted`, `bg-card`, `border-border`, `bg-brand-indigo`). Never write arbitrary slate classes or custom hex values.
