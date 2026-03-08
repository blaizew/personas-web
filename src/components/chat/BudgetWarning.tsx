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
      <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-center">
        <p className="text-red-700 text-sm font-medium">
          Budget fully used. Contact Blaize for more access.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 text-center">
      <p className="text-amber-700 text-xs">
        {estimatedMessages != null
          ? `~${estimatedMessages} messages remaining`
          : `Budget running low (${Math.round(percentage)}% remaining)`}
      </p>
    </div>
  );
}
