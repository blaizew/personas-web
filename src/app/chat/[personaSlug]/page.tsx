'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ChatContainer } from '@/components/chat/ChatContainer';

const personaNames: Record<string, string> = {
  'jeff-bezos': 'Jeff Bezos',
  'jeff-bezos-conversational': 'Jeff Bezos (Conversational)',
  'esther-perel': 'Esther Perel',
  'paul-graham': 'Paul Graham',
  'matt-mochary': 'Matt Mochary',
  'chris-camillo': 'Chris Camillo',
  'stanley-druckenmiller': 'Stanley Druckenmiller',
  'jerry-colonna': 'Jerry Colonna',
};

export default function ChatPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.personaSlug as string;
  const personaName = personaNames[slug];

  const [budgetInfo, setBudgetInfo] = useState<{ remaining: number; total: number } | null>(null);

  useEffect(() => {
    if (!personaName) {
      router.push('/');
      return;
    }

    // Quick budget check by validating session
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
          setBudgetInfo({ remaining: data.remaining, total: data.remaining }); // Approximate
        }
      })
      .catch(() => router.push('/'));
  }, [personaName, router]);

  if (!personaName) return null;

  return (
    <div className="h-screen flex flex-col">
      <header className="border-b border-[var(--border)] px-6 py-4 flex-shrink-0">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <button
            onClick={() => router.push('/')}
            className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-lg font-semibold text-[var(--text-primary)]">{personaName}</h1>
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full overflow-hidden">
        <ChatContainer
          personaSlug={slug}
          personaName={personaName}
          budgetRemaining={budgetInfo?.remaining ?? 1000000}
          budgetTotal={budgetInfo?.total ?? 1000000}
        />
      </main>
    </div>
  );
}
