'use client';

import { useRef, useEffect } from 'react';
import { useChat } from '@ai-sdk/react';
import Image from 'next/image';
import { MessageBubble } from './MessageBubble';
import { ChatInput } from './ChatInput';
import { TypingIndicator } from './TypingIndicator';
import { BudgetWarning } from './BudgetWarning';

interface ChatContainerProps {
  personaSlug: string;
  personaName: string;
  personaPortrait?: string;
  budgetRemaining: number;
  budgetTotal: number;
}

function EmptyStateAvatar({ name, portrait }: { name: string; portrait?: string }) {
  const initials = name.split(' ').map((w) => w[0]).join('').slice(0, 2);

  if (portrait) {
    return (
      <div className="rounded-2xl overflow-hidden border border-[var(--border)] shadow-[var(--shadow-md)] bg-white">
        <Image
          src={portrait}
          alt={name}
          width={120}
          height={156}
          className="w-[120px] h-[156px] object-cover"
        />
      </div>
    );
  }

  return (
    <div className="w-[120px] h-[156px] rounded-2xl bg-gradient-to-br from-[#dce9ff] via-[#e7f0ff] to-[#f3f8ff] text-[var(--accent)] flex items-center justify-center text-3xl font-semibold border border-[var(--border)] shadow-[var(--shadow-md)]">
      {initials}
    </div>
  );
}

export function ChatContainer({ personaSlug, personaName, personaPortrait, budgetRemaining, budgetTotal }: ChatContainerProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { messages, input, setInput, handleSubmit, isLoading, error } = useChat({
    api: '/api/chat',
    body: { personaSlug },
    onError: (err) => {
      console.error('Chat error:', err);
    },
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const budgetExceeded = error?.message?.includes('402') || budgetRemaining <= 0;

  return (
    <div className="flex flex-col h-full py-3 sm:py-4">
      <div className="flex-1 min-h-0 rounded-3xl border border-[var(--border)] bg-[var(--surface)] backdrop-blur-xl shadow-[var(--shadow-sm)] overflow-hidden">
        <div className="h-full overflow-y-auto px-4 sm:px-6 py-6 sm:py-7 space-y-6">
          {messages.length === 0 && (
            <div className="h-full min-h-[420px] flex items-center justify-center">
              <div className="text-center max-w-lg">
                <div className="flex justify-center mb-5">
                  <EmptyStateAvatar name={personaName} portrait={personaPortrait} />
                </div>

                <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[var(--text-primary)] mb-2" style={{ fontFamily: 'var(--font-display)' }}>
                  {personaName}
                </h2>

                <p className="text-[var(--text-secondary)] text-sm sm:text-base mb-6 leading-relaxed">
                  Ask for strategy, frameworks, or direct feedback. You can keep it short or go deep.
                </p>

                <div className="flex flex-wrap justify-center gap-2.5">
                  {[
                    'How should I think about my next big decision?',
                    'Give me a hard critique of my current approach.',
                    'What is one question I should ask myself right now?',
                  ].map((prompt) => (
                    <button
                      key={prompt}
                      onClick={() => setInput(prompt)}
                      className="rounded-full border border-[var(--border)] bg-white/92 px-4 py-2 text-xs sm:text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[#b8c8de] hover:bg-white transition-colors"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {messages.map((message) => (
            <MessageBubble
              key={message.id}
              role={message.role as 'user' | 'assistant'}
              content={message.content}
              personaName={message.role === 'assistant' ? personaName : undefined}
              personaPortrait={message.role === 'assistant' ? personaPortrait : undefined}
            />
          ))}

          {isLoading && messages[messages.length - 1]?.role === 'user' && (
            <TypingIndicator personaName={personaName} personaPortrait={personaPortrait} />
          )}

          {error && !budgetExceeded && (
            <div className="max-w-3xl mx-auto rounded-2xl border border-red-200 bg-white px-4 py-3 text-center animate-fade-slide-in">
              <p className="text-[var(--danger-text)] text-sm">Something went wrong. Please try again.</p>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="pt-3 sm:pt-4 space-y-2">
        <BudgetWarning
          remaining={budgetRemaining}
          total={budgetTotal}
        />
        <ChatInput
          input={input}
          setInput={setInput}
          onSubmit={handleSubmit}
          isLoading={isLoading}
          disabled={budgetExceeded}
        />
      </div>
    </div>
  );
}
