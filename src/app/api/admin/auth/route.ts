import { setAdminCookie } from '@/lib/auth';

export async function POST(request: Request) {
  const { password } = await request.json();

  if (password !== process.env.ADMIN_PASSWORD) {
    return Response.json({ error: 'Invalid password' }, { status: 401 });
  }

  await setAdminCookie();
  return Response.json({ success: true });
}
