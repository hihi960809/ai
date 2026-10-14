import type { Character, Message } from '../types';

const GEMINI_MODEL = 'gemini-2.5-flash';
const API_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

export interface GeminiResponse {
  text: string;
  error?: string;
}

function buildContents(messages: Message[]): Array<{ role: string; parts: Array<{ text: string }> }> {
  return messages
    .filter((m) => m.text.trim().length > 0)
    .map((m) => ({
      role: m.sender === 'user' ? 'user' : 'model',
      parts: [{ text: m.text }],
    }));
}

export async function generateReply(
  character: Character,
  messages: Message[],
  apiKey: string
): Promise<GeminiResponse> {
  if (!apiKey) {
    return { text: '', error: '尚未設定 Gemini API Key。請點擊右上方的鑰匙圖示輸入你的 API Key。' };
  }

  const contents = buildContents(messages);

  const body = {
    system_instruction: {
      parts: [{ text: character.systemInstruction }],
    },
    contents,
    generationConfig: {
      temperature: 0.9,
      maxOutputTokens: 512,
    },
  };

  try {
    const res = await fetch(`${API_ENDPOINT}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const errBody = await res.text();
      console.error('[Gemini] API error:', res.status, errBody);

      if (res.status === 400 || res.status === 403) {
        return { text: '', error: 'API Key 無效或已過期。請檢查你的 Gemini API Key。' };
      }
      if (res.status === 429) {
        return { text: '', error: 'API 呼叫次數已達上限，請稍後再試。' };
      }
      return { text: '', error: `Gemini API 發生錯誤（${res.status}）。` };
    }

    const data = await res.json();
    const text =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ??
      data?.candidates?.[0]?.content?.parts?.map((p: { text: string }) => p.text).join('') ??
      '';

    if (!text) {
      return { text: '', error: 'Gemini 回傳了空的回覆。請再試一次。' };
    }

    return { text: text.trim() };
  } catch (err) {
    console.error('[Gemini] fetch error:', err);
    return { text: '', error: '無法連接 Gemini API。請檢查網路連線。' };
  }
}

export function getApiKeyFromEnv(): string {
  return import.meta.env.VITE_GEMINI_API_KEY ?? '';
}

export function getApiKeyFromStorage(): string {
  try {
    return localStorage.getItem('gemini_api_key') ?? '';
  } catch {
    return '';
  }
}

export function saveApiKeyToStorage(key: string): void {
  try {
    if (key) {
      localStorage.setItem('gemini_api_key', key);
    } else {
      localStorage.removeItem('gemini_api_key');
    }
  } catch {
    // ignore
  }
}

export function resolveApiKey(): string {
  return getApiKeyFromStorage() || getApiKeyFromEnv();
}
