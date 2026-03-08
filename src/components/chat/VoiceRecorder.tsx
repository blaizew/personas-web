'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { Mic, MicOff } from 'lucide-react';

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
        className="flex w-full items-center gap-3 rounded-xl bg-destructive/10 border border-destructive/30 px-4 py-3 transition-colors hover:bg-destructive/20 min-h-[44px]"
      >
        <span className="h-3 w-3 flex-shrink-0 rounded-full bg-destructive animate-mic-pulse" />
        <span className="flex-1 text-left text-sm text-destructive">Recording... tap to stop</span>
        <span className="font-mono text-sm text-destructive">{formatTime(elapsed)}</span>
      </button>
    );
  }

  // Transcribing state — full-width bar
  if (voiceState === 'transcribing') {
    return (
      <div className="flex w-full items-center gap-3 rounded-xl border border-border bg-secondary px-4 py-3 min-h-[44px]">
        <svg className="h-5 w-5 flex-shrink-0 animate-spin text-primary" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
        <span className="text-sm text-muted-foreground">Transcribing...</span>
      </div>
    );
  }

  // Idle state — mic button
  return (
    <button
      type="button"
      onClick={startRecording}
      disabled={disabled}
      className="flex-shrink-0 rounded-full bg-secondary p-3 text-secondary-foreground transition-all hover:bg-surface-hover disabled:opacity-50 disabled:cursor-not-allowed"
      aria-label="Start recording"
    >
      <Mic className="h-5 w-5" />
    </button>
  );
}
