# Placely Component Library (`src/components/ui/`)

> Built directly on **Radix UI primitives** styled with **Tailwind CSS v4**.

---

## Component Index & Usage Reference

### 1. Button (`button.tsx`)
Supports dual design system variants (`default`, `landing`, `landingOutline`, `secondary`, `outline`, `ghost`, `destructive`, `link`).
```tsx
import { Button } from "@/components/ui/button";

// App Black Button
<Button variant="default">Save Changes</Button>

// Landing Indigo Button (Sharp 0px)
<Button variant="landing" size="lg">Explore Placements</Button>

// Emerald Secondary Button
<Button variant="secondary">Approve Applicant</Button>
```

### 2. Input (`input.tsx`)
```tsx
import { Input } from "@/components/ui/input";

<Input placeholder="Enter your email" type="email" />
```

### 3. Label (`label.tsx`)
```tsx
import { Label } from "@/components/ui/label";

<Label htmlFor="email">Email Address</Label>
```

### 4. Card (`card.tsx`)
```tsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";

// App Soft Card
<Card variant="default">
  <CardHeader>
    <CardTitle>Application Overview</CardTitle>
    <CardDescription>Track status</CardDescription>
  </CardHeader>
</Card>
```

### 5. Badge (`badge.tsx`)
```tsx
import { Badge } from "@/components/ui/badge";

<Badge variant="accepted">Accepted</Badge>
<Badge variant="pending">Pending</Badge>
```

### 6. Avatar (`avatar.tsx`)
```tsx
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

<Avatar>
  <AvatarImage src="/user.png" alt="User" />
  <AvatarFallback>UN</AvatarFallback>
</Avatar>
```

### 7. Dialog (`dialog.tsx`)
```tsx
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

<Dialog>
  <DialogTrigger>Open Modal</DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Confirm Action</DialogTitle>
    </DialogHeader>
  </DialogContent>
</Dialog>
```

### 8. Select (`select.tsx`)
```tsx
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

<Select>
  <SelectTrigger><SelectValue placeholder="Select discipline" /></SelectTrigger>
  <SelectContent>
    <SelectItem value="mechanical">Mechanical Engineering</SelectItem>
  </SelectContent>
</Select>
```

### 9. Checkbox (`checkbox.tsx`)
```tsx
import { Checkbox } from "@/components/ui/checkbox";

<Checkbox id="terms" />
```

### 10. RadioGroup (`radio-group.tsx`)
```tsx
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

<RadioGroup defaultValue="student">
  <RadioGroupItem value="student" id="r1" />
  <RadioGroupItem value="employer" id="r2" />
</RadioGroup>
```

### 11. Toast (`toast.tsx`)
```tsx
import { ToastProvider, ToastViewport, Toast, ToastTitle } from "@/components/ui/toast";
```

### 12. Separator (`separator.tsx`)
```tsx
import { Separator } from "@/components/ui/separator";

<Separator orientation="horizontal" />
```

### 13. Tabs (`tabs.tsx`)
```tsx
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

<Tabs defaultValue="overview">
  <TabsList>
    <TabsTrigger value="overview">Overview</TabsTrigger>
  </TabsList>
  <TabsContent value="overview">Content</TabsContent>
</Tabs>
```

### 14. DropdownMenu (`dropdown-menu.tsx`)
```tsx
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
```

### 15. ScrollArea (`scroll-area.tsx`)
```tsx
import { ScrollArea } from "@/components/ui/scroll-area";

<ScrollArea className="h-72">Content</ScrollArea>
```

### 16. Progress (`progress.tsx`)
```tsx
import { Progress } from "@/components/ui/progress";

<Progress value={60} />
```

### 17. AlertDialog (`alert-dialog.tsx`)
```tsx
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogAction, AlertDialogCancel } from "@/components/ui/alert-dialog";
```
