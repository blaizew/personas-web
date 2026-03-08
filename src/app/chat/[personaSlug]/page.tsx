'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { ChatContainer } from '@/components/chat/ChatContainer';

const personaData: Record<string, { name: string; portrait: string }> = {
  'jeff-bezos': { name: 'Jeff Bezos', portrait: '/portraits/jeff-bezos.webp' },
  'jeff-bezos-conversational': { name: 'Jeff Bezos (Conversational)', portrait: '/portraits/jeff-bezos-conversational.webp' },
  'esther-perel': { name: 'Esther Perel', portrait: '/portraits/esther-perel.webp' },
  'paul-graham': { name: 'Paul Graham', portrait: '/portraits/paul-graham.webp' },
  'matt-mochary': { name: 'Matt Mochary', portrait: '/portraits/matt-mochary.webp' },
  'chris-camillo': { name: 'Chris Camillo', portrait: '/portraits/chris-camillo.webp' },
  'stanley-druckenmiller': { name: 'Stanley Druckenmiller', portrait: '/portraits/stanley-druckenmiller.webp' },
  'jerry-colonna': { name: 'Jerry Colonna', portrait: '/portraits/jerry-colonna.webp' },
};

function PersonaHeaderAvatar({ name, portrait }: { name: string; portrait: string }) {
  const initials = name.split(' ').map(w => w[0]).join('').slice(0, 2);

  return (
    <div className="w-7 h-7 rounded-full bg-[var(--accent-light)] text-[var(--accent)] flex items-center justify-center text-xs font-semibold flex-shrink-0 overflow-hidden">
      <Image
        src={portrait}
        alt={name}
        width={28}
        height={28}
        className="w-full h-full object-cover"
        onError={(e) => {
          // Fallback to initials on image load error
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
    <div className="h-screen flex flex-col bg-white">
      <header className="border-b border-[var(--border)] bg-white px-6 py-4 flex-shrink-0">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <button
            onClick={() => router.push('/')}
            className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors p-1 -ml-1"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <PersonaHeaderAvatar name={persona.name} portrait={persona.portrait} />
          <h1 className="text-base font-semibold text-[var(--text-primary)]">{persona.name}</h1>
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full overflow-hidden">
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
