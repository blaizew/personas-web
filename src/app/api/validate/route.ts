import { NextResponse } from 'next/server';
import { validateInviteToken, getSessionInvite, setInviteCookieOnResponse } from '@/lib/auth';

export async function POST(request: Request) {
  const { token } = await request.json();

  // If token provided, validate and set cookie
  if (token && typeof token === 'string') {
    const invite = await validateInviteToken(token);
    if (!invite || !invite.is_active) {
      return NextResponse.json({ valid: false }, { status: 401 });
    }

    const response = NextResponse.json({
      valid: true,
      userName: invite.user_name,
      remaining: invite.token_budget - invite.tokens_used,
    });
    setInviteCookieOnResponse(response, token);
    return response;
  }

  // No token — check existing session cookie
  const invite = await getSessionInvite();
  if (invite && invite.is_active) {
    return NextResponse.json({
      valid: true,
      userName: invite.user_name,
      remaining: invite.token_budget - invite.tokens_used,
    });
  }

  return NextResponse.json({ valid: false }, { status: 401 });
}
