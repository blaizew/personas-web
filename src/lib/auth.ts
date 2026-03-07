import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { getInviteByToken } from './db';
import type { InviteLink } from '@/types';

export const INVITE_COOKIE = 'invite_token';
export const ADMIN_COOKIE = 'admin_session';

export async function validateInviteToken(token: string): Promise<InviteLink | null> {
  return getInviteByToken(token);
}

export async function getSessionInvite(): Promise<InviteLink | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(INVITE_COOKIE)?.value;
  if (!token) return null;
  return getInviteByToken(token);
}

export async function validateAdminSession(): Promise<boolean> {
  const cookieStore = await cookies();
  return cookieStore.get(ADMIN_COOKIE)?.value === 'authenticated';
}

export function setAdminCookieOnResponse(response: NextResponse): void {
  response.cookies.set(ADMIN_COOKIE, 'authenticated', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24, // 24 hours
  });
}

export function setInviteCookieOnResponse(response: NextResponse, token: string): void {
  response.cookies.set(INVITE_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    // No maxAge = session cookie (cleared on browser close)
  });
}

export function getInviteTokenFromRequest(request: Request): string | null {
  const cookieHeader = request.headers.get('cookie') ?? '';
  const match = cookieHeader.match(new RegExp(`${INVITE_COOKIE}=([^;]+)`));
  return match?.[1] ?? null;
}
