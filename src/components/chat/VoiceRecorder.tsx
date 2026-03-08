'use client';

import { useState, useRef, useCallback, useEffect } from 'react';

export type VoiceState = 'idle' | 'recording' | 'transcribing';

interface VoiceRecorderProps {
  onTranscription: (text: string) => void;
  onStateChange?: (state: VoiceState) => void;
  disabled?: boolean;
}

export function VoiceRecorder({ onTranscription, onStateChange, disabled }: VoiceRecorderProps) {
  const [voiceState, setVoiceState] = useState<VoiceState>('idle');
  const [elapsed, setElapsed] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const updateState = useCallback((state: VoiceState) => {
    setVoiceState(state);
    onStateChange?.(state);
  }, [onStateChange]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      const mimeType = MediaRecorder.isTypeSupported('audio/webm')
        ? 'audio/webm'
        : 'audio/mp4';

      const recorder = new MediaRecorder(stream, { mimeType });
      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop());
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
        setElapsed(0);

        const blob = new Blob(chunksRef.current, { type: mimeType });
        updateState('transcribing');

        try {
          const formData = new FormData();
          formData.append('audio', blob, `recording.${mimeType === 'audio/webm' ? 'webm' : 'mp4'}`);

          const res = await fetch('/api/transcribe', {
            method: 'POST',
            body: formData,
          });

          if (res.ok) {
            const { text } = await res.json();
            onTranscription(text);
          }
        } finally {
          updateState('idle');
        }
      };

      mediaRecorderRef.current = recorder;
      recorder.start();
      setElapsed(0);
      timerRef.current = setInterval(() => setElapsed(s => s + 1), 1000);
      updateState('recording');
    } catch (err) {
      console.error('Microphone access denied:', err);
    }
  }, [onTranscription, updateState]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current?.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
  }, []);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  // Recording state — full-width bar
  if (voiceState === 'recording') {
    return (
      <button
        type="button"
        onClick={stopRecording}
        className="flex items-center gap-3 w-full px-4 py-3 rounded-2xl bg-red-50 border border-red-200 transition-colors hover:bg-red-100 min-h-[44px]"
      >
        <span className="w-3 h-3 rounded-full bg-red-500 animate-mic-pulse flex-shrink-0" />
        <span className="text-sm text-red-700 flex-1 text-left">Recording... tap to stop</span>
        <span className="text-sm font-mono text-red-600">{formatTime(elapsed)}</span>
      </button>
    );
  }

  // Transcribing state — full-width bar
  if (voiceState === 'transcribing') {
    return (
      <div className="flex items-center gap-3 w-full px-4 py-3 rounded-2xl bg-[var(--surface)] border border-[var(--border)] min-h-[44px]">
        <svg className="w-5 h-5 animate-spin text-[var(--accent)] flex-shrink-0" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
        <span className="text-sm text-[var(--text-secondary)]">Transcribing...</span>
      </div>
    );
  }

  // Idle state — mic button
  return (
    <button
      type="button"
      onClick={startRecording}
      disabled={disabled}
      className="p-2.5 rounded-full transition-colors focus:outline-none bg-[var(--accent-light)] text-[var(--accent)] hover:bg-[var(--accent-surface)] disabled:opacity-50 disabled:cursor-not-allowed min-w-[44px] min-h-[44px] flex items-center justify-center"
      title="Voice input"
    >
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm-1-9c0-.55.45-1 1-1s1 .45 1 1v6c0 .55-.45 1-1 1s-1-.45-1-1V5z" />
        <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
      </svg>
    </button>
  );
}
