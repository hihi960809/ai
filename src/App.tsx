import { useState, useMemo, useCallback } from 'react';
import { Users, ScrollText } from 'lucide-react';
import Header from './components/Header';
import CharacterCard from './components/CharacterCard';
import ChatWindow from './components/ChatWindow';
import MessageInput from './components/MessageInput';
import { characters, mockMessages, mockBardMessages } from './mockData';
import type { Character, Message, ConnectionStatus } from './types';

const initialConversations: Record<string, Message[]> = {
  mark: mockMessages,
  bard: mockBardMessages,
};

// Mock auto-replies per character
const autoReplies: Record<string, string[]> = {
  mark: [
    '……酒還沒涼。你倒先開口了。',
    '我不想聽。但你可以繼續說。',
    '這杯我請。別問為什麼。',
    '你看起來比剛才清醒了些。也許是酒的功勞。',
    '吧台後面的人不問客人來自哪裡。只問——你今晚想忘掉什麼。',
  ],
  bard: [
    '哈哈哈！有意思！這個故事我得記下來！',
    '喔？你也有故事？來來來，邊喝邊說！',
    '你知道嗎，這句話讓我想起一首古老的歌……算了，下次再唱！',
    '旅人，你的眼裡有光。這可是好兆頭！',
    '乾杯！為今晚的相遇，也為所有未完的故事！',
  ],
};

export default function App() {
  const [selectedId, setSelectedId] = useState<string>('mark');
  const [conversations, setConversations] = useState<
    Record<string, Message[]>
  >(initialConversations);
  const [status, setStatus] = useState<ConnectionStatus>('connected');
  const [isTyping, setIsTyping] = useState(false);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);

  const selectedCharacter: Character = useMemo(
    () => characters.find((c) => c.id === selectedId)!,
    [selectedId]
  );

  const currentMessages = conversations[selectedId] ?? [];

  const handleSelectCharacter = useCallback((id: string) => {
    setSelectedId(id);
    setShowMobileSidebar(false);
  }, []);

  const handleSend = useCallback(
    (text: string) => {
      const now = new Date();
      const timestamp = `${String(now.getHours()).padStart(2, '0')}:${String(
        now.getMinutes()
      ).padStart(2, '0')}`;

      const userMsg: Message = {
        id: `u-${Date.now()}`,
        characterId: selectedId,
        sender: 'user',
        text,
        timestamp,
      };

      setConversations((prev) => ({
        ...prev,
        [selectedId]: [...(prev[selectedId] ?? []), userMsg],
      }));

      // Simulate character typing + reply
      setIsTyping(true);
      const replies = autoReplies[selectedId] ?? autoReplies.mark;
      const reply = replies[Math.floor(Math.random() * replies.length)];
      const delay = 1200 + Math.random() * 1500;

      setTimeout(() => {
        const replyTime = new Date();
        const replyTimestamp = `${String(replyTime.getHours()).padStart(
          2,
          '0'
        )}:${String(replyTime.getMinutes()).padStart(2, '0')}`;

        const charMsg: Message = {
          id: `c-${Date.now()}`,
          characterId: selectedId,
          sender: 'character',
          text: reply,
          timestamp: replyTimestamp,
        };

        setConversations((prev) => ({
          ...prev,
          [selectedId]: [...(prev[selectedId] ?? []), charMsg],
        }));
        setIsTyping(false);
      }, delay);
    },
    [selectedId]
  );

  const toggleConnection = useCallback(() => {
    setStatus((prev) =>
      prev === 'connected' ? 'disconnected' : 'connected'
    );
  }, []);

  return (
    <div className="flex h-screen flex-col bg-tavern-bg">
      {/* Ambient background glow */}
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_at_20%_-10%,rgba(212,148,74,0.06),transparent_50%),radial-gradient(ellipse_at_80%_110%,rgba(201,164,76,0.04),transparent_50%)]" />

      <Header status={status} />

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
          />

          <MessageInput onSend={handleSend} disabled={status !== 'connected'} />
        </main>
      </div>
    </div>
  );
}
