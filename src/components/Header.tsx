import { useState, useEffect, useCallback } from 'react';
import { Wine, Wifi, WifiOff, Loader2, Key, X, Check, Eye, EyeOff } from 'lucide-react';
import type { ConnectionStatus } from '../types';
import { resolveApiKey, saveApiKeyToStorage } from '../services/gemini';

interface HeaderProps {
  status: ConnectionStatus;
  onApiKeyChange?: (key: string) => void;
}

const statusConfig = {
  connected: {
    label: '已連線',
    icon: Wifi,
    color: 'text-tavern-success',
    dot: 'bg-tavern-success',
    ring: 'shadow-[0_0_8px_2px_rgba(90,138,90,0.4)]',
  },
  connecting: {
    label: '連線中…',
    icon: Loader2,
    color: 'text-tavern-amber',
    dot: 'bg-tavern-amber',
    ring: 'shadow-[0_0_8px_2px_rgba(212,148,74,0.4)]',
  },
  disconnected: {
    label: '未連線',
    icon: WifiOff,
    color: 'text-tavern-danger',
    dot: 'bg-tavern-danger',
    ring: 'shadow-[0_0_8px_2px_rgba(194,84,80,0.3)]',
  },
} as const;

export default function Header({ status, onApiKeyChange }: HeaderProps) {
  const cfg = statusConfig[status];
  const StatusIcon = cfg.icon;

  const [showKeyModal, setShowKeyModal] = useState(false);
  const [keyInput, setKeyInput] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [hasKey, setHasKey] = useState(false);

  useEffect(() => {
    const key = resolveApiKey();
    setHasKey(!!key);
    setKeyInput(key);
  }, []);

  const handleSaveKey = useCallback(() => {
    saveApiKeyToStorage(keyInput.trim());
    setHasKey(!!keyInput.trim());
    onApiKeyChange?.(keyInput.trim());
    setShowKeyModal(false);
  }, [keyInput, onApiKeyChange]);

  const handleClearKey = useCallback(() => {
    setKeyInput('');
    saveApiKeyToStorage('');
    setHasKey(false);
    onApiKeyChange?.('');
  }, [onApiKeyChange]);

  return (
    <>
      <header className="relative border-b border-tavern-border bg-gradient-to-b from-tavern-surface to-tavern-bg px-4 py-3 sm:px-6 sm:py-4">
        {/* Ambient candle glow */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(212,148,74,0.08),transparent_60%)]" />

        <div className="relative flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-tavern-amber-dim bg-tavern-card shadow-[0_0_16px_2px_rgba(212,148,74,0.15)] animate-flicker">
              <Wine className="h-5 w-5 text-tavern-amber" />
            </div>
            <div>
              <h1 className="font-serif text-lg font-bold tracking-wide text-tavern-text sm:text-2xl">
                AI 酒館
                <span className="ml-2 hidden font-body text-sm font-normal text-tavern-amber sm:inline">
                  — 遇見你的奇幻夥伴
                </span>
              </h1>
              <p className="hidden font-body text-xs text-tavern-text-muted sm:block">
                推開木門，遇見奇幻世界裡的靈魂
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* API Key button */}
            <button
              onClick={() => setShowKeyModal(true)}
              title="設定 Gemini API Key"
              className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 transition-all duration-200 ${
                hasKey
                  ? 'border-tavern-success/40 bg-tavern-success/10 text-tavern-success'
                  : 'border-tavern-amber-dim bg-tavern-card text-tavern-amber'
              }`}
            >
              <Key className="h-3.5 w-3.5" />
              <span className="hidden font-body text-xs font-medium sm:inline">
                {hasKey ? 'API Key 已設定' : '設定 API Key'}
              </span>
            </button>

            {/* Connection status */}
            <div className="flex items-center gap-2 rounded-full border border-tavern-border bg-tavern-card px-3 py-1.5">
              <span
                className={`h-2 w-2 rounded-full ${cfg.dot} ${cfg.ring} ${status === 'connecting' ? 'animate-pulse' : ''}`}
              />
              <StatusIcon
                className={`h-3.5 w-3.5 ${cfg.color} ${status === 'connecting' ? 'animate-spin' : ''}`}
              />
              <span className={`font-body text-xs font-medium ${cfg.color}`}>
                {cfg.label}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* API Key Modal */}
      {showKeyModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in"
          onClick={() => setShowKeyModal(false)}
        >
          <div
            className="relative w-[90%] max-w-md rounded-2xl border border-tavern-border bg-tavern-card p-6 shadow-[0_8px_40px_rgba(0,0,0,0.6)]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowKeyModal(false)}
              className="absolute right-4 top-4 text-tavern-text-muted transition-colors hover:text-tavern-text"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="mb-4 flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-tavern-amber-dim bg-tavern-amber/10">
                <Key className="h-4 w-4 text-tavern-amber" />
              </div>
              <div>
                <h2 className="font-serif text-base font-bold text-tavern-text">
                  Gemini API Key
                </h2>
                <p className="font-body text-xs text-tavern-text-muted">
                  設定後即可與 NPC 即時對話
                </p>
              </div>
            </div>

            <div className="mb-3">
              <label className="mb-1.5 block font-body text-xs text-tavern-text-dim">
                API Key
              </label>
              <div className="relative">
                <input
                  type={showKey ? 'text' : 'password'}
                  value={keyInput}
                  onChange={(e) => setKeyInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSaveKey();
                  }}
                  placeholder="AIza..."
                  autoFocus
                  className="w-full rounded-lg border border-tavern-border bg-tavern-bg px-3 py-2.5 pr-10 font-body text-sm text-tavern-text placeholder:text-tavern-text-muted focus:border-tavern-amber-dim focus:outline-none focus:ring-1 focus:ring-tavern-amber/30"
                />
                <button
                  onClick={() => setShowKey((v) => !v)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-tavern-text-muted transition-colors hover:text-tavern-text"
                >
                  {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <p className="mb-4 rounded-lg border border-tavern-border bg-tavern-bg/50 px-3 py-2 font-body text-xs leading-relaxed text-tavern-text-muted">
              你的 API Key 僅儲存在瀏覽器本地，不會上傳到任何伺服器。可至{' '}
              <a
                href="https://aistudio.google.com/apikey"
                target="_blank"
                rel="noopener noreferrer"
                className="text-tavern-amber underline hover:text-tavern-amber-bright"
              >
                Google AI Studio
              </a>{' '}
              免費取得。
            </p>

            <div className="flex items-center gap-2">
              <button
                onClick={handleSaveKey}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-tavern-amber-dim bg-tavern-amber/15 px-3 py-2.5 font-body text-sm font-medium text-tavern-amber transition-all hover:bg-tavern-amber/25"
              >
                <Check className="h-4 w-4" />
                儲存
              </button>
              {hasKey && (
                <button
                  onClick={handleClearKey}
                  className="rounded-lg border border-tavern-border bg-tavern-surface px-3 py-2.5 font-body text-sm text-tavern-text-muted transition-colors hover:border-tavern-danger/40 hover:text-tavern-danger"
                >
                  清除
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
