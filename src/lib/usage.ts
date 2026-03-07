import { getInviteByToken, incrementTokensUsed, recordUsageLog } from './db';

export async function checkBudget(token: string): Promise<{
  allowed: boolean;
  remaining: number;
  budgetTotal: number;
  tokensUsed: number;
  inviteId: string;
  userName: string;
}> {
  const invite = await getInviteByToken(token);
  if (!invite) {
    return { allowed: false, remaining: 0, budgetTotal: 0, tokensUsed: 0, inviteId: '', userName: '' };
  }

  const remaining = invite.token_budget - invite.tokens_used;
  return {
    allowed: remaining > 0,
    remaining,
    budgetTotal: invite.token_budget,
    tokensUsed: invite.tokens_used,
    inviteId: invite.id,
    userName: invite.user_name,
  };
}

export async function recordUsage(
  inviteId: string,
  personaSlug: string,
  usage: { promptTokens: number; completionTokens: number }
): Promise<void> {
  await Promise.all([
    incrementTokensUsed(inviteId, usage.promptTokens, usage.completionTokens),
    recordUsageLog(inviteId, personaSlug, usage.promptTokens, usage.completionTokens),
  ]);
}

export function estimateRemainingMessages(remaining: number, tokensUsed: number, callCount: number): number | null {
  if (callCount === 0) return null;
  const avgPerCall = tokensUsed / callCount;
  if (avgPerCall === 0) return null;
  return Math.floor(remaining / avgPerCall);
}
