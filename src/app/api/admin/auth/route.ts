import { NextResponse } from 'next/server';
import { setAdminCookieOnResponse } from '@/lib/auth';

export async function POST(request: Request) {
  const { password } = await request.json();

  if (password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
  }

  const response = NextResponse.json({ success: true });
  setAdminCookieOnResponse(response);
  return response;
}
