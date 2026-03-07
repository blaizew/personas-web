'use client';

import { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export function Input({ label, className = '', ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-sm text-[var(--text-secondary)]">{label}</label>
      )}
      <input
        className={`bg-[var(--surface-elevated)] text-[var(--text-primary)] border border-[var(--border)] rounded-lg px-4 py-2.5 text-sm placeholder:text-[var(--text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent transition-colors ${className}`}
        {...props}
      />
    </div>
  );
}
