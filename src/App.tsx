import { useState, useMemo, useCallback, useRef } from 'react';
import { Users, ScrollText, AlertCircle, X } from 'lucide-react';
import Header from './components/Header';
import CharacterCard from './components/CharacterCard';
import ChatWindow from './components/ChatWindow';
import MessageInput from './components/MessageInput';
import { characters, mockMessages, mockBardMessages } from './mockData';
import { generateReply, resolveApiKey } from './services/gemini';
import type { Character, Message, ConnectionStatus } from './types';

const initialConversations: Record<string, Message[]> = {
  mark: mockMessages,
  bard: mockBardMessages,
};

function makeTimestamp(): string {
  const now = new Date();
  return `${String(now.getHours()).padStart(2, '0')}:${String(
    now.getMinutes()
  ).padStart(2, '0')}`;
}

export default function App() {
  const [selectedId, setSelectedId] = useState<string>('mark');
  const [conversations, setConversations] = useState<
    Record<string, Message[]>
  >(initialConversations);
  const [status, setStatus] = useState<ConnectionStatus>('connected');
  const [isTyping, setIsTyping] = useState(false);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [apiKey, setApiKey] = useState<string>(resolveApiKey());
  const [errorToast, setErrorToast] = useState<string | null>(null);
  const errorTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const selectedCharacter: Character = useMemo(
    () => characters.find((c) => c.id === selectedId)!,
    [selectedId]
  );

  const currentMessages = conversations[selectedId] ?? [];

  const showError = useCallback((msg: string) => {
    setErrorToast(msg);
    if (errorTimerRef.current) clearTimeout(errorTimerRef.current);
    errorTimerRef.current = setTimeout(() => setErrorToast(null), 5000);
  }, []);

  const handleSelectCharacter = useCallback((id: string) => {
    setSelectedId(id);
    setShowMobileSidebar(false);
  }, []);

  const handleApiKeyChange = useCallback((key: string) => {
    setApiKey(key);
  }, []);

  const handleSend = useCallback(
    async (text: string) => {
      const timestamp = makeTimestamp();

      const userMsg: Message = {
        id: `u-${Date.now()}`,
        characterId: selectedId,
        sender: 'user',
        text,
        timestamp,
      };

      // Build the conversation history including the new user message
      const history = [...(conversations[selectedId] ?? []), userMsg];

      setConversations((prev) => ({
        ...prev,
        [selectedId]: history,
      }));

      setIsTyping(true);

      const result = await generateReply(selectedCharacter, history, apiKey);

      setIsTyping(false);

      if (result.error) {
        showError(result.error);
        return;
      }

      const charMsg: Message = {
        id: `c-${Date.now()}`,
        characterId: selectedId,
        sender: 'character',
        text: result.text,
        timestamp: makeTimestamp(),
        isTyping: true,
      };

      setConversations((prev) => ({
        ...prev,
        [selectedId]: [...(prev[selectedId] ?? []), charMsg],
      }));
    },
    [selectedId, selectedCharacter, apiKey, conversations, showError]
  );

  const handleTypingComplete = useCallback((messageId: string) => {
    setConversations((prev) => {
      const conv = prev[selectedId];
      if (!conv) return prev;
      return {
        ...prev,
        [selectedId]: conv.map((m) =>
          m.id === messageId ? { ...m, isTyping: false } : m
        ),
      };
    });
  }, [selectedId]);

  const toggleConnection = useCallback(() => {
    setStatus((prev) =>
      prev === 'connected' ? 'disconnected' : 'connected'
    );
  }, []);

  return (
    <div className="flex h-screen flex-col bg-tavern-bg">
      {/* Ambient background glow */}
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_at_20%_-10%,rgba(212,148,74,0.06),transparent_50%),radial-gradient(ellipse_at_80%_110%,rgba(201,164,76,0.04),transparent_50%)]" />

      {/* Error toast */}
      {errorToast && (
        <div className="fixed top-20 left-1/2 z-50 flex max-w-md -translate-x-1/2 animate-slide-up">
          <div className="flex items-start gap-2.5 rounded-lg border border-tavern-danger/40 bg-tavern-card px-4 py-3 shadow-[0_4px_24px_rgba(0,0,0,0.5)]">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-tavern-danger" />
            <p className="flex-1 font-body text-sm leading-snug text-tavern-text">
              {errorToast}
            </p>
            <button
              onClick={() => setErrorToast(null)}
              className="shrink-0 text-tavern-text-muted transition-colors hover:text-tavern-text"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      <Header status={status} onApiKeyChange={handleApiKeyChange} />

      {/* Mobile tab switcher */}
      <div className="relative z-10 flex border-b border-tavern-border bg-tavern-surface lg:hidden">
        <button
          onClick={() => setShowMobileSidebar(true)}
          className={`flex flex-1 items-center justify-center gap-2 py-2.5 font-body text-sm transition-colors ${
            showMobileSidebar
              ? 'border-b-2 border-tavern-amber text-tavern-amber'
              : 'text-tavern-text-dim'
          }`}
        >
          <Users className="h-4 w-4" />
          角色選擇
        </button>
        <button
          onClick={() => setShowMobileSidebar(false)}
          className={`flex flex-1 items-center justify-center gap-2 py-2.5 font-body text-sm transition-colors ${
            !showMobileSidebar
              ? 'border-b-2 border-tavern-amber text-tavern-amber'
              : 'text-tavern-text-dim'
          }`}
        >
          <ScrollText className="h-4 w-4" />
          對話
        </button>
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-1 overflow-hidden">
        {/* Left panel - characters */}
        <aside
          className={`
            ${showMobileSidebar ? 'flex' : 'hidden'}
            w-full flex-col border-r border-tavern-border bg-tavern-surface/40 lg:flex lg:w-80 xl:w-96
          `}
        >
          <div className="border-b border-tavern-border px-4 py-3">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-tavern-amber" />
              <h2 className="font-serif text-sm font-bold tracking-wide text-tavern-text">
                選擇夥伴
              </h2>
            </div>
            <p className="mt-0.5 font-body text-xs text-tavern-text-muted">
              每張桌子都有一個故事等著你
            </p>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto p-3">
            {characters.map((char) => (
              <CharacterCard
                key={char.id}
                character={char}
                isSelected={char.id === selectedId}
                onClick={() => handleSelectCharacter(char.id)}
                messageCount={(conversations[char.id] ?? []).length}
              />
            ))}
          </div>

          {/* Connection toggle */}
          <div className="border-t border-tavern-border p-3">
            <button
              onClick={toggleConnection}
              className="w-full rounded-lg border border-tavern-border bg-tavern-card px-3 py-2 font-body text-xs text-tavern-text-dim transition-colors hover:border-tavern-amber-dim hover:text-tavern-text"
            >
              {status === 'connected' ? '中斷連線' : '重新連線'}
            </button>
          </div>
        </aside>

        {/* Right panel - chat */}
        <main
          className={`
            ${showMobileSidebar ? 'hidden' : 'flex'}
            flex-1 flex-col
          `}
        >
          {/* Character banner */}
          <div className="flex items-center gap-3 border-b border-tavern-border bg-tavern-surface/60 px-4 py-3 sm:px-6">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-lg border text-xl"
              style={{
                backgroundColor: '#0d0a08',
                borderColor: selectedCharacter.accentColor + '44',
              }}
            >
              {selectedCharacter.avatar}
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="font-serif text-base font-bold text-tavern-text">
                {selectedCharacter.name}
                <span className="ml-2 font-body text-xs font-normal text-tavern-amber-dim">
                  {selectedCharacter.title}
                </span>
              </h2>
              <p className="truncate font-body text-xs text-tavern-text-muted">
                {selectedCharacter.personality}
              </p>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-tavern-success shadow-[0_0_6px_1px_rgba(90,138,90,0.4)]" />
              <span className="font-body text-xs text-tavern-text-dim">
                在線上
              </span>
            </div>
          </div>

          <ChatWindow
            character={selectedCharacter}
            messages={currentMessages}
            isTyping={isTyping}
            onTypingComplete={handleTypingComplete}
          />

          <MessageInput onSend={handleSend} disabled={status !== 'connected'} />
        </main>
      </div>
    </div>
  );
}
