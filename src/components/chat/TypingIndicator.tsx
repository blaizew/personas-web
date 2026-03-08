'use client';

import Image from 'next/image';

interface TypingIndicatorProps {
  personaName?: string;
  personaPortrait?: string;
}

function PersonaAvatar({ name, portrait }: { name: string; portrait?: string }) {
  const initials = name.split(' ').map((w) => w[0]).join('').slice(0, 2);

  if (portrait) {
    return (
      <div className="flex-shrink-0 rounded-xl overflow-hidden border border-[var(--border)] bg-white shadow-[var(--shadow-sm)]">
        <Image
          src={portrait}
          alt={name}
          width={36}
          height={36}
          className="w-9 h-9 object-cover"
        />
      </div>
    );
  }

  return (
    <div className="w-9 h-9 rounded-xl bg-[var(--accent-light)] text-[var(--accent)] flex items-center justify-center text-xs font-semibold flex-shrink-0 border border-[var(--border)]">
      {initials}
    </div>
  );
}

export function TypingIndicator({ personaName, personaPortrait }: TypingIndicatorProps) {
  return (
    <div className="max-w-3xl mr-auto animate-fade-slide-in">
      <div className="flex items-start gap-3">
        {personaName && (
          <div className="mt-1">
            <PersonaAvatar name={personaName} portrait={personaPortrait} />
          </div>
        )}

        <div className="rounded-2xl rounded-tl-md border border-[var(--border)] bg-white/86 backdrop-blur px-4 py-3 shadow-[var(--shadow-sm)]">
          <div className="flex gap-1.5 items-center">
            <span className="w-1.5 h-1.5 bg-[var(--text-tertiary)] rounded-full" style={{ animation: 'pulse 1.3s ease-in-out infinite' }} />
            <span className="w-1.5 h-1.5 bg-[var(--text-tertiary)] rounded-full" style={{ animation: 'pulse 1.3s ease-in-out 0.18s infinite' }} />
            <span className="w-1.5 h-1.5 bg-[var(--text-tertiary)] rounded-full" style={{ animation: 'pulse 1.3s ease-in-out 0.36s infinite' }} />
          </div>
        </div>
      </div>
    </div>
  );
}
