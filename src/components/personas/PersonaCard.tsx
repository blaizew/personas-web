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
    <div className="w-36 h-48 sm:w-40 sm:h-52 rounded-xl bg-gradient-to-br from-[var(--accent-light)] to-[var(--accent-surface)] text-[var(--accent)] flex items-center justify-center text-2xl font-semibold">
      {initials}
    </div>
  );
}

export function PersonaCard({ persona, onClick, index = 0 }: PersonaCardProps) {
  return (
    <button
      onClick={onClick}
      className="group bg-[var(--surface-elevated)] rounded-2xl p-6 pb-7 text-center transition-all duration-300 hover:shadow-[var(--shadow-md)] hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-2 focus:ring-offset-[var(--bg)] shadow-[var(--shadow-sm)] border border-[var(--border-subtle)] hover:border-[var(--accent)]/20 animate-fade-slide-in"
      style={{ animationDelay: `${index * 60}ms`, animationFillMode: 'both' }}
    >
      <div className="flex flex-col items-center">
        <div className="mb-5 rounded-xl shadow-[var(--shadow-sm)] overflow-hidden transition-transform duration-300 group-hover:scale-[1.02]" style={{ aspectRatio: '3/4' }}>
          {persona.portrait ? (
            <Image
              src={persona.portrait}
              alt={persona.name}
              width={160}
              height={208}
              className="w-36 h-48 sm:w-40 sm:h-52 object-cover"
            />
          ) : (
            <PersonaInitials name={persona.name} />
          )}
        </div>

        <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-1 leading-tight" style={{ fontFamily: 'var(--font-display)' }}>
          {persona.name}
        </h3>

        <p className="text-[11px] text-[var(--accent)] tracking-[0.1em] uppercase font-medium mb-3">
          {persona.domain.split(',')[0]}
        </p>

        <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
          {persona.description}
        </p>
      </div>
    </button>
  );
}
