import type { Character, Message } from '../types';
import SpeakButton from './SpeakButton';
import { useTypewriter } from '../hooks/useTypewriter';

interface TypewriterBubbleProps {
  message: Message;
  character: Character;
  onComplete: () => void;
  onTick?: () => void;
}

export function TypewriterBubble({
  message,
  character,
  onComplete,
  onTick,
}: TypewriterBubbleProps) {
  const { displayedText, isTyping, skip } = useTypewriter({
    text: message.text,
    speed: 35,
    onComplete,
    onTick,
  });

  return (
    <div className="flex items-end gap-2.5 animate-slide-up">
      {/* Avatar */}
      <div
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border text-base"
        style={{
          backgroundColor: '#0d0a08',
          borderColor: character.accentColor + '44',
        }}
      >
        {character.avatar}
      </div>

      {/* Bubble */}
      <div className="max-w-[75%] sm:max-w-[70%] items-start">
        <div
          className="rounded-2xl rounded-bl-md border border-tavern-border bg-tavern-card px-4 py-2.5 font-body text-sm leading-relaxed text-tavern-text cursor-pointer"
          onClick={skip}
          title={isTyping ? '點擊跳過打字動畫' : undefined}
        >
          <div className="flex items-start gap-2">
            <span className="flex-1">
              {displayedText}
              {isTyping && (
                <span className="inline-block w-0.5 h-4 ml-0.5 bg-tavern-amber align-middle animate-pulse" />
              )}
            </span>
            {/* TTS uses full message.text, not partial displayedText */}
            {!isTyping && <SpeakButton text={message.text} lang="zh-TW" />}
          </div>
        </div>
        <div className="mt-1 flex items-center gap-2 justify-start">
          <p className="font-body text-[10px] text-tavern-text-muted">
            {message.timestamp}
          </p>
        </div>
      </div>
    </div>
  );
}
