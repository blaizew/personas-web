'use client';

import { FormEvent, useRef, useEffect, useState } from 'react';
import { VoiceRecorder, type VoiceState } from './VoiceRecorder';

interface ChatInputProps {
  input: string;
  setInput: (value: string) => void;
  onSubmit: (e: FormEvent) => void;
  isLoading: boolean;
  disabled?: boolean;
}

export function ChatInput({ input, setInput, onSubmit, isLoading, disabled }: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [voiceState, setVoiceState] = useState<VoiceState>('idle');

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

  const isRecordingOrTranscribing = voiceState !== 'idle';

  return (
    <form onSubmit={onSubmit} className="max-w-2xl mx-auto w-full">
      {isRecordingOrTranscribing ? (
        <div className="bg-white border border-[var(--border)] rounded-2xl px-3 py-2 shadow-[var(--shadow-sm)]">
          <VoiceRecorder
            onTranscription={(text) => setInput(input ? `${input} ${text}` : text)}
            onStateChange={setVoiceState}
            disabled={isLoading || disabled}
          />
        </div>
      ) : (
        <div className="flex flex-col items-center gap-2">
          <VoiceRecorder
            onTranscription={(text) => setInput(input ? `${input} ${text}` : text)}
            onStateChange={setVoiceState}
            disabled={isLoading || disabled}
          />
          <div className="flex items-end gap-2 w-full bg-white border border-[var(--border-subtle)] rounded-2xl px-4 py-3 shadow-[0_-1px_3px_rgba(0,0,0,0.04)] focus-within:ring-2 focus-within:ring-[var(--accent)]/30 focus-within:border-[var(--accent)]/40 transition-all">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask anything..."
              disabled={isLoading || disabled}
              rows={1}
              className="flex-1 bg-transparent text-[var(--text-primary)] text-sm resize-none focus:outline-none placeholder:text-[var(--text-tertiary)] disabled:opacity-50 min-h-[24px] max-h-[160px]"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading || disabled}
              className="p-2 rounded-xl bg-[var(--accent)] text-white transition-all hover:bg-[var(--accent-hover)] disabled:opacity-20 disabled:cursor-not-allowed min-w-[40px] min-h-[40px] flex items-center justify-center active:scale-95"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5L12 3m0 0l7.5 7.5M12 3v18" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </form>
  );
}
