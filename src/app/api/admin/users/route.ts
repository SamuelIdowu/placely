// src/app/api/admin/users/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/infrastructure/db/prisma.client';

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q')?.trim() || '';

  const whereClause = q
    ? {
        OR: [
          { email: { contains: q, mode: 'insensitive' as const } },
          { student: { university: { contains: q, mode: 'insensitive' as const } } },
          { employer: { companyName: { contains: q, mode: 'insensitive' as const } } },
        ],
      }
    : {};

  const users = await prisma.user.findMany({
    where: whereClause,
    include: {
      student: {
        select: {
          id: true,
          university: true,
          discipline: true,
          verificationStatus: true,
          resumeUrl: true,
        },
      },
      employer: {
        select: {
          id: true,
          companyName: true,
          cacNumber: true,
          verificationStatus: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
    take: 50,
  });

  return NextResponse.json({ users });
}
