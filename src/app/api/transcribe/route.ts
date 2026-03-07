import { getInviteTokenFromRequest } from '@/lib/auth';
import { getInviteByToken } from '@/lib/db';

export async function POST(request: Request) {
  const token = getInviteTokenFromRequest(request);
  if (!token) {
    return new Response('Unauthorized', { status: 401 });
  }

  const invite = await getInviteByToken(token);
  if (!invite) {
    return new Response('Invalid token', { status: 401 });
  }

  const formData = await request.formData();
  const audio = formData.get('audio') as File;
  if (!audio) {
    return new Response('No audio file', { status: 400 });
  }

  const whisperForm = new FormData();
  whisperForm.append('file', audio, 'recording.webm');
  whisperForm.append('model', 'whisper-1');

  const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: whisperForm,
  });

  if (!response.ok) {
    const error = await response.text();
    return new Response(`Transcription failed: ${error}`, { status: 500 });
  }

  const result = await response.json();
  return Response.json({ text: result.text });
}
