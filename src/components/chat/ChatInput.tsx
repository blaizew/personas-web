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
        <div className="flex items-end gap-2 bg-white border border-[var(--border)] rounded-2xl px-4 py-3 shadow-[var(--shadow-sm)] focus-within:ring-2 focus-within:ring-[var(--accent)] focus-within:border-transparent transition-shadow">
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
            className="flex-1 bg-transparent text-[var(--text-primary)] text-sm resize-none focus:outline-none placeholder:text-[var(--text-tertiary)] disabled:opacity-50 min-h-[24px] max-h-[160px]"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading || disabled}
            className="p-2.5 rounded-full bg-[var(--accent)] text-white transition-all hover:bg-[var(--accent-hover)] disabled:opacity-30 disabled:cursor-not-allowed min-w-[44px] min-h-[44px] flex items-center justify-center active:scale-95"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
            </svg>
          </button>
        </div>
      )}
    </form>
  );
}
