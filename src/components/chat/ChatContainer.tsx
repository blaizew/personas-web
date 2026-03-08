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
      <div className="overflow-hidden rounded-full ring-2 ring-primary/30">
        <Image
          src={portrait}
          alt={name}
          width={80}
          height={80}
          className="h-20 w-20 object-cover"
        />
      </div>
    );
  }

  return (
    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-secondary text-2xl font-semibold text-primary ring-2 ring-primary/30">
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
    <div className="flex h-full flex-col">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 md:px-6">
        <div className="mx-auto max-w-2xl space-y-4">
          {messages.length === 0 && (
            <div className="flex h-full items-center justify-center pt-24">
              <div className="text-center">
                <div className="mb-5 flex justify-center">
                  <EmptyStateAvatar name={personaName} portrait={personaPortrait} />
                </div>
                <h2 className="mb-1.5 font-display text-xl font-semibold text-foreground">
                  {personaName}
                </h2>
                <p className="mb-8 text-sm text-muted-foreground">
                  Start a conversation. Ask anything.
                </p>
                <button
                  onClick={() => setInput("What should I ask you about?")}
                  className="rounded-full border border-border px-5 py-2.5 text-sm text-muted-foreground transition-all duration-200 hover:border-primary hover:bg-secondary hover:text-primary"
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
            <div className="mx-auto max-w-2xl animate-fade-slide-in rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-center">
              <p className="text-sm text-destructive">Something went wrong. Please try again.</p>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Budget + Input */}
      <div className="space-y-2 border-t border-border px-4 py-3 md:px-6" style={{ paddingBottom: 'max(12px, env(safe-area-inset-bottom))' }}>
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
          personaName={personaName}
        />
      </div>
    </div>
  );
}
