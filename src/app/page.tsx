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
    <div className="bg-[var(--surface-elevated)] rounded-2xl p-6 pb-7 border border-[var(--border-subtle)] shadow-[var(--shadow-sm)]">
      <div className="flex flex-col items-center">
        <div className="w-36 h-48 sm:w-40 sm:h-52 rounded-xl animate-shimmer mb-5" />
        <div className="h-5 w-28 rounded animate-shimmer mb-2" />
        <div className="h-3 w-20 rounded animate-shimmer mb-3" />
        <div className="h-4 w-full rounded animate-shimmer" />
      </div>
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
      <div className="min-h-screen bg-[var(--bg)]">
        <header className="bg-[var(--bg)]/80 backdrop-blur-sm border-b border-[var(--border-subtle)] px-6 py-4">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div className="h-5 w-24 rounded animate-shimmer" />
            <div className="h-4 w-32 rounded animate-shimmer" />
          </div>
        </header>
        <main className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 py-12">
          <div className="mb-12 text-center space-y-4">
            <div className="h-10 w-72 rounded animate-shimmer mx-auto" />
            <div className="w-10 h-[1.5px] rounded animate-shimmer mx-auto" />
            <div className="h-4 w-80 rounded animate-shimmer mx-auto" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-7">
            {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        </main>
      </div>
    );
  }

  if (!isValidated && !error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg)]">
        <div className="text-center max-w-md px-4">
          <h1 className="font-[var(--font-display)] text-3xl font-medium text-[var(--text-primary)] mb-2" style={{ fontFamily: 'var(--font-display)' }}>Personas</h1>
          <div className="w-10 h-[1.5px] bg-[var(--accent)] mx-auto mb-4" />
          <p className="text-[var(--text-secondary)] text-sm">
            This is an invite-only experience. Use the link you received to get started.
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg)]">
        <div className="text-center max-w-md px-4">
          <h1 className="text-3xl font-medium text-[var(--text-primary)] mb-2" style={{ fontFamily: 'var(--font-display)' }}>Personas</h1>
          <div className="w-10 h-[1.5px] bg-[var(--accent)] mx-auto mb-4" />
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <header className="bg-[var(--bg)]/80 backdrop-blur-sm border-b border-[var(--border-subtle)] px-6 py-4 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <h1 className="text-xl tracking-wide text-[var(--text-primary)]" style={{ fontFamily: 'var(--font-display)', fontWeight: 400, letterSpacing: '0.04em' }}>Personas</h1>
          <span className="text-sm text-[var(--text-tertiary)]">{userName}</span>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 pt-14 pb-16">
        <div className="mb-12 text-center">
          <h2 className="text-4xl sm:text-5xl font-medium tracking-tight text-[var(--text-primary)] mb-4" style={{ fontFamily: 'var(--font-display)' }}>
            Choose your advisor
          </h2>
          <div className="w-10 h-[1.5px] bg-[var(--accent)] mx-auto mb-4" />
          <p className="text-[var(--text-secondary)] text-sm sm:text-base max-w-lg mx-auto">
            Each persona is powered by deep knowledge modules that load dynamically based on your conversation.
          </p>
        </div>
        <PersonaGrid personas={personas} />
      </main>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg)]">
        <div className="text-[var(--text-secondary)] text-sm">Loading...</div>
      </div>
    }>
      <HomeContent />
    </Suspense>
  );
}
