'use client';

import { useRef, useEffect } from 'react';
import { useChat } from '@ai-sdk/react';
import { MessageBubble } from './MessageBubble';
import { ChatInput } from './ChatInput';
import { TypingIndicator } from './TypingIndicator';
import { BudgetWarning } from './BudgetWarning';

interface ChatContainerProps {
  personaSlug: string;
  personaName: string;
  budgetRemaining: number;
  budgetTotal: number;
}

export function ChatContainer({ personaSlug, personaName, budgetRemaining, budgetTotal }: ChatContainerProps) {
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
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        {messages.length === 0 && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-2">
                {personaName}
              </h2>
              <p className="text-[var(--text-secondary)] text-sm">
                Start a conversation. Ask anything.
              </p>
            </div>
          </div>
        )}

        {messages.map((message) => (
          <MessageBubble
            key={message.id}
            role={message.role as 'user' | 'assistant'}
            content={message.content}
          />
        ))}

        {isLoading && messages[messages.length - 1]?.role === 'user' && (
          <TypingIndicator />
        )}

        {error && !budgetExceeded && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3 text-center animate-fade-slide-in">
            <p className="text-red-400 text-sm">Something went wrong. Please try again.</p>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Budget + Input */}
      <div className="px-4 pb-4 space-y-2">
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
