'use client';

import type { Persona } from '@/types';

interface PersonaCardProps {
  persona: Persona;
  onClick: () => void;
}

export function PersonaCard({ persona, onClick }: PersonaCardProps) {
  return (
    <button
      onClick={onClick}
      className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-6 text-left transition-all duration-150 hover:scale-[1.02] hover:border-[var(--accent)] hover:bg-[var(--surface-elevated)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
    >
      <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-1">
        {persona.name}
      </h3>
      <p className="text-xs text-[var(--accent)] font-medium mb-3 uppercase tracking-wide">
        {persona.domain}
      </p>
      <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
        {persona.description}
      </p>
    </button>
  );
}
