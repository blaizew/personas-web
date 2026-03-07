'use client';

export function TypingIndicator() {
  return (
    <div className="flex justify-start animate-fade-slide-in">
      <div className="bg-[var(--surface-elevated)] rounded-2xl rounded-bl-md px-4 py-3 flex gap-1.5 items-center">
        <span className="w-2 h-2 bg-[var(--text-secondary)] rounded-full" style={{ animation: 'pulse 1.4s ease-in-out infinite' }} />
        <span className="w-2 h-2 bg-[var(--text-secondary)] rounded-full" style={{ animation: 'pulse 1.4s ease-in-out 0.2s infinite' }} />
        <span className="w-2 h-2 bg-[var(--text-secondary)] rounded-full" style={{ animation: 'pulse 1.4s ease-in-out 0.4s infinite' }} />
      </div>
    </div>
  );
}
