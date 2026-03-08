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
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName.trim()) return;

    setIsSubmitting(true);
    setError('');
    try {
      const res = await fetch('/api/admin/invites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userName: userName.trim(), tokenBudget }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || `Failed to create invite (${res.status})`);
        return;
      }
      const data = await res.json();
      setInviteUrl(data.inviteUrl);
      setUserName('');
      onCreated();
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <h3 className="mb-4 font-display text-lg font-semibold text-foreground">Create Invite</h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="User name"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          placeholder="e.g., John"
          required
        />

        <div>
          <label className="mb-1.5 block text-sm text-muted-foreground">Token budget</label>
          <div className="mb-2 flex gap-2">
            {BUDGET_PRESETS.map((preset) => (
              <button
                key={preset.value}
                type="button"
                onClick={() => setTokenBudget(preset.value)}
                className={`rounded-lg border px-3 py-1.5 text-xs transition-colors ${
                  tokenBudget === preset.value
                    ? 'border-primary bg-primary/10 font-medium text-primary'
                    : 'border-border text-muted-foreground hover:border-primary/40 hover:text-foreground'
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

        {error && <p className="text-sm text-destructive">{error}</p>}

        <Button type="submit" disabled={isSubmitting || !userName.trim()}>
          {isSubmitting ? 'Creating...' : 'Create Invite'}
        </Button>
      </form>

      {inviteUrl && (
        <div className="mt-4 rounded-lg border border-border bg-secondary p-3">
          <p className="mb-1 text-xs text-muted-foreground">Invite link created:</p>
          <div className="flex items-center gap-2">
            <code className="flex-1 break-all text-sm text-primary">{inviteUrl}</code>
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
