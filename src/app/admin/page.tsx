'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { InviteForm } from '@/components/admin/InviteForm';
import { InviteTable } from '@/components/admin/InviteTable';
import type { InviteLink, PersonaUsageBreakdown } from '@/types';

interface InviteWithBreakdown extends InviteLink {
  breakdown: PersonaUsageBreakdown[];
}

interface UsageStats {
  total_tokens: number;
  active_invites: number;
  estimated_cost: number;
}

function formatTokens(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return n.toString();
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [invites, setInvites] = useState<InviteWithBreakdown[]>([]);
  const [stats, setStats] = useState<UsageStats | null>(null);

  const fetchData = useCallback(async () => {
    const [invitesRes, usageRes] = await Promise.all([
      fetch('/api/admin/invites'),
      fetch('/api/admin/usage'),
    ]);

    if (invitesRes.ok) setInvites(await invitesRes.json());
    if (usageRes.ok) setStats(await usageRes.json());
  }, []);

  useEffect(() => {
    if (isAuthenticated) fetchData();
  }, [isAuthenticated, fetchData]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/admin/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      setIsAuthenticated(true);
      setLoginError('');
    } else {
      setLoginError('Wrong password');
    }
  };

  const handleDeactivate = async (id: string) => {
    await fetch('/api/admin/invites', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    fetchData();
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center px-5">
        <form onSubmit={handleLogin} className="w-full max-w-sm">
          <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] backdrop-blur-xl p-7 shadow-[var(--shadow-md)]">
            <p className="inline-flex items-center rounded-full bg-[var(--accent-light)] px-3 py-1 text-[11px] font-semibold tracking-[0.1em] text-[var(--accent)] uppercase mb-4">
              Secure Access
            </p>
            <h1 className="text-3xl font-semibold text-[var(--text-primary)] mb-5" style={{ fontFamily: 'var(--font-display)' }}>
              Admin
            </h1>

            <div className="space-y-4">
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                autoFocus
              />
              {loginError && <p className="text-[var(--danger-text)] text-sm text-center">{loginError}</p>}
              <Button type="submit" className="w-full">Sign in</Button>
            </div>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-10">
      <header className="sticky top-0 z-20 border-b border-[var(--border-subtle)] bg-white/62 backdrop-blur-xl">
        <div className="max-w-5xl mx-auto px-5 sm:px-8 py-4">
          <h1 className="text-lg sm:text-xl font-semibold tracking-tight text-[var(--text-primary)]" style={{ fontFamily: 'var(--font-display)' }}>
            Admin Dashboard
          </h1>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-5 sm:px-8 py-7 space-y-8">
        {stats && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] backdrop-blur-xl p-5 shadow-[var(--shadow-sm)]">
              <p className="text-xs uppercase tracking-[0.08em] text-[var(--text-tertiary)] mb-2">Total Tokens</p>
              <p className="text-3xl font-semibold text-[var(--text-primary)]" style={{ fontFamily: 'var(--font-display)' }}>{formatTokens(stats.total_tokens)}</p>
            </div>
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] backdrop-blur-xl p-5 shadow-[var(--shadow-sm)]">
              <p className="text-xs uppercase tracking-[0.08em] text-[var(--text-tertiary)] mb-2">Active Invites</p>
              <p className="text-3xl font-semibold text-[var(--text-primary)]" style={{ fontFamily: 'var(--font-display)' }}>{formatTokens(stats.active_invites)}</p>
            </div>
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] backdrop-blur-xl p-5 shadow-[var(--shadow-sm)]">
              <p className="text-xs uppercase tracking-[0.08em] text-[var(--text-tertiary)] mb-2">Est. API Cost</p>
              <p className="text-3xl font-semibold text-[var(--text-primary)]" style={{ fontFamily: 'var(--font-display)' }}>${stats.estimated_cost}</p>
            </div>
          </div>
        )}

        <InviteForm onCreated={fetchData} />

        <section>
          <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-4" style={{ fontFamily: 'var(--font-display)' }}>
            Invite List
          </h2>
          <InviteTable invites={invites} onDeactivate={handleDeactivate} />
        </section>
      </main>
    </div>
  );
}
