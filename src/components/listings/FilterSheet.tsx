'use client';

import * as React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Filter } from 'lucide-react';
import { FilterControls } from './FilterSidebar';

export function FilterSheet() {
  const [open, setOpen] = React.useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="md:hidden">
          <Filter className="w-4 h-4 mr-2" />
          Filter Listings
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md max-h-[85vh] overflow-y-auto p-6">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-lg font-semibold text-foreground">Search & Filters</DialogTitle>
        </DialogHeader>
        <FilterControls />
      </DialogContent>
    </Dialog>
  );
}
