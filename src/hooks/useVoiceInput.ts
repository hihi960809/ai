import { useState, useRef, useCallback, useEffect } from 'react';
import type {
  SpeechRecognition,
  SpeechRecognitionEvent,
  SpeechRecognitionErrorEvent,
} from '../speech-types';

export type VoiceStatus = 'idle' | 'recording' | 'error' | 'unsupported';

export interface UseVoiceInputOptions {
  lang?: string;
  onResult?: (text: string, isFinal: boolean) => void;
}

export interface UseVoiceInputReturn {
  status: VoiceStatus;
  errorMessage: string | null;
  isRecording: boolean;
  start: () => void;
  stop: () => void;
  isSupported: boolean;
}

export function useVoiceInput({
  lang = 'zh-TW',
  onResult,
}: UseVoiceInputOptions = {}): UseVoiceInputReturn {
  const [status, setStatus] = useState<VoiceStatus>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const onResultRef = useRef(onResult);

  useEffect(() => {
    onResultRef.current = onResult;
  }, [onResult]);

  const isSupported =
    typeof window !== 'undefined' &&
    (window.SpeechRecognition !== undefined ||
      window.webkitSpeechRecognition !== undefined);

  const getRecognition = useCallback((): SpeechRecognition | null => {
    if (recognitionRef.current) return recognitionRef.current;

    const Ctor = window.SpeechRecognition ?? window.webkitSpeechRecognition;
    if (!Ctor) return null;

    const recognition = new Ctor();
    recognition.lang = lang;
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let transcript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }

      if (transcript) {
        const isFinal = event.results[event.results.length - 1].isFinal;
        onResultRef.current?.(transcript, isFinal);
      }
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.log('[SpeechRecognition] onerror:', event.error, event.message);

      let msg: string;
      switch (event.error) {
        case 'not-allowed':
        case 'service-not-allowed':
          msg = '麥克風權限被拒絕。請在瀏覽器設定中允許存取麥克風。';
          break;
        case 'no-speech':
          msg = '沒有偵測到語音。請再試一次。';
          break;
        case 'audio-capture':
          msg = '無法存取麥克風裝置。請檢查麥克風是否正確連接。';
          break;
        case 'network':
          msg = '語音辨識服務暫時無法使用。';
          break;
        case 'aborted':
          msg = '語音辨識已中止。';
          break;
        default:
          msg = `語音辨識發生錯誤：${event.error}`;
      }
      setErrorMessage(msg);
      setStatus('error');
    };

    recognition.onend = () => {
      console.log('[SpeechRecognition] onend');
      setStatus((prev) => (prev === 'recording' ? 'idle' : prev));
    };

    recognition.onstart = () => {
      console.log('[SpeechRecognition] onstart');
    };

    recognitionRef.current = recognition;
    return recognition;
  }, [lang]);

  const start = useCallback(() => {
    if (!isSupported) {
      setStatus('unsupported');
      setErrorMessage('您的瀏覽器不支援語音辨識功能。請使用 Chrome 或 Edge 瀏覽器。');
      return;
    }

    setErrorMessage(null);

    const recognition = getRecognition();
    if (!recognition) {
      setStatus('unsupported');
      setErrorMessage('無法初始化語音辨識。');
      return;
    }

    try {
      recognition.start();
      setStatus('recording');
    } catch {
      try {
        recognition.abort();
        recognition.start();
        setStatus('recording');
      } catch {
        setErrorMessage('無法啟動語音辨識。');
        setStatus('error');
      }
    }
  }, [getRecognition, isSupported]);

  const stop = useCallback(() => {
    const recognition = recognitionRef.current;
    if (recognition) {
      try {
        recognition.stop();
      } catch {
        // ignore
      }
    }
    setStatus('idle');
  }, []);

  useEffect(() => {
    return () => {
      const recognition = recognitionRef.current;
      if (recognition) {
        try {
          recognition.abort();
        } catch {
          // ignore
        }
      }
    };
  }, []);

  return {
    status,
    errorMessage,
    isRecording: status === 'recording',
    start,
    stop,
    isSupported,
  };
}
