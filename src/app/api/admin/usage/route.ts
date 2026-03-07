import { validateAdminSession } from '@/lib/auth';
import { getTotalUsage } from '@/lib/db';

export async function GET() {
  const isAdmin = await validateAdminSession();
  if (!isAdmin) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const usage = await getTotalUsage();

  // Estimate cost: Opus 4.6 pricing ~$15/M input, ~$75/M output
  // Rough estimate using blended rate of ~$30/M tokens
  const estimatedCost = (usage.total_tokens / 1_000_000) * 30;

  return Response.json({
    ...usage,
    estimated_cost: Math.round(estimatedCost * 100) / 100,
  });
}
