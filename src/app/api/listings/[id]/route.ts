// src/app/api/listings/[id]/route.ts
// GET /api/listings/[id] — public listing detail with employer verification info

import { NextRequest, NextResponse } from 'next/server';
import { listingRepo } from '@/lib/container';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const listing = await listingRepo.findDetailsById(id);

    if (!listing || listing.isModerated || listing.status !== 'OPEN') {
      return NextResponse.json({ error: 'Listing not found' }, { status: 404 });
    }

    return NextResponse.json({ listing });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch listing detail';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
