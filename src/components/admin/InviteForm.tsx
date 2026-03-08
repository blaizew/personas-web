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
    <section className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] backdrop-blur-xl p-6 sm:p-7 shadow-[var(--shadow-sm)]">
      <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-5" style={{ fontFamily: 'var(--font-display)' }}>
        Create Invite
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="User name"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          placeholder="e.g., Taylor"
          required
        />

        <div>
          <label className="text-sm font-medium text-[var(--text-secondary)] mb-1.5 block">Token budget</label>
          <div className="flex flex-wrap gap-2 mb-3">
            {BUDGET_PRESETS.map((preset) => (
              <button
                key={preset.value}
                type="button"
                onClick={() => setTokenBudget(preset.value)}
                className={`px-3 py-1.5 text-xs rounded-full border transition-colors font-semibold ${
                  tokenBudget === preset.value
                    ? 'border-[var(--accent)] bg-[var(--accent-light)] text-[var(--accent)]'
                    : 'border-[var(--border)] bg-white/90 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[#c0cde1]'
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

        {error && <p className="text-[var(--danger-text)] text-sm">{error}</p>}

        <Button type="submit" disabled={isSubmitting || !userName.trim()}>
          {isSubmitting ? 'Creating...' : 'Create Invite'}
        </Button>
      </form>

      {inviteUrl && (
        <div className="mt-5 p-4 bg-white/85 border border-[var(--border)] rounded-2xl">
          <p className="text-xs uppercase tracking-[0.08em] text-[var(--text-tertiary)] mb-2">Invite link</p>
          <div className="flex items-center gap-2">
            <code className="text-sm text-[var(--accent)] break-all flex-1">{inviteUrl}</code>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => navigator.clipboard.writeText(inviteUrl)}
            >
              Copy
            </Button>
          </div>
        </div>
      )}
    </section>
  );
}
