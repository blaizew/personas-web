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
    <div className="bg-white border border-[var(--border)] rounded-xl p-5 sm:p-6 shadow-[var(--shadow-sm)]">
      <div className="flex items-start gap-4">
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full animate-shimmer flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-5 w-32 rounded animate-shimmer" />
          <div className="h-4 w-24 rounded animate-shimmer" />
          <div className="h-4 w-full rounded animate-shimmer" />
        </div>
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
      <div className="min-h-screen">
        <header className="border-b border-[var(--border)] bg-white px-6 py-4">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div className="h-5 w-24 rounded animate-shimmer" />
            <div className="h-4 w-32 rounded animate-shimmer" />
          </div>
        </header>
        <main className="max-w-6xl mx-auto px-6 py-12">
          <div className="mb-8 space-y-2">
            <div className="h-7 w-48 rounded animate-shimmer" />
            <div className="h-4 w-96 rounded animate-shimmer" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        </main>
      </div>
    );
  }

  if (!isValidated && !error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--surface)]">
        <div className="text-center max-w-md px-4">
          <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-4">Personas</h1>
          <p className="text-[var(--text-secondary)] text-sm">
            This is an invite-only experience. Use the link you received to get started.
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--surface)]">
        <div className="text-center max-w-md px-4">
          <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-4">Personas</h1>
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--surface)]">
      <header className="border-b border-[var(--border)] bg-white px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <h1 className="text-lg font-semibold text-[var(--text-primary)]">Personas</h1>
          <span className="text-sm text-[var(--text-secondary)]">Welcome, {userName}</span>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-2">Choose a coach</h2>
          <p className="text-[var(--text-secondary)] text-sm">
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-[var(--text-secondary)] text-sm">Loading...</div>
      </div>
    }>
      <HomeContent />
    </Suspense>
  );
}
