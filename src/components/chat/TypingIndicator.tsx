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
      <div className="flex-shrink-0 shadow-[var(--shadow-sm)] rounded-lg overflow-hidden">
        <Image
          src={portrait}
          alt={name}
          width={32}
          height={32}
          className="w-8 h-8 object-cover"
        />
      </div>
    );
  }

  return (
    <div className="w-8 h-8 rounded-lg bg-[var(--accent-light)] text-[var(--accent)] flex items-center justify-center text-xs font-semibold flex-shrink-0">
      {initials}
    </div>
  );
}

export function TypingIndicator({ personaName, personaPortrait }: TypingIndicatorProps) {
  return (
    <div className="max-w-2xl mx-auto animate-fade-slide-in">
      <div className="flex items-start gap-3">
        {personaName && (
          <div className="mt-0.5">
            <PersonaAvatar name={personaName} portrait={personaPortrait} />
          </div>
        )}
        <div className="flex gap-1.5 items-center py-2.5">
          <span className="w-1.5 h-1.5 bg-[var(--text-tertiary)] rounded-full" style={{ animation: 'pulse 1.4s ease-in-out infinite' }} />
          <span className="w-1.5 h-1.5 bg-[var(--text-tertiary)] rounded-full" style={{ animation: 'pulse 1.4s ease-in-out 0.2s infinite' }} />
          <span className="w-1.5 h-1.5 bg-[var(--text-tertiary)] rounded-full" style={{ animation: 'pulse 1.4s ease-in-out 0.4s infinite' }} />
        </div>
      </div>
    </div>
  );
}
