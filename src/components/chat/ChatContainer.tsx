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

function PersonaAvatar({ name, portrait, size = 'lg' }: { name: string; portrait?: string; size?: 'lg' | 'xl' }) {
  const initials = name.split(' ').map(w => w[0]).join('').slice(0, 2);
  const sizeClass = size === 'xl' ? 'w-20 h-20 text-2xl' : 'w-16 h-16 text-xl';

  if (portrait) {
    return (
      <Image
        src={portrait}
        alt={name}
        width={size === 'xl' ? 80 : 64}
        height={size === 'xl' ? 80 : 64}
        className={`${sizeClass} rounded-full object-cover`}
      />
    );
  }

  return (
    <div className={`${sizeClass} rounded-full bg-[var(--accent-light)] text-[var(--accent)] flex items-center justify-center font-semibold`}>
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
    <div className="flex flex-col h-[calc(100vh-64px)]">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
        {messages.length === 0 && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <PersonaAvatar name={personaName} portrait={personaPortrait} size="xl" />
              </div>
              <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-2">
                {personaName}
              </h2>
              <p className="text-[var(--text-secondary)] text-sm mb-6">
                Start a conversation. Ask anything.
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                <button
                  onClick={() => setInput("What should I ask you about?")}
                  className="text-sm px-4 py-2 rounded-full border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--accent)] hover:bg-[var(--accent-light)] transition-colors"
                >
                  What should I ask you about?
                </button>
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
          <div className="max-w-2xl mx-auto bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-center animate-fade-slide-in">
            <p className="text-red-600 text-sm">Something went wrong. Please try again.</p>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Budget + Input */}
      <div className="px-4 space-y-2" style={{ paddingBottom: 'max(16px, env(safe-area-inset-bottom))' }}>
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
