// src/app/api/applications/[id]/messages/route.ts
import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getThreadUseCase, sendMessageUseCase } from '@/lib/container';

export const dynamic = 'force-dynamic';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: applicationId } = await params;

    const result = await getThreadUseCase.execute({
      applicationId,
      userId: session.user.id,
    });

    const formattedMessages = result.messages.map((m) => m.toObject());

    const response = NextResponse.json({
      messages: formattedMessages,
      isLocked: result.isLocked,
      status: result.status,
    });

    // Ensure no caching for polling endpoint
    response.headers.set('Cache-Control', 'no-store, max-age=0, must-revalidate');

    return response;
  } catch (error: unknown) {
    const err = error as { name?: string; message?: string };
    if (err.name === 'ForbiddenError') {
      return NextResponse.json({ error: err.message }, { status: 403 });
    }
    if (err.name === 'NotFoundError') {
      return NextResponse.json({ error: err.message }, { status: 404 });
    }
    console.error('Error fetching message thread:', error);
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: applicationId } = await params;
    const body = await req.json();

    if (!body?.body) {
      return NextResponse.json({ error: 'Message body is required' }, { status: 400 });
    }

    const created = await sendMessageUseCase.execute({
      applicationId,
      senderUserId: session.user.id,
      body: body.body,
    });

    return NextResponse.json({ message: created.toObject() }, { status: 201 });
  } catch (error: unknown) {
    const err = error as { name?: string; message?: string };
    if (err.name === 'ForbiddenError') {
      return NextResponse.json({ error: err.message }, { status: 403 });
    }
    if (err.name === 'NotFoundError') {
      return NextResponse.json({ error: err.message }, { status: 404 });
    }
    console.error('Error sending message:', error);
    return NextResponse.json({ error: err.message || 'Failed to send message' }, { status: 500 });
  }
}
