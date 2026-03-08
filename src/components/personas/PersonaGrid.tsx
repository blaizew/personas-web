'use client';

import { useRouter } from 'next/navigation';
import type { Persona } from '@/types';
import { PersonaCard } from './PersonaCard';

interface PersonaGridProps {
  personas: Persona[];
}

export function PersonaGrid({ personas }: PersonaGridProps) {
  const router = useRouter();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
      {personas.map((persona, index) => (
        <PersonaCard
          key={persona.slug}
          persona={persona}
          index={index}
          onClick={() => router.push(`/chat/${persona.slug}`)}
        />
      ))}
    </div>
  );
}
