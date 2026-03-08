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
    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[var(--accent-light)] text-[var(--accent)] flex items-center justify-center text-lg sm:text-xl font-semibold">
      {initials}
    </div>
  );
}

export function PersonaCard({ persona, onClick, index = 0 }: PersonaCardProps) {
  return (
    <button
      onClick={onClick}
      className="bg-white border border-[var(--border)] rounded-xl p-5 sm:p-6 text-left transition-all duration-200 hover:shadow-[var(--shadow-md)] hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] shadow-[var(--shadow-sm)] animate-fade-slide-in"
      style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'both' }}
    >
      <div className="flex flex-col items-center text-center gap-3">
        {persona.portrait ? (
          <Image
            src={persona.portrait}
            alt={persona.name}
            width={96}
            height={96}
            className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover"
          />
        ) : (
          <PersonaInitials name={persona.name} />
        )}
        <div>
          <h3 className="text-base sm:text-lg font-semibold text-[var(--text-primary)] mb-1">
            {persona.name}
          </h3>
          <span className="inline-block text-xs font-medium text-[var(--accent)] bg-[var(--accent-light)] px-2 py-0.5 rounded-full mb-2">
            {persona.domain}
          </span>
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed line-clamp-2">
            {persona.description}
          </p>
        </div>
      </div>
    </button>
  );
}
