import { cookies } from 'next/headers';
import { getInviteByToken } from './db';
import type { InviteLink } from '@/types';

const INVITE_COOKIE = 'invite_token';
const ADMIN_COOKIE = 'admin_session';

export async function validateInviteToken(token: string): Promise<InviteLink | null> {
  return getInviteByToken(token);
}

export async function getSessionInvite(): Promise<InviteLink | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(INVITE_COOKIE)?.value;
  if (!token) return null;
  return getInviteByToken(token);
}

export async function setInviteCookie(token: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(INVITE_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    // No maxAge = session cookie (cleared on browser close)
  });
}

export async function validateAdminSession(): Promise<boolean> {
  const cookieStore = await cookies();
  return cookieStore.get(ADMIN_COOKIE)?.value === 'authenticated';
}

export async function setAdminCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_COOKIE, 'authenticated', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/admin',
    maxAge: 60 * 60 * 24, // 24 hours
  });
}

export function getInviteTokenFromRequest(request: Request): string | null {
  const cookieHeader = request.headers.get('cookie') ?? '';
  const match = cookieHeader.match(new RegExp(`${INVITE_COOKIE}=([^;]+)`));
  return match?.[1] ?? null;
}
