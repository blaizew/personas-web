import { sql } from '@vercel/postgres';
import type { InviteLink, UsageLogEntry, PersonaUsageBreakdown } from '@/types';

export async function getInviteByToken(token: string): Promise<InviteLink | null> {
  const { rows } = await sql<InviteLink>`
    SELECT * FROM invite_links WHERE token = ${token} AND is_active = TRUE
  `;
  return rows[0] ?? null;
}

export async function getInviteById(id: string): Promise<InviteLink | null> {
  const { rows } = await sql<InviteLink>`
    SELECT * FROM invite_links WHERE id = ${id}::uuid
  `;
  return rows[0] ?? null;
}

export async function getAllInvites(): Promise<InviteLink[]> {
  const { rows } = await sql<InviteLink>`
    SELECT * FROM invite_links ORDER BY created_at DESC
  `;
  return rows;
}

export async function createInvite(
  token: string,
  userName: string,
  tokenBudget: number
): Promise<InviteLink> {
  const { rows } = await sql<InviteLink>`
    INSERT INTO invite_links (token, user_name, token_budget)
    VALUES (${token}, ${userName}, ${tokenBudget})
    RETURNING *
  `;
  return rows[0];
}

export async function deactivateInvite(id: string): Promise<void> {
  await sql`UPDATE invite_links SET is_active = FALSE WHERE id = ${id}::uuid`;
}

export async function incrementTokensUsed(
  inviteId: string,
  inputTokens: number,
  outputTokens: number
): Promise<void> {
  const total = inputTokens + outputTokens;
  await sql`
    UPDATE invite_links
    SET tokens_used = tokens_used + ${total}
    WHERE id = ${inviteId}::uuid
  `;
}

export async function recordUsageLog(
  inviteId: string,
  personaSlug: string,
  inputTokens: number,
  outputTokens: number
): Promise<void> {
  await sql`
    INSERT INTO usage_log (invite_id, persona_slug, input_tokens, output_tokens)
    VALUES (${inviteId}::uuid, ${personaSlug}, ${inputTokens}, ${outputTokens})
  `;
}

export async function getUsageBreakdown(inviteId: string): Promise<PersonaUsageBreakdown[]> {
  const { rows } = await sql<PersonaUsageBreakdown>`
    SELECT
      persona_slug,
      SUM(input_tokens)::int AS total_input,
      SUM(output_tokens)::int AS total_output,
      COUNT(*)::int AS call_count
    FROM usage_log
    WHERE invite_id = ${inviteId}::uuid
    GROUP BY persona_slug
    ORDER BY SUM(input_tokens) + SUM(output_tokens) DESC
  `;
  return rows;
}

export async function getTotalUsage(): Promise<{ total_tokens: number; active_invites: number }> {
  const [usage, invites] = await Promise.all([
    sql`SELECT COALESCE(SUM(tokens_used), 0)::int AS total_tokens FROM invite_links`,
    sql`SELECT COUNT(*)::int AS active_invites FROM invite_links WHERE is_active = TRUE`,
  ]);
  return {
    total_tokens: usage.rows[0].total_tokens,
    active_invites: invites.rows[0].active_invites,
  };
}
