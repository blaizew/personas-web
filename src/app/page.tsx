'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { PersonaGrid } from '@/components/personas/PersonaGrid';
import type { Persona } from '@/types';

const personas: Persona[] = [
  { slug: 'jeff-bezos', name: 'Jeff Bezos', domain: 'Business, strategy, leadership', description: 'Customer obsession, long-term thinking, and building at scale.', portrait: '/portraits/jeff-bezos.webp', modules: [] },
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
    <div className="overflow-hidden rounded-lg border border-border bg-card">
      <div className="aspect-[4/5] w-full animate-shimmer" />
      <div className="-mt-16 relative z-10 px-5 pb-5">
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
      <div className="min-h-screen bg-background">
        <header className="px-6 pb-12 pt-16 text-center md:pt-24">
          <div className="h-4 w-40 rounded animate-shimmer mx-auto mb-3" />
          <div className="h-12 w-96 max-w-full rounded animate-shimmer mx-auto mb-5" />
          <div className="h-4 w-80 max-w-full rounded animate-shimmer mx-auto" />
        </header>
        <main className="mx-auto max-w-6xl px-6 pb-20">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        </main>
      </div>
    );
  }

  if (!isValidated && !error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center max-w-md px-4">
          <h1 className="font-display text-3xl font-bold text-foreground mb-3">Personas</h1>
          <p className="text-muted-foreground text-sm">
            This is an invite-only experience. Use the link you received to get started.
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center max-w-md px-4">
          <h1 className="font-display text-3xl font-bold text-foreground mb-3">Personas</h1>
          <p className="text-destructive text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="px-6 pb-12 pt-16 text-center md:pt-24">
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-3 text-sm font-medium uppercase tracking-[0.2em] text-primary"
        >
          AI Persona Coaches
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mx-auto max-w-2xl font-display text-4xl font-bold leading-tight text-foreground md:text-5xl lg:text-6xl"
        >
          Learn from the <span className="text-gradient-gold">greatest minds</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="mx-auto mt-5 max-w-lg text-base leading-relaxed text-muted-foreground md:text-lg"
        >
          Chat with AI personas built from the writings, interviews, and ideas of iconic thinkers.
        </motion.p>
        {userName && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.4 }}
            className="mt-4 text-sm text-muted-foreground"
          >
            Welcome back, {userName}
          </motion.p>
        )}
      </header>

      <main className="mx-auto max-w-6xl px-6 pb-20">
        <PersonaGrid personas={personas} />
      </main>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-muted-foreground text-sm">Loading...</div>
      </div>
    }>
      <HomeContent />
    </Suspense>
  );
}
