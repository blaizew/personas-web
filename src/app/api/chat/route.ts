import { streamText } from 'ai';
import { anthropic } from '@ai-sdk/anthropic';
import { getPersona, getSystemPrompt } from '@/lib/personas';
import { createModuleTool } from '@/lib/tools';
import { checkBudget, recordUsage } from '@/lib/usage';
import { getInviteTokenFromRequest } from '@/lib/auth';

export const maxDuration = 120;

export async function POST(request: Request) {
  const token = getInviteTokenFromRequest(request);
  if (!token) {
    return new Response('Unauthorized', { status: 401 });
  }

  const budget = await checkBudget(token);
  if (!budget.allowed) {
    return new Response(
      JSON.stringify({ error: 'Budget exceeded. Contact Blaize for more access.' }),
      { status: 402, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const { messages, personaSlug } = await request.json();

  const persona = getPersona(personaSlug);
  if (!persona) {
    return new Response('Unknown persona', { status: 400 });
  }

  const systemPrompt = getSystemPrompt(personaSlug);

  const result = streamText({
    model: anthropic('claude-opus-4-6'),
    system: systemPrompt,
    messages,
    tools: { load_module: createModuleTool(personaSlug) },
    maxSteps: 3,
    onFinish: async ({ usage }) => {
      await recordUsage(budget.inviteId, personaSlug, {
        promptTokens: usage.promptTokens,
        completionTokens: usage.completionTokens,
      });
    },
  });

  return result.toDataStreamResponse();
}
