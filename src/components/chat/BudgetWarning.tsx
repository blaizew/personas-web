'use client';

interface BudgetWarningProps {
  remaining: number;
  total: number;
  estimatedMessages?: number | null;
}

export function BudgetWarning({ remaining, total, estimatedMessages }: BudgetWarningProps) {
  const percentage = (remaining / total) * 100;
  const isExceeded = remaining <= 0;
  const isLow = percentage < 15;

  if (!isExceeded && !isLow) return null;

  if (isExceeded) {
    return (
      <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-center">
        <p className="text-sm font-medium text-destructive">
          Budget fully used. Contact Blaize for more access.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-primary/30 bg-primary/10 px-3 py-2 text-center">
      <p className="text-xs text-primary">
        {estimatedMessages != null
          ? `~${estimatedMessages} messages remaining`
          : `Budget running low (${Math.round(percentage)}% remaining)`}
      </p>
    </div>
  );
}
