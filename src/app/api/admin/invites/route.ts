import { randomBytes } from 'crypto';
import { NextResponse } from 'next/server';
import { validateAdminSession } from '@/lib/auth';
import { getAllInvites, createInvite, deactivateInvite, getUsageBreakdown } from '@/lib/db';

export async function GET() {
  const isAdmin = await validateAdminSession();
  if (!isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const invites = await getAllInvites();

  // Fetch usage breakdowns for all invites
  const invitesWithBreakdown = await Promise.all(
    invites.map(async (invite) => {
      const breakdown = await getUsageBreakdown(invite.id);
      return { ...invite, breakdown };
    })
  );

  return NextResponse.json(invitesWithBreakdown);
}

export async function POST(request: Request) {
  const isAdmin = await validateAdminSession();
  if (!isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { userName, tokenBudget } = await request.json();

  if (!userName || !tokenBudget || tokenBudget < 1) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
  }

  const token = randomBytes(3).toString('base64url').slice(0, 5);
  const invite = await createInvite(token, userName, tokenBudget);

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const inviteUrl = `${appUrl}?token=${token}`;

  return NextResponse.json({ invite, inviteUrl });
}

export async function DELETE(request: Request) {
  const isAdmin = await validateAdminSession();
  if (!isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await request.json();
  await deactivateInvite(id);
  return NextResponse.json({ success: true });
}
