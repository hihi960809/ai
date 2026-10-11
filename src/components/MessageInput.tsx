import { useState, useRef, type KeyboardEvent } from 'react';
import { Send, CornerDownLeft, Mic, Square, AlertCircle, X } from 'lucide-react';
import { useVoiceInput } from '../hooks/useVoiceInput';

interface MessageInputProps {
  onSend: (text: string) => void;
  disabled: boolean;
}

export default function MessageInput({ onSend, disabled }: MessageInputProps) {
  const [text, setText] = useState('');
  const [showVoiceError, setShowVoiceError] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const autoResize = () => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = 'auto';
      el.style.height = Math.min(el.scrollHeight, 120) + 'px';
    }
  };

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

  const handleInput = () => autoResize();

  // Voice input
  const { status, errorMessage, isRecording, start, stop, isSupported } =
    useVoiceInput({
      lang: 'zh-TW',
      onResult: (recognizedText, isFinal) => {
        setText((prev) => {
          // For interim results, replace trailing interim text.
          // For final results, append to existing text.
          if (isFinal) {
            const combined = prev + (prev && !prev.endsWith(' ') ? ' ' : '') + recognizedText;
            return combined;
          }
          return recognizedText;
        });
        if (isFinal) {
          // Focus textarea after final result so user can review/send
          requestAnimationFrame(() => textareaRef.current?.focus());
        }
      },
    });

  const handleMicClick = () => {
    if (isRecording) {
      stop();
    } else {
      setShowVoiceError(false);
      start();
      if (!isSupported) {
        setShowVoiceError(true);
      }
    }
  };

  // Show error toast when status transitions to error
  const prevStatusRef = useRef(status);
  if (prevStatusRef.current !== status) {
    if (status === 'error' || status === 'unsupported') {
      setShowVoiceError(true);
    }
    prevStatusRef.current = status;
  }

  return (
    <div className="relative border-t border-tavern-border bg-tavern-surface/80 px-4 py-3 sm:px-6 sm:py-4">
      {/* Voice error toast */}
      {showVoiceError && errorMessage && (
        <div className="absolute -top-2 left-1/2 z-20 w-[90%] max-w-md -translate-x-1/2 -translate-y-full animate-slide-up">
          <div className="flex items-start gap-2.5 rounded-lg border border-tavern-danger/40 bg-tavern-card px-4 py-3 shadow-[0_4px_24px_rgba(0,0,0,0.4)]">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-tavern-danger" />
            <p className="flex-1 font-body text-sm leading-snug text-tavern-text">
              {errorMessage}
            </p>
            <button
              onClick={() => setShowVoiceError(false)}
              className="shrink-0 text-tavern-text-muted transition-colors hover:text-tavern-text"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      <div className="mx-auto flex max-w-3xl items-end gap-2">
        <div className="relative flex-1">
          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onInput={handleInput}
            onKeyDown={handleKeyDown}
            rows={1}
            placeholder={
              isRecording ? '正在聆聽…請對著麥克風說話' : '在酒館裡說點什麼…'
            }
            disabled={disabled}
            className="w-full resize-none rounded-xl border border-tavern-border bg-tavern-card px-4 py-3 font-body text-sm text-tavern-text placeholder:text-tavern-text-muted focus:border-tavern-amber-dim focus:outline-none focus:ring-1 focus:ring-tavern-amber/30 disabled:opacity-50"
            style={{
              maxHeight: '120px',
              ...(isRecording
                ? { borderColor: '#c2545066', boxShadow: '0 0 0 1px rgba(194,84,80,0.2)' }
                : {}),
            }}
          />
          <div className="absolute bottom-2 right-3 hidden items-center gap-1 font-body text-[10px] text-tavern-text-muted sm:flex">
            <CornerDownLeft className="h-3 w-3" />
            發送
          </div>
        </div>

        {/* Microphone button */}
        <button
          onClick={handleMicClick}
          disabled={disabled}
          title={
            !isSupported
              ? '此瀏覽器不支援語音輸入'
              : isRecording
                ? '停止錄音'
                : '開始語音輸入'
          }
          className={`
            relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border transition-all duration-200 active:scale-95
            disabled:cursor-not-allowed disabled:opacity-40
            ${
              isRecording
                ? 'border-tavern-danger bg-tavern-danger/15 text-tavern-danger shadow-[0_0_20px_4px_rgba(194,84,80,0.3)]'
                : 'border-tavern-border bg-tavern-card text-tavern-text-dim hover:border-tavern-amber-dim hover:text-tavern-amber'
            }
          `}
        >
          {isRecording ? (
            <>
              {/* Pulsing red glow ring */}
              <span className="absolute inset-0 rounded-xl border-2 border-tavern-danger animate-ping opacity-40" />
              <Square className="relative h-4 w-4 fill-current" />
            </>
          ) : (
            <Mic className="h-5 w-5" />
          )}
        </button>

        {/* Send button */}
        <button
          onClick={handleSend}
          disabled={disabled || !text.trim()}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-tavern-amber-dim bg-tavern-amber/15 text-tavern-amber transition-all duration-200 hover:bg-tavern-amber/25 hover:shadow-[0_0_16px_2px_rgba(212,148,74,0.2)] active:scale-95 disabled:cursor-not-allowed disabled:border-tavern-border disabled:bg-tavern-card disabled:text-tavern-text-muted disabled:shadow-none"
        >
          <Send className="h-4 w-4" />
        </button>
      </div>

      {/* Recording status hint */}
      {isRecording && (
        <div className="mx-auto mt-2 flex max-w-3xl items-center justify-center gap-2 animate-fade-in">
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-tavern-danger animate-pulse" />
            <span className="h-2 w-2 rounded-full bg-tavern-danger animate-pulse [animation-delay:0.2s]" />
            <span className="h-2 w-2 rounded-full bg-tavern-danger animate-pulse [animation-delay:0.4s]" />
          </span>
          <span className="font-body text-xs text-tavern-danger">
            錄音中 — 再按一次麥克風結束
          </span>
        </div>
      )}
    </div>
  );
}
