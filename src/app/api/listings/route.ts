// src/app/api/listings/route.ts
// GET /api/listings?discipline=&location=&keyword=&isRemote=&page=&pageSize= — public search & browse open listings

import { NextRequest, NextResponse } from 'next/server';
import { browseListingsUseCase } from '@/lib/container';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const discipline = searchParams.get('discipline') ?? undefined;
    const location = searchParams.get('location') ?? undefined;
    const keyword = searchParams.get('keyword') ?? undefined;
    const isRemoteParam = searchParams.get('isRemote');
    const isRemote = isRemoteParam === null ? undefined : isRemoteParam === 'true';
    const page = parseInt(searchParams.get('page') ?? '1', 10);
    const pageSize = parseInt(searchParams.get('pageSize') ?? '10', 10);

    const result = await browseListingsUseCase.execute({
      discipline,
      location,
      keyword,
      isRemote,
      page,
      pageSize,
    });

    return NextResponse.json({
      listings: result.listings,
      total: result.total,
      page,
      pageSize,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch listings';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
