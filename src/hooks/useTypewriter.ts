import { useState, useEffect, useRef, useCallback } from 'react';

interface UseTypewriterOptions {
  text: string;
  speed?: number;
  enabled?: boolean;
  onComplete?: () => void;
  onTick?: () => void;
}

export interface UseTypewriterReturn {
  displayedText: string;
  isTyping: boolean;
  skip: () => void;
}

export function useTypewriter({
  text,
  speed = 35,
  enabled = true,
  onComplete,
  onTick,
}: UseTypewriterOptions): UseTypewriterReturn {
  const [displayedText, setDisplayedText] = useState(enabled ? '' : text);
  const [isTyping, setIsTyping] = useState(enabled && text.length > 0);
  const indexRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const onCompleteRef = useRef(onComplete);
  const onTickRef = useRef(onTick);

  useEffect(() => {
    onCompleteRef.current = onComplete;
    onTickRef.current = onTick;
  }, [onComplete, onTick]);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const finish = useCallback(() => {
    clearTimer();
    setDisplayedText(text);
    setIsTyping(false);
    onCompleteRef.current?.();
  }, [text, clearTimer]);

  const skip = useCallback(() => {
    if (timerRef.current) {
      finish();
    }
  }, [finish]);

  useEffect(() => {
    if (!enabled || text.length === 0) {
      setDisplayedText(text);
      setIsTyping(false);
      return;
    }

    // Reset for new text
    indexRef.current = 0;
    setDisplayedText('');
    setIsTyping(true);
    clearTimer();

    timerRef.current = setInterval(() => {
      indexRef.current += 1;
      const next = text.slice(0, indexRef.current);
      setDisplayedText(next);
      onTickRef.current?.();

      if (indexRef.current >= text.length) {
        finish();
      }
    }, speed);

    return clearTimer;
  }, [text, speed, enabled, clearTimer, finish]);

  return { displayedText, isTyping, skip };
}
