import { Wine, Wifi, WifiOff, Loader2 } from 'lucide-react';
import type { ConnectionStatus } from '../types';

interface HeaderProps {
  status: ConnectionStatus;
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

export default function Header({ status }: HeaderProps) {
  const cfg = statusConfig[status];
  const StatusIcon = cfg.icon;

  return (
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
    </header>
  );
}
