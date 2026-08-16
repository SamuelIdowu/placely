// src/app/api/employer/claim/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/infrastructure/db/prisma.client';
import { claimCompanyProfileUseCase } from '@/lib/container';
import bcrypt from 'bcryptjs';
import { createId } from '@paralleldrive/cuid2';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json({ error: 'Token parameter is required' }, { status: 400 });
    }

    const details = await claimCompanyProfileUseCase.getClaimDetails(token);
    return NextResponse.json(details, { status: 200 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Invalid claim token';
    return NextResponse.json({ error: message }, { status: 404 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { token, email, password, companyName, cacNumber, action } = body;

    if (!token || !email || !password || !companyName) {
      return NextResponse.json({ error: 'Token, email, password, and company name are required' }, { status: 400 });
    }

    const claimDetails = await claimCompanyProfileUseCase.getClaimDetails(token);

    // Check if user with this email already exists or create new user
    let user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      const passwordHash = await bcrypt.hash(password, 10);
      user = await prisma.user.create({
        data: {
          id: createId(),
          email,
          passwordHash,
          role: 'EMPLOYER',
        },
      });
    }

    // Check or create employer profile
    let employerProfile = await prisma.employerProfile.findUnique({
      where: { userId: user.id },
    });

    if (!employerProfile) {
      employerProfile = await prisma.employerProfile.create({
        data: {
          id: createId(),
          userId: user.id,
          companyName,
          cacNumber: cacNumber || 'PENDING_VERIFICATION',
          verificationStatus: 'VERIFIED',
        },
      });
    }

    // Action the claim on the application and listing
    await claimCompanyProfileUseCase.actionClaim({
      claimToken: token,
      employerProfileId: employerProfile.id,
      action: action === 'ACCEPT' ? 'ACCEPT' : 'SHORTLIST',
    });

    return NextResponse.json({
      success: true,
      message: 'Company profile successfully claimed and student application updated!',
      userId: user.id,
      employerProfileId: employerProfile.id,
    }, { status: 200 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to claim employer profile';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
