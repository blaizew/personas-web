import { validateInviteToken, setInviteCookie } from '@/lib/auth';

export async function POST(request: Request) {
  const { token } = await request.json();

  if (!token || typeof token !== 'string') {
    return Response.json({ valid: false }, { status: 400 });
  }

  const invite = await validateInviteToken(token);
  if (!invite) {
    return Response.json({ valid: false }, { status: 401 });
  }

  await setInviteCookie(token);

  return Response.json({
    valid: true,
    userName: invite.user_name,
    remaining: invite.token_budget - invite.tokens_used,
  });
}
