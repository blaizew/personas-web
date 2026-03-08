'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import type { InviteLink, PersonaUsageBreakdown } from '@/types';

interface InviteWithBreakdown extends InviteLink {
  breakdown: PersonaUsageBreakdown[];
}

interface InviteTableProps {
  invites: InviteWithBreakdown[];
  onDeactivate: (id: string) => void;
}

function formatTokens(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return n.toString();
}

export function InviteTable({ invites, onDeactivate }: InviteTableProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (invites.length === 0) {
    return (
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] backdrop-blur-xl text-center text-[var(--text-secondary)] py-12 text-sm">
        No invites yet. Create one above.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {invites.map((invite) => {
        const usagePercent = Math.min((invite.tokens_used / invite.token_budget) * 100, 100);
        const isExpanded = expandedId === invite.id;

        return (
          <div
            key={invite.id}
            className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] backdrop-blur-xl overflow-hidden shadow-[var(--shadow-sm)]"
          >
            <div className="p-4 sm:p-5">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-[var(--text-primary)]">
                    {invite.user_name}
                  </span>
                  <span
                    className={`text-[11px] px-2 py-0.5 rounded-full font-semibold uppercase tracking-[0.08em] ${
                      invite.is_active
                        ? 'bg-[var(--success-surface)] text-[var(--success-text)]'
                        : 'bg-[var(--danger-surface)] text-[var(--danger-text)]'
                    }`}
                  >
                    {invite.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      const url = `${window.location.origin}?token=${invite.token}`;
                      navigator.clipboard.writeText(url);
                    }}
                  >
                    Copy link
                  </Button>
                  {invite.is_active && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDeactivate(invite.id)}
                    >
                      Deactivate
                    </Button>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3 mb-2">
                <div className="flex-1 h-2.5 bg-[#e6edf7] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[var(--accent)] rounded-full transition-all duration-300"
                    style={{ width: `${usagePercent}%` }}
                  />
                </div>
                <span className="text-xs text-[var(--text-secondary)] whitespace-nowrap">
                  {formatTokens(invite.tokens_used)} / {formatTokens(invite.token_budget)}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-[var(--text-tertiary)]">
                  Created {new Date(invite.created_at).toLocaleDateString()}
                </span>
                {invite.breakdown.length > 0 && (
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : invite.id)}
                    className="text-[var(--accent)] hover:text-[var(--accent-hover)] transition-colors font-medium"
                  >
                    {isExpanded ? 'Hide details' : 'Show details'}
                  </button>
                )}
              </div>
            </div>

            {isExpanded && invite.breakdown.length > 0 && (
              <div className="border-t border-[var(--border-subtle)] px-4 sm:px-5 py-3 bg-white/82">
                <table className="w-full text-xs sm:text-sm">
                  <thead>
                    <tr className="text-[var(--text-tertiary)]">
                      <th className="text-left pb-2 font-semibold">Persona</th>
                      <th className="text-right pb-2 font-semibold">Input</th>
                      <th className="text-right pb-2 font-semibold">Output</th>
                      <th className="text-right pb-2 font-semibold">Calls</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invite.breakdown.map((row) => (
                      <tr key={row.persona_slug} className="text-[var(--text-primary)]">
                        <td className="py-1.5">{row.persona_slug}</td>
                        <td className="py-1.5 text-right">{formatTokens(row.total_input)}</td>
                        <td className="py-1.5 text-right">{formatTokens(row.total_output)}</td>
                        <td className="py-1.5 text-right">{row.call_count}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
