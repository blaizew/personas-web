'use client';

import Image from 'next/image';

interface MessageBubbleProps {
  role: 'user' | 'assistant';
  content: string;
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

export function MessageBubble({ role, content, personaName, personaPortrait }: MessageBubbleProps) {
  const isUser = role === 'user';

  if (isUser) {
    return (
      <div className="max-w-2xl mx-auto animate-fade-slide-in">
        <div className="bg-[var(--surface)] rounded-2xl px-4 py-3 text-sm leading-relaxed">
          <div className="whitespace-pre-wrap text-[var(--text-primary)]">{content}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto animate-fade-slide-in">
      <div className="flex items-start gap-3">
        {personaName && (
          <div className="mt-0.5">
            <PersonaAvatar name={personaName} portrait={personaPortrait} />
          </div>
        )}
        <div className="min-w-0 flex-1">
          {personaName && (
            <span className="text-[11px] font-medium text-[var(--accent)] mb-1.5 block tracking-[0.1em] uppercase">
              {personaName.split(' ')[0]}
            </span>
          )}
          <div className="prose text-sm whitespace-pre-wrap">{content}</div>
        </div>
      </div>
    </div>
  );
}
