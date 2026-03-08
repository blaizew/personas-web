'use client';

import Image from 'next/image';
import type { Persona } from '@/types';

interface PersonaCardProps {
  persona: Persona;
  onClick: () => void;
  index?: number;
}

function PersonaInitials({ name }: { name: string }) {
  const initials = name.split(' ').map((w) => w[0]).join('').slice(0, 2);
  return (
    <div className="h-full w-full bg-gradient-to-br from-[#dce9ff] via-[#e7f0ff] to-[#f3f8ff] text-[var(--accent)] flex items-center justify-center text-3xl font-semibold">
      {initials}
    </div>
  );
}

export function PersonaCard({ persona, onClick, index = 0 }: PersonaCardProps) {
  const category = persona.domain.split(',')[0];

  return (
    <button
      onClick={onClick}
      className="group w-full text-left rounded-3xl border border-[var(--border)] bg-[var(--surface)] backdrop-blur-xl p-4 transition-all duration-300 hover:-translate-y-1 hover:border-[#bfcde0] hover:shadow-[var(--shadow-lg)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/45 focus:ring-offset-2 focus:ring-offset-[var(--bg)] animate-fade-slide-in"
      style={{ animationDelay: `${index * 70}ms`, animationFillMode: 'both' }}
    >
      <div className="relative overflow-hidden rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-soft)] mb-4">
        <div className="absolute top-3 left-3 z-10 rounded-full bg-white/90 border border-[var(--border)] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] text-[var(--accent)]">
          {category}
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-[#0f1e34]/45 to-transparent opacity-70 transition-opacity duration-300 group-hover:opacity-88" />

        <div className="aspect-[4/5] w-full transition-transform duration-500 group-hover:scale-[1.03]">
          {persona.portrait ? (
            <Image
              src={persona.portrait}
              alt={persona.name}
              width={420}
              height={520}
              className="h-full w-full object-cover"
            />
          ) : (
            <PersonaInitials name={persona.name} />
          )}
        </div>
      </div>

      <h3 className="text-xl font-semibold text-[var(--text-primary)] leading-tight mb-2" style={{ fontFamily: 'var(--font-display)' }}>
        {persona.name}
      </h3>

      <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-4 min-h-[48px]">
        {persona.description}
      </p>

      <div className="flex items-center justify-between text-sm">
        <span className="text-[var(--text-tertiary)]">Open chat</span>
        <span className="inline-flex items-center justify-center rounded-full bg-[var(--accent-light)] text-[var(--accent)] w-8 h-8 transition-transform duration-300 group-hover:translate-x-0.5">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.25}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M17 7H9M17 7V15" />
          </svg>
        </span>
      </div>
    </button>
  );
}
