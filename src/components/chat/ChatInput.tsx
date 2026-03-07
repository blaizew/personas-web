'use client';

import { FormEvent, useRef, useEffect } from 'react';
import { VoiceRecorder } from './VoiceRecorder';

interface ChatInputProps {
  input: string;
  setInput: (value: string) => void;
  onSubmit: (e: FormEvent) => void;
  isLoading: boolean;
  disabled?: boolean;
}

export function ChatInput({ input, setInput, onSubmit, isLoading, disabled }: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 160)}px`;
    }
  }, [input]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (input.trim() && !isLoading && !disabled) {
        onSubmit(e as unknown as FormEvent);
      }
    }
  };

  return (
    <form onSubmit={onSubmit} className="flex items-end gap-2 bg-[var(--surface)] border border-[var(--border)] rounded-2xl px-4 py-3">
      <VoiceRecorder
        onTranscription={(text) => setInput(input ? `${input} ${text}` : text)}
        disabled={isLoading || disabled}
      />
      <textarea
        ref={textareaRef}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Ask anything..."
        disabled={isLoading || disabled}
        rows={1}
        className="flex-1 bg-transparent text-[var(--text-primary)] text-sm resize-none focus:outline-none placeholder:text-[var(--text-secondary)] disabled:opacity-50 min-h-[24px] max-h-[160px]"
      />
      <button
        type="submit"
        disabled={!input.trim() || isLoading || disabled}
        className="p-2.5 rounded-full bg-[var(--accent)] text-white transition-colors hover:bg-[var(--accent-hover)] disabled:opacity-30 disabled:cursor-not-allowed"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
        </svg>
      </button>
    </form>
  );
}
