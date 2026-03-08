'use client';

import Image from 'next/image';

interface MessageBubbleProps {
  role: 'user' | 'assistant';
  content: string;
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

export function MessageBubble({ role, content, personaName, personaPortrait }: MessageBubbleProps) {
  const isUser = role === 'user';

  if (isUser) {
    return (
      <div className="max-w-3xl ml-auto animate-fade-slide-in">
        <div className="ml-auto max-w-[88%] rounded-2xl rounded-br-md bg-[var(--accent)] text-white px-4 py-3 text-sm leading-relaxed shadow-[var(--shadow-sm)]">
          <div className="whitespace-pre-wrap">{content}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mr-auto animate-fade-slide-in">
      <div className="flex items-start gap-3">
        {personaName && (
          <div className="mt-1">
            <PersonaAvatar name={personaName} portrait={personaPortrait} />
          </div>
        )}

        <div className="min-w-0 flex-1">
          {personaName && (
            <span className="text-[11px] font-semibold text-[var(--text-tertiary)] mb-1.5 block uppercase tracking-[0.1em]">
              {personaName.split(' ')[0]}
            </span>
          )}
          <div className="rounded-2xl rounded-tl-md border border-[var(--border)] bg-white/86 backdrop-blur px-4 py-3 shadow-[var(--shadow-sm)]">
            <div className="prose text-sm whitespace-pre-wrap">{content}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
