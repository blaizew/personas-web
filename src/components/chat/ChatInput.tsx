'use client';

import { FormEvent, useRef, useEffect, useState } from 'react';
import { Send, Mic, MicOff } from 'lucide-react';
import { VoiceRecorder, type VoiceState } from './VoiceRecorder';

interface ChatInputProps {
  input: string;
  setInput: (value: string) => void;
  onSubmit: (e: FormEvent) => void;
  isLoading: boolean;
  disabled?: boolean;
  personaName?: string;
}

export function ChatInput({ input, setInput, onSubmit, isLoading, disabled, personaName }: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [voiceState, setVoiceState] = useState<VoiceState>('idle');

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 128)}px`;
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

  if (isRecordingOrTranscribing) {
    return (
      <form onSubmit={onSubmit} className="mx-auto max-w-2xl w-full">
        <div className="rounded-xl border border-border bg-secondary px-3 py-2">
          <VoiceRecorder
            onTranscription={(text) => setInput(input ? `${input} ${text}` : text)}
            onStateChange={setVoiceState}
            disabled={isLoading || disabled}
          />
        </div>
      </form>
    );
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto max-w-2xl w-full">
      <div className="flex items-end gap-2">
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
          placeholder={personaName ? `Ask ${personaName} anything...` : 'Ask anything...'}
          disabled={isLoading || disabled}
          rows={1}
          className="max-h-32 min-h-[44px] flex-1 resize-none rounded-xl border border-border bg-secondary px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30"
        />

        <button
          type="submit"
          disabled={!input.trim() || isLoading || disabled}
          className="flex-shrink-0 rounded-full bg-primary p-3 text-primary-foreground transition-opacity disabled:opacity-30"
          aria-label="Send message"
        >
          <Send className="h-5 w-5" />
        </button>
      </div>
    </form>
  );
}
