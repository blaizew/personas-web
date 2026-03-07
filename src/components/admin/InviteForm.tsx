'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

interface InviteFormProps {
  onCreated: () => void;
}

const BUDGET_PRESETS = [
  { label: '100K', value: 100_000 },
  { label: '500K', value: 500_000 },
  { label: '1M', value: 1_000_000 },
  { label: '5M', value: 5_000_000 },
];

export function InviteForm({ onCreated }: InviteFormProps) {
  const [userName, setUserName] = useState('');
  const [tokenBudget, setTokenBudget] = useState(500_000);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [inviteUrl, setInviteUrl] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/admin/invites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userName: userName.trim(), tokenBudget }),
      });
      const data = await res.json();
      setInviteUrl(data.inviteUrl);
      setUserName('');
      onCreated();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-6">
      <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Create Invite</h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="User name"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          placeholder="e.g., John"
          required
        />

        <div>
          <label className="text-sm text-[var(--text-secondary)] mb-1.5 block">Token budget</label>
          <div className="flex gap-2 mb-2">
            {BUDGET_PRESETS.map((preset) => (
              <button
                key={preset.value}
                type="button"
                onClick={() => setTokenBudget(preset.value)}
                className={`px-3 py-1.5 text-xs rounded-lg border transition-colors ${
                  tokenBudget === preset.value
                    ? 'border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--accent)]'
                    : 'border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>
          <Input
            type="number"
            value={tokenBudget}
            onChange={(e) => setTokenBudget(Number(e.target.value))}
            min={1}
          />
        </div>

        <Button type="submit" disabled={isSubmitting || !userName.trim()}>
          {isSubmitting ? 'Creating...' : 'Create Invite'}
        </Button>
      </form>

      {inviteUrl && (
        <div className="mt-4 p-3 bg-[var(--surface-elevated)] border border-[var(--border)] rounded-lg">
          <p className="text-xs text-[var(--text-secondary)] mb-1">Invite link created:</p>
          <div className="flex items-center gap-2">
            <code className="text-sm text-[var(--accent)] break-all flex-1">{inviteUrl}</code>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigator.clipboard.writeText(inviteUrl)}
            >
              Copy
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
