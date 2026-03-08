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
  const initials = name.split(' ').map(w => w[0]).join('').slice(0, 2);

  if (portrait) {
    return (
      <div className="shadow-[var(--shadow-md)] rounded-xl overflow-hidden">
        <Image
          src={portrait}
          alt={name}
          width={100}
          height={132}
          className="w-[100px] h-[132px] object-cover"
        />
      </div>
    );
  }

  return (
    <div className="w-[100px] h-[132px] rounded-xl bg-gradient-to-br from-[var(--accent-light)] to-[var(--accent-surface)] text-[var(--accent)] flex items-center justify-center text-2xl font-semibold shadow-[var(--shadow-md)]">
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
    <div className="flex flex-col h-[calc(100vh-56px)]">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 space-y-5">
        {messages.length === 0 && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="flex justify-center mb-5">
                <EmptyStateAvatar name={personaName} portrait={personaPortrait} />
              </div>
              <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-1.5" style={{ fontFamily: 'var(--font-display)' }}>
                {personaName}
              </h2>
              <p className="text-[var(--text-secondary)] text-sm mb-8">
                Start a conversation. Ask anything.
              </p>
              <button
                onClick={() => setInput("What should I ask you about?")}
                className="text-sm px-5 py-2.5 rounded-full border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--accent)] hover:border-[var(--accent)] hover:bg-[var(--accent-light)] transition-all duration-200"
              >
                What should I ask you about?
              </button>
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
          <div className="max-w-2xl mx-auto bg-red-50/80 border border-red-200 rounded-xl px-4 py-3 text-center animate-fade-slide-in">
            <p className="text-red-600 text-sm">Something went wrong. Please try again.</p>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Budget + Input */}
      <div className="px-4 sm:px-6 pb-3 space-y-2" style={{ paddingBottom: 'max(12px, env(safe-area-inset-bottom))' }}>
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
