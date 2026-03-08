'use client';

import Image from 'next/image';

interface TypingIndicatorProps {
  personaName?: string;
  personaPortrait?: string;
}

function PersonaAvatar({ name, portrait }: { name: string; portrait?: string }) {
  const initials = name.split(' ').map(w => w[0]).join('').slice(0, 2);

  if (portrait) {
    return (
      <Image
        src={portrait}
        alt={name}
        width={32}
        height={32}
        className="w-8 h-8 rounded-full object-cover flex-shrink-0"
      />
    );
  }

  return (
    <div className="w-8 h-8 rounded-full bg-[var(--accent-light)] text-[var(--accent)] flex items-center justify-center text-xs font-semibold flex-shrink-0">
      {initials}
    </div>
  );
}

export function TypingIndicator({ personaName, personaPortrait }: TypingIndicatorProps) {
  return (
    <div className="max-w-2xl mx-auto animate-fade-slide-in">
      <div className="flex items-start gap-3">
        {personaName && (
          <PersonaAvatar name={personaName} portrait={personaPortrait} />
        )}
        <div className="flex gap-1.5 items-center py-2">
          <span className="w-2 h-2 bg-[var(--text-tertiary)] rounded-full" style={{ animation: 'pulse 1.4s ease-in-out infinite' }} />
          <span className="w-2 h-2 bg-[var(--text-tertiary)] rounded-full" style={{ animation: 'pulse 1.4s ease-in-out 0.2s infinite' }} />
          <span className="w-2 h-2 bg-[var(--text-tertiary)] rounded-full" style={{ animation: 'pulse 1.4s ease-in-out 0.4s infinite' }} />
        </div>
      </div>
    </div>
  );
}
