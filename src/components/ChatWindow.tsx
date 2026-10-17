import { useEffect, useRef } from 'react';
import type { Character, Message } from '../types';
import SpeakButton from './SpeakButton';
import { TypewriterBubble } from './TypewriterBubble';

interface ChatWindowProps {
  character: Character;
  messages: Message[];
  isTyping: boolean;
  onTypingComplete: (messageId: string) => void;
}

export default function ChatWindow({
  character,
  messages,
  isTyping,
  onTypingComplete,
}: ChatWindowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior,
      });
    }
  };

  useEffect(() => {
    scrollToBottom('smooth');
  }, [messages, isTyping]);

  return (
    <div
      ref={scrollRef}
      className="flex-1 overflow-y-auto px-4 py-5 sm:px-6"
    >
      {/* Tavern atmosphere divider */}
      <div className="mb-6 flex items-center justify-center gap-3">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent to-tavern-border" />
        <span className="font-body text-xs italic text-tavern-text-muted">
          ~ {character.name} 的酒桌 ~
        </span>
        <div className="h-px flex-1 bg-gradient-to-l from-transparent to-tavern-border" />
      </div>

      <div className="mx-auto flex max-w-3xl flex-col gap-4">
        {messages.map((msg) => {
          const isCharacterTyping =
            msg.sender === 'character' && msg.isTyping;

          if (isCharacterTyping) {
            return (
              <TypewriterBubble
                key={msg.id}
                message={msg}
                character={character}
                onComplete={() => onTypingComplete(msg.id)}
                onTick={() => scrollToBottom('auto')}
              />
            );
          }

          return (
            <MessageBubble
              key={msg.id}
              message={msg}
              character={character}
            />
          );
        })}

        {/* Typing indicator (waiting for API response) */}
        {isTyping && (
          <div className="flex items-end gap-2.5 animate-fade-in">
            <div
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border text-base"
              style={{
                backgroundColor: '#0d0a08',
                borderColor: character.accentColor + '44',
              }}
            >
              {character.avatar}
            </div>
            <div className="flex items-center gap-1 rounded-2xl rounded-bl-md border border-tavern-border bg-tavern-card px-4 py-3">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="h-1.5 w-1.5 rounded-full bg-tavern-amber-dim animate-typing"
                  style={{ animationDelay: `${i * 0.2}s` }}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function MessageBubble({
  message,
  character,
}: {
  message: Message;
  character: Character;
}) {
  const isUser = message.sender === 'user';

  return (
    <div
      className={`flex items-end gap-2.5 animate-slide-up ${
        isUser ? 'flex-row-reverse' : ''
      }`}
    >
      {/* Avatar */}
      <div
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border text-base ${
          isUser
            ? 'border-tavern-border bg-tavern-surface'
            : ''
        }`}
        style={
          !isUser
            ? {
                backgroundColor: '#0d0a08',
                borderColor: character.accentColor + '44',
              }
            : undefined
        }
      >
        {isUser ? '🧙' : character.avatar}
      </div>

      {/* Bubble */}
      <div
        className={`max-w-[75%] sm:max-w-[70%] ${
          isUser ? 'items-end' : 'items-start'
        }`}
      >
        <div
          className={`
            rounded-2xl px-4 py-2.5 font-body text-sm leading-relaxed
            ${
              isUser
                ? 'rounded-br-md border border-tavern-amber-dim/40 bg-tavern-amber/10 text-tavern-text'
                : 'rounded-bl-md border border-tavern-border bg-tavern-card text-tavern-text'
            }
          `}
        >
          <div className="flex items-start gap-2">
            <span className="flex-1">{message.text}</span>
            {!isUser && (
              <SpeakButton text={message.text} lang="zh-TW" />
            )}
          </div>
        </div>
        <div
          className={`mt-1 flex items-center gap-2 ${
            isUser ? 'justify-end' : 'justify-start'
          }`}
        >
          <p className="font-body text-[10px] text-tavern-text-muted">
            {message.timestamp}
          </p>
        </div>
      </div>
    </div>
  );
}
