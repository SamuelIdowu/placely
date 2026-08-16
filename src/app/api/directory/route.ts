// src/app/api/directory/route.ts
import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import {
  searchCompanyDirectoryUseCase,
  importCompanyDirectoryUseCase,
} from '@/lib/container';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || undefined;
    const university = searchParams.get('university') || undefined;
    const industry = searchParams.get('industry') || undefined;
    const location = searchParams.get('location') || undefined;
    const limit = searchParams.get('limit') ? Number(searchParams.get('limit')) : 24;
    const offset = searchParams.get('offset') ? Number(searchParams.get('offset')) : 0;

    const result = await searchCompanyDirectoryUseCase.execute({
      search,
      university,
      industry,
      location,
      limit,
      offset,
    });

    return NextResponse.json({
      companies: result.companies.map((c) => c.toObject()),
      total: result.total,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to search company directory';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized: Admin role required to import directory items' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const result = await importCompanyDirectoryUseCase.execute({
      companies: body.companies,
      defaultUniversity: body.defaultUniversity,
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to import directory items';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
