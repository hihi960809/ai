import { useState, useRef, type KeyboardEvent } from 'react';
import { Send, CornerDownLeft } from 'lucide-react';

interface MessageInputProps {
  onSend: (text: string) => void;
  disabled: boolean;
}

export default function MessageInput({ onSend, disabled }: MessageInputProps) {
  const [text, setText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setText('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInput = () => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = 'auto';
      el.style.height = Math.min(el.scrollHeight, 120) + 'px';
    }
  };

  return (
    <div className="border-t border-tavern-border bg-tavern-surface/80 px-4 py-3 sm:px-6 sm:py-4">
      <div className="mx-auto flex max-w-3xl items-end gap-2">
        <div className="relative flex-1">
          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onInput={handleInput}
            onKeyDown={handleKeyDown}
            rows={1}
            placeholder="在酒館裡說點什麼…"
            disabled={disabled}
            className="w-full resize-none rounded-xl border border-tavern-border bg-tavern-card px-4 py-3 font-body text-sm text-tavern-text placeholder:text-tavern-text-muted focus:border-tavern-amber-dim focus:outline-none focus:ring-1 focus:ring-tavern-amber/30 disabled:opacity-50"
            style={{ maxHeight: '120px' }}
          />
          <div className="absolute bottom-2 right-3 hidden items-center gap-1 font-body text-[10px] text-tavern-text-muted sm:flex">
            <CornerDownLeft className="h-3 w-3" />
            發送
          </div>
        </div>
        <button
          onClick={handleSend}
          disabled={disabled || !text.trim()}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-tavern-amber-dim bg-tavern-amber/15 text-tavern-amber transition-all duration-200 hover:bg-tavern-amber/25 hover:shadow-[0_0_16px_2px_rgba(212,148,74,0.2)] active:scale-95 disabled:cursor-not-allowed disabled:border-tavern-border disabled:bg-tavern-card disabled:text-tavern-text-muted disabled:shadow-none"
        >
          <Send className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
