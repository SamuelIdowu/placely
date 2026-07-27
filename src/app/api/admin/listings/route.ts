// src/app/api/admin/listings/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { listingRepo } from '@/lib/container';

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const isModeratedParam = searchParams.get('isModerated');
  const statusParam = searchParams.get('status') as 'OPEN' | 'CLOSED' | null;

  const filters: { isModerated?: boolean; status?: 'OPEN' | 'CLOSED' } = {};
  if (isModeratedParam !== null) {
    filters.isModerated = isModeratedParam === 'true';
  }
  if (statusParam) {
    filters.status = statusParam;
  }

  const listings = await listingRepo.findAllForAdmin(filters);
  return NextResponse.json({ listings });
}
