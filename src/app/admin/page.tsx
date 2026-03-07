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
      <div className="min-h-screen flex items-center justify-center">
        <form onSubmit={handleLogin} className="w-full max-w-sm px-4 space-y-4">
          <h1 className="text-2xl font-bold text-[var(--text-primary)] text-center">Admin</h1>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            autoFocus
          />
          {loginError && <p className="text-red-400 text-sm text-center">{loginError}</p>}
          <Button type="submit" className="w-full">Sign in</Button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <header className="border-b border-[var(--border)] px-6 py-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-lg font-semibold text-[var(--text-primary)]">Admin Dashboard</h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8 space-y-8">
        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-4">
              <p className="text-xs text-[var(--text-secondary)] mb-1">Total Tokens</p>
              <p className="text-2xl font-bold text-[var(--text-primary)]">{formatTokens(stats.total_tokens)}</p>
            </div>
            <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-4">
              <p className="text-xs text-[var(--text-secondary)] mb-1">Active Invites</p>
              <p className="text-2xl font-bold text-[var(--text-primary)]">{stats.active_invites}</p>
            </div>
            <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-4">
              <p className="text-xs text-[var(--text-secondary)] mb-1">Est. API Cost</p>
              <p className="text-2xl font-bold text-[var(--text-primary)]">${stats.estimated_cost}</p>
            </div>
          </div>
        )}

        {/* Create invite */}
        <InviteForm onCreated={fetchData} />

        {/* Invite list */}
        <div>
          <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Invites</h3>
          <InviteTable invites={invites} onDeactivate={handleDeactivate} />
        </div>
      </main>
    </div>
  );
}
