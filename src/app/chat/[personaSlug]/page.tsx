'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { ArrowLeft } from 'lucide-react';
import { ChatContainer } from '@/components/chat/ChatContainer';

const personaData: Record<string, { name: string; title: string; portrait: string }> = {
  'jeff-bezos': { name: 'Jeff Bezos', title: 'Founder of Amazon', portrait: '/portraits/jeff-bezos.webp' },
  'jeff-bezos-conversational': { name: 'Jeff Bezos (Conversational)', title: 'Founder of Amazon', portrait: '/portraits/jeff-bezos-conversational.webp' },
  'esther-perel': { name: 'Esther Perel', title: 'Psychotherapist & Author', portrait: '/portraits/esther-perel.webp' },
  'paul-graham': { name: 'Paul Graham', title: 'Co-founder of Y Combinator', portrait: '/portraits/paul-graham.webp' },
  'matt-mochary': { name: 'Matt Mochary', title: 'CEO Coach & Author', portrait: '/portraits/matt-mochary.webp' },
  'chris-camillo': { name: 'Chris Camillo', title: 'Investor & Author', portrait: '/portraits/chris-camillo.webp' },
  'stanley-druckenmiller': { name: 'Stanley Druckenmiller', title: 'Macro Investor', portrait: '/portraits/stanley-druckenmiller.webp' },
  'jerry-colonna': { name: 'Jerry Colonna', title: 'CEO Coach & Author', portrait: '/portraits/jerry-colonna.webp' },
};

function PersonaHeaderAvatar({ name, portrait }: { name: string; portrait: string }) {
  const initials = name.split(' ').map(w => w[0]).join('').slice(0, 2);

  return (
    <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-full ring-2 ring-primary/30">
      <Image
        src={portrait}
        alt={name}
        width={40}
        height={40}
        className="h-full w-full object-cover"
        onError={(e) => {
          const target = e.currentTarget;
          target.style.display = 'none';
          target.parentElement!.textContent = initials;
        }}
      />
    </div>
  );
}

export default function ChatPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.personaSlug as string;
  const persona = personaData[slug];

  const [budgetInfo, setBudgetInfo] = useState<{ remaining: number; total: number } | null>(null);

  useEffect(() => {
    if (!persona) {
      router.push('/');
      return;
    }

    fetch('/api/validate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: '' }),
    })
      .then((res) => {
        if (!res.ok) {
          router.push('/');
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (data?.valid) {
          setBudgetInfo({ remaining: data.remaining, total: data.remaining });
        }
      })
      .catch(() => router.push('/'));
  }, [persona, router]);

  if (!persona) return null;

  return (
    <div className="flex h-screen flex-col bg-background">
      <header className="flex items-center gap-4 border-b border-border px-4 py-3 md:px-6">
        <button
          onClick={() => router.push('/')}
          className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <PersonaHeaderAvatar name={persona.name} portrait={persona.portrait} />
        <div className="min-w-0">
          <h2 className="truncate font-display text-lg font-semibold text-foreground">
            {persona.name}
          </h2>
          <p className="truncate text-xs text-muted-foreground">{persona.title}</p>
        </div>
      </header>

      <main className="flex-1 overflow-hidden">
        <ChatContainer
          personaSlug={slug}
          personaName={persona.name}
          personaPortrait={persona.portrait}
          budgetRemaining={budgetInfo?.remaining ?? 1000000}
          budgetTotal={budgetInfo?.total ?? 1000000}
        />
      </main>
    </div>
  );
}
