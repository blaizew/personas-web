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
      <div className="py-12 text-center text-sm text-muted-foreground">
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
            className="overflow-hidden rounded-xl border border-border bg-card"
          >
            <div className="p-4">
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-foreground">
                    {invite.user_name}
                  </span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      invite.is_active
                        ? 'bg-green-500/10 text-green-400'
                        : 'bg-destructive/10 text-destructive'
                    }`}
                  >
                    {invite.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
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

              {/* Progress bar */}
              <div className="mb-2 flex items-center gap-3">
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-secondary">
                  <div
                    className="h-full rounded-full bg-primary transition-all duration-300"
                    style={{ width: `${usagePercent}%` }}
                  />
                </div>
                <span className="whitespace-nowrap text-xs text-muted-foreground">
                  {formatTokens(invite.tokens_used)} / {formatTokens(invite.token_budget)}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  Created {new Date(invite.created_at).toLocaleDateString()}
                </span>
                {invite.breakdown.length > 0 && (
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : invite.id)}
                    className="text-xs text-primary transition-colors hover:text-primary/80"
                  >
                    {isExpanded ? 'Hide details' : 'Show details'}
                  </button>
                )}
              </div>
            </div>

            {/* Expanded breakdown */}
            {isExpanded && invite.breakdown.length > 0 && (
              <div className="border-t border-border bg-secondary px-4 py-3">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="text-muted-foreground">
                      <th className="pb-2 text-left">Persona</th>
                      <th className="pb-2 text-right">Input</th>
                      <th className="pb-2 text-right">Output</th>
                      <th className="pb-2 text-right">Calls</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invite.breakdown.map((row) => (
                      <tr key={row.persona_slug} className="text-foreground">
                        <td className="py-1">{row.persona_slug}</td>
                        <td className="py-1 text-right">{formatTokens(row.total_input)}</td>
                        <td className="py-1 text-right">{formatTokens(row.total_output)}</td>
                        <td className="py-1 text-right">{row.call_count}</td>
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
