'use client';

import { motion } from 'framer-motion';
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
    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-secondary to-muted text-2xl font-semibold text-primary">
      {initials}
    </div>
  );
}

export function PersonaCard({ persona, onClick, index = 0 }: PersonaCardProps) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      whileHover={{ y: -6, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="card-shine group relative flex flex-col overflow-hidden rounded-lg border border-border bg-card text-left transition-colors hover:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/50"
    >
      <div className="relative aspect-[4/5] w-full overflow-hidden">
        {persona.portrait ? (
          <Image
            src={persona.portrait}
            alt={`Portrait of ${persona.name}`}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        ) : (
          <PersonaInitials name={persona.name} />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-card via-card/20 to-transparent" />
      </div>
      <div className="relative z-10 -mt-16 flex flex-col gap-1 px-5 pb-5">
        <h3 className="font-display text-xl font-semibold text-foreground">
          {persona.name}
        </h3>
        <p className="text-sm font-medium text-primary">{persona.domain.split(',')[0]}</p>
        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
          {persona.description}
        </p>
      </div>
    </motion.button>
  );
}
