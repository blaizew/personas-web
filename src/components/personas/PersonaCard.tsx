'use client';

import Image from 'next/image';
import type { Persona } from '@/types';

interface PersonaCardProps {
  persona: Persona;
  onClick: () => void;
  index?: number;
}

function PersonaInitials({ name }: { name: string }) {
  const initials = name.split(' ').map(w => w[0]).join('').slice(0, 2);
  return (
    <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-gradient-to-br from-[var(--accent-light)] to-[var(--accent-surface)] text-[var(--accent)] flex items-center justify-center text-2xl font-semibold">
      {initials}
    </div>
  );
}

export function PersonaCard({ persona, onClick, index = 0 }: PersonaCardProps) {
  return (
    <button
      onClick={onClick}
      className="group bg-white rounded-2xl p-6 pb-7 text-center transition-all duration-300 hover:shadow-lg hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-2 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_1px_2px_rgba(0,0,0,0.06)] border border-[var(--border-subtle)] animate-fade-slide-in"
      style={{ animationDelay: `${index * 60}ms`, animationFillMode: 'both' }}
    >
      <div className="flex flex-col items-center">
        <div className="mb-4 rounded-full ring-4 ring-white shadow-md overflow-hidden transition-transform duration-300 group-hover:scale-105">
          {persona.portrait ? (
            <Image
              src={persona.portrait}
              alt={persona.name}
              width={128}
              height={128}
              className="w-28 h-28 sm:w-32 sm:h-32 object-cover"
            />
          ) : (
            <PersonaInitials name={persona.name} />
          )}
        </div>

        <h3 className="text-base font-semibold text-[var(--text-primary)] mb-1 leading-tight">
          {persona.name}
        </h3>

        <p className="text-xs text-[var(--text-tertiary)] tracking-wide uppercase mb-3">
          {persona.domain.split(',')[0]}
        </p>

        <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
          {persona.description}
        </p>
      </div>
    </button>
  );
}
