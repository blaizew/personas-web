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
      <div className="max-w-4xl mx-auto rounded-xl border border-red-200 bg-white px-4 py-3 text-center shadow-[var(--shadow-sm)]">
        <p className="text-[var(--danger-text)] text-sm font-medium">
          Budget fully used. Contact Blaize for more access.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto rounded-xl border border-amber-200 bg-white px-3.5 py-2.5 text-center shadow-[var(--shadow-sm)]">
      <p className="text-[var(--warning-text)] text-xs sm:text-sm font-medium">
        {estimatedMessages != null
          ? `About ${estimatedMessages} messages remaining`
          : `Budget running low (${Math.round(percentage)}% remaining)`}
      </p>
    </div>
  );
}
