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
      <div className="flex-shrink-0 overflow-hidden rounded-full ring-1 ring-border">
        <Image
          src={portrait}
          alt={name}
          width={32}
          height={32}
          className="h-8 w-8 object-cover"
        />
      </div>
    );
  }

  return (
    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-semibold text-primary">
      {initials}
    </div>
  );
}

export function TypingIndicator({ personaName, personaPortrait }: TypingIndicatorProps) {
  return (
    <div className="flex justify-start animate-fade-slide-in">
      <div className="flex items-start gap-3">
        {personaName && (
          <div className="mt-0.5">
            <PersonaAvatar name={personaName} portrait={personaPortrait} />
          </div>
        )}
        <div className="flex items-center gap-1.5 rounded-2xl bg-secondary px-4 py-3">
          <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground" style={{ animation: 'pulse 1.4s ease-in-out infinite' }} />
          <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground" style={{ animation: 'pulse 1.4s ease-in-out 0.2s infinite' }} />
          <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground" style={{ animation: 'pulse 1.4s ease-in-out 0.4s infinite' }} />
        </div>
      </div>
    </div>
  );
}
