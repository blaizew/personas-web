'use client';

import { motion } from 'framer-motion';
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

export function MessageBubble({ role, content, personaName, personaPortrait }: MessageBubbleProps) {
  const isUser = role === 'user';

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      {isUser ? (
        <div className="max-w-[85%] rounded-2xl bg-primary px-4 py-3 text-sm leading-relaxed text-primary-foreground md:max-w-[75%]">
          {content.split('\n').map((line, i) => (
            <p key={i} className={i > 0 ? 'mt-2' : ''}>{line}</p>
          ))}
        </div>
      ) : (
        <div className="flex max-w-[85%] items-start gap-3 md:max-w-[75%]">
          {personaName && (
            <div className="mt-0.5">
              <PersonaAvatar name={personaName} portrait={personaPortrait} />
            </div>
          )}
          <div className="min-w-0 rounded-2xl bg-secondary px-4 py-3 text-sm leading-relaxed text-secondary-foreground">
            {content.split('\n').map((line, i) => (
              <p key={i} className={i > 0 ? 'mt-2' : ''}>{line}</p>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}
