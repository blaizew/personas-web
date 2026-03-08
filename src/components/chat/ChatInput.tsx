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
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 180)}px`;
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
    <form onSubmit={onSubmit} className="max-w-4xl mx-auto w-full">
      {isRecordingOrTranscribing ? (
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] backdrop-blur-xl p-2 shadow-[var(--shadow-sm)]">
          <VoiceRecorder
            onTranscription={(text) => setInput(input ? `${input} ${text}` : text)}
            onStateChange={setVoiceState}
            disabled={isLoading || disabled}
          />
        </div>
      ) : (
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] backdrop-blur-xl p-2 shadow-[var(--shadow-sm)]">
          <div className="flex items-end gap-2 sm:gap-3">
            <VoiceRecorder
              onTranscription={(text) => setInput(input ? `${input} ${text}` : text)}
              onStateChange={setVoiceState}
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
              className="flex-1 bg-transparent text-[var(--text-primary)] text-sm resize-none focus:outline-none placeholder:text-[var(--text-tertiary)] disabled:opacity-50 min-h-[26px] max-h-[180px] leading-relaxed py-2"
            />

            <button
              type="submit"
              disabled={!input.trim() || isLoading || disabled}
              className="p-2.5 rounded-xl bg-[var(--accent)] text-white transition-all hover:bg-[var(--accent-hover)] disabled:opacity-30 disabled:cursor-not-allowed min-w-[42px] min-h-[42px] flex items-center justify-center active:scale-95"
              aria-label="Send message"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.25}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12h15m-6-6l6 6-6 6" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </form>
  );
}
