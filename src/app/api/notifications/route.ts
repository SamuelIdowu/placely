// src/app/api/notifications/route.ts

import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getUserNotificationsUseCase, markNotificationReadUseCase } from '@/lib/container';

export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ notifications: [], unreadCount: 0 });
  }

  const result = await getUserNotificationsUseCase.execute(session.user.id);
  return NextResponse.json(result);
}

export async function PATCH(req: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { notificationId } = await req.json();
    if (!notificationId) {
      return NextResponse.json({ error: 'notificationId is required' }, { status: 400 });
    }

    await markNotificationReadUseCase.execute(notificationId, session.user.id);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[PATCH /api/notifications] error:', err);
    return NextResponse.json({ error: 'Failed to update notification' }, { status: 500 });
  }
}
