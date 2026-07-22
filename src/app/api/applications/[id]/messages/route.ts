// app/api/applications/[id]/messages/route.ts
// GET  — list messages for an application thread
// POST — send a message

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { sendMessageUseCase, messageRepo } from '@/lib/container';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const messages = await messageRepo.findByApplicationId(id);
  return NextResponse.json({ messages: messages.map((m: any) => m.toObject()) });
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { body } = await req.json();
  if (!body?.trim()) {
    return NextResponse.json({ error: 'Message body required' }, { status: 400 });
  }

  const result = await sendMessageUseCase.execute({
    applicationId: id,
    senderId: session.user.id,
    body,
  });

  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 422 });
  }

  return NextResponse.json({ messageId: result.messageId }, { status: 201 });
}
