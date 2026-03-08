'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { PersonaGrid } from '@/components/personas/PersonaGrid';
import type { Persona } from '@/types';

const personas: Persona[] = [
  { slug: 'jeff-bezos', name: 'Jeff Bezos', domain: 'Business, strategy, leadership', description: 'Think big, start small, scale fast. Day 1 mentality and long-term thinking.', portrait: '/portraits/jeff-bezos.webp', modules: [] },
  { slug: 'jeff-bezos-conversational', name: 'Jeff Bezos (Conversational)', domain: 'Business, strategy, leadership', description: 'Same Bezos wisdom, more casual and conversational tone.', portrait: '/portraits/jeff-bezos-conversational.webp', modules: [] },
  { slug: 'esther-perel', name: 'Esther Perel', domain: 'Relationships, desire, relational therapy', description: 'Navigate love, desire, and the complexity of modern relationships.', portrait: '/portraits/esther-perel.webp', modules: [] },
  { slug: 'paul-graham', name: 'Paul Graham', domain: 'Startups, technology, life design', description: 'Startup wisdom from the founder of Y Combinator. Think independently.', portrait: '/portraits/paul-graham.webp', modules: [] },
  { slug: 'matt-mochary', name: 'Matt Mochary', domain: 'CEO coaching, conscious leadership', description: 'The CEO coach. Energy audit, fear processing, radical transparency.', portrait: '/portraits/matt-mochary.webp', modules: [] },
  { slug: 'chris-camillo', name: 'Chris Camillo', domain: 'Investing, trading, wealth building', description: 'Social arbitrage investing. Spot trends before Wall Street.', portrait: '/portraits/chris-camillo.webp', modules: [] },
  { slug: 'stanley-druckenmiller', name: 'Stanley Druckenmiller', domain: 'Investing, macro strategy, market cycles', description: 'Macro legend. Position sizing, liquidity, and the art of cutting losses.', portrait: '/portraits/stanley-druckenmiller.webp', modules: [] },
  { slug: 'jerry-colonna', name: 'Jerry Colonna', domain: 'Conscious leadership, founder psychology', description: 'The CEO whisperer. Radical self-inquiry, finding meaning in the struggle.', portrait: '/portraits/jerry-colonna.webp', modules: [] },
];

function SkeletonCard() {
  return (
    <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] backdrop-blur-xl p-5 shadow-[var(--shadow-sm)]">
      <div className="h-56 rounded-2xl animate-shimmer mb-5" />
      <div className="h-3.5 w-24 rounded-full animate-shimmer mb-3" />
      <div className="h-5 w-40 rounded-full animate-shimmer mb-2" />
      <div className="h-4 w-full rounded-full animate-shimmer" />
    </div>
  );
}

function HomeContent() {
  const searchParams = useSearchParams();
  const [isValidated, setIsValidated] = useState(false);
  const [userName, setUserName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = searchParams.get('token');
    if (!token) {
      fetch('/api/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: '' }),
      }).then(() => {
        setIsLoading(false);
      }).catch(() => {
        setIsLoading(false);
      });
      return;
    }

    fetch('/api/validate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.valid) {
          setIsValidated(true);
          setUserName(data.userName);
          window.history.replaceState({}, '', '/');
        } else {
          setError('Invalid or expired invite link.');
        }
        setIsLoading(false);
      })
      .catch(() => {
        setError('Could not validate invite. Please try again.');
        setIsLoading(false);
      });
  }, [searchParams]);

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <header className="sticky top-0 z-20 border-b border-[var(--border-subtle)] bg-white/60 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 py-4 flex items-center justify-between">
            <div className="h-8 w-24 rounded-full animate-shimmer" />
            <div className="h-8 w-28 rounded-full animate-shimmer" />
          </div>
        </header>
        <main className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 py-10 sm:py-12">
          <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] backdrop-blur-xl p-7 sm:p-10 mb-10 shadow-[var(--shadow-sm)]">
            <div className="h-10 w-56 rounded-full animate-shimmer mb-4" />
            <div className="h-4 w-full max-w-xl rounded-full animate-shimmer mb-2" />
            <div className="h-4 w-2/3 max-w-md rounded-full animate-shimmer" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        </main>
      </div>
    );
  }

  if (!isValidated && !error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-5">
        <div className="max-w-md w-full rounded-3xl border border-[var(--border)] bg-[var(--surface)] backdrop-blur-xl p-8 shadow-[var(--shadow-md)] text-center">
          <p className="inline-flex items-center rounded-full bg-[var(--accent-light)] px-3 py-1 text-xs font-semibold tracking-[0.12em] text-[var(--accent)] uppercase mb-5">
            Private Access
          </p>
          <h1 className="text-3xl font-semibold mb-3 text-[var(--text-primary)]" style={{ fontFamily: 'var(--font-display)' }}>
            Personas
          </h1>
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
            This workspace is invite-only. Open your invite link to unlock your persona roster.
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-5">
        <div className="max-w-md w-full rounded-3xl border border-red-200 bg-white/85 p-8 shadow-[var(--shadow-md)] text-center">
          <h1 className="text-3xl font-semibold mb-3 text-[var(--text-primary)]" style={{ fontFamily: 'var(--font-display)' }}>
            Personas
          </h1>
          <p className="text-sm text-[var(--danger-text)]">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-16">
      <header className="sticky top-0 z-30 border-b border-[var(--border-subtle)] bg-white/62 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 py-4 flex items-center justify-between gap-3">
          <h1 className="text-lg sm:text-xl font-semibold tracking-tight text-[var(--text-primary)]" style={{ fontFamily: 'var(--font-display)' }}>
            Personas
          </h1>
          <span className="rounded-full bg-white/85 border border-[var(--border)] px-3.5 py-1.5 text-xs sm:text-sm text-[var(--text-secondary)] shadow-[var(--shadow-sm)]">
            {userName}
          </span>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 pt-8 sm:pt-12">
        <section className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] backdrop-blur-xl p-7 sm:p-10 shadow-[var(--shadow-md)] mb-10 overflow-hidden relative">
          <div className="absolute -right-16 -top-16 w-56 h-56 rounded-full bg-[var(--accent-light)] blur-3xl opacity-80" />
          <div className="absolute -left-20 -bottom-20 w-72 h-72 rounded-full bg-white/70 blur-3xl" />

          <div className="relative grid md:grid-cols-[1fr_auto] gap-8 items-start">
            <div>
              <p className="inline-flex items-center rounded-full bg-[var(--accent-light)] border border-[var(--accent-surface)] px-3 py-1 text-xs font-semibold tracking-[0.12em] text-[var(--accent)] uppercase mb-4">
                Curated Advisors
              </p>
              <h2 className="text-4xl sm:text-5xl font-semibold leading-tight tracking-tight text-[var(--text-primary)] mb-4" style={{ fontFamily: 'var(--font-display)' }}>
                Choose the right mind for the decision in front of you.
              </h2>
              <p className="text-[var(--text-secondary)] text-sm sm:text-base leading-relaxed max-w-2xl">
                Each persona is trained on focused modules and responds with a specific voice. Start with one advisor, then switch as your problem evolves.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 min-w-[210px]">
              <div className="rounded-2xl border border-[var(--border)] bg-white/80 px-4 py-3">
                <p className="text-[11px] uppercase tracking-[0.08em] text-[var(--text-tertiary)]">Advisors</p>
                <p className="text-2xl font-semibold text-[var(--text-primary)]" style={{ fontFamily: 'var(--font-display)' }}>{personas.length}</p>
              </div>
              <div className="rounded-2xl border border-[var(--border)] bg-white/80 px-4 py-3">
                <p className="text-[11px] uppercase tracking-[0.08em] text-[var(--text-tertiary)]">Mode</p>
                <p className="text-2xl font-semibold text-[var(--text-primary)]" style={{ fontFamily: 'var(--font-display)' }}>Live</p>
              </div>
            </div>
          </div>
        </section>

        <PersonaGrid personas={personas} />
      </main>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-[var(--text-secondary)] text-sm">Loading...</div>
      </div>
    }>
      <HomeContent />
    </Suspense>
  );
}
