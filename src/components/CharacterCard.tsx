import { Check } from 'lucide-react';
import type { Character } from '../types';

interface CharacterCardProps {
  character: Character;
  isSelected: boolean;
  onClick: () => void;
  messageCount: number;
}

export default function CharacterCard({
  character,
  isSelected,
  onClick,
  messageCount,
}: CharacterCardProps) {
  return (
    <button
      onClick={onClick}
      className={`
        group relative w-full overflow-hidden rounded-xl border p-4 text-left
        transition-all duration-300
        ${
          isSelected
            ? 'border-tavern-amber bg-tavern-card shadow-[0_0_20px_2px_rgba(212,148,74,0.12)]'
            : 'border-tavern-border bg-tavern-surface/60 hover:border-tavern-amber-dim hover:bg-tavern-card'
        }
      `}
    >
      {/* Accent line on left */}
      <div
        className="absolute left-0 top-0 h-full w-1 transition-all duration-300"
        style={{
          backgroundColor: isSelected ? character.accentColor : 'transparent',
          boxShadow: isSelected
            ? `0 0 12px 1px ${character.accentColor}66`
            : 'none',
        }}
      />

      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div
          className={`
            flex h-12 w-12 shrink-0 items-center justify-center rounded-lg text-2xl
            border transition-all duration-300
            ${
              isSelected
                ? 'border-tavern-amber-dim bg-tavern-bg shadow-[0_0_12px_1px_rgba(212,148,74,0.15)]'
                : 'border-tavern-border bg-tavern-bg/50 group-hover:border-tavern-amber-dim'
            }
          `}
        >
          {character.avatar}
        </div>

        {/* Info */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <h3
              className={`font-serif text-base font-bold tracking-wide transition-colors ${
                isSelected ? 'text-tavern-amber-bright' : 'text-tavern-text'
              }`}
            >
              {character.name}
            </h3>
            {isSelected && (
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-tavern-amber/20 animate-fade-in">
                <Check className="h-3 w-3 text-tavern-amber" />
              </div>
            )}
          </div>
          <p className="font-body text-xs font-medium text-tavern-amber-dim">
            {character.title}
          </p>
          <p className="mt-1.5 line-clamp-2 font-body text-sm leading-relaxed text-tavern-text-dim">
            {character.description}
          </p>

          {/* Footer */}
          <div className="mt-3 flex items-center justify-between">
            <span className="rounded-full border border-tavern-border bg-tavern-bg/50 px-2 py-0.5 font-body text-[10px] text-tavern-text-muted">
              {character.personality}
            </span>
            <span className="font-body text-[10px] text-tavern-text-muted">
              {messageCount} 則對話
            </span>
          </div>
        </div>
      </div>
    </button>
  );
}
