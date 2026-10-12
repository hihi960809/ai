import { useState, useCallback, useRef } from 'react';
import { Volume2, Loader2 } from 'lucide-react';

interface SpeakButtonProps {
  text: string;
  lang?: string;
}

export default function SpeakButton({
  text,
  lang = 'zh-TW',
}: SpeakButtonProps) {
  const [state, setState] = useState<'idle' | 'speaking' | 'loading'>('idle');
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const handleStop = useCallback(() => {
    window.speechSynthesis.cancel();
    setState('idle');
  }, []);

  const handleSpeak = useCallback(() => {
    if (state === 'speaking') {
      handleStop();
      return;
    }

    if (!('speechSynthesis' in window)) return;

    // Cancel any ongoing speech first
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    // Try to find a zh-TW voice
    const voices = window.speechSynthesis.getVoices();
    const zhVoice = voices.find(
      (v) => v.lang === 'zh-TW' || v.lang === 'zh_TW'
    );
    if (zhVoice) utterance.voice = zhVoice;

    utterance.onstart = () => setState('speaking');
    utterance.onend = () => setState('idle');
    utterance.onerror = () => setState('idle');

    utteranceRef.current = utterance;

    // Voices may not be loaded yet — set loading state briefly
    setState('loading');
    window.speechSynthesis.speak(utterance);
  }, [text, lang, state, handleStop]);

  if (!('speechSynthesis' in window)) return null;

  const isSpeaking = state === 'speaking';
  const isLoading = state === 'loading';

  return (
    <button
      onClick={handleSpeak}
      title={isSpeaking ? '停止朗讀' : '朗讀訊息'}
      className={`
        flex shrink-0 items-center justify-center rounded-md p-1 transition-all duration-200
        ${
          isSpeaking
            ? 'text-tavern-amber-bright'
            : 'text-tavern-text-muted hover:text-tavern-amber'
        }
      `}
    >
      {isLoading ? (
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
      ) : (
        <Volume2
          className={`h-3.5 w-3.5 ${isSpeaking ? 'animate-pulse' : ''}`}
        />
      )}
    </button>
  );
}
